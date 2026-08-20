import express from 'express';
import { fetchRepoData, fetchDiffData } from '../services/githubService.js';
import { generateCodeReview } from '../services/geminiService.js';
import { validateRepoUrl, validateDiffComponents } from '../middleware/inputValidator.js';

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

    // Send headers immediately and keep connection alive
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.flushHeaders();

    heartbeat = setInterval(() => {
      res.write(' ');
      res.flushHeaders();
    }, 10000);

    // 1. Fetch Repository Data
    const repoData = await fetchRepoData(repoUrl);

    // 2. Generate Code Review using Gemini AI
    const aiReview = await generateCodeReview(repoData);

    clearInterval(heartbeat);

    // 3. Return the successful response
    res.write(JSON.stringify({
      success: true,
      repo: repoData.metadata,
      analysis: repoData.staticAnalysis,
      review: aiReview
    }));
    return res.end();

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
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
    const aiReview = await generateCodeReview(diffData);

    clearInterval(heartbeat);

    res.write(JSON.stringify({
      success: true,
      repo: diffData.metadata,
      review: aiReview
    }));
    return res.end();

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    next(error);
  }
});

export default router;
