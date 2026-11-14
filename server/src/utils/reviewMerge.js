/**
 * Merges the 3 independently-generated review parts into the final 7-category
 * schema and computes the type-weighted overall score.
 *
 * Pure and side-effect-free so it can be reused verbatim by both the default
 * (server-held-key) review path and the custom/BYOK path, where the 3 parts
 * come from the client's own direct AI calls instead of the server's.
 *
 * NOTE: client/src/utils/reviewMerge.ts is a TypeScript port of this exact
 * logic for the custom-mode client-side flow. Keep them in sync.
 */

const normalize = (s) => (s || '').trim().toLowerCase();

const pickCategory = (categoriesArr, expectedName) => {
  const match = (categoriesArr || []).find(c => normalize(c.name) === normalize(expectedName));
  if (match) return { ...match, name: expectedName };
  // Fallback stub keeps the schema's 7-category contract intact even if
  // a part's model response omitted/mislabeled this category.
  return { name: expectedName, score: 50, emoji: '❓', summary: 'The AI did not return a parsable result for this category.', issues: [], positives: [] };
};

/**
 * @param {Object} part1 - Part 1 response (Overview/Structure/Documentation)
 * @param {Object} part2 - Part 2 response (Code Quality/Test Coverage/Performance/Scalability)
 * @param {Object} part3 - Part 3 response (Security)
 * @param {Record<string, number>} weights - rubric weights for the classified repo type
 * @returns {{ categories: Array, overallScore: number }}
 */
export const mergeReviewParts = (part1, part2, part3, weights) => {
  const categories = [
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
