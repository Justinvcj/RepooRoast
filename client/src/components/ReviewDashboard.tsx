import React from 'react';
import { motion } from 'framer-motion';
import type { ReviewResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { ScoreChart } from './ScoreChart';
import { CategorySection } from './CategorySection';
import { Target, ThumbsUp } from 'lucide-react';

interface ReviewDashboardProps {
  review: ReviewResult;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ review }) => {
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
          <div className="bg-surface/60 backdrop-blur-xl rounded-5xl border border-[#f85149]/30 p-10 flex-1 border-t-4 shadow-2xl shadow-[#f85149]/5 hover:border-[#f85149]/50 transition-colors">
            <h3 className="text-2xl font-serif font-extrabold flex items-center gap-3 mb-8 text-textPrimary">
              <Target className="w-8 h-8 text-[#f85149]" />
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

          <div className="bg-surface/60 backdrop-blur-xl rounded-5xl border border-[#3fb950]/30 p-10 flex-1 border-t-4 shadow-2xl shadow-[#3fb950]/5 hover:border-[#3fb950]/50 transition-colors">
            <h3 className="text-2xl font-serif font-extrabold flex items-center gap-3 mb-8 text-textPrimary">
              <ThumbsUp className="w-8 h-8 text-[#3fb950]" />
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
        <h2 className="text-3xl font-extrabold text-textPrimary mb-8 pb-4 border-b border-border/50">Detailed Breakdown</h2>
        <div className="flex flex-col gap-6">
          {review.categories.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};
