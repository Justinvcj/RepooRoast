const cache = new Map();

// 24 hours in milliseconds
const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 100;

export const getCachedReview = (key) => {
  if (!cache.has(key)) return null;

  const entry = cache.get(key);
  
  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedReview = (key, data) => {
  // Simple LRU-ish eviction if we exceed size
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  cache.set(key, {
    timestamp: Date.now(),
    data
  });
};

export const clearCache = () => {
  cache.clear();
};
