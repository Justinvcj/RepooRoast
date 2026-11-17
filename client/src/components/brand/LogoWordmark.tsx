import React from 'react';

export interface LogoWordmarkProps {
  size?: number; // Base mark size used for optical scaling (default: 32)
  monochrome?: boolean; // When true, uses currentColor throughout
  className?: string;
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  size = 32,
  monochrome = false,
  className = '',
}) => {
  // Optical typography scaling: font-size is 0.625x mark size (20px at size=32)
  const fontSize = Math.max(12, Math.round(size * 0.625));
  const lineHeight = Math.round(fontSize * 1.2);

  const repoColor = monochrome ? 'currentColor' : '#F0F3F6';
  const roastColor = monochrome ? 'currentColor' : '#F97316';

  return (
    <span
      className={`inline-flex items-baseline font-sans font-semibold select-none ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        letterSpacing: '-0.03em',
      }}
      aria-label="RepoRoast"
    >
      <span
        style={{ color: repoColor }}
        className="font-medium tracking-tight"
      >
        Repo
      </span>
      <span
        style={{ color: roastColor }}
        className="font-bold tracking-tight"
      >
        Roast
      </span>
    </span>
  );
};
