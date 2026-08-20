/**
 * Fallback analyzer for languages without tree-sitter grammar.
 * Produces basic line-count and pattern-matching metrics only.
 */
export const analyzeGeneric = (sourceCode, filePath) => {
  const lines = sourceCode.split('\n');
  const totalLines = lines.length;

  let commentLines = 0;
  let blankLines = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') blankLines++;
    else if (
      trimmed.startsWith('//') || trimmed.startsWith('#') ||
      trimmed.startsWith('/*') || trimmed.startsWith('*') ||
      trimmed.startsWith('--') || trimmed.startsWith('"""')
    ) {
      commentLines++;
    }
  }

  const upperSource = sourceCode.toUpperCase();
  const todoCount = (upperSource.match(/\bTODO\b/g) || []).length;
  const fixmeCount = (upperSource.match(/\bFIXME\b/g) || []).length;

  // Regex-based fallbacks for WASM tree-sitter
  const imports = [];
  const functions = [];
  
  // Basic JS/TS/Python import regex
  const importRegex = /(?:import\s+.*?from\s+['"]([^'"]+)['"])|(?:require\(['"]([^'"]+)['"]\))|(?:from\s+([^\s]+)\s+import)|(?:import\s+([^\s]+))/g;
  let match;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const pkg = match[1] || match[2] || match[3] || match[4];
    if (pkg && !pkg.includes('{')) imports.push(pkg);
  }

  // Basic JS/TS/Python function regex
  const funcRegex = /(?:function\s+([a-zA-Z0-9_]+))|(?:const\s+([a-zA-Z0-9_]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)|(?:def\s+([a-zA-Z0-9_]+))/g;
  while ((match = funcRegex.exec(sourceCode)) !== null) {
    const fn = match[1] || match[2] || match[3];
    if (fn) functions.push(fn);
  }

  return {
    path: filePath,
    language: 'unknown',
    loc: totalLines,
    codeLoc: totalLines - commentLines - blankLines,
    commentLoc: commentLines,
    blankLoc: blankLines,
    functions,
    imports,
    exports: [],
    magicNumbers: [],
    deepCallbacks: [],
    todoCount,
    fixmeCount,
  };
};
