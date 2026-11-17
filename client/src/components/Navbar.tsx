import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { LogoLockup } from './brand';

export const Navbar: React.FC = () => {
  const handleScrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('repo-url-input') as HTMLInputElement;
        if (input) input.focus({ preventScroll: true });
      }, 500);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border-hairline">
      <nav
        aria-label="Global"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between"
      >
        <Link
          to="/"
          onClick={handleScrollToTop}
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="RepoRoast Home"
        >
          <LogoLockup size={26} />
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link
            to="/"
            onClick={handleScrollToTop}
            className="font-semibold text-textPrimary hover:text-primary transition-colors duration-fast rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            New roast
          </Link>
          <a
            href="https://github.com/Justinvcj/RepooRoast"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source on GitHub"
            className="text-textSecondary hover:text-textPrimary transition-colors duration-fast rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="View Source on GitHub"
          >
            <Github className="w-[18px] h-[18px]" />
          </a>
        </div>
      </nav>
    </header>
  );
};
