import React from 'react';

import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-textSecondary">
          Built with <span className="text-[#f85149]">brains</span> and AI by Justin Varghese.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-textSecondary/70">
          <button onClick={() => toast("This is a portfolio project! We don't have lawyers.", { icon: '🧑‍⚖️' })} className="hover:text-primary transition-colors hover:underline">Privacy Policy</button>
          <button onClick={() => toast("By using this site, you agree to get your code brutally roasted.", { icon: '🔥' })} className="hover:text-primary transition-colors hover:underline">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};
