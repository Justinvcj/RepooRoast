import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '../utils/scoreHelpers';

interface ScoreCardProps {
  score: number;
  verdict: string;
  quote: string;
  hiringVerdict: string;
}

/** The grade, circled the way a reviewer circles it: one loose, slightly open ellipse. */
const PenCircle: React.FC<{ color: string }> = ({ color }) => {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+1.5rem)] h-[calc(100%+1rem)] overflow-visible"
      fill="none"
    >
      <motion.path
        d="M 38 78 C 30 40, 90 14, 146 26 C 188 36, 196 90, 150 122 C 104 150, 36 136, 22 96 C 16 76, 34 52, 70 40"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict, quote, hiringVerdict }) => {
  const color = getScoreColor(score);
  const rounded = Math.round(score);

  return (
    <section
      aria-label="Overall verdict"
      className="w-full grid md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center bg-surface border border-border-hairline rounded-lg p-6 sm:p-10"
    >
      <div
        role="img"
        aria-label={`Score: ${rounded} out of 100, ${getScoreLabel(score)}`}
        className="relative mx-auto w-[200px] h-[150px] flex items-center justify-center select-none"
      >
        <PenCircle color={color} />
        <div className="relative text-center leading-none">
          <span
            className="font-display font-extrabold text-[4.5rem] tracking-[-0.05em] tabular-nums"
            style={{ color }}
          >
            {rounded}
          </span>
          <span className="block mt-1 text-sm text-textMuted font-medium">out of 100</span>
        </div>
      </div>

      <div className="min-w-0">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-[-0.03em] leading-[1.08] text-textPrimary max-w-[28ch]">
          {verdict}
        </h2>

        <blockquote className="mt-5 max-w-[60ch] text-lg text-textSecondary leading-relaxed border-l-2 border-primary pl-4">
          {quote}
        </blockquote>

        <p className="mt-6 text-sm text-textSecondary">
          Hiring verdict:{' '}
          <span className="font-semibold" style={{ color }}>
            {hiringVerdict}
          </span>
        </p>
      </div>
    </section>
  );
};
