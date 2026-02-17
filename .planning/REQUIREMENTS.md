# Requirements: HR Duo Job Scraper for Croom Medical

**Defined:** 2026-02-17
**Core Value:** Open roles posted in HR Duo automatically appear on croommedical.com/careers with working apply links back to HR Duo

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Scraping

- [ ] **SCRP-01**: Scraper loads HR Duo candidate portal SPA and extracts job listings
- [ ] **SCRP-02**: Scraper outputs a jobs.json file with title, type, description, and apply URL per job
- [ ] **SCRP-03**: GitHub Actions runs scraper daily and publishes jobs.json

### Display

- [ ] **DISP-01**: JavaScript snippet on careers page fetches jobs.json and renders job cards
- [ ] **DISP-02**: Cards show title, type, short description, and "Apply Now" button linking to HR Duo
- [ ] **DISP-03**: Careers page shows "No open roles at this time" when no jobs exist

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

- **V2-01**: Jobs grouped by department/category
- **V2-02**: Location field on job cards
- **V2-03**: WP Admin dashboard showing sync status
- **V2-04**: Email alerts on sync failure
- **V2-05**: Card styling enhancements (match Indeed layout exactly)

## Out of Scope

| Feature | Reason |
|---------|--------|
| WordPress REST API / ACF custom posts | Over-engineered — JSON + JS is simpler |
| Custom application form on WordPress | Candidates apply through HR Duo |
| Real-time sync | Daily sync sufficient for recruitment timelines |
| Job search/filtering | Likely <20 roles — visual scanning is faster |
| Full job description on WordPress | Summary + link avoids stale content |
| HR Duo API integration | No public API available |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCRP-01 | — | Pending |
| SCRP-02 | — | Pending |
| SCRP-03 | — | Pending |
| DISP-01 | — | Pending |
| DISP-02 | — | Pending |
| DISP-03 | — | Pending |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 0
- Unmapped: 6

---
*Requirements defined: 2026-02-17*
*Last updated: 2026-02-17 after simplification*
