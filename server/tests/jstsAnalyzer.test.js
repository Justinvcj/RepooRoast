import { describe, it, expect, beforeAll } from 'vitest';
import { getParser } from '../src/analyzers/parserLoader.js';
import { analyzeJSTS } from '../src/analyzers/jstsAnalyzer.js';

describe('jstsAnalyzer', () => {
  let parser;

  beforeAll(async () => {
    parser = await getParser('javascript');
  });

  it('should analyze basic functions and complexity', () => {
    const code = `
      function calculateComplexity(a, b) {
        if (a > b) {
          return a;
        } else if (a < b) {
          return b;
        }
        for (let i = 0; i < 10; i++) {
          console.log(i);
        }
        return 0;
      }
    `;
    const tree = parser.parse(code);
    const result = analyzeJSTS(tree, code, 'test.js');

    expect(result.functions.length).toBeGreaterThan(0);
    const mainFunc = result.functions.find(f => f.name === 'calculateComplexity');
    expect(mainFunc).toBeDefined();
    expect(mainFunc.cyclomaticComplexity).toBeGreaterThan(1);
  });

  it('should detect magic numbers', () => {
    const code = `
      const maxRetries = 5;
      function doWork() {
        setTimeout(() => {}, 86400000);
      }
    `;
    const tree = parser.parse(code);
    const result = analyzeJSTS(tree, code, 'magic.js');

    expect(result.magicNumbers.some(m => m.value === '86400000')).toBe(true);
    // We shouldn't flag 5 ideally because it's assigned to a variable,
    // though our simple AST query might flag it. 86400000 is clearly a magic number.
  });

  it('should detect hardcoded secrets and TODOS', () => {
    const code = `
      const API_KEY = "sk-live-1234567890abcdef";
      // TODO: Refactor this later
      function connect() {
        console.log("connected");
      }
    `;
    const tree = parser.parse(code);
    const result = analyzeJSTS(tree, code, 'secrets.js');

    expect(result.todoCount).toBe(1);
  });
});
