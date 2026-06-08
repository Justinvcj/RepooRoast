import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ReviewResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { ScoreChart } from './ScoreChart';
import { CategorySection } from './CategorySection';
import { Target, ThumbsUp, Terminal, Copy, Check } from 'lucide-react';

interface ReviewDashboardProps {
  review: ReviewResult;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ review }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (review.fixPrompt) {
      navigator.clipboard.writeText(review.fixPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  // Staggered container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10"
    >
      <motion.div variants={itemVariants}>
        <ScoreCard 
          score={review.overallScore} 
          verdict={review.overallVerdict} 
          quote={review.seniorDevQuote} 
          hiringVerdict={review.hiringVerdict} 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="flex flex-col h-full">
          <ScoreChart categories={review.categories} />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          <div className="bg-surface/90 rounded-3xl border border-[#f85149]/30 p-5 md:p-6 flex-1 border-t-4 shadow-2xl shadow-[#f85149]/5 hover:border-[#f85149]/50 transition-colors">
            <h3 className="text-xl font-serif font-extrabold flex items-center gap-3 mb-6 text-textPrimary">
              <Target className="w-6 h-6 text-[#f85149]" />
              Top Priorities
            </h3>
            <ul className="space-y-4">
              {review.topPriorities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f85149]/20 text-[#f85149] font-bold text-sm shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-textSecondary text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface/90 rounded-3xl border border-[#3fb950]/30 p-5 md:p-6 flex-1 border-t-4 shadow-2xl shadow-[#3fb950]/5 hover:border-[#3fb950]/50 transition-colors">
            <h3 className="text-xl font-serif font-extrabold flex items-center gap-3 mb-6 text-textPrimary">
              <ThumbsUp className="w-6 h-6 text-[#3fb950]" />
              What You Did Well
            </h3>
            <ul className="space-y-4">
              {review.whatYouDidWell.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-textSecondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-2xl font-extrabold text-textPrimary mb-6 pb-4 border-b border-border/50">Detailed Breakdown</h2>
        <div className="flex flex-col gap-6">
          {review.categories.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </motion.div>

      {review.fixPrompt && (
        <motion.div variants={itemVariants} className="mt-8 print:break-inside-avoid">
          <h2 className="text-2xl font-extrabold text-textPrimary mb-6 pb-4 border-b border-border/50 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" />
            Auto-Fix AI Prompt
          </h2>
          <div className="bg-[#0d1117] rounded-2xl border border-border/50 p-5 md:p-6 relative group shadow-lg">
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2.5 bg-surface border border-border rounded-xl text-textSecondary hover:text-textPrimary hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 print:hidden shadow-sm cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-[#3fb950]" /> : <Copy className="w-5 h-5" />}
            </button>
            <pre className="text-sm md:text-base text-textSecondary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-primary/30">
              {review.fixPrompt}
            </pre>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};
