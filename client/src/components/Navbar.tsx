import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Plus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const handleScrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Give smooth scroll a moment before focusing to prevent jumping
      setTimeout(() => {
        const input = document.getElementById('repo-url-input') as HTMLInputElement;
        if (input) input.focus({ preventScroll: true });
      }, 500);
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto glass-panel bg-[#0d1117]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-6 py-3 flex items-center justify-between gap-8 md:gap-16 transition-colors duration-300">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" onClick={handleScrollToTop} className="text-xl font-serif font-semibold tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-textPrimary">Repo<span className="text-primary">Roast</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            onClick={handleScrollToTop}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Roast</span>
          </Link>
          <a 
            href="https://github.com/Justinvcj/RepooRoast" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-textSecondary hover:text-textPrimary bg-surface/50 border border-border/50 rounded-lg hover:border-[#8b949e] transition-colors"
            title="View Source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>
    </div>
  );
};
