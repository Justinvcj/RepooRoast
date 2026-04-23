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
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
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
    if (status === 403 || status === 429) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or add a GITHUB_TOKEN.');
    }
  }
  // Generic fallback if it's not a handled response error
  if (error.message.includes('Repository not found') || error.message.includes('rate limit exceeded')) {
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
const fetchFileContent = async (api, owner, repo, path) => {
  try {
    const response = await api.get(`/repos/${owner}/${repo}/contents/${path}`);
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
    const defaultBranch = metadata.default_branch;

    // 2. Fetch Directory Tree
    const treeRes = await api.get(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
    const tree = treeRes.data.tree;

    // 3. Fetch Languages
    const languagesRes = await api.get(`/repos/${owner}/${repo}/languages`);
    const languages = languagesRes.data;

    // 4. Fetch Recent Commits (Last 5)
    let commits = [];
    try {
      const commitsRes = await api.get(`/repos/${owner}/${repo}/commits?per_page=5`);
      commits = commitsRes.data.map(commitData => ({
        sha: commitData.sha,
        message: commitData.commit.message,
        author: commitData.commit.author ? commitData.commit.author.name : 'Unknown',
        date: commitData.commit.author ? commitData.commit.author.date : new Date().toISOString()
      }));
    } catch(e) {
      console.warn("Failed to fetch commits", e.message);
    }

    // 5. Fetch README
    let readme = null;
    try {
      const readmeRes = await api.get(`/repos/${owner}/${repo}/readme`);
      if (readmeRes.data && readmeRes.data.content) {
        readme = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
      }
    } catch (readmeError) {
      // README might not exist, that's okay.
    }

    // 6. SMART FILE SELECTION
    // Filter out directories and explicitly ignored paths/extensions
    const ignorePatterns = [
      /^node_modules\//, /^\.git\//, /^dist\//, /^build\//, 
      /\.lock$/, /\.(png|jpe?g|gif|svg|ico|ttf|woff2?|eot|mp4|webp)$/i
    ];
    
    // Only looking at blobs (files)
    const allFilePaths = tree
      .filter(item => item.type === 'blob')
      .map(item => item.path);

    const isIgnored = (path) => ignorePatterns.some(pattern => pattern.test(path));
    const validFiles = allFilePaths.filter(path => !isIgnored(path));

    const selectedFilePaths = new Set();

    // Strategy 1: Always try to fetch specific high-value files
    const exactMatchFiles = ['package.json', '.env.example', '.gitignore', 'Dockerfile'];
    
    validFiles.forEach(path => {
      const fileName = path.split('/').pop();
      if (exactMatchFiles.includes(fileName)) {
        selectedFilePaths.add(path);
      }
    });

    // Strategy 2: Fetch up to 8 additional source files based on priority
    const priorityKeywords = ['index.js', 'main.py', 'src/routes/', 'src/services/', 'auth', 'api', 'user'];
    let additionalFilesCount = 0;

    for (const path of validFiles) {
      if (additionalFilesCount >= 8) break;
      
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
      const content = await fetchFileContent(api, owner, repo, path);
      if (content !== null) {
        fileContents[path] = content;
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
      selectedFiles: fileContents
    };

  } catch (error) {
    handleGitHubError(error);
  }
};

export {
  fetchRepoData
};
