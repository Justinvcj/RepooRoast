import { GoogleGenerativeAI } from '@google/generative-ai';

const CLASSIFIER_PROMPT = `
[SYSTEM]
You are a repository classifier. Your only job is to determine what TYPE of software project a repository is, based on structural signals. You do not review code quality. Output strict JSON only, no prose, no markdown fences.

[USER]
Classify this repository using the evidence below.

FILE TREE (top 3 levels):
{{file_tree}}

PACKAGE.JSON (if present):
{{package_json_contents}}

README (first 2000 chars, if present):
{{readme_excerpt}}

LOC: {{total_loc}}
FILE COUNT: {{total_files}}
HAS TEST DIRECTORY: {{has_tests}}
HAS CI/CD WORKFLOWS: {{has_ci}}

Classify into exactly one of these types:
- "personal_portfolio": personal site, resume site, "about me" page, project showcase
- "library": published package meant for others to import/depend on
- "cli_tool": command-line utility
- "production_service": backend API, SaaS product, service with real users/data
- "prototype": experimental/hackathon/proof-of-concept, not intended for reuse
- "learning_project": tutorial-following or coursework repo
- "unknown": insufficient signal to classify confidently

Output JSON exactly in this shape:
{
  "type": "<one of the above>",
  "confidence": 0.0 to 1.0,
  "signals": ["<short evidence string>", "<short evidence string>"],
  "secondary_type": "<optional second-best guess, or null>"
}

Rules:
- If confidence < 0.5, set type to "unknown" and secondary_type to your best guess.
- "signals" should list the 2-4 concrete pieces of evidence that drove the decision (e.g. "package.json has 'private: true' and no 'main' field").
- Do not guess based on repo name alone — use structural evidence.
`;

const extractClassifierContext = (repoData) => {
  // repoData.tree is a flat array of path strings (see githubService.js's
  // allFilePaths/changedFiles), not {path, type} objects -- treating entries
  // as objects here threw on every call (`f.path` was undefined), silently
  // falling back to "unknown" classification for every single review.
  const treeFiles = repoData.tree || [];
  const topTree = treeFiles.filter(p => p.split('/').length <= 3).slice(0, 100);
  
  let packageJson = "Not found";
  if (repoData.selectedFiles && repoData.selectedFiles['package.json']) {
    packageJson = repoData.selectedFiles['package.json'].substring(0, 1500);
  }

  let readme = "Not found";
  if (repoData.readme) {
    readme = repoData.readme.substring(0, 2000);
  }

  let totalLoc = 0;
  let totalFiles = treeFiles.length;
  if (repoData.staticAnalysis && repoData.staticAnalysis.repoMetrics) {
    totalLoc = repoData.staticAnalysis.repoMetrics.totalLOC;
    totalFiles = repoData.staticAnalysis.repoMetrics.totalFiles;
  }

  const hasTests = treeFiles.some(p => p.toLowerCase().includes('test') || p.toLowerCase().includes('spec'));
  const hasCi = treeFiles.some(p => p.startsWith('.github/workflows') || p.includes('.gitlab-ci.yml') || p.includes('circleci'));

  return CLASSIFIER_PROMPT
    .replace('{{file_tree}}', topTree.join('\n'))
    .replace('{{package_json_contents}}', packageJson)
    .replace('{{readme_excerpt}}', readme)
    .replace('{{total_loc}}', totalLoc)
    .replace('{{total_files}}', totalFiles)
    .replace('{{has_tests}}', hasTests)
    .replace('{{has_ci}}', hasCi);
};

const CLASSIFIER_TIMEOUT_MS = 12000;

export const classifyRepoContext = async (repoData) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { type: 'unknown', confidence: 1.0, signals: ['No API Key'] };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    const prompt = extractClassifierContext(repoData);
    console.log('[Classifier] Running repo classification...');

    // Unlike the 3 main review calls, this has no model fallback. Without a
    // timeout, a slow/overloaded classifier model blocks the ENTIRE review
    // pipeline indefinitely -- it's awaited alongside static analysis before
    // any of the real review calls can fire, even though static analysis
    // itself finishes in milliseconds. Cap it and fall back to 'unknown'
    // rather than let one slow call stall everything downstream.
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Classifier timed out')), CLASSIFIER_TIMEOUT_MS))
    ]);

    let parsed = JSON.parse(result.response.text().trim());
    console.log(`[Classifier] Result: ${parsed.type} (Confidence: ${parsed.confidence})`);
    return parsed;
  } catch (err) {
    console.error('[Classifier Error]', err.message);
    return {
      type: 'unknown',
      confidence: 0,
      signals: ['Classification failed: ' + err.message],
      secondary_type: null
    };
  }
};
