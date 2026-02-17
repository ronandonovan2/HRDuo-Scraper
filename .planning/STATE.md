# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo — no manual data entry.
**Current focus:** Phase 2 - Careers Page

## Current Position

Phase: 2 of 2 (Careers Page)
Plan: 0 of 2 in current phase (not yet started)
Status: Phase 1 complete — ready to execute Phase 2
Last activity: 2026-02-17 — Phase 1 complete (both plans verified)

Progress: [■■■■■░░░░░] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 2 (Phase 1 complete)
- Average duration: ~17min/plan
- Total execution time: ~35min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-scraper-pipeline | 2/2 complete ✓ | ~35min | ~17min |

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

### Pending Todos

- Plan and execute Phase 2: Careers page on croommedical.com that fetches from the raw GitHub jobs.json URL

### Blockers/Concerns

None — Phase 1 fully operational. Data source: `https://raw.githubusercontent.com/ronandonovan2/HRDuo-Scraper/main/data/jobs.json`

## Session Continuity

Last session: 2026-02-17
Stopped at: Phase 1 complete — Phase 2 not yet planned or started
Resume: run /gsd:plan-phase 2 to plan the careers page, then /gsd:execute-phase 2
