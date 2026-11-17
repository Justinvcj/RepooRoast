import { useState } from 'react';
import type { ApiResponse, ReviewStatus } from '../types';
import { extractRepoInfo } from '../utils/githubParser';

/** One newline-delimited JSON message from the streaming review endpoint. */
type StreamMessage = { type?: string; stage?: string; success?: boolean; [key: string]: unknown };

export type ReviewStage =
  | 'idle' | 'fetching' | 'analyzing' | 'classifying' | 'generating' | 'synthesizing' | 'cache_hit' | 'starting'
  // Custom/BYOK mode stages (see useCustomReview.ts) -- the slow part shifts
  // to the client's own direct AI calls, which the server never reports on.
  | 'preparing' | 'reviewing';

export const useRepoReview = () => {
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<ReviewStage>('idle');

  const analyzeRepo = async (repoUrl: string) => {
    setStatus('loading');
    setError(null);
    setStage('starting');

    const controller = new AbortController();
    // The server sends a heartbeat every few seconds while it works, so a
    // healthy review never goes quiet. Time out on silence, not on total
    // duration: a long review on a big repo is fine, a dead connection is not.
    // The first byte gets longer to cover Render's free-tier cold start, and a
    // hard cap stops a stuck request from running forever.
    const FIRST_BYTE_MS = 90_000;
    const IDLE_MS = 40_000;
    const HARD_CAP_MS = 6 * 60_000;
    let timeoutId = setTimeout(() => controller.abort(), FIRST_BYTE_MS);
    const armIdle = (ms: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => controller.abort(), ms);
    };
    const hardCapId = setTimeout(() => controller.abort(), HARD_CAP_MS);

    try {
      const parsed = extractRepoInfo(repoUrl);
      const API_BASE = import.meta.env.VITE_API_URL || '';

      let endpoint = `${API_BASE}/api/review`;
      let payload: object = { repoUrl };

      if (parsed && (parsed.type === 'pull' || parsed.type === 'compare')) {
        endpoint = `${API_BASE}/api/review/diff`;
        payload = parsed;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.body) {
        throw new Error('No response body received from server.');
      }

      // The server streams newline-delimited JSON: zero or more
      // {"type":"progress","stage":...} lines followed by one final result
      // (or error) object. Parse it incrementally so the loading UI reflects
      // the actual pipeline stage instead of a fake timer.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalResult: ApiResponse | null = null;
      let serverErrorMessage: string | null = null;

      const consumeLine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let parsed: StreamMessage;
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          return; // Ignore anything that isn't a complete JSON object yet.
        }

        if (parsed.type === 'progress') {
          setStage(parsed.stage as ReviewStage);
        } else if (parsed.success === true) {
          finalResult = parsed as unknown as ApiResponse;
        } else if (parsed.success === false) {
          serverErrorMessage = (parsed as { error?: string }).error || 'Analysis failed unexpectedly.';
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        armIdle(IDLE_MS);
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          consumeLine(buffer.slice(0, newlineIndex));
          buffer = buffer.slice(newlineIndex + 1);
        }
      }
      consumeLine(buffer); // Handle any trailing content with no final newline.

      clearTimeout(timeoutId);
      clearTimeout(hardCapId);

      if (serverErrorMessage && !finalResult) {
        throw new Error(serverErrorMessage);
      }
      if (!finalResult) {
        throw new Error('The server stopped before the review finished. Wait a minute and try again.');
      }

      localStorage.setItem('reporoast_last_review', JSON.stringify({
        data: finalResult,
        timestamp: Date.now()
      }));
      setData(finalResult);
      setStatus('success');

    } catch (err) {
      clearTimeout(timeoutId);
      clearTimeout(hardCapId);
      let errorMessage = 'An unexpected error occurred during review generation.';

      if (err instanceof DOMException && err.name === 'AbortError') {
        errorMessage = 'The server stopped responding before the review finished. Try again in a minute. If it had already finished, the retry loads instantly.';
      } else if (err instanceof Error) {
        if (err.message === 'Failed to fetch') {
          errorMessage = 'Network Error: Your browser blocked the connection, or the server timed out. Try turning off your ad-blocker/Brave Shields for this site, or do a Hard Refresh (Ctrl+Shift+R).';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setData(null);
    setError(null);
    setStage('idle');
  };

  return {
    status,
    data,
    error,
    stage,
    analyzeRepo,
    reset
  };
};
