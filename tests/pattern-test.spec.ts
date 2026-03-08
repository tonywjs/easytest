import { test, expect } from '@playwright/test';

test.describe('Pattern Memory Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patterntest/');
  });

  test('page loads with intro section visible', async ({ page }) => {
    const introSection = page.locator('#introSection');
    await expect(introSection).toBeVisible();

    // Game and result sections should be hidden
    await expect(page.locator('#gameSection')).toBeHidden();
    await expect(page.locator('#resultSection')).toBeHidden();
  });

  test('page title shows pattern test', async ({ page }) => {
    await expect(page.locator('h1[data-i18n="patternTest"]')).toContainText(
      '패턴기억테스트'
    );
  });

  test('intro shows difficulty options', async ({ page }) => {
    // Three difficulty radio buttons should be present
    const easyRadio = page.locator('input[name="difficulty"][value="easy"]');
    const normalRadio = page.locator('input[name="difficulty"][value="normal"]');
    const hardRadio = page.locator('input[name="difficulty"][value="hard"]');

    await expect(easyRadio).toBeVisible();
    await expect(normalRadio).toBeVisible();
    await expect(hardRadio).toBeVisible();

    // Easy should be checked by default
    await expect(easyRadio).toBeChecked();
  });

  test('intro shows life system info', async ({ page }) => {
    await expect(page.locator('#introSection')).toContainText('2개의 라이프');
  });

  test('start button works and shows game section', async ({ page }) => {
    const startButton = page.locator('#startTestBtn');
    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(page.locator('#introSection')).toBeHidden();
    await expect(page.locator('#gameSection')).toBeVisible();
  });

  test('game section shows level display', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const levelDisplay = page.locator('#currentLevel');
    await expect(levelDisplay).toBeVisible();
    await expect(levelDisplay).toHaveText('1');
  });

  test('game section shows lives (hearts)', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const livesDisplay = page.locator('#livesDisplay');
    await expect(livesDisplay).toBeVisible();

    // Should show 2 hearts initially
    const hearts = page.locator('#livesHearts .fa-heart');
    await expect(hearts).toHaveCount(2);
  });

  test('game container is visible after start', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const gameContainer = page.locator('#gameContainer');
    await expect(gameContainer).toBeVisible();
  });

  test('exit button is visible in game section', async ({ page }) => {
    await page.locator('#startTestBtn').click();

    const exitBtn = page.locator('#exitGameBtn');
    await expect(exitBtn).toBeVisible();
  });

  test('home button is visible on pattern test page', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('홈으로');
  });
});
