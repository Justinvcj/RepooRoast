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
  maxWidth = 'max-w-[280px] sm:max-w-[420px]',
  className,
  ...props
}) => {
  const display = lineNumber !== undefined ? `${path}:${lineNumber}` : path;

  return (
    <span
      title={display}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-secondary/80 border border-border-hairline font-mono text-xs text-textSecondary hover:text-textPrimary transition-colors select-all',
        className
      )}
      {...props}
    >
      <FileCode className="w-3.5 h-3.5 text-textMuted shrink-0" />
      <span className={cn('truncate', maxWidth)}>{display}</span>
    </span>
  );
};
