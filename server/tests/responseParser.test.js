import { describe, it, expect } from 'vitest';
import { parseGeminiResponse } from '../src/utils/responseParser.js';

describe('Response Parser & Zod Validation', () => {
  it('should successfully parse a valid JSON response matching the schema', () => {
    const validJson = {
      overallScore: 85,
      overallVerdict: "Looks good.",
      seniorDevQuote: "Ship it.",
      categories: [
        { name: "Code Quality", score: 90, emoji: "🧹", summary: "Good", issues: [], positives: [] },
        { name: "Project Structure", score: 90, emoji: "🏗️", summary: "Good", issues: [], positives: [] },
        { name: "Documentation", score: 90, emoji: "📝", summary: "Good", issues: [], positives: [] },
        { name: "Security", score: 90, emoji: "🔒", summary: "Good", issues: [], positives: [] },
        { name: "Test Coverage", score: 90, emoji: "🧪", summary: "Good", issues: [], positives: [] },
        { name: "Performance", score: 90, emoji: "⚡", summary: "Good", issues: [], positives: [] },
        { name: "Scalability", score: 90, emoji: "📈", summary: "Good", issues: [], positives: [] }
      ],
      topPriorities: ["None"],
      whatYouDidWell: ["Everything"],
      hiringVerdict: "Hired",
      fixPrompt: "Prompt"
    };

    const result = parseGeminiResponse(`\`\`\`json\n${JSON.stringify(validJson)}\n\`\`\``);
    expect(result.overallScore).toBe(85);
    expect(result.categories.length).toBe(7);
  });

  it('should not throw for partial JSON responses (due to parallel chunks)', () => {
    // Missing some categories and top priorities
    const partialJson = {
      overallScore: 50,
      overallVerdict: "Missing stuff.",
      seniorDevQuote: "Oof.",
      categories: [
        { name: "Code Quality", score: 50, emoji: "dY 1", summary: "Bad", issues: [], positives: [] }
      ]
    };

    const result = parseGeminiResponse(JSON.stringify(partialJson));
    expect(result.overallScore).toBe(50);
  });

  it('should throw if JSON is entirely unparseable', () => {
    const unparseable = "This is just text, not JSON at all.";
    
    expect(() => parseGeminiResponse(unparseable)).toThrow(/Failed to parse AI response into JSON/);
  });
});
