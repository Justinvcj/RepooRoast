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

  // 2. Strip standard markdown JSON blocks or extract raw JSON object
  let cleanedText = responseText;
  
  const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    cleanedText = match[1];
  } else {
    // 3. Fallback: Extract everything between the first '{' and the last '}'
    const firstBraceIndex = cleanedText.indexOf('{');
    const lastBraceIndex = cleanedText.lastIndexOf('}');

    if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
      cleanedText = cleanedText.substring(firstBraceIndex, lastBraceIndex + 1);
    }
  }

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    // Fallback parsing failed
  }

  // 4. If all parsing attempts fail, throw custom error
  throw new Error("Failed to parse AI response into JSON.");
};

export {
  parseGeminiResponse
};
