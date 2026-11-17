import React from 'react';
import { motion } from 'framer-motion';
import type { ReviewResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { ScoreChart } from './ScoreChart';
import { CategorySection } from './CategorySection';
import { Target, ThumbsUp, Terminal } from 'lucide-react';
import { Card, CodeBlock } from './ui';

interface ReviewDashboardProps {
  review: ReviewResult;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ review }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10"
    >
      {/* 1. Overall Score & Verdict */}
      <motion.div variants={itemVariants}>
        <ScoreCard
          score={review.overallScore}
          verdict={review.overallVerdict}
          quote={review.seniorDevQuote}
          hiringVerdict={review.hiringVerdict}
        />
      </motion.div>

      {/* 2. Breakdown and Key Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <motion.div variants={itemVariants} className="flex flex-col h-full">
          <ScoreChart categories={review.categories} />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          {/* Top Priorities Card */}
          <Card level={1} className="p-6 sm:p-7 flex-1 border-border-hairline shadow-sm">
            <h3 className="text-base font-bold flex items-center gap-2.5 mb-5 text-textPrimary font-sans">
              <div className="p-1.5 rounded-md bg-data-critical/10 text-data-critical border border-data-critical/20">
                <Target className="w-4 h-4" />
              </div>
              <span>Top Priorities</span>
            </h3>
            <ul className="space-y-3.5">
              {review.topPriorities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-surface-elevated border border-border-hairline text-data-critical font-mono text-xs font-bold shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="text-textSecondary text-xs sm:text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* What You Did Well Card */}
          <Card level={1} className="p-6 sm:p-7 flex-1 border-border-hairline shadow-sm">
            <h3 className="text-base font-bold flex items-center gap-2.5 mb-5 text-textPrimary font-sans">
              <div className="p-1.5 rounded-md bg-data-success/10 text-data-success border border-data-success/20">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <span>What You Did Well</span>
            </h3>
            <ul className="space-y-3">
              {review.whatYouDidWell.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-textSecondary text-xs sm:text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-data-success shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* 3. Detailed Category Breakdown */}
      <motion.div variants={itemVariants} className="mt-4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-hairline">
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight font-sans">
            Detailed Breakdown
          </h2>
          <span className="text-xs font-mono text-textMuted select-none">
            {review.categories.length} Categories Inspected
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {review.categories.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </motion.div>

      {/* 4. Auto-Fix AI Prompt Block */}
      {review.fixPrompt && (
        <motion.div variants={itemVariants} className="mt-4 print:break-inside-avoid">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border-hairline">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-textPrimary font-sans">
              Auto-Fix AI Prompt
            </h2>
          </div>
          <CodeBlock
            code={review.fixPrompt}
            language="markdown"
            fileName="CLAUDE_OR_COPILOT_PROMPT.md"
            copyable={true}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
