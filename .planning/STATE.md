# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo — no manual data entry.
**Current focus:** Phase 1 - Scraper Pipeline

## Current Position

Phase: 1 of 2 (Scraper Pipeline)
Plan: 2 of 2 in current phase (01-02 at checkpoint — awaiting GitHub Actions verification)
Status: Checkpoint — awaiting human verification that GitHub Actions workflow runs successfully and jobs.json is publicly accessible at raw GitHub URL
Last activity: 2026-02-17 — Plan 01-02 Task 1 complete, paused at Task 2 checkpoint

Progress: [■■░░░░░░░░] 20%

## Performance Metrics

**Velocity:**
- Total plans completed: 0 (01-01 and 01-02 both at checkpoint, not fully complete)
- Average duration: -
- Total execution time: ~30min across both plans

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-scraper-pipeline | 0 complete (2 at checkpoint) | ~30min | - |

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

- Complete Plan 01-02 Task 2: Push repo to GitHub, trigger workflow manually, verify jobs.json accessible at raw.githubusercontent.com URL

### Blockers/Concerns

- Phase 1: Workflow created but not yet tested on GitHub. Requires push to remote and manual workflow_dispatch trigger to verify end-to-end operation.

## Session Continuity

Last session: 2026-02-17
Stopped at: Plan 01-02 Task 2 checkpoint — awaiting human verification that GitHub Actions workflow runs and publishes jobs.json
Resume file: .planning/phases/01-scraper-pipeline/01-02-SUMMARY.md
