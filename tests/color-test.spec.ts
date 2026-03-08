import { test, expect } from '@playwright/test';

test.describe('Color Vision Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/colortest/');
  });

  test('page loads with intro section visible', async ({ page }) => {
    const introSection = page.locator('#introSection');
    await expect(introSection).toBeVisible();

    const gameSection = page.locator('#gameSection');
    await expect(gameSection).toBeHidden();

    const resultSection = page.locator('#resultSection');
    await expect(resultSection).toBeHidden();
  });

  test('page title contains color test info', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('색각');
  });

  test('intro section shows 3 benchmark cards', async ({ page }) => {
    const cards = page.locator('#introSection .et-info-card');
    await expect(cards).toHaveCount(3);
  });

  test('start button works and shows game section', async ({ page }) => {
    const startButton = page.locator('#startTestBtn');
    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(page.locator('#introSection')).toBeHidden();
    await expect(page.locator('#gameSection')).toBeVisible();
  });

  test('game shows color grid with tiles', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const grid = page.locator('#colorGrid');
    await expect(grid).toBeVisible();

    // First level is 2x2, so at least 4 tiles
    const tiles = page.locator('#colorGrid .color-tile');
    const count = await tiles.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('level display starts at 1', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const level = page.locator('#currentLevel');
    await expect(level).toHaveText('1');
  });

  test('lives display shows hearts', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const lives = page.locator('#livesDisplay');
    await expect(lives).toBeVisible();
    const text = await lives.textContent();
    expect(text).toContain('\u2764\uFE0F');
  });

  test('home button is visible', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
  });
});
