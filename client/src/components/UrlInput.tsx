import React, { useState } from 'react';
import { isValidGithubUrl } from '../utils/githubParser';
import toast from 'react-hot-toast';
import { Github, Loader2, ArrowRight } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
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
    <div className="w-full max-w-3xl mx-auto mt-12">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Single-color ember glow that answers focus, not hover -- this is
            a live input, not a decoration, so it should react like one. */}
        <div className="absolute -inset-px rounded-full bg-primary opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-40 pointer-events-none"></div>
        <div className="relative flex items-center bg-surface/95 border border-border group-focus-within:border-primary/60 rounded-full p-2 shadow-xl transition-colors">
          <div className="pl-6 pr-4 pointer-events-none">
            <Github className="h-7 w-7 text-textSecondary" />
          </div>
          <input
            id="repo-url-input"
            type="text"
            className="flex-grow bg-transparent border-none text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-0 text-lg font-medium"
            placeholder="github.com/username/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex-shrink-0 flex items-center justify-center p-4 rounded-full shadow-sm text-white bg-primary hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <ArrowRight className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-textSecondary/70">
        <span>Try an example:</span>
        <button 
          onClick={() => handleExampleClick('https://github.com/facebook/react')}
          className="hover:text-primary transition-colors hover:underline"
          disabled={isLoading}
          type="button"
        >
          facebook/react
        </button>
        <span>•</span>
        <button 
          onClick={() => handleExampleClick('https://github.com/vuejs/core')}
          className="hover:text-primary transition-colors hover:underline"
          disabled={isLoading}
          type="button"
        >
          vuejs/core
        </button>
        <span>•</span>
        <button 
          onClick={() => handleExampleClick('https://github.com/vercel/next.js')}
          className="hover:text-primary transition-colors hover:underline"
          disabled={isLoading}
          type="button"
        >
          vercel/next.js
        </button>
      </div>
    </div>
  );
};
