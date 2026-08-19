import { useState } from 'react';
import axios from 'axios';
import type { ApiResponse, ReviewStatus } from '../types';
import { extractRepoInfo } from '../utils/githubParser';

export const useRepoReview = () => {
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepo = async (repoUrl: string) => {
    setStatus('loading');
    setError(null);
    
    const controller = new AbortController();
    // 120 second timeout to account for Render free tier cold starts
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    
    try {
      const parsed = extractRepoInfo(repoUrl);
      const API_BASE = import.meta.env.VITE_API_URL || '';
      
      let endpoint = `${API_BASE}/api/review`;
      let payload: any = { repoUrl };

      if (parsed && (parsed.type === 'pull' || parsed.type === 'compare')) {
        endpoint = `${API_BASE}/api/review/diff`;
        payload = parsed;
      }

      const response = await axios.post<ApiResponse>(endpoint, payload, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.data.success) {
        localStorage.setItem('reporoast_last_review', JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
        setData(response.data);
        setStatus('success');
      } else {
        throw new Error('Analysis failed unexpectedly.');
      }

    } catch (err) {
      clearTimeout(timeoutId);
      let errorMessage = 'An unexpected error occurred during review generation.';
      
      if (axios.isCancel(err)) {
        errorMessage = 'The review request timed out. Please try a smaller repository.';
      } else if (axios.isAxiosError(err) && err.response?.data?.error) {
         errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
         if (err.message === 'Network Error') {
           errorMessage = 'Network Error: Your browser blocked the connection, or the Render server timed out. Try turning off your ad-blocker/Brave Shields for this site, or do a Hard Refresh (Ctrl+Shift+R).';
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
  };

  return {
    status,
    data,
    error,
    analyzeRepo,
    reset
  };
};
