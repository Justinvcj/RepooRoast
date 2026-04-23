import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-textSecondary">
          Built with <span className="text-[#f85149]">brains</span> and AI by Justin Varghese.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-textSecondary/70">
          <a href="#" className="hover:text-primary transition-colors hover:underline">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
