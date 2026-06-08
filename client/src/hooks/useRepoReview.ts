import { useState } from 'react';
import axios from 'axios';
import type { ApiResponse, ReviewStatus } from '../types';

export const useRepoReview = () => {
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepo = async (repoUrl: string) => {
    setStatus('loading');
    setError(null);
    
    try {
      // Use the environment variable for production, or fallback to relative for local Vite proxy
      const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\\/$/, '');
      const response = await axios.post<ApiResponse>(`${API_BASE}/api/review`, { repoUrl });
      
      if (response.data.success) {
        setData(response.data);
        setStatus('success');
      } else {
        // Handle cases where the server returned a 2xx status but success was false
        // (Even though our backend currently throws 4xx/5xx for these)
        throw new Error('Analysis failed unexpectedly.');
      }

    } catch (err) {
      // Standardize the error message
      let errorMessage = 'An unexpected error occurred during review generation.';
      
      if (axios.isAxiosError(err) && err.response?.data?.error) {
         // This extracts the human-readable error sent by our backend error handler
         errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
         errorMessage = err.message;
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
