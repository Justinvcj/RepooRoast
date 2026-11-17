import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileCode, BrainCircuit, ListChecks, KeyRound, Check } from 'lucide-react';
import { LogoAnimation } from './brand';
import { Card } from './ui';
import type { ReviewStage } from '../hooks/useRepoReview';

const roastingQuotes = [
  "Warming up the review oven...",
  "Calibrating tree-sitter AST parser...",
  "Summoning the ghost of clean code...",
  "Preparing the unvarnished findings...",
  "Evaluating your cyclomatic complexity...",
  "Questioning your architectural boundaries...",
];

const DEFAULT_STEP_ORDER: ReviewStage[] = ['fetching', 'analyzing', 'classifying', 'generating', 'synthesizing'];
const CUSTOM_STEP_ORDER: ReviewStage[] = ['preparing', 'reviewing', 'synthesizing'];

const STEP_CONFIG: Record<string, { text: string; icon: React.ComponentType<{ className?: string }> }> = {
  fetching: { text: "Fetching repository metadata & structure...", icon: Database },
  analyzing: { text: "Running local static analysis...", icon: FileCode },
  classifying: { text: "Classifying project & inspecting AST...", icon: BrainCircuit },
  generating: { text: "Generating evidence-grounded review...", icon: BrainCircuit },
  synthesizing: { text: "Synthesizing prioritized action plan...", icon: ListChecks },
  preparing: { text: "Preparing repository context...", icon: Database },
  reviewing: { text: "Reviewing with your API key...", icon: KeyRound },
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
    }, 3200);

    return () => clearInterval(quoteInterval);
  }, []);

  const currentIndex = stage === 'cache_hit'
    ? STEP_ORDER.length - 1
    : Math.max(0, STEP_ORDER.indexOf(stage));
  const progress = Math.round(((currentIndex + 1) / STEP_ORDER.length) * 100);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 bg-background select-none">
      {/* Calm Looping Brand Respiration */}
      <div className="mb-10 flex flex-col items-center">
        <LogoAnimation
          size={52}
          looping={true}
          showWordmark={false}
          className="text-primary"
        />
      </div>

      {/* Progress Card */}
      <Card level={1} className="w-full max-w-md p-6 sm:p-8 rounded-lg border-border-hairline mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-hairline">
          <h3 className="text-base sm:text-lg font-semibold text-textPrimary font-display flex items-center gap-2">
            <span>Analyzing Codebase</span>
            <span className="inline-flex space-x-0.5 text-primary">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.25 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}>.</motion.span>
            </span>
          </h3>
          <span className="text-sm font-semibold text-textSecondary tabular-nums">
            Step {currentIndex + 1} of {STEP_ORDER.length}
          </span>
        </div>

        <div className="space-y-3.5">
          {STEP_ORDER.map((key, index) => {
            const config = STEP_CONFIG[key];
            if (!config) return null;
            const Icon = config.icon;
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isComplete || isActive ? 1 : 0.4, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 text-sm transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : isComplete
                    ? 'text-textPrimary'
                    : 'text-textMuted'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                    isComplete
                      ? 'bg-data-success/15 border-data-success/40 text-data-success'
                      : isActive
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-surface-secondary border-border-hairline text-textMuted'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="truncate">{config.text}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Real Progress Bar */}
        <div className="mt-8 pt-4 border-t border-border-hairline">
          <div className="flex justify-between items-center mb-2 text-sm text-textSecondary">
            <span>Progress</span>
            <span className="text-primary font-semibold tabular-nums">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden border border-border-hairline">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </Card>

      {/* Dynamic Roasting Quotes */}
      <div className="h-8 flex items-center justify-center max-w-md px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-xs sm:text-sm font-sans text-textSecondary italic"
          >
            "{roastingQuotes[quoteIndex]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
