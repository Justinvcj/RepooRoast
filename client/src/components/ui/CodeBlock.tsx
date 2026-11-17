import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  fileName?: string;
  copyable?: boolean;
  maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  fileName,
  copyable = true,
  maxHeight = 'max-h-96',
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is denied
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-md border border-border-hairline bg-surface overflow-hidden text-left flex flex-col',
        className
      )}
      {...props}
    >
      {(fileName || language || copyable) && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-surface-elevated border-b border-border-hairline text-xs font-mono">
          <div className="flex items-center gap-2 truncate text-textSecondary">
            {fileName && <span className="font-semibold text-textPrimary truncate">{fileName}</span>}
            {language && <span className="text-textMuted">{language}</span>}
          </div>

          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied code to clipboard' : 'Copy code to clipboard'}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-sans font-medium text-textSecondary hover:text-textPrimary hover:bg-surface-elevated transition-colors duration-instant ease-spring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-data-success" />
                  <span className="text-data-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      <pre
        className={cn(
          'p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-textPrimary selection:bg-primary/25',
          maxHeight
        )}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};
