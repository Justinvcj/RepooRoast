import axios from 'axios';

/**
 * Parses a GitHub URL to extract the owner and repository name.
 * @param {string} url - The GitHub repository URL.
 * @returns {{ owner: string, repo: string }}
 */
const parseGitHubUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      return { owner: pathParts[0], repo: pathParts[1] };
    }
    throw new Error('Invalid GitHub URL structure.');
  } catch (error) {
    throw new Error('Repository not found or is private.');
  }
};

/**
 * Creates an Axios instance for GitHub API requests.
 * @returns {import('axios').AxiosInstance}
 */
const getGitHubAxiosInstance = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return axios.create({
    baseURL: 'https://api.github.com',
    headers,
  });
};

/**
 * Helper to handle GitHub API responses and throw specific error messages.
 * @param {Error} error - The caught error.
 */
const handleGitHubError = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      throw new Error('Repository not found or is private.');
    }
    if (status === 401) {
      throw new Error('GitHub API error: Unauthorized (401). The GITHUB_TOKEN on the server is invalid or expired.');
    }
    if (status === 403 || status === 429) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN.');
    }
  }
  // Generic fallback if it's not a handled response error
  if (error.message.includes('Repository not found') || error.message.includes('rate limit exceeded') || error.message.includes('Unauthorized')) {
      throw error;
  }
  throw new Error(`GitHub API error: ${error.message}`);
};

/**
 * Fetches and decodes the content of a specific file from the repository.
 * @param {import('axios').AxiosInstance} api - The Axios instance.
 * @param {string} owner - Repository owner.
 * @param {string} repo - Repository name.
 * @param {string} path - File path within the repository.
 * @returns {Promise<string|null>} The decoded file content or null if failed.
 */
