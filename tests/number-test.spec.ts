import { test, expect } from '@playwright/test';

test.describe('Number Puzzle Test (Persimmon Game)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/numbertest/');
  });

  test('start screen loads with title', async ({ page }) => {
    await expect(page.locator('h1[data-i18n="numberTest"]')).toBeVisible();
  });

  test('start screen shows difficulty options', async ({ page }) => {
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).toBeVisible();

    // Four difficulty buttons
    const difficultyBtns = startScreen.locator('.difficulty-btn');
    await expect(difficultyBtns).toHaveCount(4);

    // Verify difficulty labels
    await expect(difficultyBtns.nth(0)).toContainText('2분 30초');
    await expect(difficultyBtns.nth(1)).toContainText('1분 30초');
    await expect(difficultyBtns.nth(2)).toContainText('1분');
    await expect(difficultyBtns.nth(3)).toContainText('30초');
  });

  test('easy difficulty is selected by default', async ({ page }) => {
    const easyBtn = page.locator('.difficulty-btn[data-difficulty="easy"]');
    await expect(easyBtn).toHaveClass(/active/);
  });

  test('start button is visible', async ({ page }) => {
    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeVisible();
  });

  test('start button works and shows game container', async ({ page }) => {
    const startBtn = page.locator('#start-btn');
    await startBtn.click();

    // Game container should become visible
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();

    // Start screen should be hidden
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).toBeHidden();
  });

  test('game container has score and timer display', async ({ page }) => {
    await page.locator('#start-btn').click();

    const score = page.locator('#score');
    await expect(score).toBeVisible();
    await expect(score).toHaveText('0');

    const timer = page.locator('#timer');
    await expect(timer).toBeVisible();
  });

  test('game container has control buttons', async ({ page }) => {
    await page.locator('#start-btn').click();

    await expect(page.locator('#game-start-btn')).toBeVisible();
    await expect(page.locator('#restart-btn')).toBeVisible();
    await expect(page.locator('#settings-btn')).toBeVisible();
    await expect(page.locator('#back-to-menu-btn')).toBeVisible();
  });

  test('tutorial modal opens and closes', async ({ page }) => {
    const tutorialBtn = page.locator('#tutorial-btn');
    await expect(tutorialBtn).toBeVisible();
    await tutorialBtn.click();

    // Tutorial modal should appear
    const tutorialModal = page.locator('#tutorial-modal');
    await expect(tutorialModal).toBeVisible();

    // Close tutorial
    const closeBtn = page.locator('#close-tutorial-btn');
    await closeBtn.click();
    await expect(tutorialModal).toBeHidden();
  });

  test('settings modal opens and closes', async ({ page }) => {
    // First enter the game
    await page.locator('#start-btn').click();

    const settingsBtn = page.locator('#settings-btn');
    await settingsBtn.click();

    // Settings modal should appear
    const settingsModal = page.locator('#settings-modal');
    await expect(settingsModal).toBeVisible();

    // Should have difficulty options
    const difficultyOptions = settingsModal.locator('.difficulty-option');
    await expect(difficultyOptions).toHaveCount(4);

    // Save and close
    const saveBtn = page.locator('#save-settings-btn');
    await saveBtn.click();
    await expect(settingsModal).toBeHidden();
  });

  test('vs friend button is visible on start screen', async ({ page }) => {
    const vsFriendBtn = page.locator('#vs-friend-btn');
    await expect(vsFriendBtn).toBeVisible();
  });

  test('back to menu button works from game', async ({ page }) => {
    await page.locator('#start-btn').click();
    await expect(page.locator('#game-container')).toBeVisible();

    await page.locator('#back-to-menu-btn').click();

    // Should return to start screen
    // The start screen parent should be visible again
    await expect(page.locator('#start-screen')).toBeVisible();
  });

  test('home button is visible on number test page', async ({ page }) => {
    const homeButton = page.locator('a[href="../index.html"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toContainText('홈으로');
  });

  test('game board area exists in game container', async ({ page }) => {
    await page.locator('#start-btn').click();

    const gameBoard = page.locator('#game-board');
    await expect(gameBoard).toBeVisible();
  });
});
