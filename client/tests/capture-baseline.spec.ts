import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BEFORE_DIR = path.resolve(__dirname, '../design/before');

// Ensure output directory exists
if (!fs.existsSync(BEFORE_DIR)) {
  fs.mkdirSync(BEFORE_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '375', label: '375px', width: 375, height: 812 },
  { name: '768', label: '768px', width: 768, height: 1024 },
  { name: '1440', label: '1440px', width: 1440, height: 900 },
];

const MOCK_REVIEW_DATA = {
  success: true,
  repo: {
    owner: 'facebook',
    repo: 'react',
    fullName: 'facebook/react',
    description: 'The library for web and native user interfaces.',
    defaultBranch: 'main',
    stars: 228000,
    forks: 46000,
    updatedAt: '2026-11-17T00:00:00Z',
    language: 'JavaScript',
  },
  review: {
    overallScore: 42,
    overallVerdict: 'A tangled web of hooks and legacy reconcilers that somehow runs half the internet.',
    seniorDevQuote: 'Looks like someone read clean code, disagreed with everything in it, and wrote a framework anyway.',
    hiringVerdict: 'Would hire for junior position, under strict supervision.',
    topPriorities: [
      'Decouple fiber reconciler from legacy scheduler',
      'Eliminate silent memory leaks in hook closure cycles',
      'Standardize error handling across concurrent render loops',
    ],
    whatYouDidWell: [
      'Comprehensive test coverage across core packages',
      'Disciplined semantic versioning policy',
      'Detailed documentation and architectural RFCs',
    ],
    fixPrompt: 'Refactor React reconciliation cycle to adhere to CRED standards and remove circular dependencies.',
    categories: [
      {
        name: 'Architecture',
        score: 45,
        emoji: '🏗️',
        summary: 'Excessive coupling between reconciler and renderer with complex state lifecycles.',
        issues: [
          {
            severity: 'critical',
            title: 'Circular dependency between fiber and scheduler',
            description: 'Cyclic imports cause unpredictable initialization order bugs.',
            file: 'packages/react-reconciler/src/ReactFiber.js',
            suggestion: 'Extract shared scheduling interface.',
          },
          {
            severity: 'high',
            title: 'Leaky reconciliation abstraction',
            description: 'Fiber nodes directly inspect renderer-specific internal host objects.',
            file: 'packages/react-reconciler/src/ReactFiberCompleteWork.js',
            suggestion: 'Enforce renderer capability boundaries via contract.',
          },
        ],
        positives: ['Well-isolated DOM renderer package', 'Explicit boundary between reconciler and native targets'],
      },
      {
        name: 'Code Quality',
        score: 55,
        emoji: '🧹',
        summary: 'Inconsistent naming conventions and dense nested ternary expressions.',
        issues: [
          {
            severity: 'warning',
            title: 'Dense nested ternaries in render root',
            description: 'Readability impaired by 5-level nested conditionals in work loop.',
            file: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
            suggestion: 'Decompose into explicit guard clauses.',
          },
        ],
        positives: ['Strict TypeScript type definitions throughout modern packages'],
      },
      {
        name: 'Security',
        score: 85,
        emoji: '🔒',
        summary: 'Good input sanitization and XSS protection routines.',
        issues: [],
        positives: ['No hardcoded secrets or vulnerable regexes detected', 'Strict CSP compliant runtime'],
      },
      {
        name: 'Testing',
        score: 78,
        emoji: '🧪',
        summary: 'High test coverage with good regression test fixtures.',
        issues: [],
        positives: ['Extensive integration tests with simulated concurrent rendering'],
      },
      {
        name: 'Performance',
        score: 62,
        emoji: '⚡',
        summary: 'Frequent re-renders in unmemoized component trees.',
        issues: [
          {
            severity: 'medium',
            title: 'Unnecessary closure allocation in render path',
            description: 'Anonymous callbacks created on each commit cycle.',
            file: 'packages/react-dom/src/events/DOMPluginEventSystem.js',
            suggestion: 'Hoist event handler references.',
          },
        ],
        positives: ['Selective hydration reduces initial main thread blocking'],
      },
    ],
  },
  analysis: {
    repoMetrics: {
      totalFiles: 1420,
      totalLOC: 285400,
      commentLOC: 42300,
      commentToCodeRatio: 0.17,
      totalFunctions: 12450,
      todoCount: 87,
    },
    dependencyGraph: {
      metrics: {
        hubs: ['src/index.js', 'src/reconciler.js', 'src/scheduler.js'],
        orphans: ['src/legacy/v15Compat.js', 'src/testUtils/deprecatedMocks.js'],
        circularPaths: [],
      },
    },
    fileAnalyses: [],
  },
};

