---
phase: 02-careers-page-display
plan: 01
subsystem: ui
tags: [html, css, javascript, fetch, wordpress, jobs]

# Dependency graph
requires:
  - phase: 01-scraper-pipeline-02
    provides: "data/jobs.json at https://raw.githubusercontent.com/ronandonovan2/HRDuo-Scraper/main/data/jobs.json — public CORS-friendly URL consumed by fetch() in snippet"
provides:
  - "careers-snippet.html — self-contained HTML/CSS/JS block ready to paste into WordPress Custom HTML block"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Scoped CSS under #croom-careers — all styles namespaced to prevent WordPress theme pollution"
    - "IIFE pattern for JS — (function(){})() prevents global scope pollution in WordPress environment"
    - "Cache-busting fetch: JOBS_URL + '?t=' + Date.now() — bypasses CDN cache on raw GitHub URL"
    - "textContent over innerHTML for all job data — XSS prevention"
    - "document.createElement DOM building — no template literals with innerHTML"

key-files:
  created:
    - careers-snippet.html
  modified: []

key-decisions:
  - "Cache-busting query param (?t=Date.now()) on fetch URL — ensures visitors always get latest jobs.json, not stale CDN cache"
  - "IIFE wrapper for JS — prevents any variable leaking into WordPress global scope"
  - "All CSS scoped under #croom-careers — avoids conflicts with Croom Medical WordPress theme"
  - "textContent (not innerHTML) for job data — prevents XSS if jobs.json data is ever compromised"
  - "document.createElement (not template literals + innerHTML) — consistent security approach"
  - "Brand green #00843D for Apply Now button — matches croommedical.com primary brand color"
  - "CSS Grid responsive layout: 1 col mobile, 2 col tablet 768px+, 3 col desktop 1024px+"

patterns-established:
  - "Self-contained snippet pattern: single HTML file with embedded <style> and <script>, zero external deps, paste into WordPress"

# Metrics
duration: 5min
completed: 2026-02-17
---

# Phase 2 Plan 01: Careers Page Snippet Summary

**Self-contained HTML/CSS/JS fetch snippet with responsive card grid, loading/empty/error states, and Croom Medical brand styling — ready to paste into WordPress**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-17T09:45:41Z
- **Completed:** 2026-02-17T09:50:00Z (Task 1 complete; Task 2 checkpoint paused for human verification)
- **Tasks:** 2 of 2 complete
- **Files modified:** 1 created

## Accomplishments

- careers-snippet.html created as a fully self-contained HTML/CSS/JS file (177 lines, zero dependencies)
- Fetches jobs.json from public GitHub raw URL with cache-busting to ensure fresh data on every page load
- Renders one card per job: title, type badge, description, Apply Now button linking to HR Duo
- Three states handled: loading ("Loading open positions..."), empty ("No open roles at this time"), error ("Unable to load job listings")
- Responsive CSS grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- All CSS scoped under #croom-careers — safe to paste into any WordPress theme

## Task Commits

Each task was committed atomically:

1. **Task 1: Build self-contained careers page snippet** - `c2ab65f` (feat)

2. **Task 2: Verify snippet on WordPress careers page** — verified live on croommedical.com/careers

## Files Created/Modified

- `careers-snippet.html` — Self-contained HTML/CSS/JS block: fetches jobs.json from raw GitHub URL, renders responsive job cards with Apply Now buttons linking to HR Duo application pages, handles loading/empty/error states

## Decisions Made

- Cache-busting `?t=Date.now()` on fetch URL ensures visitors always get the latest jobs, not a stale CDN cache of the raw GitHub URL
- IIFE wrapper prevents any JS variables leaking into the WordPress global scope
- CSS scoped to `#croom-careers` container avoids conflicts with the WordPress theme's existing styles
- `textContent` used for all job data (not `innerHTML`) — prevents XSS if jobs.json data is ever compromised
- `document.createElement` DOM building (not template literals + innerHTML) for consistent security
- Brand green `#00843D` for Apply Now button — matches Croom Medical primary brand color visible on croommedical.com
- Responsive CSS Grid breakpoints: 768px (2 col) and 1024px (3 col) match common tablet/desktop thresholds

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Deployment Notes

- The snippet was integrated into the existing Open Roles ACF block template (`inc/blocks/open_roles.php`) in the Croom Medical WordPress theme, replacing the legacy Indeedly (Indeed) plugin integration
- GitHub repo `ronandonovan2/HRDuo-Scraper` was made public so the raw URL is accessible to the browser fetch() call
- Verified live on croommedical.com/careers: 4 job cards render correctly with working Apply Now links

## Next Phase Readiness

- Phase 2 complete — no further phases planned
- The data pipeline (Phase 1 GitHub Actions) keeps jobs.json updated automatically every day

---
*Phase: 02-careers-page-display*
*Completed: 2026-02-17*
