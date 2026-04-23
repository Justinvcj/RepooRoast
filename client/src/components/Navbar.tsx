import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Plus } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-surface/60 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-full px-6 py-3 flex items-center justify-between gap-8 md:gap-16 transition-all duration-300">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="text-xl font-serif font-extrabold tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-400">
              RepoRoast
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-orange-600 px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Roast</span>
          </Link>
          <a 
            href="https://github.com/justinvarghese1/reporoast" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-textSecondary hover:text-textPrimary bg-surface/50 border border-border/50 rounded-full hover:border-[#8b949e] transition-colors"
            title="View Source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>
    </div>
  );
};
