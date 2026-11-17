import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../types';
import { Card, ScoreBar } from './ui';

interface ScoreChartProps {
  categories: Category[];
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ categories }) => {
  const sorted = [...categories].sort((a, b) => b.score - a.score);

  return (
    <Card level={1} className="w-full p-6 sm:p-8 flex flex-col justify-between h-full">
      <div className="mb-6 pb-3 border-b border-border-hairline flex items-center justify-between">
        <h3 className="text-base font-bold text-textPrimary tracking-tight font-sans">
          Category Performance Breakdown
        </h3>
        <span className="text-xs font-mono text-textMuted select-none">
          Ranked Highest to Lowest
        </span>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-around">
        {sorted.map((category, i) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <ScoreBar
              score={category.score}
              label={category.name}
              delay={i * 0.04}
            />
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
