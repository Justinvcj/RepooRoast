import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="content-panel rounded-[2.5rem] p-10 md:p-16 max-w-xl"
      >
        <Flame className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-5xl md:text-6xl font-serif font-semibold tracking-tight text-textPrimary mb-4">
          404
        </h1>
        <p className="text-lg text-textSecondary font-medium mb-8">
          This page got roasted out of existence. Even our AI couldn't find anything redeeming about this URL.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to safety
        </Link>
      </motion.div>
    </div>
  );
};
