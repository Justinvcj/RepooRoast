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
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-surface/80 backdrop-blur-xl border border-border rounded-full p-2 shadow-2xl">
          <div className="pl-6 pr-4 pointer-events-none">
            <Github className="h-7 w-7 text-textSecondary" />
          </div>
          <input
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
