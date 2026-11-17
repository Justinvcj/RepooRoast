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

// The diff endpoints interpolate these values into GitHub API paths that are
// requested with the server's token. Anything containing "/" or ".." segments
// could redirect that request to a different GitHub endpoint (for example
// another repository the token can read), so they must be strictly shaped.
const NAME = /^[A-Za-z0-9_.-]{1,100}$/;
const SEGMENT = /^[A-Za-z0-9_.-]+$/;
const PULL_NUMBER = /^\d{1,9}$/;

const isSafeName = (value) => NAME.test(value) && value !== '.' && value !== '..';
const isSafeRef = (value) =>
  value.length > 0 && value.length <= 250 && value.split('/').every((seg) => SEGMENT.test(seg) && seg !== '.' && seg !== '..');
const isSafeCompare = (value) => {
  const parts = value.split(/\.{2,3}/);
  return parts.length === 2 && parts.every(isSafeRef);
};

export const validateDiffComponents = (req, res, next) => {
  const { owner, repo, pullNumber, compareString } = req.body;

  if (!owner || typeof owner !== 'string' || !repo || typeof repo !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Repository owner and name are required.',
      code: 'INPUT_MISSING'
    });
  }

  if (!pullNumber && !compareString) {
    return res.status(400).json({
      success: false,
      error: 'Either a pullNumber or compareString is required for a diff review.',
      code: 'INPUT_MISSING'
    });
  }

  // Ensure they are strings if present
  if ((pullNumber && typeof pullNumber !== 'string') || (compareString && typeof compareString !== 'string')) {
    return res.status(400).json({
      success: false,
      error: 'pullNumber and compareString must be strings.',
      code: 'INPUT_INVALID'
    });
  }

  // Sanitize
  req.body.owner = owner.trim();
  req.body.repo = repo.trim();
  if (pullNumber) req.body.pullNumber = pullNumber.trim();
  if (compareString) req.body.compareString = compareString.trim();

  const bad =
    !isSafeName(req.body.owner) ||
    !isSafeName(req.body.repo) ||
    (pullNumber && !PULL_NUMBER.test(req.body.pullNumber)) ||
    (compareString && !isSafeCompare(req.body.compareString));
  if (bad) {
    return res.status(400).json({
      success: false,
      error: 'Invalid owner, repository, pull request number or compare range.',
      code: 'INPUT_INVALID'
    });
  }

  next();
};
