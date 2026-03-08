import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  test('default language is Korean when no preference is set', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('easytest_lang'));
    await page.goto('/');

    const subtitle = page.locator('[data-i18n="mainSubtitle"]');
    await expect(subtitle).toContainText('당신의 능력을 테스트하고');
  });

  test('language selector shows all 4 languages (kr, en, ja, zh)', async ({ page }) => {
    await page.goto('/');
    const selector = page.locator('#language-selector');
    await expect(selector).toBeVisible();

    const buttons = selector.locator('button');
    await expect(buttons).toHaveCount(4);

    await expect(buttons.nth(0)).toContainText('한국어');
    await expect(buttons.nth(1)).toContainText('EN');
    await expect(buttons.nth(2)).toContainText('日本語');
    await expect(buttons.nth(3)).toContainText('中文');
  });

  test('switching to English changes all visible text', async ({ page }) => {
    await page.goto('/');
    const selector = page.locator('#language-selector');
    await selector.locator('button', { hasText: 'EN' }).click();

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'Test your abilities and compare with others!'
    );
    await expect(page.locator('[data-i18n="availableTests"]')).toContainText(
      'Available Tests'
    );
    await expect(page.locator('[data-i18n="reactionTest"]')).toContainText(
      'Reaction Speed Test'
    );
  });

  test('switching to Japanese changes all visible text', async ({ page }) => {
    await page.goto('/');
    const selector = page.locator('#language-selector');
    await selector.locator('button', { hasText: '日本語' }).click();

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'あなたの能力をテストして'
    );
    await expect(page.locator('[data-i18n="availableTests"]')).toContainText(
      '利用可能なテスト'
    );
    await expect(page.locator('[data-i18n="reactionTest"]')).toContainText(
      '反応速度テスト'
    );
  });

  test('switching to Chinese changes all visible text', async ({ page }) => {
    await page.goto('/');
    const selector = page.locator('#language-selector');
    await selector.locator('button', { hasText: '中文' }).click();

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      '测试你的能力并与他人比较'
    );
    await expect(page.locator('[data-i18n="availableTests"]')).toContainText(
      '可用测试'
    );
    await expect(page.locator('[data-i18n="reactionTest"]')).toContainText(
      '反应速度测试'
    );
  });

  test('language persists via URL parameter', async ({ page }) => {
    await page.goto('/?lang=en');
    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'Test your abilities and compare with others!'
    );

    await page.goto('/?lang=ja');
    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'あなたの能力をテストして'
    );

    await page.goto('/?lang=zh');
    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      '测试你的能力并与他人比较'
    );
  });

  test('language persists via localStorage', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('#language-selector');
    await selector.locator('button', { hasText: 'EN' }).click();

    const savedLang = await page.evaluate(() =>
      localStorage.getItem('easytest_lang')
    );
    expect(savedLang).toBe('en');

    // Reload without URL param - should stay English from localStorage
    await page.goto('/');
    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'Test your abilities and compare with others!'
    );
  });

  test('browser language detection works for English', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('easytest_lang'));
    await page.goto('/');

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'Test your abilities and compare with others!'
    );
    await context.close();
  });

  test('browser language detection works for Japanese', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ja-JP' });
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('easytest_lang'));
    await page.goto('/');

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      'あなたの能力をテストして'
    );
    await context.close();
  });

  test('browser language detection works for Chinese', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'zh-CN' });
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('easytest_lang'));
    await page.goto('/');

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      '测试你的能力并与他人比较'
    );
    await context.close();
  });

  test('browser language detection defaults to Korean for unsupported language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('easytest_lang'));
    await page.goto('/');

    await expect(page.locator('[data-i18n="mainSubtitle"]')).toContainText(
      '당신의 능력을 테스트하고'
    );
    await context.close();
  });

  test('URL is updated when switching language', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('#language-selector');
    await selector.locator('button', { hasText: 'EN' }).click();
    await expect(page).toHaveURL(/[?&]lang=en/);

    await selector.locator('button', { hasText: '한국어' }).click();
    const url = page.url();
    expect(url).not.toContain('lang=');
  });

  test('i18n works on sub-pages via URL param', async ({ page }) => {
    await page.goto('/reactiontest/?lang=en');

    await expect(page.locator('[data-i18n="reactionTest"]').first()).toContainText(
      'Reaction Speed Test'
    );
    await expect(page.locator('[data-i18n="backToHome"]')).toContainText('Home');
  });

  test('i18n works on typing test page via URL param', async ({ page }) => {
    await page.goto('/typingtest/?lang=en');

    await expect(page.locator('[data-i18n="typingTest"]')).toContainText(
      'Typing Test'
    );
  });

  test('i18n works on aim test page via URL param', async ({ page }) => {
    await page.goto('/aimtest/?lang=en');

    await expect(page.locator('[data-i18n="aimTest"]').first()).toContainText(
      'Aim Test'
    );
  });

  test('i18n works on number test page via URL param', async ({ page }) => {
    await page.goto('/numbertest/?lang=zh');

    await expect(page.locator('[data-i18n="numberTest"]').first()).toContainText(
      '数字计算测试'
    );
  });
});
