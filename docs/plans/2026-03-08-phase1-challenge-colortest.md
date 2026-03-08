# Phase 1: 1:1 Challenge + Color Vision Test

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Color Vision Test and 1:1 Challenge system to increase viral sharing and page views.

**Architecture:** Color test is a standalone page following existing test patterns (intro, game, result). Challenge system uses URL-encoded Base64 parameters to share seeds and scores — no backend needed. A shared `challenge.js` utility handles encoding/decoding across all tests.

**Tech Stack:** Vanilla JS, Tailwind CSS 2.2.19, existing i18n system, existing Kakao/Facebook sharing.

---

### Task 1: Color Vision Test — HTML + CSS

**Files:**
- Create: `colortest/index.html`
- Create: `colortest/styles.css`

**Step 1: Create `colortest/index.html`**

Follow the exact pattern from `reactiontest/index.html`:
- Head: CDN links (Tailwind, FontAwesome, Noto Sans KR) + common.css + styles.css + Kakao SDK + AdSense
- Body: `class="et-dark"`, home button (`.et-home-btn`), `#app` with `pt-14 pb-8`
- Three sections: `#introSection` (glass-content), `#gameSection` (hidden), `#resultSection` (hidden)
- Intro: icon-circle (eye icon, cyan-purple gradient), 3 et-info-card benchmarks (Expert Lv16-20, Average Lv8-15, Beginner Lv1-7), et-rules-box with 4 rules, start button
- Game: level display + lives (hearts) + progress-bar + `#colorGrid` container + message
- Result: level score display + level-indicator bar + challenge section (challenge button + link input + copy button) + share buttons (kakao/facebook/instagram/link) + retry button
- Scripts: `../js/i18n.js`, `../js/challenge.js`, `script.js`

**Step 2: Create `colortest/styles.css`**

- `.color-grid`: CSS Grid, centered, max-width 400px, aspect-ratio 1
- `.grid-2x2` through `.grid-5x5`: grid-template-columns variants
- `.color-tile`: aspect-ratio 1, border-radius 12px, cursor pointer, hover scale(1.05)
- `.color-tile.correct`: green border + green glow + correctPulse animation
- `.color-tile.wrong`: red border + shake animation
- `.progress-bar` / `.progress-fill`: 6px height, gradient fill
- `.level-indicator` / `.level-progress` / `.level-marker`: result bar with markers
- `.challenge-comparison` / `.challenge-player` / `.challenge-vs`: challenge result layout
- Mobile (480px): grid max-width 300px, gap 4px, border-radius 8px

**Step 3: Commit**

```bash
git add colortest/index.html colortest/styles.css
git commit -m "feat(colortest): add HTML structure and styles"
```

---

### Task 2: Color Vision Test — Game Logic

**Files:**
- Create: `colortest/script.js`

**Step 1: Create game logic**

**State:**
```javascript
let gameState = {
  level: 0, maxLevel: 20, lives: 3, maxLives: 3,
  correctTile: -1, isPlaying: false, seed: null
};
```

**Seeded RNG** (for challenge mode): Linear congruential generator using seed parameter.

**Level configs** (array of 20): Each level has `{ grid: 2-5, delta: 80 down to 2 }` where delta is the HSL color difference. Level 1 = grid 2x2, delta 80 (very easy). Level 20 = grid 5x5, delta 2 (nearly impossible).

**Color generation:**
- `generateBaseColor()`: random HSL (H: 0-360, S: 40-80%, L: 35-65%)
- `generateDifferentColor(base, delta)`: shift H/S/L by delta amount
- `hslToString(color)`: returns `hsl(h, s%, l%)` string

**Game flow:**
1. `initGame()`: reset state, check for challenge seed via `ChallengeUtils.parseChallenge()`, show gameSection
2. `nextLevel()`: increment level, call `renderGrid()`
3. `renderGrid()`: set grid class, generate base + different colors, place tiles with click handlers
4. `handleTileClick()`: correct = green pulse + advance after 600ms. Wrong = shake + lose life. 0 lives = game over after 1000ms
5. `finishGame()`: show result with icon/description/percentile. If challenge mode, show comparison (opponent vs you with winner highlight). Setup share buttons and challenge link button.

**Challenge integration:**
- On page load, check URL for `?challenge=` param
- If present, show challenge banner in intro section
- Use same seed for identical game conditions
- After finish, show side-by-side comparison with win/lose/draw

**Share buttons:** Follow existing pattern — Kakao Share API, Facebook sharer URL, Instagram clipboard copy, link copy. All text via `window.i18n.getText()`.

**Step 2: Verify syntax**

Run: `node -c colortest/script.js`

**Step 3: Commit**

```bash
git add colortest/script.js
git commit -m "feat(colortest): add game logic with challenge support"
```

---

### Task 3: Challenge Utility (Shared Module)

**Files:**
- Create: `js/challenge.js`

