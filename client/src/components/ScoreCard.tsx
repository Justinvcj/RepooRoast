import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  score: number;
  verdict: string;
  quote: string;
  hiringVerdict: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict, quote, hiringVerdict }) => {
  // Determine color based on score
  let ringColor = '#f85149'; // danger
  if (score >= 80) ringColor = '#3fb950'; // success
  else if (score >= 60) ringColor = '#d29922'; // warning
  else if (score >= 40) ringColor = '#f97316'; // primary

  // Circle properties
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // Apple-like custom cubic-bezier
      }}
      className="w-full relative overflow-hidden rounded-3xl bg-surface/90 border border-border/50 p-5 md:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-12"
    >
      {/* Decorative gradient blob behind the score */}
      <div 
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: ringColor }}
      />
      
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg className="transform -rotate-90 w-64 h-64">
          {/* Background Ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            className="text-border/50"
          />
          {/* Animated Foreground Ring */}
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            stroke={ringColor}
            strokeWidth="14"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl font-serif font-extrabold tracking-tighter"
            style={{ color: ringColor }}
          >
            {score}
          </motion.span>
          <span className="text-sm font-semibold text-textSecondary uppercase tracking-widest mt-2">/ 100</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center text-center md:text-left z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl md:text-3xl font-serif font-extrabold text-textPrimary tracking-tight mb-6"
        >
          {verdict}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base md:text-lg text-textSecondary italic font-serif leading-relaxed mb-6"
        >
          "{quote}"
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center justify-center md:justify-start gap-2 text-sm font-semibold tracking-wide uppercase"
          style={{ color: ringColor }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ringColor }} />
          Hiring Verdict: {hiringVerdict}
        </motion.div>
      </div>
    </motion.div>
  );
};
