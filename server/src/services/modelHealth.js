/**
 * Remembers which Gemini models are currently unusable, so a review does not
 * re-try a model that just told us it is out of quota or overloaded.
 *
 * Free-tier keys have a small daily request cap per model (about 20). Once a
 * model returns a daily-quota 429, every later attempt in the same day fails
 * the same way, so we skip it until Google says it recovers. Overloaded (503)
 * and timed-out models get a short cooldown instead, because they usually
 * recover within a minute.
 *
 * Keep the chain below in sync with client/src/utils/geminiDirectClient.ts.
 */

// Best quality first, lite models last. Each model has its own quota.
export const MODEL_CHAIN = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

// Light calls (repo classification) use their own models so they do not
// spend the quota the three review calls need.
export const CLASSIFIER_CHAIN = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/** model -> { until: epoch ms, kind } */
const cooldowns = new Map();

/** Parses Google's "retry in 17h32m49.5s" hint into milliseconds. */
export const parseRetryMs = (message = '') => {
  const m = /retry in ((?:\d+(?:\.\d+)?[hms])+)/i.exec(message);
  if (!m) return null;
  let ms = 0;
  for (const [, n, unit] of m[1].matchAll(/(\d+(?:\.\d+)?)([hms])/g)) {
    ms += parseFloat(n) * { h: HOUR, m: MINUTE, s: 1000 }[unit];
  }
  return ms || null;
};

/** Turns a Gemini error message into { kind, cooldownMs }. */
export const classifyFailure = (message = '') => {
  const retryMs = parseRetryMs(message);
  if (message.includes('429') || /RESOURCE_EXHAUSTED|quota/i.test(message)) {
    if (/per ?day|PerDay/i.test(message)) {
      return { kind: 'daily-quota', cooldownMs: Math.min(retryMs ?? HOUR, 12 * HOUR) };
    }
    return { kind: 'rate-limit', cooldownMs: Math.min(retryMs ?? MINUTE, 10 * MINUTE) };
  }
  if (message.includes('404')) return { kind: 'not-found', cooldownMs: HOUR };
  if (message.includes('503') || /timed out|fetch failed|overloaded|high demand/i.test(message)) {
    return { kind: 'overloaded', cooldownMs: 45 * 1000 };
  }
  return { kind: 'other', cooldownMs: 0 };
};

export const markUnavailable = (model, message, now = Date.now()) => {
  const { kind, cooldownMs } = classifyFailure(message);
  if (cooldownMs > 0) cooldowns.set(model, { until: now + cooldownMs, kind });
  return kind;
};

export const isAvailable = (model, now = Date.now()) => {
  const entry = cooldowns.get(model);
  if (!entry) return true;
  if (entry.until <= now) {
    cooldowns.delete(model);
    return true;
  }
  return false;
};

export const availableModels = (chain, now = Date.now()) => chain.filter((m) => isAvailable(m, now));

/** Explains why nothing in the chain can be used right now. */
export const describeUnavailable = (chain, now = Date.now()) => {
  const entries = chain.map((m) => cooldowns.get(m)).filter((e) => e && e.until > now);
  if (entries.length === 0) return 'All Google Gemini models are currently overwhelmed.';
  const soonest = Math.min(...entries.map((e) => e.until)) - now;
  if (entries.every((e) => e.kind === 'daily-quota')) {
    const hours = Math.max(1, Math.round(soonest / HOUR));
    return `All Google Gemini models have hit their daily free quota. The first one resets in about ${hours} hour${hours === 1 ? '' : 's'}.`;
  }
  const mins = Math.max(1, Math.ceil(soonest / MINUTE));
  return `All Google Gemini models are busy or out of quota right now. Try again in about ${mins} minute${mins === 1 ? '' : 's'}.`;
};

export const resetModelHealth = () => cooldowns.clear();
