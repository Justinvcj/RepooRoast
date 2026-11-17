import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  mono?: boolean;
  tabular?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      mono = false,
      tabular = false,
      inputSize = 'md',
      leftIcon,
      rightIcon,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md h-8',
      md: 'text-sm px-3.5 py-2 rounded-lg h-10',
      lg: 'text-base px-4 py-2.5 rounded-xl h-12',
    };

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-textSecondary select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-textMuted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            className={cn(
              'w-full bg-surface-secondary text-textPrimary placeholder:text-textMuted border border-border-hairline transition-colors duration-fast ease-spring',
              'focus:outline-none focus:border-border-focused focus:ring-2 focus:ring-primary/25',
              sizeStyles[inputSize],
              mono && 'font-mono text-xs sm:text-sm',
              tabular && 'tabular-nums',
              leftIcon && 'pl-9 sm:pl-10',
              rightIcon && 'pr-9 sm:pr-10',
              error && 'border-data-critical focus:border-data-critical focus:ring-data-critical/25 text-data-critical',
              disabled && 'opacity-40 cursor-not-allowed bg-dominant/50',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-textMuted">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} role="alert" className="text-xs text-data-critical font-medium mt-0.5">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-textMuted mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
