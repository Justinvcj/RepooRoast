import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildReviewPrompt } from '../utils/promptBuilder.js';
import { parseGeminiResponse } from '../utils/responseParser.js';

/**
 * Initializes the Gemini API service.
 * Throws an error early if the API key is not configured.
 */
const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Define the system instructions for the AI persona
const SYSTEM_INSTRUCTION = "You are a highly objective Technical Auditor and a delightfully sarcastic Principal Engineer. Your technical analysis (files, architecture, issues) MUST be pin-point accurate, deeply detailed, and absolutely truthful. Do not invent issues. However, the overall tone of your review and summary should be witty, slightly mocking, and sarcastic—giving the codebase a proper 'roast' without overstepping into being mean or offensive. Keep the roast clever and lighthearted, but the technical feedback razor-sharp. You ALWAYS respond with valid JSON only.";

/**
 * Generates a comprehensive code review using the Gemini AI model.
 * @param {Object} repoData - the structured repository data fetched from GitHub.
 * @returns {Promise<Object>} The parsed JSON review object.
 */
const generateCodeReview = async (repoData) => {
  try {
    const genAI = initGemini();
    
    // 1. Build the prompt using the GitHub data
    const prompt = buildReviewPrompt(repoData);

    // 2. Call the Gemini API with Automatic Model Fallback
    const fallbackModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let result = null;
    
    for (const modelName of fallbackModels) {
      try {
        console.log(`[Gemini] Attempting to generate review using ${modelName}...`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            topK: 40,
            responseMimeType: "application/json"
          }
        });

        result = await model.generateContent(prompt);
        console.log(`[Gemini] Success! Generated review using ${modelName}`);
        break; // If successful, exit the fallback loop
        
      } catch (apiError) {
        const errorMsg = apiError.message || '';
        console.warn(`[Gemini] Model ${modelName} failed: ${errorMsg}`);
        
        // If it's a server overload (503), rate limit (429), Not Found (404), or network drop, continue to next model
        if (errorMsg.includes('503') || errorMsg.includes('429') || errorMsg.includes('404') || errorMsg.includes('fetch failed')) {
          console.warn(`[Gemini] Switching to fallback model...`);
          continue;
        } else {
          // If it's a bad request or auth error, throw immediately
          throw apiError;
        }
      }
    }

    // If we looped through all models and still have no result, the entire API is down/blocked
    if (!result) {
      throw new Error('All Google Gemini models are currently overwhelmed with high demand. Please try again in 5 minutes.');
    }
    
    // 3. Extract the text response
    const responseText = result.response.text();

    // 4. Parse and validate the response
    const parsedReview = parseGeminiResponse(responseText);

    return parsedReview;

  } catch (error) {
    if (error.message.includes('GEMINI_API_KEY')) {
      throw error;
    }
    if (error.message === "Failed to parse AI response into JSON.") {
      throw error;
    }
    // Generic wrapper for Gemini API failures
    throw new Error(`Gemini AI analysis failed: ${error.message}`);
  }
};

export {
  generateCodeReview
};
