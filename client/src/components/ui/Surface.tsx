import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2;
  border?: boolean;
  hoverable?: boolean;
  interactive?: boolean;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      level = 1,
      border = true,
      hoverable = false,
      interactive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const levelStyles: Record<0 | 1 | 2, string> = {
      0: 'bg-dominant text-textPrimary',
      1: 'bg-surface-secondary text-textPrimary',
      2: 'bg-surface-secondary text-textPrimary',
    };

    const borderStyles = border
      ? level === 2
        ? 'border border-border-focused'
        : 'border border-border-hairline'
      : '';

    const hoverStyles =
      hoverable || interactive
        ? 'transition-colors duration-fast ease-spring hover:border-border-focused'
        : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          levelStyles[level],
          borderStyles,
          hoverStyles,
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = 'Surface';
