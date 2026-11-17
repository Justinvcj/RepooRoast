import React from 'react';
import { LogoAnimation } from './LogoAnimation';

export interface LogoMarkProps {
  size?: number; // Target size in pixels (default: 32)
  monochrome?: boolean; // When true, uses currentColor for every part
  animated?: boolean;
  looping?: boolean;
  className?: string;
}

export const INK = '#EEF0F5';
export const EMBER = '#FF6B3D';

/**
 * The mark: a block of code with one line flagged.
 * Three lines of code, the short middle one hot, and the diff-gutter tick beside it.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 32,
  monochrome = false,
  animated = false,
  looping = false,
  className = '',
}) => {
  if (animated || looping) {
    return (
      <LogoAnimation
        size={size}
        monochrome={monochrome}
        looping={looping}
        showWordmark={false}
        className={className}
      />
    );
  }

  const line = monochrome ? 'currentColor' : INK;
  const flag = monochrome ? 'currentColor' : EMBER;

  // Integer-snapped 16px variant keeps edges crisp in browser tabs
  if (size <= 18) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-hidden="true"
      >
        <rect x="4" y="3" width="8" height="2" rx="1" fill={line} />
        <rect x="6" y="7" width="8" height="2" rx="1" fill={flag} />
        <rect x="4" y="11" width="5" height="2" rx="1" fill={line} />
        <rect x="1" y="6" width="2" height="4" rx="1" fill={flag} />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <rect x="8" y="6" width="16" height="4" rx="2" fill={line} />
      <rect x="13" y="14" width="14" height="4" rx="2" fill={flag} />
      <rect x="8" y="22" width="10" height="4" rx="2" fill={line} />
      <rect x="2" y="11" width="3" height="10" rx="1.5" fill={flag} />
    </svg>
  );
};
