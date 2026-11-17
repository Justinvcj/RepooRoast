import React from 'react';
import { LogoMark } from './LogoMark';
import { LogoWordmark } from './LogoWordmark';
import { LogoAnimation } from './LogoAnimation';

export interface LogoLockupProps {
  size?: number; // Base mark size in pixels (default: 32)
  monochrome?: boolean; // When true, renders in single-color mode
  animated?: boolean; // When true, runs 1.4s assembly animation
  looping?: boolean; // When true, runs 2.4s calm thermal respiration
  className?: string;
}

export const LogoLockup: React.FC<LogoLockupProps> = ({
  size = 32,
  monochrome = false,
  animated = false,
  looping = false,
  className = '',
}) => {
  // If animated or looping is requested, delegate to LogoAnimation with showWordmark
  if (animated || looping) {
    return (
      <LogoAnimation
        size={size}
        monochrome={monochrome}
        looping={looping}
        showWordmark={true}
        className={className}
      />
    );
  }

  // Optical clearance gap: 0.375x mark width
  const gap = Math.round(size * 0.375);

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: `${gap}px` }}
    >
      <LogoMark size={size} monochrome={monochrome} />
      <LogoWordmark size={size} monochrome={monochrome} />
    </div>
  );
};
