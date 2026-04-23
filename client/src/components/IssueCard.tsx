import React from 'react';
import { motion } from 'framer-motion';
import type { Issue } from '../types';
import { AlertCircle, FileCode, Lightbulb } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const severityColors = {
    critical: 'bg-danger text-white border-danger',
    high: 'bg-warning text-white border-warning',
    medium: 'bg-primary text-white border-primary',
    low: 'bg-[#30363d] text-textPrimary border-border'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#0d1117]/50 rounded-3xl border border-border/70 overflow-hidden group hover:border-primary/30 transition-colors shadow-sm"
    >
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${severityColors[issue.severity]}`}>
            {issue.severity}
          </span>
          {issue.file && (
            <div className="flex items-center gap-1.5 text-xs text-textSecondary font-mono bg-surface px-3 py-1.5 rounded-md border border-border">
              <FileCode className="w-4 h-4" />
              <span className="truncate max-w-[200px]" title={issue.file}>{issue.file}</span>
            </div>
          )}
        </div>
        
        <h4 className="text-lg font-serif font-bold text-textPrimary flex items-start gap-3 mt-2">
          <AlertCircle className="w-6 h-6 text-textSecondary shrink-0 mt-0.5" />
          {issue.title}
        </h4>
        
        <p className="text-textSecondary text-sm leading-relaxed pl-9">
          {issue.description}
        </p>
      </div>
      
      <div className="bg-surface border-t border-border p-5">
        <h5 className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          AI Suggestion
        </h5>
        <div className="font-mono text-sm text-textPrimary bg-[#0d1117] p-4 rounded-lg border border-border/50 overflow-x-auto">
          {issue.suggestion}
        </div>
      </div>
    </motion.div>
  );
};
