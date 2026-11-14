import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Database, FileCode, BrainCircuit, ListChecks } from 'lucide-react';
import Lightfall from './Lightfall';
import type { ReviewStage } from '../hooks/useRepoReview';

const roastingQuotes = [
  "Warming up the review oven...",
  "Teaching the AI to be mean...",
  "Summoning the ghost of clean code...",
  "Preparing the brutal truth...",
  "Judging your variable names...",
  "Questioning your architectural choices..."
];

// The real pipeline stages the server reports, in the order they occur.
// `cache_hit` always jumps straight to the end since no AI call is needed.
const STEP_ORDER: ReviewStage[] = ['fetching', 'analyzing', 'classifying', 'generating', 'synthesizing'];

const STEP_CONFIG: Record<string, { text: string; icon: React.ReactNode }> = {
  fetching: { text: "Fetching repository metadata & structure...", icon: <Database className="w-5 h-5" /> },
  analyzing: { text: "Running local static analysis...", icon: <FileCode className="w-5 h-5" /> },
  classifying: { text: "Classifying project & consulting the AI Senior Dev...", icon: <BrainCircuit className="w-5 h-5" /> },
  generating: { text: "Generating your brutal review...", icon: <Flame className="w-5 h-5" /> },
  synthesizing: { text: "Synthesizing your action plan...", icon: <ListChecks className="w-5 h-5" /> },
};

interface LoadingScreenProps {
  stage?: ReviewStage;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage = 'starting' }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % roastingQuotes.length);
    }, 3000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Real progress derived from the server's actual pipeline stage - no fake
  // timer pretending to know how long an AI call will take.
  const currentIndex = stage === 'cache_hit'
    ? STEP_ORDER.length - 1
    : Math.max(0, STEP_ORDER.indexOf(stage));
  const progress = Math.round(((currentIndex + 1) / STEP_ORDER.length) * 100);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 bg-background">
      {/* Background stays completely fixed */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
         <Lightfall
            colors={['#f97316', '#f85149', '#d29922']}
            backgroundColor="#0d1117"
            speed={0.5}
            streakCount={3}
            streakWidth={1}
            streakLength={1.5}
            glow={0.5}
            density={0.6}
            twinkle={0.6}
            zoom={2.5}
            backgroundGlow={0.1}
            mouseInteraction={false}
            dpr={1}
         />
      </div>

      {/* Pulsing Flame Icon */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 mb-16 p-6 rounded-full glass-panel"
      >
        <Flame className="w-14 h-14 text-primary" />
      </motion.div>

      {/* Progress Steps container */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 rounded-[2.5rem] mb-8">
        <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-center gap-2">
          <span>Analyzing Codebase</span>
          <span className="flex space-x-1">
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
          </span>
        </h3>

        <div className="space-y-4">
          {STEP_ORDER.map((key, index) => {
            const config = STEP_CONFIG[key];
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isComplete || isActive ? 1 : 0.35, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-3 ${isActive ? 'text-primary' : isComplete ? 'text-textPrimary' : 'text-textSecondary'}`}
              >
                {config.icon}
                <span className={isActive ? "font-medium" : ""}>
                  {config.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Loading Bar - width is driven by the real server-reported stage */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2 text-sm font-medium text-textSecondary">
            <span>Progress</span>
            <span className="text-primary font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Roasting Quotes */}
      <motion.div
        key={quoteIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-lg font-medium text-warning text-center max-w-md italic"
      >
        "{roastingQuotes[quoteIndex]}"
      </motion.div>
    </div>
  );
};
