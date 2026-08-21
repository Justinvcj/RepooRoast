import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCachedReview, setCachedReview, clearCache } from '../src/services/cacheService.js';

describe('cacheService', () => {
  beforeEach(() => {
    clearCache();
    vi.useFakeTimers();
  });

  it('should store and retrieve a review', () => {
    setCachedReview('repo:user/test:abcd123', { score: 99 });
    const cached = getCachedReview('repo:user/test:abcd123');
    expect(cached).toEqual({ score: 99 });
  });

  it('should return null for missing key', () => {
    const cached = getCachedReview('missing');
    expect(cached).toBeNull();
  });

  it('should expire cache after 24 hours', () => {
    setCachedReview('expire_test', { data: 'test' });
    
    // Advance time by 24 hours + 1 ms
    vi.advanceTimersByTime((24 * 60 * 60 * 1000) + 1);
    
    const cached = getCachedReview('expire_test');
    expect(cached).toBeNull();
  });
});
