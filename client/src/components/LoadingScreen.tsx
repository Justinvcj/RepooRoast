import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Database, FileCode, BrainCircuit, Terminal } from 'lucide-react';
import Lightfall from './Lightfall';

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
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4">
      {/* Background stays completely fixed */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
         <Lightfall 
            colors={['#f97316', '#f85149', '#d29922']}
            backgroundColor="#0d1117"
            speed={0.15}
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
        className="relative z-10 mb-16 p-6 rounded-full bg-[#0d1117]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        <Flame className="w-14 h-14 text-primary" />
      </motion.div>

      {/* Progress Steps container */}
      <div className="relative z-10 w-full max-w-md bg-[#0d1117]/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-8">
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
        className="relative z-10 text-lg font-medium text-warning text-center max-w-md italic"
      >
        "{roastingQuotes[quoteIndex]}"
      </motion.div>
    </div>
  );
};
