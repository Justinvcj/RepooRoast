import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { getScoreColor } from '../../utils/scoreHelpers';

export interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | number;
  strokeWidth?: number;
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'md',
  strokeWidth,
  showLabel = true,
  animate = true,
  className,
}) => {
  const prefersReduced = useReducedMotion();
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const scoreColor = getScoreColor(clampedScore);

  const dimension =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 72
      : size === 'lg'
      ? 160
      : 112;

  const stroke = strokeWidth || (dimension > 120 ? 8 : dimension > 80 ? 6 : 4.5);
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const fontSize =
    dimension > 120
      ? 'text-4xl'
      : dimension > 80
      ? 'text-2xl'
      : 'text-base';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center select-none', className)}
      style={{ width: dimension, height: dimension }}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${clampedScore} out of 100`}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="rotate-[-90deg]"
      >
        {/* Track circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--border-hairline, #1E222D)"
          strokeWidth={stroke}
        />

        {/* Animated Progress circle */}
        {animate && !prefersReduced ? (
          <motion.circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ) : (
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={cn(
            'font-display font-semibold tabular-nums text-textPrimary tracking-tight',
            fontSize
          )}
        >
          {clampedScore}
        </span>
        {showLabel && dimension >= 90 && (
          <span className="text-[11px] text-textMuted mt-0.5">
            / 100
          </span>
        )}
      </div>
    </div>
  );
};
