import React from 'react';
import { UrlInput } from './UrlInput';
import { motion, useReducedMotion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

interface HeroProps {
  onAnalyzeRepo: (url: string) => void;
  isLoading: boolean;
  customModeEnabled?: boolean;
  onOpenCustomMode?: () => void;
}

/** A pen mark: the number the reviewer wrote next to a line. */
const Mark: React.FC<{ n: number }> = ({ n }) => (
  <span
    aria-hidden="true"
    className="ml-3 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border-[1.5px] border-primary text-primary text-[11px] font-sans font-semibold leading-none align-middle"
  >
    {n}
  </span>
);

const CODE: { n: number; text: React.ReactNode; flag?: boolean }[] = [
  { n: 38, text: 'function saveUser(data) {' },
  { n: 39, text: '	if (data) {' },
  { n: 40, text: '		if (data.user) {' },
  { n: 41, text: '			if (data.user.id) {' },
  {
    n: 42,
    flag: true,
    text: (
      <>
        {'				if (data.user.id > 0) {'}
        <Mark n={1} />
      </>
    ),
  },
  {
    n: 43,
    flag: true,
    text: (
      <>
        {'					save('}
        <span className="relative inline-block px-1 -mx-1">
          <span
            aria-hidden="true"
            className="pen-ring absolute -inset-x-1 -inset-y-0.5 rounded-[50%/60%] border-[1.5px] border-primary"
          />
          data, true, null, false
        </span>
        {');'}
        <Mark n={2} />
      </>
    ),
  },
];

const ReviewPrintout: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto bg-surface border border-border-hairline rounded-lg overflow-hidden"
      aria-label="Sample review: two problems marked in red pen"
    >
      <figcaption className="px-4 py-2.5 border-b border-border-hairline bg-surface-elevated flex items-center justify-between text-xs text-textMuted">
        <span className="font-mono text-textSecondary">src/users/save.js</span>
        <span>Sample review</span>
      </figcaption>

      <pre className="px-4 py-4 text-[11px] sm:text-[12.5px] leading-6 font-mono [tab-size:1] sm:[tab-size:2] text-textPrimary overflow-x-auto">
        {CODE.map((l) => (
          <div key={l.n} className="whitespace-pre flex relative">
            {l.flag && <span aria-hidden="true" className="absolute -left-4 top-1 bottom-1 w-[3px] rounded-full bg-primary" />}
            <span className="w-7 sm:w-9 shrink-0 text-textMuted select-none text-right pr-2 sm:pr-4 tabular-nums">{l.n}</span>
            <span>{l.text}</span>
          </div>
        ))}
      </pre>

      <ol className="px-4 pb-4 pt-3 border-t border-border-hairline space-y-2 text-sm text-primary font-semibold">
        <li className="flex gap-3">
          <span className="w-[18px] shrink-0 text-center tabular-nums">1</span>
          <span>Four levels deep. Return early instead.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-[18px] shrink-0 text-center tabular-nums">2</span>
          <span>Three positional booleans. Nobody can read this call.</span>
        </li>
      </ol>

      <div className="px-4 py-3 border-t border-border-hairline flex items-baseline justify-between bg-surface-elevated">
        <span className="text-sm text-textSecondary">Code quality</span>
        <span className="font-display font-semibold text-2xl text-data-flawed tabular-nums">
          38<span className="text-sm text-textMuted font-medium"> / 100</span>
        </span>
      </div>
    </motion.figure>
  );
};

export const Hero: React.FC<HeroProps> = ({
  onAnalyzeRepo,
  isLoading,
  customModeEnabled,
  onOpenCustomMode,
}) => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[0.98] text-textPrimary">
            Roast your codebase.
          </h1>

          <p className="max-w-lg mt-6 mb-9 text-lg text-textSecondary leading-relaxed">
            Paste a public GitHub repo. A static-analysis pass measures it first, then a senior reviewer marks it up: scored, specific, no sugarcoating.
          </p>

          <UrlInput onSubmit={onAnalyzeRepo} isLoading={isLoading} align="left" />

          {onOpenCustomMode && (
            <button
              type="button"
              onClick={onOpenCustomMode}
              className="mt-5 inline-flex items-center gap-2 text-sm text-textSecondary hover:text-primary transition-colors cursor-pointer rounded py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <KeyRound className="w-3.5 h-3.5 text-textMuted" />
              <span>
                {customModeEnabled ? 'Custom Mode: on (using your own API key)' : 'Use your own API key (Custom Mode)'}
              </span>
            </button>
          )}
        </motion.div>

        <ReviewPrintout />
      </div>
    </div>
  );
};
