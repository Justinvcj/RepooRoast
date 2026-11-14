import type { Category } from '../types';

/**
 * TypeScript port of server/src/utils/reviewMerge.js's mergeReviewParts,
 * used for custom/BYOK mode where the 3 review parts come from the
 * browser's own direct AI calls instead of the server's. Keep these two
 * in sync -- this is the only duplication point in the custom-mode flow,
 * deliberately, so the server never has to see the user's AI responses.
 */

const normalize = (s?: string) => (s || '').trim().toLowerCase();

const pickCategory = (categoriesArr: Category[] | undefined, expectedName: string): Category => {
  const match = (categoriesArr || []).find(c => normalize(c.name) === normalize(expectedName));
  if (match) return { ...match, name: expectedName };
  return {
    name: expectedName,
    score: 50,
    emoji: '❓',
    summary: 'The AI did not return a parsable result for this category.',
    issues: [],
    positives: []
  };
};

export interface ReviewPart {
  categories?: Category[];
  overallScore?: number;
  overallVerdict?: string;
  seniorDevQuote?: string;
  hiringVerdict?: string;
}

export const mergeReviewParts = (
  part1: ReviewPart,
  part2: ReviewPart,
  part3: ReviewPart,
  weights: Record<string, number>
): { categories: Category[]; overallScore: number } => {
  const categories: Category[] = [
    pickCategory(part2.categories, "Code Quality"),
    pickCategory(part1.categories, "Project Structure"),
    pickCategory(part1.categories, "Documentation"),
    pickCategory(part3.categories, "Security"),
    pickCategory(part2.categories, "Test Coverage"),
    pickCategory(part2.categories, "Performance"),
    pickCategory(part2.categories, "Scalability")
  ];

  let overallScore = part1.overallScore || 50;

  if (weights && categories.length > 0) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const cat of categories) {
      const weight = weights[cat.name] || 0;
      weightedSum += (cat.score || 0) * weight;
      totalWeight += weight;
    }

    if (totalWeight > 0) {
      overallScore = Math.round(weightedSum / totalWeight);
    }
  }

  return { categories, overallScore };
};
