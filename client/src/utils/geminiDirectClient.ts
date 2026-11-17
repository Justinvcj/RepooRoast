/**
 * Calls the Google Generative Language REST API directly from the browser
 * using a key the user pasted into Custom Mode. This is the entire point of
 * custom mode: the key, the prompt, and the AI's response never pass through
 * RepoRoast's own backend -- only straight to Google's own API domain.
 *
 * Mirrors the resilience behavior of the server's executePromptWithFallbacks
 * (server/src/services/geminiService.js): a 4-tier model fallback chain and
 * a per-attempt timeout, since an overloaded model doesn't always fail fast.
 */

const FALLBACK_MODELS = ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash"];
const MODEL_ATTEMPT_TIMEOUT_MS = 45000;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiDirectError extends Error {}

/**
 * JSON extraction port of server/src/utils/responseParser.js -- handles the
 * model wrapping its JSON in markdown fences or surrounding prose.
 */
const parseGeminiJson = (responseText: string): unknown => {
  if (!responseText || typeof responseText !== 'string') {
    throw new GeminiDirectError('Empty or invalid response received from the AI.');
  }

  try {
    return JSON.parse(responseText.trim());
  } catch {
    let cleaned = responseText;
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) {
      cleaned = fenceMatch[1];
    } else {
      const first = cleaned.indexOf('{');
      const last = cleaned.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        cleaned = cleaned.substring(first, last + 1);
      }
    }
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new GeminiDirectError('Failed to parse the AI response into JSON.');
    }
  }
};

const callModel = async (apiKey: string, model: string, systemInstruction: string, prompt: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MODEL_ATTEMPT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 40,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new GeminiDirectError(`${response.status} ${response.statusText}${body ? `: ${body.slice(0, 300)}` : ''}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') || '';
    if (!text) {
      throw new GeminiDirectError('Gemini returned no content (the response may have been blocked by safety filters).');
    }
    return text;
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') {
      throw new GeminiDirectError(`Model ${model} timed out after ${MODEL_ATTEMPT_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Runs a single prompt through the model fallback chain, exactly mirroring
 * the server's executePromptWithFallbacks, and returns the parsed JSON.
 */
export const generateWithFallbacks = async <T = Record<string, unknown>>(
  apiKey: string,
  systemInstruction: string,
  prompt: string,
  partName: string,
  onModelAttempt?: (model: string) => void
): Promise<T> => {
  let lastError: Error | null = null;

  for (const model of FALLBACK_MODELS) {
    try {
      onModelAttempt?.(model);
      const text = await callModel(apiKey, model, systemInstruction, prompt);
      return parseGeminiJson(text) as T;
    } catch (err) {
      lastError = err as Error;
      const msg = (err as { message?: string })?.message || '';
      // A bad API key should fail loudly and immediately, not burn through
      // every fallback model with the same auth error.
      if (/^40[13]/.test(msg) || /API key not valid/i.test(msg)) {
        throw new GeminiDirectError(`Invalid or unauthorized API key: ${msg}`);
      }
      // Otherwise treat it like the server does: try the next model tier.
      continue;
    }
  }

  throw new GeminiDirectError(`All Gemini models were unavailable for ${partName}. Last error: ${lastError?.message || 'unknown'}`);
};
