import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { Category } from '../types';

interface ScoreChartProps {
  categories: Category[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string }; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl">
        <p className="text-textPrimary font-semibold mb-1">{payload[0].payload.name}</p>
        <p className="text-primary font-bold text-xl">{payload[0].value} / 100</p>
      </div>
    );
  }
  return null;
};

export const ScoreChart: React.FC<ScoreChartProps> = ({ categories }) => {
  const data = categories.map(c => ({
    name: c.name,
    score: c.score,
    fullMark: 100,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-[400px] bg-surface/50 backdrop-blur-sm border border-border rounded-3xl p-6 flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-textSecondary mb-2 self-start">Performance Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#30363d" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: '#8b949e', fontSize: 12, fontWeight: 500 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#f97316"
            strokeWidth={2}
            fill="#f97316"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
