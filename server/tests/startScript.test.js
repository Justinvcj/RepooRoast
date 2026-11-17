import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

/**
 * Regression guard for a production crash on Render's free tier (512MB, ~10%
 * CPU). V8's optimizing WebAssembly compiler used about 430MB of transient
 * memory compiling the tree-sitter grammars, pushing resident memory past the
 * limit mid-review and killing the process with no error. --liftoff-only uses
 * the lightweight compiler: peak memory dropped from 560MB to 129MB with the
 * parser still enabled. Render runs `npm start`, so the flag lives here.
 */
describe('production start script', () => {
  it('uses V8 lightweight wasm compilation', () => {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(pkg.scripts.start).toContain('--liftoff-only');
    expect(pkg.scripts.start).toContain('src/index.js');
  });
});
