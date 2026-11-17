import React from 'react';
import { motion } from 'framer-motion';
import type { Issue } from '../types';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Card, Badge, FilePath, CodeBlock } from './ui';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const getBadgeVariant = (severity: string): 'critical' | 'warning' | 'flawed' | 'default' => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'warning';
      case 'medium':
        return 'flawed';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card level={1} className="overflow-hidden border-border-hairline shadow-sm hover:border-border-focused transition-all">
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border-hairline">
            <Badge variant={getBadgeVariant(issue.severity)}>
              {issue.severity.toUpperCase()}
            </Badge>

            {issue.file && (
              <FilePath path={issue.file} />
            )}
          </div>

          <h4 className="text-base font-bold text-textPrimary flex items-start gap-2.5 mt-1 font-sans">
            <AlertCircle className="w-5 h-5 text-textMuted shrink-0 mt-0.5" />
            <span>{issue.title}</span>
          </h4>

          <p className="text-xs sm:text-sm text-textSecondary leading-relaxed pl-7.5">
            {issue.description}
          </p>
        </div>

        {issue.suggestion && (
          <div className="bg-surface-secondary/70 border-t border-border-hairline p-5">
            <div className="text-xs font-mono font-medium text-textMuted flex items-center gap-2 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span>Suggested Remediation:</span>
            </div>
            <CodeBlock
              code={issue.suggestion}
              className="mt-1"
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};
