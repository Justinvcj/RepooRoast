import React from 'react';
import type { Category } from '../types';
import { ScoreBar } from './ui';

interface ScoreChartProps {
  categories: Category[];
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ categories }) => {
  const sorted = [...categories].sort((a, b) => b.score - a.score);

  return (
    <section aria-labelledby="scores-title" className="w-full">
      <h3 id="scores-title" className="font-display text-xl font-semibold tracking-tight text-textPrimary mb-1">
        Scores by category
      </h3>
      <p className="text-sm text-textMuted mb-6">Highest first.</p>

      <div className="flex flex-col gap-5">
        {sorted.map((category, i) => (
          <ScoreBar key={category.name} score={category.score} label={category.name} delay={i * 0.4} />
        ))}
      </div>
    </section>
  );
};
