import { countTokens, truncateToTokens } from './tokenCounter.js';
import { scoreFile } from './fileScorer.js';

const TOTAL_BUDGET = 30000;
const MIN_BUDGET_PER_FILE = 200; // Guarantee at least imports/signatures

export const allocateBudget = (filesContentMap, dependencyGraph, maxBudget = 30000) => {
  const files = Object.keys(filesContentMap);
  if (files.length === 0) return {};

  const fileStats = files.map(path => {
    const content = filesContentMap[path];
    const tokens = countTokens(content);
    const inDegree = dependencyGraph?.metrics?.inDegree[path] || 0;
    const score = scoreFile(path, inDegree);
    
    return { path, content, tokens, score, allocated: 0, done: false };
  });

  const totalRawTokens = fileStats.reduce((sum, f) => sum + f.tokens, 0);

  // If we fit in budget, no need to truncate anything
  if (totalRawTokens <= maxBudget) {
    const result = {};
    for (const f of fileStats) {
      result[f.path] = f.content;
    }
    return result;
  }

  // Pass 1: Give everyone the minimum budget
  let remainingBudget = maxBudget;
  for (const f of fileStats) {
    const alloc = Math.min(f.tokens, MIN_BUDGET_PER_FILE);
    f.allocated = alloc;
    remainingBudget -= alloc;
    if (f.allocated === f.tokens) f.done = true;
  }

  // Pass 2: Distribute remaining budget proportionally by score until all budget is used or all files are fully allocated
  let loopSafeguard = 0;
  while (remainingBudget > 0 && loopSafeguard < 100) {
    loopSafeguard++;
    
    const activeFiles = fileStats.filter(f => !f.done);
    if (activeFiles.length === 0) break;

    const totalScore = activeFiles.reduce((sum, f) => sum + f.score, 0);
    let budgetConsumedThisRound = 0;

    for (const f of activeFiles) {
      // Proportion of the remaining budget this file deserves
      const proportion = f.score / totalScore;
      const additionalAllocation = Math.floor(remainingBudget * proportion);
      
      const needed = f.tokens - f.allocated;
      
      if (additionalAllocation >= needed) {
        // File gets fully funded
        f.allocated = f.tokens;
        f.done = true;
        budgetConsumedThisRound += needed;
      } else {
        // File gets partially funded
        f.allocated += additionalAllocation;
        budgetConsumedThisRound += additionalAllocation;
      }
    }

    remainingBudget -= budgetConsumedThisRound;
    // If we couldn't allocate anything due to rounding down, break to prevent infinite loops
    if (budgetConsumedThisRound === 0) break;
  }

  // Pass 3: Truncate contents based on final allocation
  const finalFiles = {};
  for (const f of fileStats) {
    if (f.allocated >= f.tokens) {
      finalFiles[f.path] = f.content;
    } else {
      finalFiles[f.path] = truncateToTokens(f.content, f.allocated);
    }
  }

  return finalFiles;
};
