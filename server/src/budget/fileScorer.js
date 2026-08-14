/**
 * Scores a file based on its importance to the repository.
 * High-scoring files get larger token budgets.
 */

// Important file path patterns
const FILE_TYPE_WEIGHTS = [
  { pattern: /package\.json$/, weight: 50 },
  { pattern: /(app|index|main|server)\.(ts|js|py)$/i, weight: 60 },
  { pattern: /routes?\/.*?\.(ts|js|py)$/i, weight: 40 },
  { pattern: /services?\/.*?\.(ts|js|py)$/i, weight: 40 },
  { pattern: /controllers?\/.*?\.(ts|js|py)$/i, weight: 40 },
  { pattern: /store\/.*?\.(ts|js|py)$/i, weight: 30 },
  { pattern: /utils?\/.*?\.(ts|js|py)$/i, weight: 20 },
  { pattern: /hooks?\/.*?\.(ts|js|py)$/i, weight: 20 },
  { pattern: /components?\/.*?\.(tsx|jsx|js|ts)$/i, weight: 15 },
  { pattern: /tests?\/.*?\.(ts|js|py)$/i, weight: 5 },
  { pattern: /types?\/.*?\.(ts)$/i, weight: 5 },
];

export const scoreFile = (filePath, inDegree = 0) => {
  let score = 10; // Base score

  // Add weight based on file type
  for (const { pattern, weight } of FILE_TYPE_WEIGHTS) {
    if (pattern.test(filePath)) {
      score += weight;
      break; // Only apply highest matched pattern (assuming sorted roughly by importance if overlapping)
    }
  }

  // Add weight based on Centrality (how many other files import this file)
  // Each inbound import is worth 5 points
  score += inDegree * 5;

  return score;
};
