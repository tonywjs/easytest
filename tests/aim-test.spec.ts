import { test, expect } from '@playwright/test';

test.describe('Aim Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aimtest/');
  });

  test('page loads with intro section visible', async ({ page }) => {
    const introSection = page.locator('#introSection');
    await expect(introSection).toBeVisible();

    // Game and result sections should be hidden
    await expect(page.locator('#gameSection')).toBeHidden();
    await expect(page.locator('#resultSection')).toBeHidden();
  });

  test('page title shows aim test', async ({ page }) => {
    await expect(page.locator('h1[data-i18n="aimTest"]')).toContainText(
      '에임테스트'
    );
  });

  test('intro section shows reference benchmarks', async ({ page }) => {
    await expect(page.locator('#introSection')).toContainText('150-200ms');
    await expect(page.locator('#introSection')).toContainText('250-350ms');
    await expect(page.locator('#introSection')).toContainText('~150ms');
  });

  test('start button works and shows game section', async ({ page }) => {
    const startButton = page.locator('#startTestBtn');
    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(page.locator('#introSection')).toBeHidden();
    await expect(page.locator('#gameSection')).toBeVisible();
  });

  test('game container is visible after start', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const gameContainer = page.locator('#gameContainer');
    await expect(gameContainer).toBeVisible();
  });

  test('progress shows correct format (1/10)', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const progress = page.locator('#gameProgress');
    await expect(progress).toHaveText('1/10');
  });

  test('game action button is visible after starting', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const actionBtn = page.locator('#gameActionBtn');
    await expect(actionBtn).toBeVisible();
  });

  test('home button is visible on aim test page', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('홈으로');
  });
});
