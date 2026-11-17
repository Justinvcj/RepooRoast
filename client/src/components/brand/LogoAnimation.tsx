import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LogoWordmark } from './LogoWordmark';

export interface LogoAnimationProps {
  size?: number;
  monochrome?: boolean;
  looping?: boolean;
  showWordmark?: boolean;
  reducedMotion?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 32,
  monochrome = false,
  looping = false,
  showWordmark = false,
  reducedMotion: manualReducedMotion = false,
  className = '',
  onComplete,
}) => {
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = manualReducedMotion || !!systemReducedMotion;

  // Colors
  const caliperStroke = monochrome ? 'currentColor' : '#F0F3F6';
  const emberFill = monochrome ? 'currentColor' : '#FF5426';
  const kernelFill = monochrome ? '#0C0E12' : '#FEF08A';

  // Spacing calculation matching 0.375x mark size gap
  const gap = Math.round(size * 0.375);

  // If reduced motion is requested, render instant settled static state with quick 150ms fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        className={`inline-flex items-center ${className}`}
        style={{ gap: `${gap}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 select-none"
          aria-hidden="true"
        >
          {/* Calipers */}
          <path
            d="M 12 5 L 5 12 L 5 20 L 12 27"
            stroke={caliperStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 20 5 L 27 12 L 27 20 L 20 27"
            stroke={caliperStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ember */}
          {monochrome ? (
            <path
              d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z M 16 10 L 14 14 L 16 18 L 18 14 Z"
              fill={emberFill}
              fillRule="evenodd"
            />
          ) : (
            <>
              <path
                d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z"
                fill={emberFill}
              />
              <path
                d="M 16 10 L 18 14 L 16 18 L 14 14 Z"
                fill={kernelFill}
              />
            </>
          )}
        </svg>

        {showWordmark && (
          <LogoWordmark size={size} monochrome={monochrome} />
        )}
      </motion.div>
    );
  }

  // Calm Looping Variant (2.4s thermal respiration for loading screens)
  if (looping) {
    return (
      <div
        className={`inline-flex items-center ${className}`}
        style={{ gap: `${gap}px` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 select-none"
          aria-hidden="true"
        >
          {/* Left Caliper with subtle optical scan */}
          <motion.path
            d="M 12 5 L 5 12 L 5 20 L 12 27"
            stroke={caliperStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, -1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Right Caliper with subtle optical scan */}
          <motion.path
            d="M 20 5 L 27 12 L 27 20 L 20 27"
            stroke={caliperStroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Ember Core with thermal respiration */}
          {monochrome ? (
            <motion.path
              d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z M 16 10 L 14 14 L 16 18 L 18 14 Z"
              fill={emberFill}
              fillRule="evenodd"
              style={{ transformOrigin: '16px 15px' }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <motion.g
              style={{ transformOrigin: '16px 15px' }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path
                d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z"
                fill={emberFill}
              />
              <motion.path
                d="M 16 10 L 18 14 L 16 18 L 14 14 Z"
                fill={kernelFill}
                style={{ transformOrigin: '16px 14px' }}
                animate={{
                  opacity: [0.75, 1, 0.75],
                  scale: [0.95, 1.08, 0.95],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.g>
          )}
        </svg>

        {showWordmark && (
          <LogoWordmark size={size} monochrome={monochrome} />
        )}
      </div>
    );
  }

  // 1.4s Assembly Animation
  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none"
        aria-hidden="true"
      >
        {/* Left Caliper Draw-In (0–600ms) */}
        <motion.path
          d="M 12 5 L 5 12 L 5 20 L 12 27"
          stroke={caliperStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Right Caliper Draw-In (0–600ms) */}
        <motion.path
          d="M 20 5 L 27 12 L 27 20 L 20 27"
          stroke={caliperStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Outer Ember Ascent (400–900ms) */}
        {monochrome ? (
          <motion.path
            d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z M 16 10 L 14 14 L 16 18 L 18 14 Z"
            fill={emberFill}
            fillRule="evenodd"
            style={{ transformOrigin: '16px 15px' }}
            initial={{ scale: 0.2, y: 4, opacity: 0 }}
            animate={{
              scale: [0.2, 1.05, 1.0],
              y: [4, -1, 0],
              opacity: 1,
            }}
            transition={{
              delay: 0.4,
              duration: 0.5,
              ease: [0.34, 1.3, 0.64, 1],
            }}
          />
        ) : (
          <>
            <motion.path
              d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z"
              fill={emberFill}
              style={{ transformOrigin: '16px 15px' }}
              initial={{ scale: 0.2, y: 4, opacity: 0 }}
              animate={{
                scale: [0.2, 1.05, 1.0],
                y: [4, -1, 0],
                opacity: 1,
              }}
              transition={{
                delay: 0.4,
                duration: 0.5,
                ease: [0.34, 1.3, 0.64, 1],
              }}
            />

            {/* Inner Kernel Ignition (700–1200ms) */}
            <motion.path
              d="M 16 10 L 18 14 L 16 18 L 14 14 Z"
              fill={kernelFill}
              style={{ transformOrigin: '16px 14px' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.25, 1.0],
                opacity: [0, 1, 0.9],
              }}
              transition={{
                delay: 0.7,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </>
        )}
      </svg>

      {/* Wordmark Settle (1000–1400ms) */}
      {showWordmark && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1.0,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={onComplete}
        >
          <LogoWordmark size={size} monochrome={monochrome} />
        </motion.div>
      )}
    </div>
  );
};
