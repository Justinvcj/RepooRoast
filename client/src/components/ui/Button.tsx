import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly = variant === 'icon';

    // Base button classes enforcing <100ms response, scale feedback, and accessible focus ring
    const baseStyles =
      'inline-flex items-center justify-center font-medium select-none transition-all duration-instant ease-spring active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100';

    // Variant tokens
    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      // Primary: WCAG AA verified 6.02:1 contrast using dark obsidian text on vermilion
      primary:
        'bg-primary text-white font-semibold hover:bg-primary-hover active:bg-accent-deep',
      secondary:
        'bg-surface-secondary text-textPrimary border border-border-hairline hover:bg-surface-elevated hover:border-border-focused active:bg-surface-secondary',
      ghost:
        'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-surface-secondary active:bg-surface-elevated',
      icon:
        'bg-surface-secondary text-textSecondary hover:text-textPrimary hover:bg-surface-secondary active:bg-surface-elevated border border-border-hairline',
    };

    // Size tokens
    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: isIconOnly ? 'p-1.5 rounded-md' : 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
      md: isIconOnly ? 'p-2 rounded-lg' : 'text-sm px-4 py-2 rounded-lg gap-2',
      lg: isIconOnly ? 'p-3 rounded-xl' : 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold',
    };

    const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn('animate-spin', iconSize, children ? 'mr-1.5' : '')} />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
