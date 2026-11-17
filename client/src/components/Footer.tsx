import React from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from './brand';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background border-t border-border-hairline mt-auto select-none">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <LogoMark size={20} monochrome={true} className="text-textMuted" />
          <p className="text-xs text-textSecondary">
            Real static analysis, no sugarcoating. Built by Justin Varghese.
          </p>
        </div>

        <nav aria-label="Legal & Information" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-textSecondary">
          <Link
            to="/privacy"
            className="hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            Terms of Service
          </Link>
          <Link
            to="/design"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            Design System
          </Link>
        </nav>
      </div>
    </footer>
  );
};
