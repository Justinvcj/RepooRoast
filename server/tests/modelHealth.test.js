import { describe, it, expect, beforeEach } from 'vitest';
import {
  MODEL_CHAIN,
  parseRetryMs,
  classifyFailure,
  markUnavailable,
  isAvailable,
  availableModels,
  describeUnavailable,
  resetModelHealth,
} from '../src/services/modelHealth.js';

const DAILY =
  '[429] Quota exceeded for metric: generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash, description: Generate content requests per day limit exceeded. Please retry in 17h36m6.15s.';

describe('modelHealth', () => {
  beforeEach(() => resetModelHealth());

  it('parses Google retry hints into milliseconds', () => {
    expect(parseRetryMs('Please retry in 17h36m6.5s.')).toBe(17 * 3600000 + 36 * 60000 + 6500);
    expect(parseRetryMs('retry in 30s')).toBe(30000);
    expect(parseRetryMs('no hint here')).toBeNull();
  });

  it('classifies daily quota, per-minute limits, overload and missing models', () => {
    expect(classifyFailure(DAILY).kind).toBe('daily-quota');
    expect(classifyFailure('[429] too many requests per minute').kind).toBe('rate-limit');
    expect(classifyFailure('[503 ] This model is currently experiencing high demand').kind).toBe('overloaded');
    expect(classifyFailure('Model x timed out after 45s').kind).toBe('overloaded');
    expect(classifyFailure('[404] model not found').kind).toBe('not-found');
    expect(classifyFailure('[400] bad request').kind).toBe('other');
  });

  it('skips a model after a daily quota error and brings it back after the cooldown', () => {
    const t0 = 1_000_000;
    markUnavailable('gemini-3.6-flash', DAILY, t0);
    expect(isAvailable('gemini-3.6-flash', t0 + 1000)).toBe(false);
    expect(availableModels(MODEL_CHAIN, t0 + 1000)).not.toContain('gemini-3.6-flash');
    expect(availableModels(MODEL_CHAIN, t0 + 1000)).toContain('gemini-2.5-flash');
    expect(isAvailable('gemini-3.6-flash', t0 + 13 * 3600000)).toBe(true);
  });

  it('never cools down unknown errors', () => {
    markUnavailable('gemini-2.5-flash', '[400] bad request');
    expect(isAvailable('gemini-2.5-flash')).toBe(true);
  });

  it('keeps every chain model distinct and ends with lite models', () => {
    expect(new Set(MODEL_CHAIN).size).toBe(MODEL_CHAIN.length);
    expect(MODEL_CHAIN.at(-1)).toMatch(/lite/);
  });

  it('explains a full daily-quota outage with the reset time', () => {
    for (const m of MODEL_CHAIN) markUnavailable(m, DAILY);
    expect(describeUnavailable(MODEL_CHAIN)).toMatch(/daily free quota.*about 12 hours/);
  });

  it('explains a transient outage in minutes', () => {
    for (const m of MODEL_CHAIN) markUnavailable(m, '[503] high demand');
    expect(describeUnavailable(MODEL_CHAIN)).toMatch(/Try again in about 3 minutes/);
  });
});
