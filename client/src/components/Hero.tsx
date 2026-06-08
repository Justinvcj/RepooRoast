import React from 'react';
import { UrlInput } from './UrlInput';
import { motion } from 'framer-motion';

interface HeroProps {
  onAnalyzeRepo: (url: string) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeRepo, isLoading }) => {
  return (
    <div className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-textPrimary tracking-tighter">Roast your </span>
          <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary via-orange-500 to-yellow-500 pb-4">
            codebase.
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-textSecondary font-medium tracking-tight mb-10 leading-relaxed">
          Intelligence meets brutality. Our AI acts as your principal engineer, 
          scrutinizing every line of your repository with surgical precision.
        </p>

        <UrlInput onSubmit={onAnalyzeRepo} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};
