import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Plus } from 'lucide-react';
import { LogoLockup } from './brand';
import { Button } from './ui';

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
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <nav
          aria-label="Global"
          className="pointer-events-auto bg-surface-secondary/85 backdrop-blur-md border border-border-hairline shadow-lg shadow-black/40 rounded-full px-5 py-2.5 flex items-center justify-between gap-6 sm:gap-12 transition-all duration-fast"
        >
          {/* Brand Logo & Name */}
          <Link
            to="/"
            onClick={handleScrollToTop}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md transition-opacity hover:opacity-90"
            aria-label="RepoRoast Home"
          >
            <LogoLockup size={26} />
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={handleScrollToTop}
              tabIndex={-1}
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="shadow-sm"
              >
                <span className="hidden sm:inline">New Roast</span>
                <span className="sm:hidden">Roast</span>
              </Button>
            </Link>

            <a
              href="https://github.com/Justinvcj/RepooRoast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Source on GitHub"
              className="p-1.5 text-textSecondary hover:text-textPrimary bg-surface-elevated/70 border border-border-hairline rounded-lg hover:border-border-focused transition-all duration-instant active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              title="View Source on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
