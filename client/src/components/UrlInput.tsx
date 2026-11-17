import React, { useState } from 'react';
import { isValidGithubUrl } from '../utils/githubParser';
import toast from 'react-hot-toast';
import { Github, Loader2, ArrowRight } from 'lucide-react';
import { Button } from './ui';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  align?: 'left' | 'center';
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading, align = 'center' }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a GitHub repository URL.');
      return;
    }

    if (!isValidGithubUrl(url)) {
      toast.error('Invalid GitHub URL. Please use the format: https://github.com/owner/repo');
      return;
    }

    onSubmit(url);
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  return (
    <div className={`w-full max-w-xl ${align === 'center' ? 'mx-auto' : ''}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-surface-secondary/90 border border-border-hairline rounded-xl p-1.5 transition-all duration-instant shadow-sm group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20">
          <label htmlFor="repo-url-input" className="sr-only">
            GitHub repository, pull request, or compare URL
          </label>
          <div className="pl-3.5 pr-2.5 pointer-events-none text-textMuted group-focus-within:text-textPrimary transition-colors">
            <Github className="h-5 w-5" />
          </div>
          <input
            id="repo-url-input"
            type="text"
            className="flex-grow min-w-0 bg-transparent border-none text-textPrimary placeholder-textMuted focus:outline-none focus:ring-0 text-sm sm:text-base font-mono font-medium tracking-tight selection:bg-primary/30"
            placeholder="github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="flex-shrink-0"
            aria-label="Analyze Repository"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      <div
        className={`mt-4 flex flex-wrap items-center gap-2.5 text-xs font-mono text-textMuted ${
          align === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="text-textSecondary select-none">Examples:</span>
        <button
          onClick={() => handleExampleClick('https://github.com/facebook/react')}
          className="hover:text-primary transition-colors hover:underline cursor-pointer select-none"
          disabled={isLoading}
          type="button"
        >
          facebook/react
        </button>
        <span className="text-border-hairline select-none">•</span>
        <button
          onClick={() => handleExampleClick('https://github.com/vuejs/core')}
          className="hover:text-primary transition-colors hover:underline cursor-pointer select-none"
          disabled={isLoading}
          type="button"
        >
          vuejs/core
        </button>
        <span className="text-border-hairline select-none">•</span>
        <button
          onClick={() => handleExampleClick('https://github.com/vercel/next.js')}
          className="hover:text-primary transition-colors hover:underline cursor-pointer select-none"
          disabled={isLoading}
          type="button"
        >
          vercel/next.js
        </button>
      </div>
    </div>
  );
};
