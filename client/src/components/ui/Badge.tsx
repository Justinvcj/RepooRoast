import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'flawed' | 'critical' | 'accent';
  size?: 'sm' | 'md';
  bracketed?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  bracketed = false,
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'text-textSecondary border-border-hairline bg-surface-secondary/70',
    success: 'text-data-success border-data-success/30 bg-data-success/10',
    warning: 'text-data-warning border-data-warning/30 bg-data-warning/10',
    flawed: 'text-data-flawed border-data-flawed/30 bg-data-flawed/10',
    critical: 'text-data-critical border-data-critical/30 bg-data-critical/10',
    accent: 'text-primary border-primary/30 bg-primary/10',
  };

  const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5 tracking-normal',
  };

  const content =
    bracketed && typeof children === 'string'
      ? `[${children.replace(/^\[|\]$/g, '')}]`
      : children;

  return (
    <span
      className={cn(
        'inline-flex items-center font-sans font-semibold rounded-full border tabular-nums select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {content}
    </span>
  );
};
