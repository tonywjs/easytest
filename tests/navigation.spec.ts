import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('main page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EasyTest/);
    await expect(page.locator('h1')).toContainText('EasyTest');
  });

  test('all 6 test cards are visible', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.glass-card');
    await expect(cards).toHaveCount(6);
  });

  test('reaction test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const reactionLink = page.locator('a[href*="reactiontest"]');
    await expect(reactionLink).toBeVisible();
    await reactionLink.click();
    await expect(page).toHaveURL(/\/reactiontest\//);
  });

  test('number test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const numberLink = page.locator('a[href*="numbertest"]');
    await expect(numberLink).toBeVisible();
    await numberLink.click();
    await expect(page).toHaveURL(/\/numbertest\//);
  });

  test('typing test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const typingLink = page.locator('a[href*="typingtest"]');
    await expect(typingLink).toBeVisible();
    await typingLink.click();
    await expect(page).toHaveURL(/\/typingtest\//);
  });

  test('aim test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const aimLink = page.locator('a[href*="aimtest"]');
    await expect(aimLink).toBeVisible();
    await aimLink.click();
    await expect(page).toHaveURL(/\/aimtest\//);
  });

  test('pattern test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const patternLink = page.locator('a[href*="patterntest"]');
    await expect(patternLink).toBeVisible();
    await patternLink.click();
    await expect(page).toHaveURL(/\/patterntest\//);
  });

  test('color test card links to correct page', async ({ page }) => {
    await page.goto('/');
    const colorLink = page.locator('a[href*="colortest"]');
    await expect(colorLink).toBeVisible();
    await colorLink.click();
    await expect(page).toHaveURL(/\/colortest\//);
  });

  test('reaction test page has home button that navigates back', async ({ page }) => {
    await page.goto('/reactiontest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('typing test page has home button that navigates back', async ({ page }) => {
    await page.goto('/typingtest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('aim test page has home button that navigates back', async ({ page }) => {
    await page.goto('/aimtest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('pattern test page has home button that navigates back', async ({ page }) => {
    await page.goto('/patterntest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('number test page has home button that navigates back', async ({ page }) => {
    await page.goto('/numbertest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('color test page has home button that navigates back', async ({ page }) => {
    await page.goto('/colortest/');
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('main page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('reaction test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/reactiontest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('typing test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/typingtest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('aim test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/aimtest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('pattern test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/patterntest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('number test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/numbertest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('color test page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    await page.goto('/colortest/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
});
