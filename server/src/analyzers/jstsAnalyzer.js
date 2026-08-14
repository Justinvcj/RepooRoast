/**
 * Walks a tree-sitter AST for JavaScript or TypeScript and extracts
 * per-function and per-file metrics.
 */

// Node types that increment cyclomatic complexity
const BRANCH_TYPES = new Set([
  'if_statement', 'else_clause',
  'for_statement', 'for_in_statement',
  'while_statement', 'do_statement',
  'switch_case',  // each case is a branch
  'catch_clause',
  'ternary_expression', 'conditional_expression',
  'binary_expression',  // only && and || — checked below
]);

// Node types that represent function definitions
const FUNCTION_TYPES = new Set([
  'function_declaration',
  'function_expression',
  'arrow_function',
  'method_definition',
  'function', // Python-style, but TS sometimes uses it
]);

const IMPORT_TYPES = new Set([
  'import_statement',
  'import_declaration',
]);

const EXPORT_TYPES = new Set([
  'export_statement',
  'export_declaration',
  'export_default_declaration',
]);

/**
 * Analyzes a single JS/TS file given its tree-sitter AST root.
 */
export const analyzeJSTS = (tree, sourceCode, filePath) => {
  const root = tree.rootNode;
  const lines = sourceCode.split('\n');
  const totalLines = lines.length;

  // Comment and blank line counting
  let commentLines = 0;
  let blankLines = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') blankLines++;
    else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) commentLines++;
  }

  const functions = [];
  const imports = [];
  const exports = [];
  const magicNumbers = [];
  const deepCallbacks = [];
  let todoCount = 0;
  let fixmeCount = 0;

  // Count TODOs and FIXMEs
  const upperSource = sourceCode.toUpperCase();
  const todoMatches = upperSource.match(/\bTODO\b/g);
  const fixmeMatches = upperSource.match(/\bFIXME\b/g);
  todoCount = todoMatches ? todoMatches.length : 0;
  fixmeCount = fixmeMatches ? fixmeMatches.length : 0;

  // Recursive AST walker
  const walk = (node, depth = 0, parentFunction = null) => {
    // Track imports
    if (IMPORT_TYPES.has(node.type)) {
      const source = node.descendantsOfType('string')
        .map(n => n.text.replace(/['"]/g, ''))[0];
      if (source) imports.push(source);
    }

    // Track exports
    if (EXPORT_TYPES.has(node.type)) {
      // Try to find the exported identifier
      const ident = node.descendantsOfType('identifier')[0];
      if (ident) exports.push(ident.text);
    }

    // Track functions
    if (FUNCTION_TYPES.has(node.type)) {
      const funcInfo = extractFunctionInfo(node, depth, sourceCode);
      functions.push(funcInfo);

      // Walk children in function context
      for (let i = 0; i < node.childCount; i++) {
        walk(node.child(i), depth + 1, funcInfo);
      }
      return; // Don't double-walk children
    }

    // Track magic numbers (numeric literals not in common patterns)
    if (node.type === 'number' || node.type === 'numeric_literal') {
      const value = parseFloat(node.text);
      // Skip 0, 1, -1, 2, 100 (common and acceptable)
      if (![0, 1, -1, 2, 100, 200, 404, 500].includes(value) && !isNaN(value)) {
        magicNumbers.push({
          value: node.text,
          line: node.startPosition.row + 1,
        });
      }
    }

    // Track deeply nested callbacks (arrow functions / function expressions > 3 deep)
    if ((node.type === 'arrow_function' || node.type === 'function_expression') && depth > 3) {
      deepCallbacks.push({
        line: node.startPosition.row + 1,
        depth,
      });
    }

    // Recurse
    for (let i = 0; i < node.childCount; i++) {
      walk(node.child(i), depth + 1, parentFunction);
    }
  };

  walk(root);

  return {
    path: filePath,
    language: filePath.endsWith('.py') ? 'python' : 'javascript/typescript',
    loc: totalLines,
    codeLoc: totalLines - commentLines - blankLines,
    commentLoc: commentLines,
    blankLoc: blankLines,
    functions,
    imports,
    exports,
    magicNumbers: magicNumbers.slice(0, 20), // cap to avoid noise
    deepCallbacks,
    todoCount,
    fixmeCount,
  };
};

/**
 * Extracts detailed info for a single function node.
 */
const extractFunctionInfo = (node, depth, sourceCode) => {
  const startLine = node.startPosition.row + 1;
  const endLine = node.endPosition.row + 1;
  const lineCount = endLine - startLine + 1;

  // Get function name
  let name = '<anonymous>';
  const nameNode = node.childForFieldName('name');
  if (nameNode) {
    name = nameNode.text;
  } else {
    // Check parent for variable assignment: const foo = () => {}
    const parent = node.parent;
    if (parent && (parent.type === 'variable_declarator' || parent.type === 'pair')) {
      const id = parent.childForFieldName('name') || parent.childForFieldName('key');
      if (id) name = id.text;
    }
  }

  // Count parameters
  const params = node.childForFieldName('parameters') || node.childForFieldName('formal_parameters');
  const paramCount = params ? params.namedChildCount : 0;

  // Calculate cyclomatic complexity
  let complexity = 1; // base complexity
  let maxNesting = 0;

  const walkComplexity = (n, nestLevel = 0) => {
    if (BRANCH_TYPES.has(n.type)) {
      // For binary expressions, only count && and ||
      if (n.type === 'binary_expression') {
        const op = n.childForFieldName('operator');
        if (op && (op.text === '&&' || op.text === '||')) {
          complexity++;
        }
      } else {
        complexity++;
        if (['if_statement', 'for_statement', 'for_in_statement',
             'while_statement', 'do_statement'].includes(n.type)) {
          nestLevel++;
          maxNesting = Math.max(maxNesting, nestLevel);
        }
      }
    }
    for (let i = 0; i < n.childCount; i++) {
      walkComplexity(n.child(i), nestLevel);
    }
  };

  walkComplexity(node);

  // Generate flags
  const flags = [];
  if (complexity > 10) flags.push('HIGH_COMPLEXITY');
  if (complexity > 20) flags.push('VERY_HIGH_COMPLEXITY');
  if (maxNesting > 3) flags.push('DEEP_NESTING');
  if (maxNesting > 5) flags.push('EXTREME_NESTING');
  if (paramCount > 4) flags.push('TOO_MANY_PARAMS');
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
