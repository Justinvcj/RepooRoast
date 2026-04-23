/**
 * Parses the raw text response from the Gemini API into a standard JSON object.
 * Helps handle cases where the LLM wraps the response in markdown blocks.
 * 
 * @param {string} responseText - The raw string returned by the model.
 * @returns {Object} The parsed JSON object.
 * @throws {Error} If the text cannot be safely parsed into JSON.
 */
const parseGeminiResponse = (responseText) => {
  // If no text, throw immediately
  if (!responseText || typeof responseText !== 'string') {
    throw new Error('Empty or invalid response type received from AI.');
  }

  // 1. Try parsing directly first (best-case scenario: model followed instructions perfectly)
  try {
    return JSON.parse(responseText.trim());
  } catch (initialError) {
    // Initial parse failed, move to cleanup strategies
  }

  // 2. Strip standard markdown JSON blocks
  // e.g. ```json\n { ... } \n```
  let cleanedText = responseText;
  
  // Remove starting ```json or ```
  cleanedText = cleanedText.replace(/^```(json)?/i, '');
  // Remove ending ```
  cleanedText = cleanedText.replace(/```$/i, '');
  
  cleanedText = cleanedText.trim();

  // Try parsing the cleaned markdown text
  try {
    return JSON.parse(cleanedText);
  } catch (markdownError) {
    // Markdown cleanup failed, move to regex extraction
  }

  // 3. Fallback: Extract everything between the first '{' and the last '}'
  try {
    const firstBraceIndex = responseText.indexOf('{');
    const lastBraceIndex = responseText.lastIndexOf('}');

    if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
      const extractedJsonString = responseText.slice(firstBraceIndex, lastBraceIndex + 1);
      return JSON.parse(extractedJsonString);
    }
  } catch (extractionError) {
    // Fallback extraction failed
  }

  // 4. If all parsing attempts fail, throw custom error
  throw new Error("Failed to parse AI response into JSON.");
};

export {
  parseGeminiResponse
};
