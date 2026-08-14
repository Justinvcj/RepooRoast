import { encode, decode } from 'gpt-tokenizer';

/**
 * Accurately counts tokens for a given string using GPT tokenizer.
 * (Gemini uses a slightly different tokenizer, but gpt-tokenizer is close enough for rough budgeting).
 */
export const countTokens = (text) => {
  if (!text) return 0;
  return encode(text).length;
};

/**
 * Truncates a string to a specific maximum token count, avoiding breaking words if possible.
 */
export const truncateToTokens = (text, maxTokens) => {
  if (!text) return '';
  const tokens = encode(text);
  if (tokens.length <= maxTokens) return text;
  
  // Truncate and decode back to string
  const truncatedTokens = tokens.slice(0, maxTokens);
  return decode(truncatedTokens) + '\n\n...[Content Truncated Due To Budget]';
};
