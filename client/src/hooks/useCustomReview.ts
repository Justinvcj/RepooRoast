import { useState } from 'react';
import type { ApiResponse, ReviewStatus } from '../types';
import type { ReviewStage } from './useRepoReview';
import { extractRepoInfo } from '../utils/githubParser';
import { generateWithFallbacks } from '../utils/geminiDirectClient';
import { mergeReviewParts, type ReviewPart } from '../utils/reviewMerge';
import { buildActionPlanPrompt } from '../utils/actionPlanPrompt';

interface PreparedReview {
  repo: ApiResponse['repo'];
  analysis?: ApiResponse['analysis'];
  isDiff: boolean;
  repoLabel: string;
  systemInstruction: string;
  promptParts: string[];
  partNames: string[];
  repoType: string;
  weights: Record<string, number>;
}

/**
 * Custom/BYOK mode: drives the same review pipeline as useRepoReview, but
 * the actual AI calls happen directly from this browser to Google's API
 * with the user's own key (see geminiDirectClient.ts) -- RepoRoast's
 * backend only ever builds the prompts (via /api/review/prepare), it never
 * sees the key or the AI's response.
 */
export const useCustomReview = () => {
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<ReviewStage>('idle');

  const analyzeRepo = async (repoUrl: string, apiKey: string) => {
    setStatus('loading');
    setError(null);
    setStage('preparing');

    try {
      if (!apiKey || !apiKey.trim()) {
        throw new Error('Enter your Gemini API key to use Custom Mode.');
      }

      const parsed = extractRepoInfo(repoUrl);
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const isDiff = parsed && (parsed.type === 'pull' || parsed.type === 'compare');

      const prepareEndpoint = isDiff ? `${API_BASE}/api/review/diff/prepare` : `${API_BASE}/api/review/prepare`;
      const preparePayload = isDiff ? parsed : { repoUrl };

      const prepareRes = await fetch(prepareEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparePayload)
      });

      const prepareJson = await prepareRes.json();
      if (!prepareRes.ok || !prepareJson.success) {
        throw new Error(prepareJson.error || 'Failed to prepare the review context.');
      }

      const prepared = prepareJson as PreparedReview & { success: true };

      // Fire the 3 review calls in parallel, directly to Google, with the
      // user's own key -- mirrors the server's own parallel structure.
      setStage('reviewing');
      const [part1, part2, part3] = await Promise.all(
        prepared.promptParts.map((prompt, i) =>
          generateWithFallbacks<ReviewPart>(apiKey, prepared.systemInstruction, prompt, prepared.partNames[i])
        )
      );

      const { categories, overallScore } = mergeReviewParts(part1, part2, part3, prepared.weights);

      // Synthesize the action plan from the full merged findings, same as
      // the server's 4th pass -- also fired directly with the user's key.
      setStage('synthesizing');
      let actionPlan: { topPriorities?: string[]; whatYouDidWell?: string[]; fixPrompt?: string } = {};
      try {
        const actionPlanPrompt = buildActionPlanPrompt(categories, prepared.repoLabel);
        actionPlan = await generateWithFallbacks<typeof actionPlan>(apiKey, prepared.systemInstruction, actionPlanPrompt, 'Action Plan Synthesis');
      } catch {
        // Non-fatal: fall back to an empty action plan rather than failing the whole review.
      }

      const finalResult: ApiResponse = {
        success: true,
        repo: prepared.repo,
        analysis: prepared.analysis,
        review: {
          overallScore,
          overallVerdict: part1.overallVerdict || 'No verdict provided.',
          seniorDevQuote: part1.seniorDevQuote || 'It works on my machine.',
          hiringVerdict: part1.hiringVerdict || 'Undecided.',
          categories,
          topPriorities: actionPlan.topPriorities || [],
          whatYouDidWell: actionPlan.whatYouDidWell || [],
          fixPrompt: actionPlan.fixPrompt || ''
        }
      };

      localStorage.setItem('reporoast_last_review', JSON.stringify({
        data: finalResult,
        timestamp: Date.now()
      }));
      setData(finalResult);
      setStatus('success');

    } catch (err) {
      let errorMessage = 'An unexpected error occurred during the custom review.';
      if (err instanceof Error) errorMessage = err.message;
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

  return { status, data, error, stage, analyzeRepo, reset };
};
