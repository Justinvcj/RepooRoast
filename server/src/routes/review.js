import express from 'express';
import { fetchRepoData } from '../services/githubService.js';
import { generateCodeReview } from '../services/geminiService.js';
import { validateRepoUrl } from '../middleware/inputValidator.js';

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
  try {
    const { repoUrl } = req.body;

    // 1. Fetch Repository Data
    // console.log(`[Review Route] Fetching repository data for: ${repoUrl}`);
    const repoData = await fetchRepoData(repoUrl);

    // 2. Generate Code Review using Gemini AI
    // console.log(`[Review Route] Generating AI review for: ${repoData.metadata.fullName}`);
    const aiReview = await generateCodeReview(repoData);

    // 3. Return the successful response
    return res.status(200).json({
      success: true,
      repo: repoData.metadata,
      review: aiReview
    });

  } catch (error) {
    // Pass any caught errors to the global error handler
    next(error);
  }
});

export default router;
