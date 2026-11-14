import { describe, it, expect } from 'vitest';
import { buildRepoCacheKey, buildDiffCacheKey } from '../src/utils/cacheKeys.js';

describe('cacheKeys', () => {
  describe('buildRepoCacheKey', () => {
    it('keys by owner/repo/commitSha', () => {
      expect(buildRepoCacheKey('facebook', 'react', 'abc123')).toBe('repo:facebook/react:abc123');
    });

    it('falls back to "unknown" when no SHA is available', () => {
      expect(buildRepoCacheKey('facebook', 'react', undefined)).toBe('repo:facebook/react:unknown');
    });
  });

  describe('buildDiffCacheKey', () => {
    it('keys a PR review by its head commit SHA when available', () => {
      const key = buildDiffCacheKey('owner', 'repo', { pullNumber: '42', headRef: 'deadbeef' });
      expect(key).toBe('diff:owner/repo:deadbeef');
    });

    it('keys a compare review by its head commit SHA when available', () => {
      const key = buildDiffCacheKey('owner', 'repo', { compareString: 'main...feature', headRef: 'deadbeef' });
      expect(key).toBe('diff:owner/repo:deadbeef');
    });

    it('falls back to the PR number when no head SHA is resolved', () => {
      const key = buildDiffCacheKey('owner', 'repo', { pullNumber: '42' });
      expect(key).toBe('diff:owner/repo:pr:42');
    });

    it('falls back to the compare string when no head SHA is resolved', () => {
      const key = buildDiffCacheKey('owner', 'repo', { compareString: 'main...feature' });
      expect(key).toBe('diff:owner/repo:cmp:main...feature');
    });

    it('never produces the same key for two different PRs, even if one title contained "Comparison"', () => {
      // Regression test: the old logic inferred which param was supplied by
      // checking whether the PR title contained the word "Comparison",
      // which collapsed PR reviews onto `compareString` (undefined in the
      // PR-number path) whenever a PR happened to be titled that way.
      const pr7 = buildDiffCacheKey('owner', 'repo', { pullNumber: '7' });
      const pr99TitledComparison = buildDiffCacheKey('owner', 'repo', { pullNumber: '99' });

      expect(pr7).not.toBe(pr99TitledComparison);
      expect(pr7).toBe('diff:owner/repo:pr:7');
      expect(pr99TitledComparison).toBe('diff:owner/repo:pr:99');
    });

    it('produces a different key when a PR gets a new head commit (cache invalidation on push)', () => {
      const beforePush = buildDiffCacheKey('owner', 'repo', { pullNumber: '7', headRef: 'sha-old' });
      const afterPush = buildDiffCacheKey('owner', 'repo', { pullNumber: '7', headRef: 'sha-new' });

      expect(beforePush).not.toBe(afterPush);
    });
  });
});
