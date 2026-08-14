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

  return {
    path: filePath,
    language: 'unknown',
    loc: totalLines,
    codeLoc: totalLines - commentLines - blankLines,
    commentLoc: commentLines,
    blankLoc: blankLines,
    functions: [],
    imports: [],
    exports: [],
    magicNumbers: [],
    deepCallbacks: [],
    todoCount,
    fixmeCount,
  };
};
