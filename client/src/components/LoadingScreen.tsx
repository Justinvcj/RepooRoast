import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Database, FileCode, BrainCircuit, Terminal } from 'lucide-react';

const roastingQuotes = [
  "Warming up the review oven...",
  "Teaching the AI to be mean...",
  "Summoning the ghost of clean code...",
  "Preparing the brutal truth...",
  "Judging your variable names...",
  "Questioning your architectural choices..."
];

export const LoadingScreen: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % roastingQuotes.length);
    }, 3000);

    return () => clearInterval(quoteInterval);
  }, []);

  const steps = [
    { text: "Fetching repository metadata...", icon: <Database className="w-5 h-5 text-textSecondary" /> },
    { text: "Reading file structure...", icon: <Terminal className="w-5 h-5 text-textSecondary" /> },
    { text: "Analyzing source code...", icon: <FileCode className="w-5 h-5 text-textSecondary" /> },
    { text: "Consulting the AI Senior Dev...", icon: <BrainCircuit className="w-5 h-5 text-textSecondary" /> },
    { text: "Generating your brutal review...", icon: <Flame className="w-5 h-5 text-primary" /> }
  ];

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background p-4">
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
        className="mb-8 p-6 rounded-full bg-surface border border-border shadow-lg"
      >
        <Flame className="w-20 h-20 text-primary" />
      </motion.div>

      {/* Progress Steps container */}
      <div className="w-full max-w-md bg-surface p-6 rounded-xl border border-border shadow-2xl mb-8">
        <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center justify-center gap-2">
          <span>Analyzing Codebase</span>
          <span className="flex space-x-1">
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
          </span>
        </h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 1.5, duration: 0.5 }}
              className="flex items-center gap-3 text-textSecondary"
            >
              {step.icon}
              <span className={index === steps.length - 1 ? "text-primary font-medium" : ""}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Roasting Quotes */}
      <motion.div 
        key={quoteIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-medium text-warning text-center max-w-md italic"
      >
        "{roastingQuotes[quoteIndex]}"
      </motion.div>
    </div>
  );
};
