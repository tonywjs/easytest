import { test, expect } from '@playwright/test';

test.describe('Typing Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/typingtest/');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1[data-i18n="typingTest"]')).toContainText(
      '타이핑 테스트'
    );
  });

  test('page loads with input area', async ({ page }) => {
    const typingInput = page.locator('#typing-input');
    await expect(typingInput).toBeVisible();
  });

  test('start button is visible', async ({ page }) => {
    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toContainText('테스트 시작하기');
  });

  test('stats display (WPM, accuracy, time) is visible', async ({ page }) => {
    const statsContainer = page.locator('.stats-container');
    await expect(statsContainer).toBeVisible();

    // Check individual stats
    const wpmStat = page.locator('#wpm');
    await expect(wpmStat).toBeVisible();
    await expect(wpmStat).toHaveText('0');

    const accuracyStat = page.locator('#accuracy');
    await expect(accuracyStat).toBeVisible();
    await expect(accuracyStat).toHaveText('100');

    const timerStat = page.locator('#timer');
    await expect(timerStat).toBeVisible();
    await expect(timerStat).toHaveText('0');
  });

  test('target text area exists', async ({ page }) => {
    const targetText = page.locator('#target-text');
    await expect(targetText).toBeVisible();
  });

  test('custom text input section exists', async ({ page }) => {
    const customInput = page.locator('#custom-text-input');
    await expect(customInput).toBeVisible();

    const applyBtn = page.locator('#apply-custom-text');
    await expect(applyBtn).toBeVisible();
  });

  test('reset button exists', async ({ page }) => {
    const resetBtn = page.locator('#reset-btn');
    await expect(resetBtn).toBeVisible();
    await expect(resetBtn).toContainText('다시 시도하기');
  });

  test('result container is initially hidden', async ({ page }) => {
    const resultContainer = page.locator('#result-container');
    await expect(resultContainer).toBeHidden();
  });

  test('home button is visible', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('홈으로');
  });
});
