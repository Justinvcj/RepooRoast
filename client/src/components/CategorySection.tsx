import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../types';
import { IssueCard } from './IssueCard';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { getScoreColor } from '../utils/scoreHelpers';
import { Card, TerminalTag } from './ui';

interface CategorySectionProps {
  category: Category;
}

const toTag = (name: string) => name.toUpperCase().replace(/\s+/g, '_');

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scoreColor = getScoreColor(category.score);

  return (
    <Card level={1} className="w-full overflow-hidden border-border-hairline shadow-md transition-all hover:border-border-focused">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-surface-elevated/40 transition-colors focus:outline-none cursor-pointer select-none text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <TerminalTag variant="default" className="text-xs">
            {toTag(category.name)}
          </TerminalTag>

          <div className="flex flex-col items-start">
            <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight font-sans">
              {category.name}
            </h3>
            <span
              className="font-mono text-xs font-semibold tabular-nums mt-0.5"
              style={{ color: scoreColor }}
            >
              {category.score} / 100
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-textMuted p-1"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border-hairline bg-background/50"
          >
            <div className="p-5 sm:p-6 space-y-6">
              <p className="text-sm sm:text-base text-textSecondary italic font-normal border-l-2 border-border-hairline pl-4 py-0.5">
                "{category.summary}"
              </p>

              {category.positives.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-data-success mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-data-success" />
                    Strengths & Clean Patterns
                  </h4>
                  <ul className="space-y-2.5">
                    {category.positives.map((positive, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-textSecondary leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-data-success shrink-0 mt-0.5" />
                        <span>{positive}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {category.issues.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-data-critical mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-data-critical" />
                    Areas to Improve ({category.issues.length})
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
    </Card>
  );
};
