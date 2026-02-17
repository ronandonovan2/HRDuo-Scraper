# Project Research Summary

**Project:** HR Duo Job Scraper for Croom Medical
**Domain:** SPA web scraping + WordPress ACF integration
**Researched:** 2026-02-17
**Confidence:** HIGH

## Executive Summary

This project is a straightforward scraper-to-CMS integration. The HR Duo candidate portal is a JavaScript Single Page Application with no public API, so we must use a headless browser (Playwright) to render the page and extract job listing data. The scraped data gets pushed to WordPress via its built-in REST API, stored as ACF custom posts, and displayed on the careers page using a card template matching the existing Indeed-style layout.

The recommended approach is a Node.js scraper running on GitHub Actions (free, scheduled, no server to maintain) that scrapes HR Duo daily, diffs against existing WordPress posts, and performs create/update/delete operations. The WordPress side is a lightweight plugin that registers a custom post type with ACF fields and provides a shortcode for the careers page.

The biggest risks are: HR Duo changing their DOM structure (breaking the scraper), accidentally deleting all jobs when the scraper fails to extract data, and headless browser issues in CI environments. All are preventable with validation, safety checks, and early CI testing.

## Key Findings

### Recommended Stack

Node.js + Playwright for the scraper, WordPress REST API + ACF for the CMS integration, GitHub Actions for scheduling.

**Core technologies:**
- **Playwright 1.50+**: Headless browser — best SPA handling, auto-wait, actively maintained by Microsoft
- **Node.js 20 LTS**: Runtime — stable, async-native, matches ecosystem
- **WordPress REST API**: Data ingestion — built-in, no plugins needed beyond ACF
- **ACF 6.x**: Custom fields — already installed on site, native REST support
- **GitHub Actions**: Scheduling — free, runs cron jobs, no server to maintain

### Expected Features

**Must have (table stakes):**
- Auto-sync job listings from HR Duo to WordPress
- Job removal when delisted from HR Duo
- Apply link directing to HR Duo
- Card display (title, type, description) matching current style
- Error resilience (don't break site if HR Duo is down)

**Should have (after v1):**
- "No open roles" fallback message
- WP Admin sync status dashboard

**Defer (v2+):**
- Email alerts on sync failure
- Click analytics on apply links

### Architecture Approach

Three-component system: external scraper (Playwright + Node.js), WordPress plugin (CPT + ACF + template), and CI scheduler (GitHub Actions cron). Components are independent — scraper pushes data via REST API, WordPress plugin receives and displays it.

**Major components:**
1. **Scraper** (src/) — Playwright loads HR Duo SPA, extracts job data, validates structure
2. **WP Sync** (src/) — Diffs scraped jobs against existing WP posts, creates/updates/deletes via REST API
3. **WP Plugin** (wordpress/) — Registers job CPT, defines ACF fields, provides card template/shortcode
4. **CI Scheduler** (.github/) — GitHub Actions cron triggers scraper daily

### Critical Pitfalls

1. **SPA DOM changes break scraper** — Use resilient selectors, validate data structure before syncing
2. **Delete-all on scraper failure** — Zero-result safety check: if 0 jobs found but WP has jobs, skip deletion
3. **Credentials exposed** — Use GitHub Secrets, .gitignore .env, minimal-permission WP user
4. **Headless browser fails in CI** — Install deps with `playwright install --with-deps`, test in CI early
5. **ACF REST not enabled** — Must toggle "Show in REST API" in ACF field group settings

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Scraper + CI Pipeline
**Rationale:** Core capability must work first — everything else depends on extracting job data
**Delivers:** Working Playwright scraper that extracts jobs from HR Duo, running in GitHub Actions
**Addresses:** Auto-sync (table stakes), error resilience
**Avoids:** Headless browser CI pitfall (test early), DOM change fragility (resilient selectors)

### Phase 2: WordPress Plugin + Sync
**Rationale:** Data destination must exist before sync can work — CPT, ACF fields, REST API setup
**Delivers:** WP plugin with job CPT, ACF fields, REST API sync, diff-based create/update/delete
**Addresses:** Job storage, removal logic, ACF integration
**Avoids:** ACF REST not enabled (verify during setup), delete-all pitfall (zero-result safety)

### Phase 3: Card Template + Deployment
**Rationale:** Visual output — once data flows, display it on the careers page
**Delivers:** Job card template matching existing Indeed style, shortcode integration, end-to-end working system
**Addresses:** Visual parity, apply links, "no jobs" fallback
**Avoids:** Stale content (summary + link approach, not full description)

### Phase Ordering Rationale

- Phase 1 first because scraper is the riskiest component (depends on external SPA structure) — validate early
- Phase 2 second because sync logic requires knowing the exact data structure from Phase 1
- Phase 3 last because template is straightforward once data is flowing

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** HR Duo page structure is unknown until maintenance ends — scraper selectors need real page inspection

Phases with standard patterns (skip research-phase):
- **Phase 2:** WordPress REST API + ACF is well-documented, established patterns
- **Phase 3:** PHP template/shortcode is standard WordPress development

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Playwright + WP REST API is well-established pattern |
| Features | HIGH | Simple scope, clear requirements |
| Architecture | HIGH | Standard scrape-transform-load pattern |
| Pitfalls | HIGH | Well-known domain risks, all preventable |

**Overall confidence:** HIGH

### Gaps to Address

- **HR Duo page structure:** Cannot inspect DOM while site is in maintenance — Phase 1 planning needs to account for this, potentially starting with a discovery step once the page is back up
- **Exact ACF field names:** Need to check what ACF setup exists on croommedical.com — may need to create new field group or adapt existing one

## Sources

### Primary (HIGH confidence)
- [ACF REST API Integration](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/) — native REST support confirmed
- [Playwright vs Puppeteer 2026](https://research.aimultiple.com/playwright-vs-puppeteer/) — Playwright recommended for SPA

### Secondary (MEDIUM confidence)
- [Web scraping best practices](https://www.scraperapi.com/web-scraping/best-practices/) — rate limiting, error handling patterns
- [Serverless scraping architecture](https://www.grepsr.com/blog/serverless-web-scraping-scaling-scraping-with-cloud-functions/) — GitHub Actions approach

---
*Research completed: 2026-02-17*
*Ready for roadmap: yes*
