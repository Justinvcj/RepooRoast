import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { getScoreColor } from '../../utils/scoreHelpers';

export interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  delay?: number;
  showValue?: boolean;
  className?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  maxScore = 100,
  delay = 0,
  showValue = true,
  className,
}) => {
  const prefersReduced = useReducedMotion();
  const clampedScore = Math.max(0, Math.min(maxScore, Math.round(score)));
  const percentage = Math.round((clampedScore / maxScore) * 100);
  const scoreColor = getScoreColor(clampedScore);

  return (
    <div
      className={cn('flex items-center gap-3 w-full select-none', className)}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={maxScore}
      aria-label={`${label}: ${clampedScore} out of ${maxScore}`}
    >
      {/* Category / Metric Label */}
      <span className="text-xs sm:text-sm font-medium text-textPrimary w-28 sm:w-36 shrink-0 truncate text-left">
        {label}
      </span>

      {/* Progress Track */}
      <div className="flex-1 h-2 sm:h-2.5 bg-surface-secondary border border-border-hairline rounded-full overflow-hidden relative">
        {prefersReduced ? (
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${percentage}%`,
              backgroundColor: scoreColor,
            }}
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.8,
              delay: delay * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor }}
          />
        )}
      </div>

      {/* Tabular Score */}
      {showValue && (
        <span
          className="font-mono tabular-nums text-xs sm:text-sm font-semibold w-10 sm:w-12 text-right shrink-0"
          style={{ color: scoreColor }}
        >
          {clampedScore}
        </span>
      )}
    </div>
  );
};
