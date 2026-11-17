import React from 'react';

export interface LogoWordmarkProps {
  size?: number; // Base mark size used for optical scaling (default: 32)
  monochrome?: boolean;
  className?: string;
}

/** The name, set in the interface family. No colour split, no effects. */
export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  size = 32,
  monochrome = false,
  className = '',
}) => {
  const fontSize = Math.max(14, Math.round(size * 0.625));

  return (
    <span
      className={`inline-flex items-baseline font-sans select-none ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color: monochrome ? 'currentColor' : '#EEF0F5',
      }}
      aria-label="RepoRoast"
    >
      <span className="font-normal">Repo</span>
      <span className="font-semibold">Roast</span>
    </span>
  );
};
