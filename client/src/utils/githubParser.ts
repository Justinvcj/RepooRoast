export type GithubUrlType = 'repo' | 'pull' | 'compare';

export interface GithubUrlInfo {
  type: GithubUrlType;
  owner: string;
  repo: string;
  pullNumber?: string;
  compareString?: string;
}

/**
 * Validates whether a given string is a standard GitHub repository, PR, or Compare URL.
 */
export const isValidGithubUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/(pull\/\d+|compare\/[a-zA-Z0-9_.-]+\.\.\.[a-zA-Z0-9_.-]+))?\/?$/;
  return regex.test(url);
};

/**
 * Parses a GitHub URL and extracts the repository owner, name, and diff information if present.
 */
export const extractRepoInfo = (url: string): GithubUrlInfo | null => {
  try {
    const urlString = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlString);
    
    if (parsedUrl.hostname !== 'github.com' && parsedUrl.hostname !== 'www.github.com') {
      return null;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      const owner = pathParts[0];
      const repo = pathParts[1].replace(/\.git$/, '');

      if (pathParts[2] === 'pull' && pathParts[3]) {
        return { type: 'pull', owner, repo, pullNumber: pathParts[3] };
      }

      if (pathParts[2] === 'compare' && pathParts[3]) {
        return { type: 'compare', owner, repo, compareString: pathParts[3] };
      }

      return { type: 'repo', owner, repo };
    }
    
    return null;
  } catch {
    return null;
  }
};