**Step 1: Create shared challenge utility**

IIFE that sets `window.ChallengeUtils` with:

- `encode(data)`: JSON.stringify, then btoa with URL-safe Base64 (replace +/= chars)
- `decode(str)`: reverse URL-safe Base64, atob, JSON.parse. Returns null on failure.
- `createChallengeURL(testType, seed, score)`: encodes `{ t, s, sc, v }` into `?challenge=` param
- `parseChallenge()`: reads `?challenge=` from URL, decodes, returns `{ testType, seed, score, version }` or null

**Step 2: Verify syntax**

Run: `node -c js/challenge.js`

**Step 3: Commit**

```bash
git add js/challenge.js
git commit -m "feat: add shared challenge URL utility (js/challenge.js)"
```

---

### Task 4: i18n Translations for Color Test + Challenge

**Files:**
- Modify: `js/i18n.js`

**Step 1: Add translations to all 4 language blocks**

Add after the pattern test section in each block:

**Color test keys** (~25 keys): colorTest, colorTestDesc, colorDuration, colorAbility, colorProgressive, colorIntroTitle, colorIntroDesc, colorExpert, colorExpertRange, colorAverage, colorAverageRange, colorBeginner, colorBeginnerRange, colorRule1-4, colorLives, colorFindDifferent, colorCorrect, colorWrong, colorGameOver, colorResultExpert/Average/Beginner, colorPercentile, colorShareText, colorKakaoTitle, colorResultDesc, colorInstagramText

**Challenge keys** (~10 keys): challengeFriend, challengeDesc, createChallengeLink, challengeResult, challengeOpponent, challengeWin, challengeLose, challengeDraw, challengeReceived, challengeReceivedDesc

All 4 languages: kr, en, ja, zh.

**Step 2: Verify syntax**

Run: `node -c js/i18n.js`

**Step 3: Commit**

```bash
git add js/i18n.js
git commit -m "feat(i18n): add color test and challenge translations (4 languages)"
```

---

### Task 5: Add Color Test to Main Page

**Files:**
- Modify: `index.html`

**Step 1: Add card to grid**

After the last glass-card (pattern test), add a new glass-card with:
- Icon: fas fa-eye, gradient cyan-purple (#06b6d4, #8b5cf6)
- Title: data-i18n="colorTest"
- Description: data-i18n="colorTestDesc"
- 3 card-details: duration (about 2 min), color ability, progressive difficulty
- CTA: link to ./colortest/

**Step 2: Add stagger animation**

Add `.card-stagger:nth-child(6) { animation-delay: 0.6s; }` to style block.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add color test card to main page"
```

---

### Task 6: Add Challenge System to Existing Tests

**Files:**
- Modify: `reactiontest/index.html`, `reactiontest/script.js`
- Modify: `aimtest/index.html`, `aimtest/script.js`
- Modify: `typingtest/index.html`, `typingtest/script.js`
- Modify: `patterntest/index.html`, `patterntest/script.js`

**Step 1: For each test HTML**, add `<script src="../js/challenge.js"></script>` before the test's script tag. Add challenge section HTML to result section (challenge button + link input + copy button).

**Step 2: For each test script.js**, integrate:
- Seeded RNG when challenge seed exists
- `ChallengeUtils.parseChallenge()` on init
- `ChallengeUtils.createChallengeURL()` for link generation
- Challenge comparison display when in challenge mode
- Challenge banner in intro when arriving via challenge link

**Step 3: Commit per test**

```bash
git commit -m "feat(reactiontest): add 1:1 challenge support"
git commit -m "feat(aimtest): add 1:1 challenge support"
git commit -m "feat(typingtest): add 1:1 challenge support"
git commit -m "feat(patterntest): add 1:1 challenge support"
```

---

### Task 7: Playwright Tests

**Files:**
- Create: `tests/color-test.spec.ts`
- Modify: `tests/navigation.spec.ts`

**Step 1: Create `tests/color-test.spec.ts`**

Tests:
- page loads with intro section visible
- page title shows color test
- intro shows 3 benchmark cards
- start button works and shows game section
- game shows color grid with tiles (count >= 4)
- level display starts at 1
- lives display shows hearts
- home button is visible

**Step 2: Update navigation tests**

- Change card count assertion from 5 to 6
- Add: color test card links to correct page
- Add: color test has home button that navigates back
- Add: color test loads without console errors

**Step 3: Run tests**

Run: `npx playwright test --project=chromium`
Expected: All tests pass

**Step 4: Commit**

```bash
git add tests/color-test.spec.ts tests/navigation.spec.ts
git commit -m "test: add color test and update navigation tests"
```

---

### Task 8: Final Verification and Push

**Step 1:** Run full test suite: `npx playwright test`

**Step 2:** Take mobile (375px) and desktop (1440px) screenshots of main page, color test intro, gameplay, and result

**Step 3:** Push: `git push origin master`
