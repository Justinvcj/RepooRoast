import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReviewResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { ScoreChart } from './ScoreChart';
import { CategorySection } from './CategorySection';
import { CodeBlock } from './ui';

interface ReviewDashboardProps {
  review: ReviewResult;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ review }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14"
    >
      {/* Verdict leads: the reader came for this. */}
      <ScoreCard
        score={review.overallScore}
        verdict={review.overallVerdict}
        quote={review.seniorDevQuote}
        hiringVerdict={review.hiringVerdict}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
        <ScoreChart categories={review.categories} />

        <div className="flex flex-col gap-10">
          <section aria-labelledby="priorities-title">
            <h3 id="priorities-title" className="font-display text-xl font-bold tracking-tight text-textPrimary mb-4">
              Fix these first
            </h3>
            <ol className="space-y-3">
              {review.topPriorities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-[15px] text-textPrimary leading-relaxed">
                  <span className="shrink-0 mt-[3px] inline-flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] border-primary text-primary text-[11px] font-semibold tabular-nums">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="well-title" className="pt-8 border-t border-border-hairline">
            <h3 id="well-title" className="font-display text-xl font-bold tracking-tight text-textPrimary mb-4">
              What you did well
            </h3>
            <ul className="space-y-2.5">
              {review.whatYouDidWell.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[15px] text-textSecondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-data-success shrink-0 mt-[9px]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="breakdown-title">
        <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-ink">
          <h2 id="breakdown-title" className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-textPrimary">
            Detailed breakdown
          </h2>
          <span className="text-sm text-textMuted tabular-nums">{review.categories.length} categories</span>
        </div>

        <div className="flex flex-col gap-3">
          {review.categories.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </section>

      {review.fixPrompt && (
        <section aria-labelledby="fix-title" className="print:break-inside-avoid">
          <h2 id="fix-title" className="font-display text-2xl font-bold tracking-tight text-textPrimary">
            Auto-fix AI prompt
          </h2>
          <p className="text-sm text-textSecondary mt-1 mb-4 max-w-[60ch]">
            Paste this into Claude or Copilot to work through the fixes above.
          </p>
          <CodeBlock
            code={review.fixPrompt}
            language="markdown"
            fileName="CLAUDE_OR_COPILOT_PROMPT.md"
            copyable={true}
          />
        </section>
      )}
    </motion.div>
  );
};
