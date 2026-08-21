import { z } from 'zod';

const issueSchema = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  title: z.string(),
  description: z.string(),
  file: z.string(),
  suggestion: z.string()
});

const categorySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  emoji: z.string(),
  summary: z.string(),
  issues: z.array(issueSchema),
  positives: z.array(z.string())
});

const reviewSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallVerdict: z.string(),
  seniorDevQuote: z.string(),
  categories: z.array(categorySchema).length(7),
  topPriorities: z.array(z.string()),
  whatYouDidWell: z.array(z.string()),
  hiringVerdict: z.string(),
  fixPrompt: z.string()
});

/**
 * Parses the raw text response from the Gemini API into a standard JSON object.
 * Helps handle cases where the LLM wraps the response in markdown blocks.
 * Validates the parsed JSON against a strict schema.
 * 
 * @param {string} responseText - The raw string returned by the model.
 * @returns {Object} The parsed JSON object.
 * @throws {Error} If the text cannot be safely parsed into JSON, or fails validation.
 */
const parseGeminiResponse = (responseText) => {
  if (!responseText || typeof responseText !== 'string') {
    throw new Error('Empty or invalid response type received from AI.');
  }

  let parsedData = null;

  try {
    parsedData = JSON.parse(responseText.trim());
  } catch (initialError) {
    let cleanedText = responseText;
    
    const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match) {
      cleanedText = match[1];
    } else {
      const firstBraceIndex = cleanedText.indexOf('{');
      const lastBraceIndex = cleanedText.lastIndexOf('}');

      if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
        cleanedText = cleanedText.substring(firstBraceIndex, lastBraceIndex + 1);
      }
    }

    try {
      parsedData = JSON.parse(cleanedText);
    } catch (error) {
      throw new Error("Failed to parse AI response into JSON.");
    }
  }

  return parsedData;
};

export {
  parseGeminiResponse
};
