import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StaticAnalysis } from '../types';
import { Code2, GitMerge, FileCode, AlertTriangle, ChevronDown } from 'lucide-react';
import { Card, Badge, FilePath } from './ui';

interface StaticAnalysisPanelProps {
  analysis: StaticAnalysis;
}

export const StaticAnalysisPanel: React.FC<StaticAnalysisPanelProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { repoMetrics, dependencyGraph, fileAnalyses } = analysis;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <Card level={1} className="overflow-hidden border-border-hairline shadow-md transition-all hover:border-border-focused">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-surface-elevated/40 transition-colors focus:outline-none cursor-pointer select-none text-left"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-surface-secondary border border-border-hairline text-primary shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight font-sans">
                  Static Code Analysis
                </h3>
                <Badge variant="accent" size="sm">
                  Measured Telemetry
                </Badge>
              </div>
              <span className="text-xs font-mono text-textMuted mt-0.5 tabular-nums">
                Parsed {repoMetrics.totalFiles.toLocaleString()} files • {repoMetrics.totalLOC.toLocaleString()} LOC
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
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
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Repo Metrics */}
                <div className="bg-surface-secondary/70 rounded-xl p-5 border border-border-hairline">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textPrimary flex items-center gap-2 mb-4">
                    <FileCode className="w-4 h-4 text-primary" />
                    <span>Repository Metrics</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs font-mono text-textSecondary">
                    <li className="flex justify-between py-1 border-b border-border-hairline/50">
                      <span>Total LOC:</span>
                      <span className="text-textPrimary font-semibold tabular-nums">{repoMetrics.totalLOC.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-border-hairline/50">
                      <span>Comment LOC:</span>
                      <span className="text-textPrimary font-semibold tabular-nums">{repoMetrics.commentLOC.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-border-hairline/50">
                      <span>Comment/Code Ratio:</span>
                      <span className="text-textPrimary font-semibold tabular-nums">{Number(repoMetrics.commentToCodeRatio).toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between py-1 border-b border-border-hairline/50">
                      <span>Functions/Methods:</span>
                      <span className="text-textPrimary font-semibold tabular-nums">{repoMetrics.totalFunctions.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>TODOs Found:</span>
                      <span className="text-textPrimary font-semibold tabular-nums">{repoMetrics.todoCount}</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Dependency Graph */}
                <div className="bg-surface-secondary/70 rounded-xl p-5 border border-border-hairline">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textPrimary flex items-center gap-2 mb-4">
                    <GitMerge className="w-4 h-4 text-textMuted" />
                    <span>Dependency Graph</span>
                  </h4>
                  <div className="space-y-4">
                    {dependencyGraph?.metrics?.hubs && dependencyGraph.metrics.hubs.length > 0 ? (
                      <div>
                        <span className="text-[11px] font-mono text-textMuted block mb-1.5">Architecture Hubs:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {dependencyGraph.metrics.hubs.slice(0, 5).map((hub) => (
                            <span
                              key={hub}
                              className="px-2 py-0.5 bg-background rounded font-mono text-[10px] text-textSecondary border border-border-hairline break-all"
                            >
                              {hub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-textMuted">No distinct hubs found.</span>
                    )}

                    {dependencyGraph?.metrics?.orphans && dependencyGraph.metrics.orphans.length > 0 && (
                      <div>
                        <span className="text-[11px] font-mono text-data-critical block mb-1.5">Potential Orphans (Unused):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {dependencyGraph.metrics.orphans.slice(0, 3).map((orphan) => (
                            <span
                              key={orphan}
                              className="px-2 py-0.5 bg-data-critical/10 rounded font-mono text-[10px] text-data-critical border border-data-critical/30 break-all"
                            >
                              {orphan}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Notable Files Insights */}
                <div className="bg-surface-secondary/70 rounded-xl p-5 border border-border-hairline lg:col-span-1 md:col-span-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-textPrimary flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-data-warning" />
                    <span>File Insights</span>
                  </h4>
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
                          <div key={idx} className="text-xs space-y-1">
                            <FilePath path={file.path} className="text-[11px]" />
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {uniqueFlags.map((flag: string, i: number) => (
                                <Badge key={i} variant="warning" size="sm">
                                  {flag}
                                </Badge>
                              ))}
                              {file.magicNumbers.length > 0 && (
                                <Badge variant="default" size="sm">
                                  {file.magicNumbers.length} Magic Nums
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-textMuted">Clean AST scan across parsed files.</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};
