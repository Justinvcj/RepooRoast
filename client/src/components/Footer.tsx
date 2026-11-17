import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-textSecondary">
          Real static analysis, no sugarcoating. Built by Justin Varghese.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-textSecondary/70">
          <Link to="/privacy" className="hover:text-primary transition-colors hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
