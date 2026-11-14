import { describe, it, expect } from 'vitest';
import { mergeReviewParts } from '../src/utils/reviewMerge.js';

const makeCategory = (name, score, overrides = {}) => ({
  name,
  score,
  emoji: '🔥',
  summary: `${name} summary`,
  issues: [],
  positives: [],
  ...overrides
});

const WEIGHTS = {
  'Code Quality': 0.20,
  'Project Structure': 0.15,
  'Documentation': 0.20,
  'Security': 0.10,
  'Test Coverage': 0.20,
  'Performance': 0.05,
  'Scalability': 0.10
};

describe('reviewMerge', () => {
  it('pulls each category from the correct part', () => {
    const part1 = {
      overallScore: 80,
      categories: [makeCategory('Project Structure', 70), makeCategory('Documentation', 90)]
    };
    const part2 = {
      categories: [
        makeCategory('Code Quality', 75),
        makeCategory('Test Coverage', 60),
        makeCategory('Performance', 85),
        makeCategory('Scalability', 50)
      ]
    };
    const part3 = { categories: [makeCategory('Security', 40)] };

    const { categories } = mergeReviewParts(part1, part2, part3, WEIGHTS);

    expect(categories.map(c => c.name)).toEqual([
      'Code Quality', 'Project Structure', 'Documentation', 'Security', 'Test Coverage', 'Performance', 'Scalability'
    ]);
    expect(categories.find(c => c.name === 'Security').score).toBe(40);
    expect(categories.find(c => c.name === 'Code Quality').score).toBe(75);
  });

  it('matches category names case/whitespace-insensitively', () => {
    const part1 = { categories: [makeCategory('  project structure ', 70), makeCategory('DOCUMENTATION', 90)] };
    const part2 = {
      categories: [
        makeCategory('code quality', 75),
        makeCategory('test coverage', 60),
        makeCategory('performance', 85),
        makeCategory('scalability', 50)
      ]
    };
    const part3 = { categories: [makeCategory('security', 40)] };

    const { categories } = mergeReviewParts(part1, part2, part3, WEIGHTS);

    // Every category should have been matched (none fell back to the stub).
    for (const cat of categories) {
      expect(cat.summary).not.toBe('The AI did not return a parsable result for this category.');
    }
    // And the canonical display name should be normalized, not the raw casing.
    expect(categories.find(c => c.score === 90).name).toBe('Documentation');
  });

  it('falls back to a stub category when a model omits or mislabels one', () => {
    const part1 = { categories: [makeCategory('Project Structure', 70)] }; // Documentation missing
    const part2 = {
      categories: [makeCategory('Code Quality', 75), makeCategory('Test Coverage', 60), makeCategory('Performance', 85), makeCategory('Scalability', 50)]
    };
    const part3 = { categories: [makeCategory('Security', 40)] };

    const { categories } = mergeReviewParts(part1, part2, part3, WEIGHTS);

    const docs = categories.find(c => c.name === 'Documentation');
    expect(docs.score).toBe(50);
    expect(docs.summary).toBe('The AI did not return a parsable result for this category.');
    expect(docs.issues).toEqual([]);
    expect(docs.positives).toEqual([]);
  });

  it('computes the weighted overall score correctly', () => {
    const part1 = { overallScore: 999, categories: [makeCategory('Project Structure', 80), makeCategory('Documentation', 80)] };
    const part2 = {
      categories: [makeCategory('Code Quality', 80), makeCategory('Test Coverage', 80), makeCategory('Performance', 80), makeCategory('Scalability', 80)]
    };
    const part3 = { categories: [makeCategory('Security', 80)] };

    const { overallScore } = mergeReviewParts(part1, part2, part3, WEIGHTS);

    // All categories scored identically (80), so the weighted average must be 80
    // regardless of the weight distribution -- and must NOT be part1.overallScore (999).
    expect(overallScore).toBe(80);
  });

  it('weights a low-scoring heavily-weighted category down correctly', () => {
    const part1 = { categories: [makeCategory('Project Structure', 100), makeCategory('Documentation', 100)] };
    const part2 = {
      categories: [makeCategory('Code Quality', 100), makeCategory('Test Coverage', 0), makeCategory('Performance', 100), makeCategory('Scalability', 100)]
    };
    const part3 = { categories: [makeCategory('Security', 100)] };

    const { overallScore } = mergeReviewParts(part1, part2, part3, WEIGHTS);

    // Test Coverage has weight 0.20 and scores 0; everything else scores 100.
    // Expected: 100 * 0.8 + 0 * 0.2 = 80.
    expect(overallScore).toBe(80);
  });

  it('falls back to part1.overallScore when weights are empty', () => {
    const part1 = { overallScore: 65, categories: [makeCategory('Project Structure', 70)] };
    const part2 = { categories: [makeCategory('Code Quality', 75)] };
    const part3 = { categories: [makeCategory('Security', 40)] };

    const { overallScore } = mergeReviewParts(part1, part2, part3, {});

    expect(overallScore).toBe(65);
  });

  it('defaults to 50 when part1.overallScore is missing and weights are empty', () => {
    const { overallScore } = mergeReviewParts({ categories: [] }, { categories: [] }, { categories: [] }, {});
    expect(overallScore).toBe(50);
  });
});
