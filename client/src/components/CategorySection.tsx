import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../types';
import { IssueCard } from './IssueCard';
import { ChevronDown, Check } from 'lucide-react';
import { getScoreColor } from '../utils/scoreHelpers';

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scoreColor = getScoreColor(category.score);
  const issueCount = category.issues.length;

  return (
    <div className="w-full bg-surface border border-border-hairline rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-surface-elevated transition-colors duration-fast cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        aria-expanded={isExpanded}
      >
        <div className="flex items-baseline gap-4 min-w-0">
          <span
            className="font-display font-semibold text-2xl tabular-nums w-12 shrink-0"
            style={{ color: scoreColor }}
          >
            {category.score}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold tracking-tight text-textPrimary">
              {category.name}
            </h3>
            <span className="text-sm text-textMuted">
              {issueCount === 0 ? 'No issues found' : `${issueCount} ${issueCount === 1 ? 'issue' : 'issues'}`}
            </span>
          </div>
        </div>

        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-textMuted shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border-hairline"
          >
            <div className="px-5 py-6 sm:px-6 space-y-7">
              <p className="text-base text-textSecondary leading-relaxed max-w-[65ch]">{category.summary}</p>

              {category.positives.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-data-success mb-2.5">Working well</h4>
                  <ul className="space-y-2">
                    {category.positives.map((positive, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-textSecondary leading-relaxed">
                        <Check className="w-4 h-4 text-data-success shrink-0 mt-1" />
                        <span>{positive}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {issueCount > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-3">
                    To fix ({issueCount})
                  </h4>
                  <div className="flex flex-col gap-4">
                    {category.issues.map((issue, i) => (
                      <IssueCard key={i} issue={issue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
