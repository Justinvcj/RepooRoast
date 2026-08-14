const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;
const GITHUB_PR_REGEX = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+(\/)?$/;
const GITHUB_COMPARE_REGEX = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/compare\/[\w.\-\/]+\.{2,3}[\w.\-\/]+(\/)?$/;
const GITHUB_COMMIT_REGEX = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/commit\/[a-f0-9]+(\/)?$/;

export const validateRepoUrl = (req, res, next) => {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'GitHub repository URL is required.',
      code: 'INPUT_MISSING'
    });
  }

  const trimmed = repoUrl.trim();

  if (!GITHUB_REPO_REGEX.test(trimmed)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GitHub repository URL format. Expected: https://github.com/owner/repo',
      code: 'INPUT_INVALID'
    });
  }

  req.body.repoUrl = trimmed;
  next();
};

export const validateDiffUrl = (req, res, next) => {
  const { diffUrl } = req.body;

  if (!diffUrl || typeof diffUrl !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'A GitHub PR, compare, or commit URL is required.',
      code: 'INPUT_MISSING'
    });
  }

  const trimmed = diffUrl.trim();
  const isValid = GITHUB_PR_REGEX.test(trimmed)
    || GITHUB_COMPARE_REGEX.test(trimmed)
    || GITHUB_COMMIT_REGEX.test(trimmed);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL. Expected a GitHub PR, compare, or commit URL.',
      code: 'INPUT_INVALID'
    });
  }

  req.body.diffUrl = trimmed;
  next();
};
