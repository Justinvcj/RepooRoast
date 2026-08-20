import { getLanguageForFile, getParser } from './parserLoader.js';
import { analyzeJSTS } from './jstsAnalyzer.js';
import { analyzePython } from './pythonAnalyzer.js';
import { analyzeGeneric } from './genericAnalyzer.js';
import { buildDependencyGraph } from './graphResolver.js';

export const analyzeFile = async (sourceCode, filePath) => {
  // Bypass web-tree-sitter completely to avoid WASM Out-Of-Memory crashes on Render Free Tier.
  // We use a robust regex fallback instead.
  return analyzeGeneric(sourceCode, filePath);
};

export const runStaticAnalysis = async (filesContentMap) => {
  const fileAnalyses = [];
  
  const repoMetrics = {
    totalFiles: 0,
    totalLOC: 0,
    commentLOC: 0,
    blankLOC: 0,
    languageBreakdown: {},
    totalFunctions: 0,
    filesWithZeroComments: [],
    todoCount: 0,
    fixmeCount: 0,
  };

  for (const [filePath, content] of Object.entries(filesContentMap)) {
    const analysis = await analyzeFile(content, filePath);
    fileAnalyses.push(analysis);
    
    // Aggregate Repo Metrics
    repoMetrics.totalFiles++;
    repoMetrics.totalLOC += analysis.loc;
    repoMetrics.commentLOC += analysis.commentLoc;
    repoMetrics.blankLOC += analysis.blankLoc;
    repoMetrics.totalFunctions += analysis.functions.length;
    repoMetrics.todoCount += analysis.todoCount;
    repoMetrics.fixmeCount += analysis.fixmeCount;

    if (analysis.commentLoc === 0) {
      repoMetrics.filesWithZeroComments.push(filePath);
    }

    repoMetrics.languageBreakdown[analysis.language] = (repoMetrics.languageBreakdown[analysis.language] || 0) + 1;

  }

  repoMetrics.commentToCodeRatio = repoMetrics.totalLOC > 0 
    ? (repoMetrics.commentLOC / repoMetrics.totalLOC).toFixed(3)
    : 0;

  // Build the intelligent dependency graph
  const dependencyGraph = buildDependencyGraph(fileAnalyses);

  return {
    repoMetrics,
    dependencyGraph,
    fileAnalyses,
  };
};
