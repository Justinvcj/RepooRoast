import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StaticAnalysis } from '../types';
import { ChevronDown } from 'lucide-react';
import { Badge, FilePath } from './ui';

interface StaticAnalysisPanelProps {
  analysis: StaticAnalysis;
}

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border-hairline last:border-b-0">
    <dt className="text-sm text-textSecondary">{label}</dt>
    <dd className="font-mono text-sm text-textPrimary tabular-nums">{value}</dd>
  </div>
);

export const StaticAnalysisPanel: React.FC<StaticAnalysisPanelProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { repoMetrics, dependencyGraph, fileAnalyses } = analysis;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      <div className="bg-surface border border-border-hairline rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-surface-elevated transition-colors duration-fast cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          aria-expanded={isExpanded}
        >
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-textPrimary">
              Measured before the review
            </h3>
            <p className="text-sm text-textSecondary mt-0.5 tabular-nums">
              {repoMetrics.totalFiles.toLocaleString()} files parsed, {repoMetrics.totalLOC.toLocaleString()} lines of code. These numbers come from the parser, not the AI.
            </p>
          </div>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
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
              <div className="px-5 py-6 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <section>
                  <h4 className="font-display text-base font-semibold text-textPrimary mb-2">Size and comments</h4>
                  <dl>
                    <Stat label="Total lines" value={repoMetrics.totalLOC.toLocaleString()} />
                    <Stat label="Comment lines" value={repoMetrics.commentLOC.toLocaleString()} />
                    <Stat label="Comment to code" value={Number(repoMetrics.commentToCodeRatio).toFixed(2)} />
                    <Stat label="Functions" value={repoMetrics.totalFunctions.toLocaleString()} />
                    <Stat label="TODOs" value={repoMetrics.todoCount} />
                  </dl>
                </section>

                <section>
                  <h4 className="font-display text-base font-semibold text-textPrimary mb-3">Dependencies</h4>
                  <div className="space-y-4">
                    {dependencyGraph?.metrics?.hubs && dependencyGraph.metrics.hubs.length > 0 ? (
                      <div>
                        <p className="text-sm text-textSecondary mb-2">Files everything depends on</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dependencyGraph.metrics.hubs.slice(0, 5).map((hub) => (
                            <span
                              key={hub}
                              className="px-2 py-0.5 bg-surface-elevated rounded font-mono text-[11px] text-textSecondary border border-border-hairline break-all"
                            >
                              {hub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-textMuted">No central files found.</p>
                    )}

                    {dependencyGraph?.metrics?.orphans && dependencyGraph.metrics.orphans.length > 0 && (
                      <div>
                        <p className="text-sm text-data-critical font-medium mb-2">Possibly unused</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dependencyGraph.metrics.orphans.slice(0, 3).map((orphan) => (
                            <span
                              key={orphan}
                              className="px-2 py-0.5 bg-data-critical/10 rounded font-mono text-[11px] text-data-critical border border-data-critical/25 break-all"
                            >
                              {orphan}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="font-display text-base font-semibold text-textPrimary mb-3">Flagged files</h4>
                  <div className="space-y-3">
                    {fileAnalyses && fileAnalyses.length > 0 ? (
                      fileAnalyses.slice(0, 4).map((file, idx) => {
                        const flags: string[] = file.functions.flatMap((f: unknown) =>
                          f && typeof f === 'object' && 'flags' in f && Array.isArray((f as { flags: string[] }).flags)
                            ? (f as { flags: string[] }).flags
                            : []
                        );
                        const uniqueFlags: string[] = Array.from(new Set(flags));
                        if (uniqueFlags.length === 0 && file.magicNumbers.length === 0) return null;

                        return (
                          <div key={idx} className="space-y-1.5">
                            <FilePath path={file.path} className="text-[11px]" />
                            <div className="flex flex-wrap gap-1">
                              {uniqueFlags.map((flag: string, i: number) => (
                                <Badge key={i} variant="warning" size="sm">
                                  {flag}
                                </Badge>
                              ))}
                              {file.magicNumbers.length > 0 && (
                                <Badge variant="default" size="sm">
                                  {file.magicNumbers.length} magic numbers
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-textMuted">Nothing flagged in the parsed files.</p>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
