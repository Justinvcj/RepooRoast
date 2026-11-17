import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LogoWordmark } from './LogoWordmark';
import { INK, EMBER } from './LogoMark';

export interface LogoAnimationProps {
  size?: number;
  monochrome?: boolean;
  looping?: boolean;
  showWordmark?: boolean;
  reducedMotion?: boolean;
  className?: string;
  onComplete?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Assembly (about 1s): the code lines write in top to bottom, then the gutter
 * tick and the flagged line light up.
 * Loop: the flagged line slowly re-scans, like a cursor on a line under review.
 */
export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 32,
  monochrome = false,
  looping = false,
  showWordmark = false,
  reducedMotion: manualReducedMotion = false,
  className = '',
  onComplete,
}) => {
  const systemReduced = useReducedMotion();
  const reduce = manualReducedMotion || !!systemReduced;

  const line = monochrome ? 'currentColor' : INK;
  const flag = monochrome ? 'currentColor' : EMBER;
  const gap = Math.round(size * 0.375);

  const grow = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { scaleX: 0, opacity: 0 },
          animate: { scaleX: 1, opacity: 1 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: `${gap}px` }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none"
        aria-hidden="true"
      >
        <motion.rect x="8" y="6" width="16" height="4" rx="2" fill={line} style={{ transformOrigin: '8px 8px' }} {...grow(0)} />
        <motion.rect x="8" y="22" width="10" height="4" rx="2" fill={line} style={{ transformOrigin: '8px 24px' }} {...grow(0.15)} />
        <motion.rect
          x="13"
          y="14"
          width="14"
          height="4"
          rx="2"
          fill={flag}
          style={{ transformOrigin: '13px 16px' }}
          {...(looping && !reduce
            ? { animate: { scaleX: [1, 0.7, 1] }, transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const } }
            : grow(0.35))}
        />
        <motion.rect
          x="2"
          y="11"
          width="3"
          height="10"
          rx="1.5"
          fill={flag}
          {...(reduce
            ? {}
            : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0.55, ease: EASE } })}
        />
      </svg>

      {showWordmark && (
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduce ? 0 : 0.6, duration: 0.4, ease: EASE }}
          onAnimationComplete={onComplete}
        >
          <LogoWordmark size={size} monochrome={monochrome} />
        </motion.div>
      )}
    </div>
  );
};
