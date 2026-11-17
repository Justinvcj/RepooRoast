import { describe, it, expect, afterEach } from 'vitest';
import { analyzeFile } from '../src/analyzers/staticAnalyzer.js';
import { analyzeGeneric } from '../src/analyzers/genericAnalyzer.js';

const SRC = 'export function add(a, b) {\n  // sum\n  return a + b;\n}\n';

describe('static analysis safety nets', () => {
  afterEach(() => {
    delete process.env.DISABLE_TREE_SITTER;
  });

  it('uses the regex analyzer when DISABLE_TREE_SITTER=1', async () => {
    process.env.DISABLE_TREE_SITTER = '1';
    const result = await analyzeFile(SRC, 'src/add.js');
    expect(result).toEqual(analyzeGeneric(SRC, 'src/add.js'));
  });

  it('still analyzes normally with the parser enabled', async () => {
    const result = await analyzeFile(SRC, 'src/add.js');
    expect(result.path).toBe('src/add.js');
    expect(result.loc).toBeGreaterThan(0);
    expect(result.functions.length).toBeGreaterThanOrEqual(1);
  });
});
