import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { StaticAnalysis } from '../types';
import { Code2, GitMerge, FileCode, AlertTriangle, Info, ChevronDown } from 'lucide-react';

interface StaticAnalysisPanelProps {
  analysis: StaticAnalysis;
}

export const StaticAnalysisPanel: React.FC<StaticAnalysisPanelProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { repoMetrics, dependencyGraph, fileAnalyses } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
    >
      <div className="bg-surface/95 rounded-2xl border border-border/50 overflow-hidden shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight">Static Code Analysis</h3>
              <span className="text-sm text-textSecondary font-medium mt-1">
                Parsed {repoMetrics.totalFiles} files • {repoMetrics.totalLOC} LOC
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-textSecondary" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className="p-6 pt-0 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Repo Metrics */}
            <div className="bg-background rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-bold text-textPrimary uppercase tracking-widest flex items-center gap-2 mb-4">
                <FileCode className="w-4 h-4 text-primary" />
                Repository Metrics
              </h4>
              <ul className="space-y-3 text-sm text-textSecondary">
                <li className="flex justify-between"><span>Total LOC:</span> <span className="font-mono text-textPrimary">{repoMetrics.totalLOC}</span></li>
                <li className="flex justify-between"><span>Comment LOC:</span> <span className="font-mono text-textPrimary">{repoMetrics.commentLOC}</span></li>
                <li className="flex justify-between"><span>Comment/Code Ratio:</span> <span className="font-mono text-textPrimary">{Number(repoMetrics.commentToCodeRatio).toFixed(2)}</span></li>
                <li className="flex justify-between"><span>Functions/Methods:</span> <span className="font-mono text-textPrimary">{repoMetrics.totalFunctions}</span></li>
                <li className="flex justify-between"><span>TODOs Found:</span> <span className="font-mono text-textPrimary">{repoMetrics.todoCount}</span></li>
              </ul>
            </div>

            {/* Dependency Graph */}
            <div className="bg-background rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-bold text-textPrimary uppercase tracking-widest flex items-center gap-2 mb-4">
                <GitMerge className="w-4 h-4 text-[#8b949e]" />
                Dependency Graph
              </h4>
              <div className="space-y-4">
                {dependencyGraph?.metrics?.hubs?.length > 0 ? (
                  <div>
                    <span className="text-xs text-textSecondary block mb-1">Architecture Hubs:</span>
                    <div className="flex flex-wrap gap-2">
                      {dependencyGraph.metrics.hubs.slice(0, 5).map(hub => (
                        <span key={hub} className="px-2 py-1 bg-[#1f2428] rounded font-mono text-[11px] text-[#8b949e] border border-border break-all">{hub}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-textSecondary">No distinct hubs found.</span>
                )}
                
                {dependencyGraph?.metrics?.orphans?.length > 0 && (
                  <div>
                    <span className="text-xs text-[#f85149] block mb-1">Potential Orphans (Unused):</span>
                    <div className="flex flex-wrap gap-2">
                      {dependencyGraph.metrics.orphans.slice(0, 3).map(orphan => (
                        <span key={orphan} className="px-2 py-1 bg-[#f85149]/10 rounded font-mono text-[11px] text-[#f85149] border border-[#f85149]/30 break-all">{orphan}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notable Files Insights */}
            <div className="bg-background rounded-xl p-5 border border-border/50 lg:col-span-1 md:col-span-2">
              <h4 className="text-sm font-bold text-textPrimary uppercase tracking-widest flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-[#d29922]" />
                File Insights
              </h4>
              <div className="space-y-3">
                {fileAnalyses && fileAnalyses.length > 0 ? (
                  fileAnalyses.slice(0, 4).map((file, idx) => {
                    const flags = file.functions.flatMap((f: any) => f.flags);
                    const uniqueFlags = Array.from(new Set(flags));
                    if (uniqueFlags.length === 0 && file.magicNumbers.length === 0) return null;
                    return (
                      <div key={idx} className="text-sm">
                        <span className="font-mono text-textPrimary text-xs break-all block mb-1">{file.path}</span>
                        <div className="flex flex-wrap gap-1">
                          {uniqueFlags.map((flag: any, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 bg-[#d29922]/10 rounded text-[10px] uppercase text-[#d29922] font-bold tracking-wider">{flag}</span>
                          ))}
                          {file.magicNumbers.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-[#8b949e]/10 rounded text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">{file.magicNumbers.length} Magic Numbers</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2 text-sm text-textSecondary">
                    <Info className="w-4 h-4" />
                    No major anomalies detected.
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
