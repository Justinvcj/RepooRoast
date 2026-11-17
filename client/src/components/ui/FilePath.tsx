import React from 'react';
import { FileCode } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilePathProps extends React.HTMLAttributes<HTMLSpanElement> {
  path: string;
  lineNumber?: number;
  maxWidth?: string;
}

export const FilePath: React.FC<FilePathProps> = ({
  path,
  lineNumber,
  maxWidth = 'max-w-full',
  className,
  ...props
}) => {
  const display = lineNumber !== undefined ? `${path}:${lineNumber}` : path;

  return (
    <span
      title={display}
      className={cn(
        'inline-flex max-w-full min-w-0 items-start gap-1.5 px-2.5 py-1 rounded bg-surface-elevated border border-border-hairline font-mono text-xs text-textSecondary hover:text-textPrimary transition-colors select-all',
        className
      )}
      {...props}
    >
      <FileCode className="w-3.5 h-3.5 text-textMuted shrink-0 mt-0.5" />
      <span className={cn('min-w-0 break-all text-left', maxWidth)}>{display}</span>
    </span>
  );
};
