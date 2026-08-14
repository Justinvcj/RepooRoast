import { describe, it, expect } from 'vitest';
import { scoreFile } from '../src/budget/fileScorer.js';
import { countTokens } from '../src/budget/tokenCounter.js';
import { allocateBudget } from '../src/budget/budgetAllocator.js';

describe('Token Budgeting System', () => {
  it('tokenCounter should count tokens accurately', () => {
    const text = 'const a = 1;';
    const tokens = countTokens(text);
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(15);
  });

  it('fileScorer should prioritize certain files over others', () => {
    const scoreHub = scoreFile('src/services/api.js', 10);
    const scoreOrphan = scoreFile('src/utils/old.js', 0);
    const scoreReadme = scoreFile('README.md', 0);
    const scorePackageJson = scoreFile('package.json', 0);

    expect(scoreHub).toBeGreaterThan(scoreOrphan);
    expect(scorePackageJson).toBeGreaterThan(scoreOrphan);
  });

  it('budgetAllocator should cap tokens within the max limit', () => {
    const files = {
      'index.js': 'console.log("hello"); '.repeat(5000), // very long file
      'config.js': 'export const API = "url";',
      'utils.js': 'export const add = (a, b) => a + b; '.repeat(100)
    };
    const deps = { metrics: { inDegree: { 'config.js': 5, 'utils.js': 1, 'index.js': 2 } } };

    const allocated = allocateBudget(files, deps, 1000); // Small budget of 1000 tokens

    expect(allocated['config.js']).toBeDefined();
    
    const totalContent = Object.values(allocated).join('\n');
    const totalTokens = countTokens(totalContent);
    
    expect(totalTokens).toBeLessThanOrEqual(1050); 
  });
});
