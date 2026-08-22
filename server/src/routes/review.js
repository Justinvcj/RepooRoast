import express from 'express';
import { fetchRepoData, fetchDiffData } from '../services/githubService.js';
import { generateCodeReview } from '../services/geminiService.js';
import { validateRepoUrl, validateDiffComponents } from '../middleware/inputValidator.js';
import { getCachedReview, setCachedReview } from '../services/cacheService.js';

const router = express.Router();

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
  let heartbeat;
  try {
    const { repoUrl } = req.body;

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.flushHeaders();

    heartbeat = setInterval(() => {
      res.write(' ');
      res.flushHeaders();
    }, 5000); // 5 seconds instead of 10

    // 1. Fetch Repository Data (this gets the commit hash)
    const repoData = await fetchRepoData(repoUrl);
    
    // 2. Check Cache
    const latestCommitSha = repoData.commits && repoData.commits.length > 0 ? repoData.commits[0].sha : 'unknown';
    const cacheKey = `repo:${repoData.metadata.owner}/${repoData.metadata.repo}:${latestCommitSha}`;
    
    const cachedReview = getCachedReview(cacheKey);
    if (cachedReview) {
      clearInterval(heartbeat);
      console.log(`[Cache] HIT for ${cacheKey}`);
      res.write(JSON.stringify(cachedReview));
      return res.end();
    }
    console.log(`[Cache] MISS for ${cacheKey}`);

    // 3. Generate Code Review using Gemini AI
    const aiReview = await generateCodeReview(repoData);

    const finalResponse = {
      success: true,
      repo: repoData.metadata,
      analysis: repoData.staticAnalysis,
      review: aiReview
    };
    
    setCachedReview(cacheKey, finalResponse);

    clearInterval(heartbeat);
    res.write(JSON.stringify(finalResponse));
    return res.end();

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    res.write('{"trace": "Error Caught: ' + error.message + '"}\n');
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
  let heartbeat;
  try {
    const { owner, repo, pullNumber, compareString } = req.body;

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.flushHeaders();

    heartbeat = setInterval(() => {
      res.write(' ');
      res.flushHeaders();
    }, 10000);

    const diffData = await fetchDiffData(owner, repo, pullNumber, compareString);
    
    // Check Cache
    const headRef = diffData.diffTitle.includes('Comparison') ? compareString : (pullNumber || 'unknown');
    const cacheKey = `diff:${owner}/${repo}:${headRef}`;
    
    const cachedReview = getCachedReview(cacheKey);
    if (cachedReview) {
      clearInterval(heartbeat);
      console.log(`[Cache] HIT for ${cacheKey}`);
      res.write(JSON.stringify(cachedReview));
      return res.end();
    }
    console.log(`[Cache] MISS for ${cacheKey}`);

    const aiReview = await generateCodeReview(diffData);

    const finalResponse = {
      success: true,
      repo: diffData.metadata,
      review: aiReview
    };
    
    setCachedReview(cacheKey, finalResponse);

    clearInterval(heartbeat);
    res.write(JSON.stringify(finalResponse));
    return res.end();

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    next(error);
  }
});

export default router;
