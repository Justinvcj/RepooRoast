import { getLanguageForFile, getParser } from './parserLoader.js';
import { analyzeJSTS } from './jstsAnalyzer.js';
import { analyzeGeneric } from './genericAnalyzer.js';

export const analyzeFile = async (sourceCode, filePath) => {
  const language = getLanguageForFile(filePath);
  
  if (language === 'javascript' || language === 'typescript' || language === 'tsx') {
    const parser = await getParser(language);
    if (parser) {
      const tree = parser.parse(sourceCode);
      return analyzeJSTS(tree, sourceCode, filePath);
    }
  }

  // Add python analyzer here later when implemented
  
  // Fallback
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

  const dependencyGraph = {
    nodes: [],
    edges: [],
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

    // Aggregate Dependency Graph
    dependencyGraph.nodes.push(filePath);
    for (const imp of analysis.imports) {
      dependencyGraph.edges.push({ from: filePath, to: imp });
    }
  }

  repoMetrics.commentToCodeRatio = repoMetrics.totalLOC > 0 
    ? (repoMetrics.commentLOC / repoMetrics.totalLOC).toFixed(3)
    : 0;

  return {
    repoMetrics,
    dependencyGraph,
    fileAnalyses,
  };
};
