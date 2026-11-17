import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FileCode, BrainCircuit, ListChecks, KeyRound } from 'lucide-react';
import { Logo, LogoMark } from './brand';
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
const DEFAULT_STEP_ORDER: ReviewStage[] = ['fetching', 'analyzing', 'classifying', 'generating', 'synthesizing'];

// Custom/BYOK mode has a different, shorter pipeline: the server only
// prepares the prompts (one combined step), then this browser makes the AI
// calls directly with the user's own key -- see useCustomReview.ts.
const CUSTOM_STEP_ORDER: ReviewStage[] = ['preparing', 'reviewing', 'synthesizing'];

const STEP_CONFIG: Record<string, { text: string; icon: React.ReactNode }> = {
  fetching: { text: "Fetching repository metadata & structure...", icon: <Database className="w-5 h-5" /> },
  analyzing: { text: "Running local static analysis...", icon: <FileCode className="w-5 h-5" /> },
  classifying: { text: "Classifying project & consulting the AI Senior Dev...", icon: <BrainCircuit className="w-5 h-5" /> },
  generating: { text: "Generating your brutal review...", icon: <LogoMark size={20} /> },
  synthesizing: { text: "Synthesizing your action plan...", icon: <ListChecks className="w-5 h-5" /> },
  preparing: { text: "Preparing repository context...", icon: <Database className="w-5 h-5" /> },
  reviewing: { text: "Reviewing with your API key...", icon: <KeyRound className="w-5 h-5" /> },
};

interface LoadingScreenProps {
  stage?: ReviewStage;
  mode?: 'default' | 'custom';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage = 'starting', mode = 'default' }) => {
  const STEP_ORDER = mode === 'custom' ? CUSTOM_STEP_ORDER : DEFAULT_STEP_ORDER;
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

      {/* Calm Looping Brand Indicator */}
      <div className="relative z-10 mb-16 p-6 rounded-full content-panel flex items-center justify-center">
        <Logo variant="mark" looping={true} size={56} />
      </div>

      {/* Progress Steps container */}
      <div className="relative z-10 w-full max-w-md content-panel p-8 rounded-[2.5rem] mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-6 flex items-center justify-center gap-2">
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
            <span className="text-primary font-semibold">{progress}%</span>
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