const fetchFileContent = async (api, owner, repo, path, ref = null) => {
  try {
    const url = ref ? `/repos/${owner}/${repo}/contents/${path}?ref=${ref}` : `/repos/${owner}/${repo}/contents/${path}`;
    const response = await api.get(url);
    if (response.data && response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch (error) {
    // We intentionally return null here if a specific file fetch fails, 
    // so it doesn't crash the entire review process.
    return null; 
  }
};

/**
 * Fetches relevant data from the GitHub API for code review.
 * @param {string} repoUrl - The public GitHub repository URL.
 * @returns {Promise<Object>} An object containing metadata, tree, commits, readme, and key file contents.
 */
const fetchRepoData = async (repoUrl) => {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const api = getGitHubAxiosInstance();

  try {
    // 1. Fetch Repository Metadata
    const metadataRes = await api.get(`/repos/${owner}/${repo}`);
    const metadata = metadataRes.data;

    // This app has no auth/authorization system -- anyone who knows a
    // owner/repo pair can request a review of it. Without a GITHUB_TOKEN,
    // GitHub itself returns 404 for private repos (so they're already
    // blocked), but if the configured token happens to have private-repo
    // access, GitHub returns the real metadata with `private: true` instead,
    // and the server would otherwise hand that repo's source code to any
    // anonymous caller (verbatim, in Custom Mode's /prepare response).
    // Reject explicitly, with the same message GitHub's own 404 produces,
    // so this doesn't become an oracle for "exists but is private" vs
    // "doesn't exist".
    if (metadata.private) {
      throw new Error('Repository not found or is private.');
    }

    const defaultBranch = metadata.default_branch;

    // 2. Parallelize subsequent requests to speed up the process
    const [treeRes, languagesRes, commitsRes, readmeRes] = await Promise.allSettled([
      api.get(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`),
      api.get(`/repos/${owner}/${repo}/languages`),
      api.get(`/repos/${owner}/${repo}/commits?per_page=5`),
      api.get(`/repos/${owner}/${repo}/readme`)
    ]);

    const tree = treeRes.status === 'fulfilled' ? treeRes.value.data.tree : [];
    const languages = languagesRes.status === 'fulfilled' ? languagesRes.value.data : {};
    
    let commits = [];
    if (commitsRes.status === 'fulfilled') {
      commits = commitsRes.value.data.map(commitData => ({
        sha: commitData.sha,
        message: commitData.commit.message,
        author: commitData.commit.author ? commitData.commit.author.name : 'Unknown',
        date: commitData.commit.author ? commitData.commit.author.date : new Date().toISOString()
      }));
    } else {
      console.warn("Failed to fetch commits");
    }

    let readme = null;
    if (readmeRes.status === 'fulfilled' && readmeRes.value.data && readmeRes.value.data.content) {
      readme = Buffer.from(readmeRes.value.data.content, 'base64').toString('utf-8');
    }

    // 6. SMART FILE SELECTION
    // Filter out directories and explicitly ignored paths/extensions
    const ignorePatterns = [
      /^node_modules\//, /^\.git\//, /^dist\//, /^build\//, 
      /\.lock$/, /package-lock\.json$/, /yarn\.lock$/, /pnpm-lock\.yaml$/,
      /\.(png|jpe?g|gif|svg|ico|ttf|woff2?|eot|mp4|webp|csv|jsonl|pdf|zip|tar|gz)$/i
    ];
    
    // ZERO-BUDGET OOM PROTECTION: 
    // Only look at blobs (files) and strictly enforce a 50KB size limit 
    // using the 'size' property returned by the GitHub Tree API.
    // This costs $0 and prevents the server from ever downloading massive files.
    const MAX_FILE_SIZE = 50000; // 50KB
    
    const allFilePaths = tree
      .filter(item => item.type === 'blob')
      .map(item => item.path)
      .filter(path => !ignorePatterns.some(pattern => pattern.test(path)))
      .slice(0, 500);

    const validFiles = tree
      .filter(item => item.type === 'blob')
      .filter(item => item.size <= MAX_FILE_SIZE) // Filter by size BEFORE fetching!
      .map(item => item.path)
      .filter(path => !ignorePatterns.some(pattern => pattern.test(path)));

    const selectedFilePaths = new Set();

    // Strategy 1: Always try to fetch specific high-value files
    const exactMatchFiles = ['package.json', '.env.example', '.gitignore', 'Dockerfile'];
    
    validFiles.forEach(path => {
      const fileName = path.split('/').pop();
      if (exactMatchFiles.includes(fileName)) {
        selectedFilePaths.add(path);
      }
    });

    // Strategy 2: Fetch additional source files based on priority.
    // Cap scales with repo size so large repos get a wider sample instead of
    // the same fixed 25 files that a tiny repo would get.
    const priorityKeywords = ['index.js', 'index.ts', 'main.py', 'app.js', 'app.ts', 'src/routes/', 'src/services/', 'auth', 'api', 'user', 'controller', 'utils', 'src/'];
    const MAX_ADDITIONAL_FILES = Math.min(60, Math.max(25, Math.ceil(validFiles.length * 0.1)));
    let additionalFilesCount = 0;

    for (const path of validFiles) {
      if (additionalFilesCount >= MAX_ADDITIONAL_FILES) break;
      
      if (!selectedFilePaths.has(path)) {
        const isPriority = priorityKeywords.some(keyword => path.includes(keyword));
        if (isPriority) {
          selectedFilePaths.add(path);
          additionalFilesCount++;
        }
      }
    }

    // Fetch the contents of all selected files
    const fileContents = {};
    const fetchPromises = Array.from(selectedFilePaths).map(async (path) => {
      try {
        const content = await fetchFileContent(api, owner, repo, path);
        if (content !== null) {
          fileContents[path] = content;
        }
      } catch (err) {
        console.warn(`[GitHub] Failed to fetch ${path}: ${err.message}`);
        // Swallow the error to prevent Unhandled Promise Rejections and just skip this file.
        return null;
      }
    });

    await Promise.all(fetchPromises);

    // Return the aggregated repository data
    return {
      metadata: {
        owner,
        repo,
        fullName: metadata.full_name,
        description: metadata.description,
        defaultBranch: metadata.default_branch,
        stars: metadata.stargazers_count,
        forks: metadata.forks_count,
        updatedAt: metadata.updated_at
      },
      languages,
      commits,
      readme,
      tree: allFilePaths, // Returning full tree of blobs for context
      selectedFiles: fileContents,
      // Honest accounting so the AI/prompt knows it's looking at a sample, not the whole repo.
      totalRepoFiles: tree.filter(item => item.type === 'blob').length,
      sampledFileCount: selectedFilePaths.size
    };

  } catch (error) {
    handleGitHubError(error);
  }
};

/**
 * Fetches the diff data for a pull request or a compare string.
 * @param {string} owner - Repository owner.
 * @param {string} repo - Repository name.
 * @param {string} pullNumber - Optional PR number.
 * @param {string} compareString - Optional compare string (e.g. base...head).
 */
const fetchDiffData = async (owner, repo, pullNumber = null, compareString = null) => {
  const api = getGitHubAxiosInstance();

  try {
    // 1. Fetch Repository Metadata
    const metadataRes = await api.get(`/repos/${owner}/${repo}`);
    const metadata = metadataRes.data;

    // Same reasoning as fetchRepoData: refuse private repos explicitly even
    // when the configured token can see them, since there's no per-user
    // authorization in this app.
    if (metadata.private) {
      throw new Error('Repository not found or is private.');
    }

    let diffUrl = '';
    let prTitle = '';
    let prDescription = '';
    let changedFiles = [];
    let headRef = null;

    if (pullNumber) {
      const prRes = await api.get(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
      prTitle = prRes.data.title;
      prDescription = prRes.data.body;
      diffUrl = prRes.data.diff_url; 
      headRef = prRes.data.head.sha;

      const filesRes = await api.get(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`);
      changedFiles = filesRes.data.filter(f => f.status !== 'removed').map(f => f.filename);
    } else if (compareString) {
      const compareRes = await api.get(`/repos/${owner}/${repo}/compare/${compareString}`);
      diffUrl = `https://api.github.com/repos/${owner}/${repo}/compare/${compareString}`;
      headRef = compareString.split('...')[1] || compareString;
      changedFiles = compareRes.data.files.filter(f => f.status !== 'removed').map(f => f.filename);
    } else {
      throw new Error('Must provide pullNumber or compareString');
    }

    // Fetch the raw diff text
    let diffContent = '';
    try {
      const headers = { 'Accept': 'application/vnd.github.v3.diff' };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }
      
      const diffRes = await axios.get(diffUrl, { headers });
      diffContent = diffRes.data;
    } catch (e) {
      throw new Error('Failed to fetch diff content. The diff might be too large or invalid.');
    }

    // Fetch the contents of all changed files to enable static analysis
    const fileContents = {};
    const fetchPromises = changedFiles.map(async (path) => {
      const content = await fetchFileContent(api, owner, repo, path, headRef);
      if (content !== null) {
        fileContents[path] = content;
      }
    });

    await Promise.all(fetchPromises);

    return {
      metadata: {
        owner,
        repo,
        fullName: metadata.full_name,
        description: metadata.description,
        defaultBranch: metadata.default_branch,
        stars: metadata.stargazers_count,
        forks: metadata.forks_count,
        updatedAt: metadata.updated_at
      },
      isDiff: true,
      diffTitle: prTitle || `Comparison: ${compareString}`,
      diffDescription: prDescription || '',
      diffContent: diffContent,
      selectedFiles: fileContents,
      tree: changedFiles,
      headRef // the resolved head commit SHA (PRs) or ref (compare), for cache-key invalidation on new commits
    };

  } catch (error) {
    handleGitHubError(error);
  }
};

export {
  fetchRepoData,
  fetchDiffData
};
