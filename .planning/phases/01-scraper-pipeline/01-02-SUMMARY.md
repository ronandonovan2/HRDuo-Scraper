---
phase: 01-scraper-pipeline
plan: 02
subsystem: infra
tags: [github-actions, ci, cron, playwright, chromium, auto-commit]

# Dependency graph
requires:
  - phase: 01-scraper-pipeline-01
    provides: "npm run scrape script (src/index.js) that exits non-zero on zero results — zero-result safety relied on by workflow"
provides:
  - ".github/workflows/scrape.yml — daily cron workflow (7 AM UTC) with manual trigger, Playwright Chromium system deps, and auto-commit of data/jobs.json"
  - "data/.gitkeep — ensures data/ directory is tracked in repo before first scrape"
affects: [02-careers-page]

# Tech tracking
tech-stack:
  added: [github-actions, actions/checkout@v4, actions/setup-node@v4]
  patterns:
    - "Cron scheduling at 7 AM UTC (8 AM Irish time) — jobs updated before business hours"
    - "Zero-result safety via exit code — scraper exits 1 on failure, workflow skips commit automatically"
    - "[skip ci] in auto-commit message — prevents infinite workflow loop"
    - "git diff --cached --quiet check — idempotent commits, skips if jobs.json unchanged"
    - "Bot user (github-actions[bot]) for auto-commits — keeps git history clean"

key-files:
  created:
    - .github/workflows/scrape.yml
    - data/.gitkeep
  modified: []

key-decisions:
  - "npm ci (not npm install) for reproducible CI builds — locked dependencies from package-lock.json"
  - "Chromium only (not all browsers) — reduces install time, only browser needed for HR Duo scraping"
  - "permissions: contents: write at workflow level — minimal required permission for auto-commit push"
  - "[skip ci] prevents recursive workflow trigger on auto-commit"
  - "git diff --cached --quiet prevents empty commits when HR Duo jobs haven't changed between runs"

patterns-established:
  - "CI safety pattern: rely on scraper exit code (not workflow-level logic) for zero-result protection"

# Metrics
duration: 5min
completed: 2026-02-17
---

# Phase 1 Plan 02: GitHub Actions Scraper Pipeline Summary

**GitHub Actions daily cron workflow with Playwright Chromium, auto-commit to data/jobs.json, and zero-result safety via scraper exit code**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17T09:23:51Z
- **Completed:** 2026-02-17T09:28:00Z (Task 1 complete; Task 2 checkpoint paused for human verification)
- **Tasks:** 1 of 2 (Task 2 is a checkpoint — awaiting human verification on GitHub Actions)
- **Files modified:** 2 created

## Accomplishments

- GitHub Actions workflow created with daily cron schedule (7 AM UTC) and manual workflow_dispatch trigger
- Playwright Chromium installed with `--with-deps` to handle ubuntu-latest system dependency requirements
- Auto-commit of data/jobs.json uses bot identity and [skip ci] tag to prevent workflow loops
- Idempotent: git diff --cached check skips commit when jobs haven't changed between runs

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions workflow for daily scraping and auto-commit** - `754e5b3` (feat)

Task 2 (human verification checkpoint) is paused — see CHECKPOINT REACHED section below.

## Files Created/Modified

- `.github/workflows/scrape.yml` — GitHub Actions workflow: cron 7 AM UTC, workflow_dispatch, Node.js 20, Playwright Chromium with system deps, npm run scrape, auto-commit with [skip ci]
- `data/.gitkeep` — Empty marker file ensuring data/ directory tracked in repo before first automated scrape

## Decisions Made

- `npm ci` over `npm install`: reproducible builds using exact locked versions from package-lock.json
- Chromium-only install (`npx playwright install --with-deps chromium`) reduces CI time vs full browser suite
- Zero-result safety delegated entirely to scraper exit code — no extra workflow logic needed
- `git diff --cached --quiet` makes workflow idempotent — safe to run multiple times per day if needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**To complete this plan:** Push the repository to GitHub and trigger the workflow manually via the Actions tab to verify end-to-end operation. See Task 2 checkpoint instructions.

**Public URL after first successful run:**
`https://raw.githubusercontent.com/{owner}/{repo}/main/data/jobs.json`

Replace `{owner}/{repo}` with your actual GitHub username/organization and repository name.

## Next Phase Readiness

- Workflow file is created and committed — ready to push to GitHub
- Task 2 checkpoint must be completed: push to GitHub, trigger manual run, confirm jobs.json accessible at raw URL
- After Task 2 approval, Phase 2 (careers page) can begin using the raw GitHub URL as its data source

---
*Phase: 01-scraper-pipeline*
*Completed: 2026-02-17 (Task 1 complete; Task 2 awaiting checkpoint verification)*
