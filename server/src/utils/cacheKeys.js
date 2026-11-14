/**
 * Cache key derivation, pulled out as pure functions so the collision/
 * staleness fix (see git history) can be unit tested directly instead of
 * only through a full route-level integration test.
 */

export const buildRepoCacheKey = (owner, repo, commitSha) =>
  `repo:${owner}/${repo}:${commitSha || 'unknown'}`;

/**
 * Derives the diff-review cache key from whichever parameter the request
 * actually supplied, plus the resolved head commit SHA when available --
 * never from inferring it off the PR title text. A PR titled to merely
 * contain the word "Comparison" used to collapse onto `compareString`
 * (undefined in the PR-number path), producing an identical cache key for
 * otherwise-unrelated PRs on the same repo. Including the head SHA also
 * means pushing new commits to a PR correctly invalidates the cache
 * instead of silently serving a stale review for the old commit forever.
 */
export const buildDiffCacheKey = (owner, repo, { pullNumber, compareString, headRef }) => {
  const refKey = headRef || (pullNumber ? `pr:${pullNumber}` : `cmp:${compareString}`);
  return `diff:${owner}/${repo}:${refKey}`;
};
