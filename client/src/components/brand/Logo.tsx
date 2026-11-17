import React from 'react';
import { LogoMark } from './LogoMark';
import { LogoWordmark } from './LogoWordmark';
import { LogoLockup } from './LogoLockup';

export interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'lockup';
  size?: number; // Base mark size (default: 32)
  monochrome?: boolean; // When true, single-color rendering
  animated?: boolean; // When true, triggers 1.4s entry assembly
  looping?: boolean; // When true, triggers 2.4s calm thermal respiration
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'lockup',
  size = 32,
  monochrome = false,
  animated = false,
  looping = false,
  className = '',
}) => {
  switch (variant) {
    case 'mark':
      return (
        <LogoMark
          size={size}
          monochrome={monochrome}
          animated={animated}
          looping={looping}
          className={className}
        />
      );
    case 'wordmark':
      return (
        <LogoWordmark
          size={size}
          monochrome={monochrome}
          className={className}
        />
      );
    case 'lockup':
    default:
      return (
        <LogoLockup
          size={size}
          monochrome={monochrome}
          animated={animated}
          looping={looping}
          className={className}
        />
      );
  }
};
