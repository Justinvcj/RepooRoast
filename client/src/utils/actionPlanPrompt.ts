import type { Category } from '../types';

/**
 * TypeScript port of server/src/utils/promptBuilder.js's
 * buildActionPlanPrompt, for the custom/BYOK client-side flow. Pure, no
 * secrets involved -- keep in sync with the server version.
 */
export const buildActionPlanPrompt = (categories: Category[], repoLabel: string): string => {
  const findingsSummary = categories.map(cat => {
    const issuesList = (cat.issues || [])
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .map(i => `  - [${i.severity.toUpperCase()}] ${i.title} (${i.file || 'general'}): ${i.description}`)
      .join('\n');
    return `### ${cat.name} (score: ${cat.score}/100)\n${cat.summary || ''}\n${issuesList || '  (no critical/high issues flagged)'}`;
  }).join('\n\n');

  return `
You are synthesizing the final action plan for a code review of ${repoLabel}. Below are the REAL findings already identified across all 7 review categories (Code Quality, Project Structure, Documentation, Security, Test Coverage, Performance, Scalability). Do not invent new issues -- only work from what's listed.

<review_findings>
${findingsSummary}
</review_findings>

Based strictly on the findings above, produce:
1. "topPriorities": the 3-5 MOST urgent items across ALL categories (not just one), ordered by actual impact -- pull from critical/high severity issues wherever they occurred.
2. "whatYouDidWell": the 3 best aspects of the project across ALL categories.
3. "fixPrompt": a single, highly detailed prompt a developer can paste into an AI coding assistant (Claude, Cursor, ChatGPT) to fix the critical/high issues listed above -- across every category they appeared in, not just one. Follow the CRED framework strictly: [C - Context]: the current situation and overarching goal. [R - Role]: a specific persona (e.g. "Act as a Principal Engineer"). [E - Execute]: exactly what to do, using actionable verbs, covering issues from every category that had any. [D - Details]: rules for output, formatting, and constraints (e.g. don't break existing behavior).

# CRITICAL JSON OUTPUT REQUIREMENT
Return ONLY valid JSON, no markdown fences:
{
  "topPriorities": ["...", "...", "..."],
  "whatYouDidWell": ["...", "...", "..."],
  "fixPrompt": "..."
}
`;
};
