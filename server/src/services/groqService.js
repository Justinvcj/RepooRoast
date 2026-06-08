import Groq from 'groq-sdk';
import { buildReviewPrompt } from '../utils/promptBuilder.js';
import { parseGeminiResponse } from '../utils/responseParser.js';

const initGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in your .env file.');
  }
  return new Groq({ apiKey });
};

const SYSTEM_INSTRUCTION = "You are a highly objective Technical Auditor. You must apply a consistent grading rubric. You are a brilliant but slightly sarcastic senior software engineer. Your goal is to tell the absolute truth about the codebase and provide extremely helpful, constructive feedback, but you should roast the code just enough to make the developers giggle without getting irritated. You are witty, direct, and insightful. You ALWAYS respond with valid JSON only.";

const generateCodeReview = async (repoData) => {
  try {
    const groq = initGroq();
    const prompt = buildReviewPrompt(repoData);

    console.log(`[Groq] Attempting to generate review using llama-3.3-70b-versatile...`);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    console.log(`[Groq] Success! Generated review.`);

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parse the JSON response
    const parsedReview = parseGeminiResponse(responseText);
    return parsedReview;

  } catch (error) {
    if (error.message.includes('GROQ_API_KEY')) {
      throw error;
    }
    throw new Error(`Groq AI analysis failed: ${error.message}`);
  }
};

export { generateCodeReview };
