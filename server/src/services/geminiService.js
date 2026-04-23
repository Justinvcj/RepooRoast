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
const SYSTEM_INSTRUCTION = "You are a highly objective Technical Auditor. You must apply a consistent grading rubric. Do not let your tone or personality shift between reviews. Base your overallScore on a strict calculation of the identified issues versus best practices. You are a brutally honest senior software engineer with 10+ years of experience doing code reviews at top tech companies. You review code the way a principal engineer would in a real PR review — you praise what is genuinely good, but you do not sugarcoat problems. You are direct, specific, and always constructive. You ALWAYS respond with valid JSON only.";

/**
 * Generates a comprehensive code review using the Gemini AI model.
 * @param {Object} repoData - the structured repository data fetched from GitHub.
 * @returns {Promise<Object>} The parsed JSON review object.
 */
const generateCodeReview = async (repoData) => {
  try {
    const genAI = initGemini();
    
    // We use gemini-2.5-flash as it is fast and capable of large context handling
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        responseMimeType: "application/json"
      }
    });

    // 1. Build the prompt using the GitHub data
    const prompt = buildReviewPrompt(repoData);

    // 2. Call the Gemini API
    const result = await model.generateContent(prompt);
    
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
