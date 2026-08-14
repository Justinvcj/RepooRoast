/**
 * Walks a tree-sitter AST for Python and extracts
 * per-function and per-file metrics.
 */

// Node types that increment cyclomatic complexity
const BRANCH_TYPES = new Set([
  'if_statement', 'elif_clause', 'else_clause',
  'for_statement', 'while_statement',
  'try_statement', 'except_clause',
  'conditional_expression', 'boolean_operator', // e.g., and, or
  'match_statement', 'case_clause' // Python 3.10+
]);

const FUNCTION_TYPES = new Set([
  'function_definition',
]);

const IMPORT_TYPES = new Set([
  'import_statement',
  'import_from_statement',
]);

export const analyzePython = (tree, sourceCode, filePath) => {
  const root = tree.rootNode;
  const lines = sourceCode.split('\n');
  const totalLines = lines.length;

  let commentLines = 0;
  let blankLines = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') blankLines++;
    else if (trimmed.startsWith('#')) commentLines++;
  }

  const functions = [];
  const imports = [];
  const exports = []; // Python doesn't have explicit exports in the same way, usually __all__
  const magicNumbers = [];
  const deepCallbacks = []; // Less relevant in Python, but we keep the structure
  let todoCount = 0;
  let fixmeCount = 0;

  const upperSource = sourceCode.toUpperCase();
  const todoMatches = upperSource.match(/\bTODO\b/g);
  const fixmeMatches = upperSource.match(/\bFIXME\b/g);
  todoCount = todoMatches ? todoMatches.length : 0;
  fixmeCount = fixmeMatches ? fixmeMatches.length : 0;

  const walk = (node, depth = 0, parentFunction = null) => {
    // Track imports
    if (IMPORT_TYPES.has(node.type)) {
      if (node.type === 'import_statement') {
        const modules = node.descendantsOfType('dotted_name').map(n => n.text);
        imports.push(...modules);
      } else if (node.type === 'import_from_statement') {
        const moduleNode = node.childForFieldName('module_name');
        if (moduleNode) imports.push(moduleNode.text);
      }
    }

    // Track functions
    if (FUNCTION_TYPES.has(node.type)) {
      const funcInfo = extractFunctionInfo(node, depth, sourceCode);
      functions.push(funcInfo);

      for (let i = 0; i < node.childCount; i++) {
        walk(node.child(i), depth + 1, funcInfo);
      }
      return;
    }

    // Track magic numbers
    if (node.type === 'integer' || node.type === 'float') {
      const value = parseFloat(node.text);
      if (![0, 1, -1, 2, 100, 200, 404, 500].includes(value) && !isNaN(value)) {
        magicNumbers.push({
          value: node.text,
          line: node.startPosition.row + 1,
        });
      }
    }

    for (let i = 0; i < node.childCount; i++) {
      walk(node.child(i), depth + 1, parentFunction);
    }
  };

  walk(root);

  return {
    path: filePath,
    language: 'python',
    loc: totalLines,
    codeLoc: totalLines - commentLines - blankLines,
    commentLoc: commentLines,
    blankLoc: blankLines,
    functions,
    imports,
    exports,
    magicNumbers: magicNumbers.slice(0, 20),
    deepCallbacks,
    todoCount,
    fixmeCount,
  };
};

const extractFunctionInfo = (node, depth, sourceCode) => {
  const startLine = node.startPosition.row + 1;
  const endLine = node.endPosition.row + 1;
  const lineCount = endLine - startLine + 1;

  let name = '<anonymous>';
  const nameNode = node.childForFieldName('name');
  if (nameNode) name = nameNode.text;

  const paramsNode = node.childForFieldName('parameters');
  let paramCount = 0;
  if (paramsNode) {
    paramCount = paramsNode.namedChildCount;
  }

  let complexity = 1;
  let maxNesting = 0;

  const walkComplexity = (n, nestLevel = 0) => {
    if (BRANCH_TYPES.has(n.type)) {
      complexity++;
      if (['if_statement', 'for_statement', 'while_statement', 'try_statement'].includes(n.type)) {
        nestLevel++;
        maxNesting = Math.max(maxNesting, nestLevel);
      }
    }
    for (let i = 0; i < n.childCount; i++) {
      walkComplexity(n.child(i), nestLevel);
    }
  };

  walkComplexity(node);

  const flags = [];
  if (complexity > 10) flags.push('HIGH_COMPLEXITY');
  if (complexity > 20) flags.push('VERY_HIGH_COMPLEXITY');
  if (maxNesting > 3) flags.push('DEEP_NESTING');
  if (maxNesting > 5) flags.push('EXTREME_NESTING');
  if (paramCount > 5) flags.push('TOO_MANY_PARAMS');
  if (lineCount > 50) flags.push('LONG_FUNCTION');
  if (lineCount > 100) flags.push('GOD_FUNCTION');

  return {
    name,
    line: startLine,
    lines: lineCount,
    params: paramCount,
    cyclomaticComplexity: complexity,
    maxNestingDepth: maxNesting,
    flags,
  };
};
