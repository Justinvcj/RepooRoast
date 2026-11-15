import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../types';
import { getScoreColor } from '../utils/scoreHelpers';

interface ScoreChartProps {
  categories: Category[];
}

// A sorted, horizontal bar breakdown. For 7 discrete categories this reads
// faster and more honestly than a radar chart - a radar's axis-position
// distortion makes categories look stronger or weaker purely based on where
// they land around the circle, not their actual score.
export const ScoreChart: React.FC<ScoreChartProps> = ({ categories }) => {
  const sorted = [...categories].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-surface/80 border border-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-textSecondary mb-6">Performance Breakdown</h3>
      <div className="flex flex-col gap-4">
        {sorted.map((category, i) => {
          const color = getScoreColor(category.score);
          return (
            <div key={category.name} className="flex items-center gap-4">
              <span className="w-36 shrink-0 text-sm font-medium text-textPrimary truncate" title={category.name}>
                {category.name}
              </span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-sm font-semibold" style={{ color }}>
                {category.score}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
