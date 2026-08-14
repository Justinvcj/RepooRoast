import { describe, it, expect } from 'vitest';
import { fetchRepoData } from '../src/services/githubService.js';
import { runStaticAnalysis } from '../src/analyzers/staticAnalyzer.js';

describe('Real Integration Test - GitHub to AST Pipeline', () => {
  // Increase timeout for live network request
  it('should fetch a real public repository and correctly parse its AST', async () => {
    const testRepoUrl = 'https://github.com/Justinvcj/RepooRoast';
    
    try {
      // 1. Fetch live data
      const repoData = await fetchRepoData(testRepoUrl);
      
      // Assert fetch success
      expect(repoData).toBeDefined();
      expect(repoData.metadata).toBeDefined();
      expect(repoData.metadata.fullName).toContain('RepooRoast');
      expect(Array.isArray(repoData.tree)).toBe(true);
      expect(repoData.tree.length).toBeGreaterThan(0);
      
      // Assert we downloaded actual files
      const fileKeys = Object.keys(repoData.selectedFiles);
      expect(fileKeys.length).toBeGreaterThan(0);
      expect(repoData.selectedFiles[fileKeys[0]]).toBeDefined();
      
      // 2. Run AST Parser
      const analysis = await runStaticAnalysis(repoData.selectedFiles, repoData.tree);
      
      // Assert analysis success
      expect(analysis).toBeDefined();
      expect(analysis.repoMetrics).toBeDefined();
      expect(analysis.repoMetrics.totalFiles).toBeGreaterThan(0);
      expect(analysis.repoMetrics.totalLOC).toBeGreaterThan(0);
      
      // Check dependency graph
      expect(analysis.dependencyGraph).toBeDefined();
      expect(Array.isArray(analysis.dependencyGraph.metrics.hubs)).toBe(true);
      
      // Check file analyses
      expect(Array.isArray(analysis.fileAnalyses)).toBe(true);
      if (analysis.fileAnalyses.length > 0) {
        expect(analysis.fileAnalyses[0].path).toBeDefined();
        expect(Array.isArray(analysis.fileAnalyses[0].functions)).toBe(true);
      }
    } catch (error) {
      if (error.message.includes('rate limit exceeded')) {
        console.warn('Skipping integration test assertions due to GitHub API rate limit.');
        expect(true).toBe(true);
      } else {
        throw error;
      }
    }
  }, 30000); 
});
