# HR Duo Job Scraper for Croom Medical

## What This Is

An automated integration that scrapes job listings from Croom Medical's HR Duo candidate portal and displays them on the Croom Medical WordPress careers page. Candidates browse roles on croommedical.com and click through to apply on HR Duo. Replaces the existing Indeed integration.

## Core Value

Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo — no manual data entry.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Scraper extracts all open job listings from HR Duo candidate portal
- [ ] Job data syncs to WordPress as ACF custom posts via REST API
- [ ] Each job card displays: title, job type, short description, and "Apply Now" link
- [ ] "Apply Now" links candidates to the HR Duo application page for that role
- [ ] Scraper runs daily (once or twice) to keep listings current
- [ ] Jobs removed from HR Duo are removed from the WordPress site
- [ ] Card layout matches the current Indeed-style design on croommedical.com/careers
- [ ] Integration works with existing WordPress + Advanced Custom Fields setup

### Out of Scope

- Real-time sync (within minutes) — daily updates are sufficient
- Modifying the HR Duo portal or its application flow
- Building a custom application form on WordPress — candidates apply through HR Duo
- Mobile app — web only
- Job search/filtering on the WordPress side — simple listing display
- OAuth/API integration with HR Duo — no public API available

## Context

- **HR Duo portal**: https://my.hrduo.com/candidate-jobs/Croom_Medical (SPA, company ID 781)
- **Individual job URL pattern**: https://my.hrduo.com/candidate-jobs/Croom_Medical/{job-uuid}
- **Current careers page**: https://croommedical.com/careers/ — currently shows 6 roles from Indeed with "Read More" and "Apply Now" card layout
- **HR Duo is an SPA**: Page content is JavaScript-rendered, requires headless browser (Puppeteer/Playwright) for scraping. No public API or embed widget available.
- **WordPress site uses ACF** (Advanced Custom Fields) for content management
- **Deployment**: WP Admin access available for plugin/theme changes
- **Scraper hosting**: External service (cloud function, scheduled task, or similar)

## Constraints

- **No HR Duo API**: Must scrape the public candidate portal — headless browser required since it's an SPA
- **WordPress + ACF**: Must integrate with existing ACF setup, not introduce a separate CMS or database
- **Daily sync**: Scraper runs externally on a schedule (1-2 times per day)
- **Styling**: Must match existing card layout on croommedical.com/careers
- **Maintenance resilience**: Scraper must handle HR Duo downtime gracefully (keep existing listings, retry later)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Scrape HR Duo instead of API | No public API available | — Pending |
| Headless browser (Puppeteer/Playwright) | HR Duo is an SPA, simple HTTP won't work | — Pending |
| External scraper service | Keeps scraping logic separate from WordPress hosting | — Pending |
| WordPress REST API + ACF custom posts | Integrates with existing WordPress/ACF workflow | — Pending |
| Match existing Indeed card style | Consistency with current careers page design | — Pending |

---
*Last updated: 2026-02-17 after initialization*
