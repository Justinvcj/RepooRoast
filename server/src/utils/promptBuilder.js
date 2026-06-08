/**
 * Builds the comprehensive prompt for the Gemini AI model based on extracted GitHub data.
 * @param {Object} repoData - The structured data from the GitHub repository.
 * @returns {string} The final prompt string.
 */
const buildReviewPrompt = (repoData) => {
  const { metadata, languages, commits, readme, tree, selectedFiles } = repoData;

  // Format basic metadata
  const metadataDesc = `
# Repository Information
- Name: ${metadata.fullName}
- Description: ${metadata.description || 'No description provided.'}
- Default Branch: ${metadata.defaultBranch}
- Stars: ${metadata.stars}
- Forks: ${metadata.forks}
- Last Updated: ${metadata.updatedAt}
`;

  // Format languages
  const languageNames = Object.keys(languages);
  const languagesDesc = languageNames.length > 0 
    ? `- Languages: ${languageNames.join(', ')}`
    : '- Languages: Unknown';

  // Format recent commits
  const commitsDesc = `
# Recent Commits (Last 5)
${commits.map(c => `- [${new Date(c.date).toISOString().split('T')[0]}] ${c.author}: ${c.message}`).join('\n')}
`;

  // Format Directory Tree (limit to a reasonable number to avoid token explosion)
  const MAX_TREE_DISPLAY = 150;
  const treePreview = tree.slice(0, MAX_TREE_DISPLAY).join('\n');
  const treeWarning = tree.length > MAX_TREE_DISPLAY ? `\n... (and ${tree.length - MAX_TREE_DISPLAY} more files not shown)` : '';
  const treeDesc = `
# Directory Tree Structure
${treePreview}${treeWarning}
`;

  // Format README
  const readmeDesc = `
# README Content
${readme ? readme.substring(0, 3000) + (readme.length > 3000 ? '\n...[README truncated]' : '') : 'No README found.'}
`;

  // Format selected file contents
  let filesContentDesc = `\n# Examined Source Files\n`;
  for (const [path, content] of Object.entries(selectedFiles)) {
    // Truncate individual file contents to save tokens (approx 2000 chars per file max)
    const truncatedContent = content.length > 2000 ? content.substring(0, 2000) + '\n...[Content truncated]' : content;
    filesContentDesc += `\n--- FILE: ${path} ---\n\`\`\`\n${truncatedContent}\n\`\`\`\n`;
  }

  // Construct the JSON schema requirement
  const schemaRequirement = `
# CRITICAL JSON OUPUT REQUIREMENT
You MUST return ONLY valid JSON matching this exact structure. Do not include any markdown formatting (like \`\`\`json), do not include any conversational text before or after the JSON.

{
  "overallScore": 0-100,
  "overallVerdict": "A short, brutal 1-2 sentence summary of the codebase.",
  "seniorDevQuote": "A witty, slightly cynical quote from a stereotypical senior dev reviewing this PR.",
  "categories": [
    {
      "name": "Code Quality",
      "score": 0-100,
      "emoji": "🧹",
      "summary": "1-2 sentences summarizing code quality.",
      "issues": [
        {
          "severity": "critical|high|medium|low",
          "title": "Short title of the issue",
          "description": "Why it's a problem",
          "file": "File path if known, else general",
          "suggestion": "How to fix it"
        }
      ],
      "positives": ["Good thing 1", "Good thing 2"]
    },
    { "name": "Project Structure", "score": 0-100, "emoji": "🏗️", "summary": "...", "issues": [...], "positives": [...] },
    { "name": "Documentation", "score": 0-100, "emoji": "📝", "summary": "...", "issues": [...], "positives": [...] },
    { "name": "Security", "score": 0-100, "emoji": "🔒", "summary": "...", "issues": [...], "positives": [...] },
    { "name": "Test Coverage", "score": 0-100, "emoji": "🧪", "summary": "...", "issues": [...], "positives": [...] },
    { "name": "Performance", "score": 0-100, "emoji": "⚡", "summary": "...", "issues": [...], "positives": [...] },
    { "name": "Scalability", "score": 0-100, "emoji": "📈", "summary": "...", "issues": [...], "positives": [...] }
  ],
  "topPriorities": [
    "Most urgent thing to fix 1",
    "Most urgent thing to fix 2",
    "Most urgent thing to fix 3"
  ],
  "whatYouDidWell": [
    "Best aspect 1",
    "Best aspect 2",
    "Best aspect 3"
  ],
  "hiringVerdict": "A short sentence on whether you would hire the person who wrote this.",
  "fixPrompt": "A single, highly detailed prompt that the developer can copy and paste into an AI coding assistant to automatically fix all the critical issues you identified in this repo. You MUST write this prompt strictly following the CRED framework: [C - Context]: Explain the current situation and the overarching goal. [R - Role]: Assign a specific persona to the AI (e.g., 'Act as a Principal Engineer'). [E - Execute]: Clearly state exactly what the AI needs to do to fix the repo using actionable verbs. [D - Details]: Provide rules for the output, formatting, and constraints. Format this as a single beautifully formatted string with line breaks and bullet points so it is easy to read."
}

CRITICAL RULE: The categories array MUST have exactly these 7 objects with these exact names: "Code Quality", "Project Structure", "Documentation", "Security", "Test Coverage", "Performance", "Scalability". Ensure the JSON is well-formed.
`;

  // Define the system instructions for the AI persona
  const SYSTEM_INSTRUCTION = "You are a highly objective Technical Auditor. You must apply a consistent grading rubric. You are a brilliant but slightly sarcastic senior software engineer. Your goal is to tell the absolute truth about the codebase and provide extremely helpful, constructive feedback, but you should roast the code just enough to make the developers giggle without getting irritated. You are witty, direct, and insightful. You ALWAYS respond with valid JSON only.";

  // Combine everything into the final prompt
  const finalPrompt = `
${SYSTEM_INSTRUCTION}

You are analyzing a GitHub repository to perform a deep, comprehensive code review. Here is the raw data extracted from the repository:

${metadataDesc}
${languagesDesc}
${commitsDesc}
${treeDesc}
${readmeDesc}
${filesContentDesc}

Based on this raw data, evaluate the codebase and provide your brutally honest senior-level feedback.

${schemaRequirement}
  `;

  return finalPrompt;
};

export {
  buildReviewPrompt
};