// Helper to save screenshot with standard and alias filenames
async function captureAndSave(
  page: import('@playwright/test').Page,
  screenName: string,
  viewport: { name: string; label: string; width: number; height: number },
  fullPage: boolean = false
) {
  const filePx = path.join(BEFORE_DIR, `${screenName}-${viewport.label}.png`);
  const fileNoPx = path.join(BEFORE_DIR, `${screenName}-${viewport.name}.png`);

  await page.screenshot({ path: filePx, fullPage });
  fs.copyFileSync(filePx, fileNoPx);

  // If screenName is not_found, also create 404 aliases
  if (screenName === 'not_found') {
    fs.copyFileSync(filePx, path.join(BEFORE_DIR, `404-${viewport.label}.png`));
    fs.copyFileSync(filePx, path.join(BEFORE_DIR, `404-${viewport.name}.png`));
  }
}

test.describe('Baseline Screenshots Capture (Phase 0)', () => {
  for (const vp of VIEWPORTS) {
    test(`capture baseline splash (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Splash is active immediately on load (2.2s timer)
      const splash = page.locator('.fixed.inset-0.z-\\[1000\\]');
      await expect(splash).toBeVisible();
      await captureAndSave(page, 'splash', vp, false);
    });

    test(`capture baseline home (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Wait for splash to unmount
      await expect(page.locator('.fixed.inset-0.z-\\[1000\\]')).toHaveCount(0, { timeout: 10000 });
      await expect(page.getByText('Roast your codebase.')).toBeVisible();

      // Small pause for any animations to settle
      await page.waitForTimeout(500);
      await captureAndSave(page, 'home', vp, true);
    });

    test(`capture baseline custom_modal (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      await expect(page.locator('.fixed.inset-0.z-\\[1000\\]')).toHaveCount(0, { timeout: 10000 });
      await expect(page.getByRole('button', { name: /use your own api key/i })).toBeVisible();

      await page.getByRole('button', { name: /use your own api key/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      await page.waitForTimeout(400);
      await captureAndSave(page, 'custom_modal', vp, false);
    });

    test(`capture baseline loading (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      await page.route('**/api/review', async () => {
        // Keep pending so loading screen stays visible
        await new Promise((resolve) => setTimeout(resolve, 30000));
      });

      await page.goto('/');
      await expect(page.locator('.fixed.inset-0.z-\\[1000\\]')).toHaveCount(0, { timeout: 10000 });

      const input = page.locator('input[type="text"]');
      await input.fill('https://github.com/facebook/react');
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText('Analyzing Codebase')).toBeVisible();
      await page.waitForTimeout(400);

      await captureAndSave(page, 'loading', vp, false);
    });

    test(`capture baseline result_dashboard (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      await page.route('**/api/review', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_REVIEW_DATA),
        });
      });

      await page.goto('/');
      await expect(page.locator('.fixed.inset-0.z-\\[1000\\]')).toHaveCount(0, { timeout: 10000 });

      const input = page.locator('input[type="text"]');
      await input.fill('https://github.com/facebook/react');
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('**/result');
      await expect(page.getByText('Roast Another')).toBeVisible();
      await expect(page.getByText('facebook')).toBeVisible();

      // Expand first category section so IssueCard is visible
      const categoryBtn = page.locator('button').filter({ hasText: 'ARCHITECTURE' }).first();
      if ((await categoryBtn.count()) > 0) {
        await categoryBtn.click();
      }

      // Expand Static Code Analysis panel so metrics/dependency hubs are visible
      const staticBtn = page.locator('button').filter({ hasText: 'Static Code Analysis' });
      if ((await staticBtn.count()) > 0) {
        await staticBtn.click();
      }

      await page.waitForTimeout(600);
      await captureAndSave(page, 'result_dashboard', vp, true);
    });

    test(`capture baseline privacy (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/privacy');

      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
      await page.waitForTimeout(400);

      await captureAndSave(page, 'privacy', vp, true);
    });

    test(`capture baseline terms (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/terms');

      await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
      await page.waitForTimeout(400);

      await captureAndSave(page, 'terms', vp, true);
    });

    test(`capture baseline not_found (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/page-not-found-404-check');

      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByRole('link', { name: /back to safety/i })).toBeVisible();
      await page.waitForTimeout(400);

      await captureAndSave(page, 'not_found', vp, true);
    });

    test(`capture baseline toast (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      await expect(page.locator('.fixed.inset-0.z-\\[1000\\]')).toHaveCount(0, { timeout: 10000 });

      const input = page.locator('input[type="text"]');
      await input.fill('not-a-valid-url');
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText(/invalid github url/i)).toBeVisible();
      await page.waitForTimeout(200);

      await captureAndSave(page, 'toast', vp, false);
    });
  }
});
