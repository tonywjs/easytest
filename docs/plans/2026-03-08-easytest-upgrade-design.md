# EasyTest Upgrade Design

## Goals
- Make tests more engaging and fun
- Drive viral sharing and competition
- Increase page views for ad revenue
- Add new test types with high shareability

## New Tests (3)

### Color Vision Test
- Grid of same-colored tiles, one slightly different — find it
- 20 rounds, color difference decreases each round
- Result: "Top N%" + minimum distinguishable deltaE
- Viral hook: "I reached level 15, can you?"

### Hearing Test
- Play frequencies from 8kHz to 20kHz, user marks if audible
- Result: "Your ear age is N years old" + frequency range
- Viral hook: Age-based hearing loss creates shocking/shareable results

### Multitasking Test
- Split screen with 2-3 simultaneous tasks (color match + math + pattern)
- 60-second time limit, progressive difficulty
- Result: Overall score + per-area accuracy breakdown
- Viral hook: Extreme results ("genius" vs "can't multitask at all")

## Core Features

### 1:1 Challenge (Phase 1 — no backend)
- After test completion, "Challenge a friend!" button
- Encode seed + score in URL (Base64): `/reactiontest/?challenge=abc123`
- Friend plays same conditions, sees immediate comparison
- "You: 230ms vs Friend: 185ms — You lose!"

### Gamer DNA Profile (Phase 3 — no backend)
- Complete 5+ tests to unlock comprehensive result card
- Radar chart: reaction / aim / typing / memory / color / hearing / multitasking
- Gamer type assigned: "Strategist", "Sniper", "All-rounder", etc.
- Canvas API generates shareable image
- Results cached in localStorage

### Daily Challenge + Leaderboard (Phase 4-5 — Cloudflare Workers)

**Backend:**
```
Cloudflare Workers + D1 (SQLite)
POST /api/score — submit score
GET  /api/leaderboard/:test/:date — daily ranking
GET  /api/daily-seed/:date — today's seed
GET  /api/stats/:test — statistics (average, distribution)
```

**Flow:**
- New seed generated daily at midnight KST
- All users get identical conditions
- Submit score → see rank instantly ("87th out of 1,234 today!")
- One attempt per day (no retries → tension)

**DB Schema:**
```sql
daily_scores: id, test_type, date, nickname, score, created_at
daily_seeds: date, test_type, seed
```

**Identity:** Simple nickname (3-10 chars), no account required

## Implementation Phases

| Phase | Content | Backend |
|-------|---------|---------|
| 1 | 1:1 Challenge (URL-based) + Color Vision Test | No |
| 2 | Hearing Test + Multitasking Test | No |
| 3 | Gamer DNA Profile (comprehensive result card) | No |
| 4 | Cloudflare Workers + D1 backend setup | Yes |
| 5 | Daily Challenge + Leaderboard integration | Yes |

## Tech Stack
- Frontend: Vanilla JS, Tailwind CSS, existing dark glassmorphism theme
- Backend: Cloudflare Workers + D1 (SQLite)
- Hosting: Cloudflare Pages (already deployed)
- i18n: Existing system (kr, en, ja, zh) — extend for new tests
- Sharing: Existing Kakao/Facebook/Instagram + new challenge URLs
