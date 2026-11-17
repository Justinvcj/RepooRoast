import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
  id,
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId();
  const switchId = id || generatedId;
  const descriptionId = `${switchId}-desc`;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      {(label || description) && (
        <div className="flex flex-col select-none text-left cursor-pointer" onClick={handleToggle}>
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium text-textPrimary cursor-pointer',
                disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className={cn(
                'text-xs text-textSecondary mt-0.5',
                disabled && 'opacity-40'
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-label={ariaLabel || label}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-fast ease-spring',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          checked ? 'bg-primary' : 'bg-border-focused border-border-focused',
          disabled && 'opacity-40 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-fast ease-spring',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
};
