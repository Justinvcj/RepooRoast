import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios so fetchRepoData/fetchDiffData never make real network calls --
// we just need to control what the "GET /repos/:owner/:repo" metadata call
// returns.
const getMock = vi.fn();
vi.mock('axios', () => ({
  default: {
    create: () => ({ get: getMock }),
    get: getMock
  }
}));

describe('private repo rejection', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('fetchRepoData refuses a repo the token can see but that is private', async () => {
    getMock.mockResolvedValue({ data: { private: true, default_branch: 'main', full_name: 'owner/secret-repo' } });
    const { fetchRepoData } = await import('../src/services/githubService.js');

    // This app has no auth system -- anyone who knows a GITHUB_TOKEN has
    // private access could otherwise exfiltrate that repo's full source via
    // Custom Mode's /prepare endpoint, or get a full AI review of it in
    // default mode, with no authorization check at all.
    await expect(fetchRepoData('https://github.com/owner/secret-repo')).rejects.toThrow('Repository not found or is private.');
  });

  it('fetchRepoData proceeds normally for a public repo', async () => {
    getMock.mockImplementation((url) => {
      if (url === '/repos/owner/public-repo') {
        return Promise.resolve({ data: { private: false, default_branch: 'main', full_name: 'owner/public-repo', stargazers_count: 1, forks_count: 0, updated_at: '2023-01-01' } });
      }
      if (url.includes('/git/trees/')) return Promise.resolve({ data: { tree: [] } });
      if (url.includes('/languages')) return Promise.resolve({ data: {} });
      if (url.includes('/commits')) return Promise.resolve({ data: [] });
      if (url.includes('/readme')) return Promise.resolve({ data: null });
      return Promise.reject(new Error(`Unexpected URL in test: ${url}`));
    });
    const { fetchRepoData } = await import('../src/services/githubService.js');

    const result = await fetchRepoData('https://github.com/owner/public-repo');
    expect(result.metadata.fullName).toBe('owner/public-repo');
  });

  it('fetchDiffData refuses a repo the token can see but that is private', async () => {
    getMock.mockResolvedValue({ data: { private: true, default_branch: 'main', full_name: 'owner/secret-repo' } });
    const { fetchDiffData } = await import('../src/services/githubService.js');

    await expect(fetchDiffData('owner', 'secret-repo', '1', null)).rejects.toThrow('Repository not found or is private.');
  });
});
