/**
 * Validates whether a given string is a standard GitHub repository URL.
 * Accepts HTTP, HTTPS, or no protocol.
 * @param url The URL string to validate.
 * @returns boolean True if valid, false otherwise.
 */
export const isValidGithubUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return regex.test(url);
};

/**
 * Parses a GitHub URL and extracts the repository owner and name.
 * @param url The GitHub URL to parse.
 * @returns An object containing owner and repo, or null if invalid.
 */
export const extractRepoInfo = (url: string): { owner: string; repo: string } | null => {
  try {
    // Add protocol if missing to ensure proper URL parsing
    const urlString = url.startsWith('http') ? url : `https://${url}`;
    const parsedUrl = new URL(urlString);
    
    if (parsedUrl.hostname !== 'github.com' && parsedUrl.hostname !== 'www.github.com') {
      return null;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      // Remove any trailing .git from the repo name
      const repo = pathParts[1].replace(/\.git$/, '');
      return { owner: pathParts[0], repo };
    }
    
    return null;
  } catch {
    return null;
  }
};
