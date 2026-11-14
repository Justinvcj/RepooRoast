import express from 'express';
import { fetchRepoData, fetchDiffData } from '../services/githubService.js';
import { generateCodeReview, prepareCustomReview } from '../services/geminiService.js';
import { validateRepoUrl, validateDiffComponents } from '../middleware/inputValidator.js';
import { getCachedReview, setCachedReview } from '../services/cacheService.js';

const router = express.Router();

/**
 * Sets up a real-progress reporter for a streamed response.
 * Emits newline-delimited JSON progress events the client can parse, and
 * re-emits the last known stage periodically so the same write also serves
 * as a keepalive heartbeat (avoids sending meaningless blank bytes that
 * would otherwise have to be filtered out of the NDJSON stream).
 */
const createProgressReporter = (res, heartbeatMs) => {
  let currentStage = 'starting';

  const sendProgress = (stage) => {
    currentStage = stage;
    try {
      res.write(JSON.stringify({ type: 'progress', stage }) + '\n');
      res.flushHeaders();
    } catch (e) {
      // Response may already be closing; nothing to do.
    }
  };

  const heartbeat = setInterval(() => sendProgress(currentStage), heartbeatMs);

  return { sendProgress, stop: () => clearInterval(heartbeat) };
};

/**
 * POST /api/review
 * Initiates a code review for a given GitHub repository URL.
 *
 * Request Body:
 * {
 *   "repoUrl": "https://github.com/owner/repo"
 * }
 */
router.post('/', validateRepoUrl, async (req, res, next) => {
  let progress;
  try {
    const { repoUrl } = req.body;

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.flushHeaders();

    progress = createProgressReporter(res, 8000);
    progress.sendProgress('fetching');

    // 1. Fetch Repository Data (this gets the commit hash)
    const repoData = await fetchRepoData(repoUrl);

    // 2. Check Cache
    const latestCommitSha = repoData.commits && repoData.commits.length > 0 ? repoData.commits[0].sha : 'unknown';
    const cacheKey = `repo:${repoData.metadata.owner}/${repoData.metadata.repo}:${latestCommitSha}`;

    const cachedReview = getCachedReview(cacheKey);
    if (cachedReview) {
      progress.sendProgress('cache_hit');
      progress.stop();
      console.log(`[Cache] HIT for ${cacheKey}`);
      res.write(JSON.stringify(cachedReview));
      return res.end();
    }
    console.log(`[Cache] MISS for ${cacheKey}`);

    progress.sendProgress('analyzing');

    // 3. Generate Code Review using Gemini AI
    const aiReview = await generateCodeReview(repoData, progress.sendProgress);

    const finalResponse = {
      success: true,
      repo: repoData.metadata,
      analysis: repoData.staticAnalysis,
      review: aiReview
    };

    setCachedReview(cacheKey, finalResponse);

    progress.stop();
    res.write(JSON.stringify(finalResponse));
    return res.end();

  } catch (error) {
    if (progress) progress.stop();
    next(error);
  }
});

/**
 * POST /api/review/diff
 * Initiates a code review for a specific PR or diff comparison.
 *
 * Request Body:
 * {
 *   "owner": "string",
 *   "repo": "string",
 *   "pullNumber": "string?",
 *   "compareString": "string?"
 * }
 */
router.post('/diff', validateDiffComponents, async (req, res, next) => {
  let progress;
  try {
    const { owner, repo, pullNumber, compareString } = req.body;

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.flushHeaders();

    progress = createProgressReporter(res, 10000);
    progress.sendProgress('fetching');

    const diffData = await fetchDiffData(owner, repo, pullNumber, compareString);

    // Check Cache. Derive the key from which parameter the request actually
    // supplied plus the resolved head commit SHA, never from inferring it
    // off the PR title text -- a PR titled to merely contain the word
    // "Comparison" used to collapse onto `compareString` (undefined in the
    // PR-number path), producing an identical cache key for otherwise-
    // unrelated PRs on the same repo and serving one PR's cached review for
    // another's request. Including the head SHA also means pushing new
    // commits to a PR correctly invalidates the cache instead of silently
    // serving a stale review for the old commit forever.
    const refKey = diffData.headRef || (pullNumber ? `pr:${pullNumber}` : `cmp:${compareString}`);
    const cacheKey = `diff:${owner}/${repo}:${refKey}`;

    const cachedReview = getCachedReview(cacheKey);
    if (cachedReview) {
      progress.sendProgress('cache_hit');
      progress.stop();
      console.log(`[Cache] HIT for ${cacheKey}`);
      res.write(JSON.stringify(cachedReview));
      return res.end();
    }
    console.log(`[Cache] MISS for ${cacheKey}`);

    progress.sendProgress('analyzing');

    const aiReview = await generateCodeReview(diffData, progress.sendProgress);

    const finalResponse = {
      success: true,
      repo: diffData.metadata,
      review: aiReview
    };

    setCachedReview(cacheKey, finalResponse);

    progress.stop();
    res.write(JSON.stringify(finalResponse));
    return res.end();

  } catch (error) {
    if (progress) progress.stop();
    next(error);
  }
});

/**
 * POST /api/review/prepare
 * Custom/BYOK mode, step 1: runs everything that doesn't need an AI review
 * key (GitHub fetch, local static analysis, classification using this
 * server's own shared key) and returns the exact prompts the server would
 * have used, so the client can fire the actual review calls directly to
 * their chosen provider with their own key. This server never receives
 * that key and never sees the resulting AI response.
 *
 * Request Body: { "repoUrl": "https://github.com/owner/repo" }
 */
router.post('/prepare', validateRepoUrl, async (req, res, next) => {
  try {
    const { repoUrl } = req.body;
    const repoData = await fetchRepoData(repoUrl);
    const prepared = await prepareCustomReview(repoData);
    return res.status(200).json({ success: true, ...prepared });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/review/diff/prepare
 * Same as /prepare, but for a PR or compare diff.
 *
 * Request Body: { "owner": "string", "repo": "string", "pullNumber": "string?", "compareString": "string?" }
 */
router.post('/diff/prepare', validateDiffComponents, async (req, res, next) => {
  try {
    const { owner, repo, pullNumber, compareString } = req.body;
    const diffData = await fetchDiffData(owner, repo, pullNumber, compareString);
    const prepared = await prepareCustomReview(diffData);
    return res.status(200).json({ success: true, ...prepared });
  } catch (error) {
    next(error);
  }
});

export default router;
