# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo — no manual data entry.
**Current focus:** Milestone complete

## Current Position

Phase: 2 of 2 (Careers Page) — COMPLETE
Plan: 1 of 1 complete
Status: All phases complete — milestone delivered
Last activity: 2026-02-17 — Phase 2 verified live on croommedical.com/careers

Progress: [■■■■■■■■■■] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 3 (all phases complete)
- Average duration: ~15min/plan
- Total execution time: ~45min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-scraper-pipeline | 2/2 complete ✓ | ~35min | ~17min |
| 02-careers-page-display | 1/1 complete ✓ | ~10min | ~10min |

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
- 02-01: Integrated into existing Open Roles ACF block (inc/blocks/open_roles.php) — replaced legacy Indeedly plugin
- 02-01: GitHub repo made public — required for browser fetch() to access raw.githubusercontent.com URL
- 02-01: Cache-busting ?t=Date.now() on fetch URL — ensures visitors always get latest jobs.json
- 02-01: CSS scoped under #croom-careers — avoids conflicts with Croom Medical WordPress theme

### Pending Todos

None — milestone complete.

### Blockers/Concerns

None — fully operational. Data pipeline runs daily via GitHub Actions. Careers page displays live HR Duo jobs.

## Session Continuity

Last session: 2026-02-17
Stopped at: Milestone complete — all phases delivered
Resume: Run /gsd:complete-milestone to archive this milestone
