import React from 'react';
import { UrlInput } from './UrlInput';
import { motion } from 'framer-motion';
import { KeyRound, Github } from 'lucide-react';
import { getScoreColor } from '../utils/scoreHelpers';

interface HeroProps {
  onAnalyzeRepo: (url: string) => void;
  isLoading: boolean;
  customModeEnabled?: boolean;
  onOpenCustomMode?: () => void;
}

// A believable preview of a real result, not a generic illustration --
// this is what the product actually produces, mocked at a fixed score.
const ReviewPreviewCard: React.FC = () => {
  const score = 67;
  const ringColor = getScoreColor(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const categories = [
    { tag: 'SECURITY', score: 88 },
    { tag: 'TEST_COVERAGE', score: 54 },
    { tag: 'SCALABILITY', score: 61 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="bg-surface/90 border border-border rounded-2xl p-6 w-full max-w-sm mx-auto md:mx-0"
    >
      <div className="flex items-center gap-2 text-xs text-textSecondary/70 font-mono mb-5">
        <Github className="w-3.5 h-3.5" />
        <span>vercel/next.js</span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div className="relative flex-shrink-0">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-border/60" />
            <circle
              cx="40" cy="40" r={radius}
              stroke={ringColor} strokeWidth="6" fill="transparent" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold" style={{ color: ringColor }}>
            {score}
          </div>
        </div>
        <p className="text-sm text-textSecondary italic leading-snug">
          "Compiles cleanly. Scales like it's still 2019."
        </p>
      </div>

      <div className="space-y-2.5">
        {categories.map((c) => (
          <div key={c.tag} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-textSecondary/60 w-28 shrink-0">[{c.tag}]</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: getScoreColor(c.score) }} />
            </div>
            <span className="font-mono text-[10px] font-semibold w-6 text-right" style={{ color: getScoreColor(c.score) }}>{c.score}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onAnalyzeRepo, isLoading, customModeEnabled, onOpenCustomMode }) => {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10 min-h-[80vh] flex flex-col justify-center">
      <div className="grid md:grid-cols-5 gap-12 md:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-3 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight mb-6 leading-[1.05] text-textPrimary">
            Roast your codebase.
          </h1>

          <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-textSecondary font-medium leading-relaxed mb-10">
            Paste a public GitHub repo. Get a scored, categorized review — real static analysis, AI commentary, no sugarcoating.
          </p>

          <UrlInput onSubmit={onAnalyzeRepo} isLoading={isLoading} align="left" />

          {onOpenCustomMode && (
            <button
              type="button"
              onClick={onOpenCustomMode}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-textSecondary/80 hover:text-primary transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {customModeEnabled ? 'Custom Mode: on (using your own API key)' : 'Use your own API key (Custom Mode)'}
            </button>
          )}
        </motion.div>

        <div className="md:col-span-2">
          <ReviewPreviewCard />
        </div>
      </div>
    </div>
  );
};
