import React from 'react';
import { LogoAnimation } from './LogoAnimation';

export interface LogoMarkProps {
  size?: number; // Target size in pixels (default: 32)
  monochrome?: boolean; // When true, uses single-color fill & stroke (currentColor)
  animated?: boolean; // When true, runs 1.4s assembly animation
  looping?: boolean; // When true, runs 2.4s calm thermal respiration
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 32,
  monochrome = false,
  animated = false,
  looping = false,
  className = '',
}) => {
  // Delegate to LogoAnimation when motion is requested
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

  const caliperStroke = monochrome ? 'currentColor' : '#F0F3F6';
  const emberFill = monochrome ? 'currentColor' : '#FF5426';

  // Crisp 16x16 integer-snapped vector path for sizes <= 18px (prevents subpixel antialiasing blur)
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
        <path
          d="M 5 2 L 2 5 L 2 11 L 5 14"
          stroke={caliperStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 11 2 L 14 5 L 14 11 L 11 14"
          stroke={caliperStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 8 2 L 10 6 L 10 9 L 8 13 L 6 9 L 6 6 Z M 8 5 L 7 7 L 8 10 L 9 7 Z"
          fill={emberFill}
          fillRule="evenodd"
        />
      </svg>
    );
  }

  // Master 32x32 Cartesian Grid Vector Mark
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
      {/* Left Diagnostic Caliper Bracket */}
      <path
        d="M 12 5 L 5 12 L 5 20 L 12 27"
        stroke={caliperStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Diagnostic Caliper Bracket */}
      <path
        d="M 20 5 L 27 12 L 27 20 L 20 27"
        stroke={caliperStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Faceted Thermal Ember Core */}
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
            fill="#FEF08A"
          />
        </>
      )}
    </svg>
  );
};
