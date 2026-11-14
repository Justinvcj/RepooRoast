import { test, expect } from '@playwright/test';

test.describe('RepoRoast End-to-End User Flow', () => {
  test('should render Home Page with global Navbar and Footer', async ({ page }) => {
    await page.goto('/');

    // Check that the Home Page Hero is visible
    await expect(page.getByText('Roast your codebase.')).toBeVisible();

    // Check that the global Navbar is visible
    const navbar = page.locator('nav').filter({ hasText: 'RepoRoast' });
    await expect(navbar).toBeVisible();

    // Check that the Footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('should show a 404 page for an unmatched route, with a way back home', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByText('404')).toBeVisible();
    const backLink = page.getByRole('link', { name: /back to safety/i });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page.getByText('Roast your codebase.')).toBeVisible();
  });

  test('should execute a roast, verify Loading Screen masks Navbar/Footer, and navigate to Result Page', async ({ page }) => {
    // Intercept the API call to mock the response, avoiding real backend processing overhead
    await page.route('**/api/review', async route => {
      // Mock a delay to allow the loading screen to be visible for a moment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          repo: {
            owner: 'testowner',
            repo: 'testrepo',
            fullName: 'testowner/testrepo',
            description: 'A test repository',
            defaultBranch: 'main',
            stars: 100,
            forks: 50,
            updatedAt: '2023-01-01T00:00:00Z',
            language: 'TypeScript'
          },
          review: {
            overallScore: 45,
            overallVerdict: 'You need to refactor everything.',
            seniorDevQuote: 'This is a brutally honest test summary.',
            categories: [
              {
                name: 'Architecture',
                score: 50,
                emoji: '🏗️',
                summary: 'Terrible structure',
                issues: [
                  { severity: 'critical', title: 'Bad Config', description: 'No config', file: 'config.js', suggestion: 'Add config' }
                ],
                positives: ['Good intent']
              }
            ],
            topPriorities: ['Refactor everything'],
            whatYouDidWell: ['You wrote some tests'],
            hiringVerdict: 'Do not hire.',
            fixPrompt: 'Fix everything please.'
          }
        })
      });
    });

    await page.goto('/');

    // Fill in the repository URL
    const input = page.locator('input[type="text"]');
    await input.fill('https://github.com/testowner/testrepo');

    // Click the submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Immediately after clicking, the Loading Screen should appear
    await expect(page.getByText('Analyzing Codebase')).toBeVisible();

    // VERY IMPORTANT: Verify that the global Navbar and Footer are physically unmounted
    // In our implementation, they are completely removed from the DOM by LayoutContext
    await expect(page.locator('footer')).toHaveCount(0);
    // There shouldn't be any "Privacy Policy" visible
    await expect(page.getByText('Privacy Policy')).toHaveCount(0);

    // Wait for navigation to Result Page after the mocked API returns
    await page.waitForURL('**/result');

    // The Result Page should have its own specialized Custom Navbar
    const resultNavbar = page.locator('nav').filter({ hasText: 'Roast Another' });
    await expect(resultNavbar).toBeVisible();

    // The Result Page should display the repository name from the mock
    await expect(page.getByText('testrepo')).toBeVisible();
    await expect(page.getByText('This is a brutally honest test summary.')).toBeVisible();
  });

  test('should reject an invalid URL without hitting the backend', async ({ page }) => {
    let requestFired = false;
    await page.route('**/api/review', async route => {
      requestFired = true;
      await route.abort();
    });

    await page.goto('/');

    const input = page.locator('input[type="text"]');
    await input.fill('not-a-github-url');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Client-side validation should reject this before any network call.
    await expect(page.getByText(/invalid github url/i)).toBeVisible();
    expect(requestFired).toBe(false);
  });

  test('should surface a server error via toast and return to the idle landing page', async ({ page }) => {
    await page.route('**/api/review', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Repository not found or is private.' }) + '\n'
      });
    });

    await page.goto('/');

    const input = page.locator('input[type="text"]');
    await input.fill('https://github.com/testowner/doesnotexist');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.getByText('Repository not found or is private.')).toBeVisible();

    // Should land back on the idle landing page, not get stuck on the loading screen.
    await expect(page.getByText('Roast your codebase.')).toBeVisible();
  });
});

