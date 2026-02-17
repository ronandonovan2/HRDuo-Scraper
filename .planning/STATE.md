# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo — no manual data entry.
**Current focus:** Phase 2 - Careers Page

## Current Position

Phase: 2 of 2 (Careers Page)
Plan: 1 of 2 in current phase (paused at Task 2 checkpoint)
Status: 02-01 Task 1 complete — careers-snippet.html built and committed. Paused at Task 2: human verification (paste into WordPress)
Last activity: 2026-02-17 — careers-snippet.html created (c2ab65f)

Progress: [■■■■■■░░░░] 60%

## Performance Metrics

**Velocity:**
- Total plans completed: 2 (Phase 1 complete)
- Average duration: ~17min/plan
- Total execution time: ~35min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-scraper-pipeline | 2/2 complete ✓ | ~35min | ~17min |
| 02-careers-page-display | 0/2 complete (1 in progress) | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Setup: Playwright chosen over Puppeteer for SPA handling (auto-wait, active maintenance)
- Setup: GitHub Actions for scheduling — free, no server to maintain
- Setup: JSON file + JS snippet chosen over WordPress REST API + ACF (simpler, fewer moving parts)
- 01-01: CommonJS (not ESM) — simpler Node.js setup, no module type flag needed
- 01-01: Config-driven selectors pattern — all CSS selectors in src/config.js, scraper logic is selector-agnostic
- 01-01: Navigation timeout caught gracefully — page.goto() wrapped in try/catch, returns empty array on timeout
- 01-01: Zero-result safety — first run writes empty array; subsequent runs with 0 jobs preserve existing jobs.json
- 01-02: npm ci (not npm install) for reproducible CI builds with locked dependencies
- 01-02: Chromium-only install — reduces CI time, only browser needed for HR Duo scraping
- 01-02: [skip ci] in auto-commit message prevents recursive workflow trigger
- 01-02: git diff --cached --quiet makes workflow idempotent — skips commit if jobs.json unchanged
- 02-01: Cache-busting ?t=Date.now() on fetch URL — ensures visitors get latest jobs.json, not stale CDN cache
- 02-01: IIFE wrapper for JS — prevents variable leaking into WordPress global scope
- 02-01: CSS scoped under #croom-careers — avoids conflicts with Croom Medical WordPress theme
- 02-01: textContent (not innerHTML) for job data — XSS prevention if jobs.json data compromised
- 02-01: Brand green #00843D for Apply Now button — matches croommedical.com primary brand color

### Pending Todos

- Complete 02-01 Task 2: paste careers-snippet.html into WordPress and verify cards render with working Apply Now links
- Execute Phase 2 Plan 02 (02-02) after WordPress verification

### Blockers/Concerns

None — careers-snippet.html is ready to paste into WordPress. Awaiting human verification at Task 2 checkpoint.

## Session Continuity

Last session: 2026-02-17
Stopped at: 02-01 Task 2 checkpoint — paste careers-snippet.html into WordPress and verify
Resume: After WordPress verification, type "approved" to continue to 02-02
