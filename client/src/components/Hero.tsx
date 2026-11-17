import React from 'react';
import { UrlInput } from './UrlInput';
import { motion } from 'framer-motion';
import { KeyRound, Github } from 'lucide-react';
import { ScoreRing, ScoreBar, Card } from './ui';

interface HeroProps {
  onAnalyzeRepo: (url: string) => void;
  isLoading: boolean;
  customModeEnabled?: boolean;
  onOpenCustomMode?: () => void;
}

// A believable, telemetry-grounded preview of a real roast report
const ReviewPreviewCard: React.FC = () => {
  const score = 67;
  const categories = [
    { tag: 'SECURITY', score: 88 },
    { tag: 'TEST_COVERAGE', score: 54 },
    { tag: 'SCALABILITY', score: 61 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="w-full max-w-sm mx-auto md:mx-0"
    >
      <Card level={2} className="p-6 border-border-hairline shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-textMuted mb-5 pb-3 border-b border-border-hairline">
          <div className="flex items-center gap-1.5 text-textSecondary">
            <Github className="w-3.5 h-3.5 text-textMuted" />
            <span>vercel/next.js</span>
          </div>
          <span className="text-[10px] text-data-warning font-semibold">[VERDICT: FLAGGED]</span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <ScoreRing score={score} size="sm" animate={true} />
          <div className="flex-1">
            <p className="text-xs text-textSecondary italic leading-relaxed font-sans">
              "Compiles cleanly. Scales like it's still 2019."
            </p>
            <span className="text-[10px] font-mono text-textMuted mt-1 block">
              34,120 LOC • 14 Dependency Hubs
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {categories.map((c) => (
            <ScoreBar
              key={c.tag}
              score={c.score}
              label={c.tag}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export const Hero: React.FC<HeroProps> = ({
  onAnalyzeRepo,
  isLoading,
  customModeEnabled,
  onOpenCustomMode,
}) => {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10 min-h-[75vh] flex flex-col justify-center">
      <div className="grid md:grid-cols-5 gap-10 md:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-3 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-secondary border border-border-hairline text-xs font-mono text-textMuted mb-6 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>AST Telemetry & Code Roast</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.08] text-textPrimary font-sans">
            Roast your codebase.
          </h1>

          <p className="max-w-xl mx-auto md:mx-0 text-base sm:text-lg text-textSecondary font-normal leading-relaxed mb-8">
            Paste a public GitHub repo. Get a score built on real static analysis, not just an AI's opinion — categorized, no sugarcoating.
          </p>

          <UrlInput onSubmit={onAnalyzeRepo} isLoading={isLoading} align="left" />

          {onOpenCustomMode && (
            <button
              type="button"
              onClick={onOpenCustomMode}
              className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-textSecondary hover:text-primary transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded py-1 px-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-textMuted" />
              <span>
                {customModeEnabled
                  ? 'Custom Mode: on (using your own API key)'
                  : 'Use your own API key (Custom Mode)'}
              </span>
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
