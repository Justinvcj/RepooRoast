import React from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '../utils/scoreHelpers';
import { Card, ScoreRing } from './ui';

interface ScoreCardProps {
  score: number;
  verdict: string;
  quote: string;
  hiringVerdict: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict, quote, hiringVerdict }) => {
  const ringColor = getScoreColor(score);

  return (
    <Card level={2} className="w-full relative overflow-hidden p-6 sm:p-8 md:p-10 border-border-hairline shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Score Ring Hero */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <ScoreRing score={score} size="lg" animate={true} />
        </div>

        {/* Verdict & Senior Dev Commentary */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left z-10 space-y-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-textMuted mb-1 select-none">
              Overall Roast Verdict
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight font-sans leading-tight"
            >
              {verdict}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-base sm:text-lg text-textSecondary italic font-normal leading-relaxed border-l-0 md:border-l-2 md:border-border-hairline md:pl-4 py-1"
          >
            "{quote}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-mono"
          >
            <span className="text-textMuted">Hiring verdict:</span>
            <span
              className="px-2.5 py-1 rounded border font-semibold uppercase tracking-wide"
              style={{
                color: ringColor,
                borderColor: `${ringColor}40`,
                backgroundColor: `${ringColor}15`,
              }}
            >
              {hiringVerdict}
            </span>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};
