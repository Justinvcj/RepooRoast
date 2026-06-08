import { generateCodeReview as geminiGenerate } from './geminiService.js';
import { generateCodeReview as groqGenerate } from './groqService.js';

/**
 * Wrapper service to route AI requests to the appropriate provider
 * based on the AI_PROVIDER environment variable.
 */
const generateCodeReview = async (repoData) => {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'gemini';
  
  if (provider === 'groq') {
    console.log('[AI Wrapper] Routing request to Groq...');
    return await groqGenerate(repoData);
  } else {
    console.log('[AI Wrapper] Routing request to Gemini...');
    return await geminiGenerate(repoData);
  }
};

export { generateCodeReview };
