import React from 'react';
import type { Issue } from '../types';
import { Badge, FilePath, CodeBlock } from './ui';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const getBadgeVariant = (severity: string): 'critical' | 'warning' | 'flawed' | 'default' => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'flawed';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  const severity = issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1).toLowerCase();

  return (
    <article className="w-full rounded-lg border border-border-hairline bg-background/60">
      <div className="p-5 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge variant={getBadgeVariant(issue.severity)}>{severity}</Badge>
          {issue.file && <FilePath path={issue.file} />}
        </div>

        <h4 className="font-display text-lg font-bold tracking-tight text-textPrimary mt-1">
          {issue.title}
        </h4>

        <p className="text-[15px] text-textSecondary leading-relaxed max-w-[65ch]">{issue.description}</p>
      </div>

      {issue.suggestion && (
        <div className="px-5 pb-5">
          <p className="text-sm font-semibold text-textPrimary mb-2">Suggested fix</p>
          <CodeBlock code={issue.suggestion} />
        </div>
      )}
    </article>
  );
};
