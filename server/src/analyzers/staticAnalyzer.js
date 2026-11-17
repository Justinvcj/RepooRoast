import { getLanguageForFile, getParser } from './parserLoader.js';
import { analyzeJSTS } from './jstsAnalyzer.js';
import { analyzePython } from './pythonAnalyzer.js';
import { analyzeGeneric } from './genericAnalyzer.js';
import { buildDependencyGraph } from './graphResolver.js';

// Tree-sitter parsing of very large files is the realistic OOM risk on a
// memory-constrained host -- cap it and fall back to the lightweight regex
// analyzer above this size rather than skipping AST analysis for the whole
// repo (which the previous unconditional bypass did).
const MAX_TREE_SITTER_FILE_SIZE = 40000; // 40KB

// Small hosts (Render's free tier is 512MB) can be killed by the OS with no
// error when memory runs out. Past this resident size we stop starting new
// WASM parses and use the regex analyzer for the rest of the request.
const MAX_RSS_FOR_PARSE_MB = Number(process.env.MAX_RSS_FOR_PARSE_MB) || 320;
const rssMb = () => Math.round(process.memoryUsage().rss / 1024 / 1024);

// Operators can set DISABLE_TREE_SITTER=1 to turn the WASM parser off
// entirely without a code change.
const treeSitterDisabled = () => process.env.DISABLE_TREE_SITTER === '1';

export const analyzeFile = async (sourceCode, filePath) => {
  const language = getLanguageForFile(filePath);

  if (
    !language ||
    sourceCode.length > MAX_TREE_SITTER_FILE_SIZE ||
    treeSitterDisabled() ||
    rssMb() > MAX_RSS_FOR_PARSE_MB
  ) {
    return analyzeGeneric(sourceCode, filePath);
  }

  let tree = null;
  try {
    const parser = await getParser(language);
    if (!parser) return analyzeGeneric(sourceCode, filePath);

    tree = parser.parse(sourceCode);
    if (!tree) return analyzeGeneric(sourceCode, filePath);

    return language === 'python'
      ? analyzePython(tree, sourceCode, filePath)
      : analyzeJSTS(tree, sourceCode, filePath);
  } catch (err) {
    console.warn(`[Analyzer] Tree-sitter parse failed for ${filePath}, falling back to regex analysis: ${err.message}`);
    return analyzeGeneric(sourceCode, filePath);
  } finally {
    // A tree-sitter Tree is backed by WASM linear memory and must be freed
    // explicitly, or it leaks for the lifetime of this long-running process
    // -- the shared parser singleton in parserLoader.js is reused across
    // every request, so every un-deleted tree accumulates. This is the most
    // likely actual cause of the original "WASM OOM" that led to bypassing
    // tree-sitter entirely, rather than tree-sitter itself being unsafe.
    if (tree && typeof tree.delete === 'function') {
      tree.delete();
    }
  }
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

    // Parsing is CPU-bound. Yield between files so the event loop can answer
    // health checks and keep the response stream alive on a slow shared CPU.
    await new Promise((resolve) => setImmediate(resolve));
    
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
