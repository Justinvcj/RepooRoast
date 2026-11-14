import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Google SDK so we control exactly what generateContent does,
// without making real network calls. `new X()` requires a real class/function,
// not an arrow function -- vi.fn().mockImplementation(() => ({})) silently
// fails that requirement.
const generateContentMock = vi.fn();
class MockGoogleGenerativeAI {
  getGenerativeModel() {
    return { generateContent: generateContentMock };
  }
}
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: MockGoogleGenerativeAI
}));

const baseRepoData = {
  tree: ['package.json', 'src/index.js', 'README.md'],
  selectedFiles: {},
  readme: null,
  staticAnalysis: null
};

describe('classifierService', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    generateContentMock.mockReset();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    vi.useRealTimers();
  });

  it('returns unknown immediately with no API key, making no network call', async () => {
    delete process.env.GEMINI_API_KEY;
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    const result = await classifyRepoContext(baseRepoData);

    expect(result).toEqual({ type: 'unknown', confidence: 1.0, signals: ['No API Key'] });
    expect(generateContentMock).not.toHaveBeenCalled();
  });

  it('returns the parsed classification on a successful response', async () => {
    generateContentMock.mockResolvedValue({
      response: { text: () => JSON.stringify({ type: 'library', confidence: 0.9, signals: ['has package.json main field'], secondary_type: null }) }
    });
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    const result = await classifyRepoContext(baseRepoData);

    expect(result.type).toBe('library');
    expect(result.confidence).toBe(0.9);
  });

  it('does not crash on a tree of plain path strings (the past f.path bug)', async () => {
    generateContentMock.mockResolvedValue({
      response: { text: () => JSON.stringify({ type: 'cli_tool', confidence: 0.7, signals: [] }) }
    });
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    // repoData.tree is always string[] in production (see githubService.js) --
    // this would throw "Cannot read properties of undefined (reading 'split')"
    // if extractClassifierContext ever regresses to treating entries as
    // {path} objects again.
    const result = await classifyRepoContext({ ...baseRepoData, tree: ['a/b/c.js', '.github/workflows/ci.yml'] });

    expect(result.type).toBe('cli_tool');
  });

  it('falls back to unknown (without throwing) when the model errors', async () => {
    generateContentMock.mockRejectedValue(new Error('503 overloaded'));
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    const result = await classifyRepoContext(baseRepoData);

    expect(result.type).toBe('unknown');
    expect(result.confidence).toBe(0);
    expect(result.signals[0]).toContain('503 overloaded');
  });

  it('falls back to unknown when the model returns unparsable JSON', async () => {
    generateContentMock.mockResolvedValue({ response: { text: () => 'not json at all' } });
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    const result = await classifyRepoContext(baseRepoData);

    expect(result.type).toBe('unknown');
  });

  it('times out and falls back to unknown instead of hanging forever', async () => {
    vi.useFakeTimers();
    // A promise that never resolves -- simulates a hung/overloaded model call.
    generateContentMock.mockReturnValue(new Promise(() => {}));
    const { classifyRepoContext } = await import('../src/services/classifierService.js');

    const resultPromise = classifyRepoContext(baseRepoData);
    await vi.advanceTimersByTimeAsync(12001);
    const result = await resultPromise;

    expect(result.type).toBe('unknown');
    expect(result.signals[0]).toContain('Classifier timed out');
  });
});
