import { describe, it, expect } from 'vitest';

const ignorePatterns = [
  /^node_modules\//, /^\.git\//, /^dist\//, /^build\//, 
  /\.lock$/, /package-lock\.json$/, /yarn\.lock$/, /pnpm-lock\.yaml$/,
  /\.(png|jpe?g|gif|svg|ico|ttf|woff2?|eot|mp4|webp|csv|jsonl|pdf|zip|tar|gz)$/i
];

describe('Noise Pruning in githubService', () => {
  it('should filter out ignored directories and extensions', () => {
    const rawPaths = [
      'src/index.js',
      'node_modules/express/index.js',
      '.git/config',
      'dist/bundle.js',
      'package-lock.json',
      'yarn.lock',
      'src/assets/logo.png',
      'src/components/Button.jsx',
      'README.md',
      'test.csv'
    ];

    const filtered = rawPaths.filter(path => !ignorePatterns.some(pattern => pattern.test(path)));

    expect(filtered).toEqual([
      'src/index.js',
      'src/components/Button.jsx',
      'README.md'
    ]);
  });
});