test.describe('Custom Mode (Bring Your Own Key)', () => {
  const PREPARE_RESPONSE = {
    success: true,
    repo: {
      owner: 'testowner',
      repo: 'testrepo',
      fullName: 'testowner/testrepo',
      description: 'A test repository',
      defaultBranch: 'main',
      stars: 10,
      forks: 2,
      updatedAt: '2023-01-01T00:00:00Z'
    },
    analysis: null,
    isDiff: false,
    repoLabel: 'testowner/testrepo',
    systemInstruction: 'You are a brutally honest reviewer.',
    promptParts: [
      'Review the Overview, Project Structure, and Documentation for this repo.',
      'Review Code Quality, Test Coverage, Performance, and Scalability for this repo.',
      'Review Security for this repo.'
    ],
    partNames: ['Overview/Structure/Documentation', 'Code Quality/Test Coverage/Performance/Scalability', 'Security'],
    repoType: 'library',
    weights: { 'Code Quality': 0.2, 'Project Structure': 0.15, 'Documentation': 0.2, 'Security': 0.1, 'Test Coverage': 0.2, 'Performance': 0.05, 'Scalability': 0.1 }
  };

  const geminiJsonResponse = (payload: unknown) => ({
    candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }]
  });

  // Routes each direct Gemini call to the right mock payload by sniffing the
  // prompt text in the request body, since all 4 calls (3 review parts + the
  // action-plan synthesis) hit the same generateContent URL pattern.
  const mockDirectGeminiCalls = async (page: import('@playwright/test').Page) => {
    await page.route('https://generativelanguage.googleapis.com/**', async route => {
      const body = route.request().postData() || '';

      if (body.includes('review_findings')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(geminiJsonResponse({
            topPriorities: ['Fix the thing'],
            whatYouDidWell: ['Nice README'],
            fixPrompt: '[C - Context]: ...'
          }))
        });
      }
      if (body.includes('Security') && !body.includes('Project Structure')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(geminiJsonResponse({ categories: [{ name: 'Security', score: 70, emoji: '🔒', summary: 'ok', issues: [], positives: [] }] }))
        });
      }
      if (body.includes('Project Structure')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(geminiJsonResponse({
            overallScore: 77,
            overallVerdict: 'Custom mode verdict text.',
            seniorDevQuote: 'Custom mode quote.',
            hiringVerdict: 'Hire.',
            categories: [
              { name: 'Project Structure', score: 80, emoji: '🏗️', summary: 'ok', issues: [], positives: [] },
              { name: 'Documentation', score: 85, emoji: '📖', summary: 'ok', issues: [], positives: [] }
            ]
          }))
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(geminiJsonResponse({
          categories: [
            { name: 'Code Quality', score: 60, emoji: '🧹', summary: 'ok', issues: [], positives: [] },
            { name: 'Test Coverage', score: 50, emoji: '🧪', summary: 'ok', issues: [], positives: [] },
            { name: 'Performance', score: 65, emoji: '⚡', summary: 'ok', issues: [], positives: [] },
            { name: 'Scalability', score: 55, emoji: '📈', summary: 'ok', issues: [], positives: [] }
          ]
        }))
      });
    });
  };

  const enableCustomMode = async (page: import('@playwright/test').Page, key = 'AIzaFAKE-TEST-KEY') => {
    await page.getByRole('button', { name: /use your own api key/i }).click();
    await page.getByRole('switch').click();
    await page.getByPlaceholder('AIza...').fill(key);
    await page.getByRole('button', { name: 'Save' }).click();
  };

  test('enabling it updates the trigger label and never calls the default /api/review endpoint', async ({ page }) => {
    let defaultEndpointCalled = false;
    await page.route('**/api/review', async route => {
      defaultEndpointCalled = true;
      await route.abort();
    });
    await page.route('**/api/review/prepare', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PREPARE_RESPONSE) });
    });
    await mockDirectGeminiCalls(page);

    await page.goto('/');
    await enableCustomMode(page);

    await expect(page.getByRole('button', { name: /custom mode: on/i })).toBeVisible();

    const input = page.locator('input[type="text"]');
    await input.fill('https://github.com/testowner/testrepo');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/result');
    expect(defaultEndpointCalled).toBe(false);
  });

  test('runs a full custom-mode review end to end via /prepare + direct Gemini calls', async ({ page }) => {
    let prepareCalled = false;
    await page.route('**/api/review/prepare', async route => {
      prepareCalled = true;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PREPARE_RESPONSE) });
    });
    await mockDirectGeminiCalls(page);

    await page.goto('/');
    await enableCustomMode(page);

    const input = page.locator('input[type="text"]');
    await input.fill('https://github.com/testowner/testrepo');
    await page.locator('button[type="submit"]').click();

    // The custom-mode-specific loading stages should appear.
    await expect(page.getByText(/preparing repository context/i)).toBeVisible();

    await page.waitForURL('**/result');

    expect(prepareCalled).toBe(true);
    await expect(page.getByText('testrepo')).toBeVisible();
    await expect(page.getByText('Custom mode quote.')).toBeVisible();
    // overallScore is computed client-side by reviewMerge.ts from the mocked
    // category scores + weights, not hardcoded in any mock payload:
    // 60*.2 + 80*.15 + 85*.2 + 70*.1 + 50*.2 + 65*.05 + 55*.1 = 66.75 -> 67.
    await expect(page.getByText('67')).toBeVisible();
  });

  test('surfaces a prepare-endpoint failure via toast without getting stuck loading', async ({ page }) => {
    await page.route('**/api/review/prepare', async route => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'Repository not found or is private.' }) });
    });

    await page.goto('/');
    await enableCustomMode(page);

    const input = page.locator('input[type="text"]');
    await input.fill('https://github.com/testowner/doesnotexist');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Repository not found or is private.')).toBeVisible();
    await expect(page.getByText('Roast your codebase.')).toBeVisible();
  });
});
