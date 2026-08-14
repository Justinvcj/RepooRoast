import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default', 'html'],
    outputFile: './test-reports/index.html',
    testTimeout: 30000, // 30 seconds for integration tests
  },
});
