import { test, expect } from '@playwright/test';

test.describe('Reaction Speed Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reactiontest/');
  });

  test('page loads with intro section visible', async ({ page }) => {
    const introSection = page.locator('#introSection');
    await expect(introSection).toBeVisible();

    // Game section and result section should be hidden
    const gameSection = page.locator('#gameSection');
    await expect(gameSection).toBeHidden();

    const resultSection = page.locator('#resultSection');
    await expect(resultSection).toBeHidden();
  });

  test('page title contains reaction test info', async ({ page }) => {
    await expect(page.locator('h1[data-i18n="reactionTest"]')).toContainText(
      '반응속도 테스트'
    );
  });

  test('intro section shows reference benchmarks', async ({ page }) => {
    // Should show pro gamer, average, and human limit benchmarks
    await expect(page.locator('#introSection')).toContainText('140-160ms');
    await expect(page.locator('#introSection')).toContainText('200-250ms');
    await expect(page.locator('#introSection')).toContainText('~100ms');
  });

  test('start button works and shows game section', async ({ page }) => {
    const startButton = page.locator('#startTestBtn');
    await expect(startButton).toBeVisible();
    await startButton.click();

    // Intro should be hidden, game should be visible
    await expect(page.locator('#introSection')).toBeHidden();
    await expect(page.locator('#gameSection')).toBeVisible();
  });

  test('game container is visible after start', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const gameContainer = page.locator('#gameContainer');
    await expect(gameContainer).toBeVisible();
  });

  test('progress indicator shows correct format (1/5)', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const progress = page.locator('#gameProgress');
    await expect(progress).toHaveText('1/5');
  });

  test('game action button is visible after starting', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const actionBtn = page.locator('#gameActionBtn');
    await expect(actionBtn).toBeVisible();
  });

  test('home button is visible on reaction test page', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('홈으로');
  });
});
