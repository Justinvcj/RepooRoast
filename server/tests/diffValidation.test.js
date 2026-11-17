import { describe, it, expect } from 'vitest';
import { validateDiffComponents } from '../src/middleware/inputValidator.js';

const run = (body) => {
  const req = { body: { ...body } };
  let status = 200;
  let payload = null;
  const res = {
    status(code) { status = code; return this; },
    json(data) { payload = data; return this; },
  };
  let nexted = false;
  validateDiffComponents(req, res, () => { nexted = true; });
  return { status, payload, nexted, body: req.body };
};

describe('diff endpoint validation (path traversal against the GitHub API)', () => {
  it('accepts a normal pull request', () => {
    expect(run({ owner: 'facebook', repo: 'react', pullNumber: '12345' }).nexted).toBe(true);
  });

  it('accepts normal compare ranges, including branch names with slashes', () => {
    expect(run({ owner: 'vuejs', repo: 'core.js', compareString: 'main...dev' }).nexted).toBe(true);
    expect(run({ owner: 'a', repo: 'b', compareString: 'v1.0.0...v1.1.0' }).nexted).toBe(true);
    expect(run({ owner: 'a', repo: 'b', compareString: 'feature/x...release/2.0' }).nexted).toBe(true);
  });

  it('rejects traversal in the compare range', () => {
    for (const compareString of [
      '../../../../victim/private/compare/main...dev',
      'main...dev/../../../../user',
      '../../user...x',
      'a/./b...c',
    ]) {
      const r = run({ owner: 'octocat', repo: 'Hello-World', compareString });
      expect(r.nexted, compareString).toBe(false);
      expect(r.status).toBe(400);
    }
  });

  it('rejects traversal and non-numeric values in the pull number', () => {
    for (const pullNumber of ['1/../../../../victim/private/pulls/3', '1/files', '12abc', '-1', '%2e%2e/x']) {
      const r = run({ owner: 'octocat', repo: 'Hello-World', pullNumber });
      expect(r.nexted, pullNumber).toBe(false);
      expect(r.status).toBe(400);
    }
  });

  it('rejects owner and repo values that are not plain GitHub names', () => {
    for (const [owner, repo] of [['..', 'x'], ['a', '..'], ['a/b', 'c'], ['a', 'b/../c'], ['a b', 'c'], ['.', 'x']]) {
      const r = run({ owner, repo, pullNumber: '1' });
      expect(r.nexted, `${owner}/${repo}`).toBe(false);
      expect(r.status).toBe(400);
    }
  });
});
