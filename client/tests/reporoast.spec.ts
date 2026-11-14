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
