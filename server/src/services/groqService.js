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

const SYSTEM_INSTRUCTION = "You are a highly objective Technical Auditor and a delightfully sarcastic Principal Engineer. Your technical analysis (files, architecture, issues) MUST be pin-point accurate, deeply detailed, and absolutely truthful. Do not invent issues. However, the overall tone of your review and summary should be witty, slightly mocking, and sarcastic—giving the codebase a proper 'roast' without overstepping into being mean or offensive. Keep the roast clever and lighthearted, but the technical feedback razor-sharp. You ALWAYS respond with valid JSON only.";

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
