# Feature Research

**Domain:** Job board scraping + WordPress career page integration
**Researched:** 2026-02-17
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Auto-sync job listings | Core purpose — jobs appear without manual entry | MEDIUM | Playwright scraper + WP REST API |
| Job removal when delisted | Stale listings destroy credibility | LOW | Compare scraped vs existing, remove missing |
| Apply link to HR Duo | Candidates need to actually apply | LOW | Link to individual job URL on HR Duo |
| Job title display | Minimum viable job card | LOW | Text field from scrape |
| Job type display | Candidates filter by full-time/part-time | LOW | Text field from scrape |
| Job description/summary | Candidates need to know what the role is | LOW | Text or excerpt from scrape |
| Matching visual style | Must look like it belongs on the site | MEDIUM | Match existing Indeed card layout |
| Error resilience | Scraper must not break site if HR Duo is down | LOW | Keep existing listings, log error, retry next run |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Department/category grouping | Organize jobs by team (Engineering, Admin, etc.) | LOW | If available in HR Duo data |
| Location display | Show office/site location | LOW | If available in HR Duo data |
| "No open roles" message | Professional fallback when no jobs exist | LOW | Conditional display in template |
| Email notification on sync failure | HR team knows if integration breaks | MEDIUM | Requires email service |
| Sync status dashboard (WP Admin) | See last sync time, job count, errors | MEDIUM | Custom admin page |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full job description on WordPress | "Keep candidates on our site" | Duplicates content, goes stale, candidates still apply on HR Duo | Show summary + "View Full Role & Apply" link to HR Duo |
| Search/filter on WordPress | "Let candidates filter jobs" | Over-engineering for likely <20 listings, maintenance burden | Simple list — if <20 jobs, users can scan visually |
| Real-time sync | "Jobs should appear instantly" | Requires webhooks or polling, HR Duo has no API, massive over-engineering | Daily sync is sufficient for recruitment timelines |
| Custom application form on WordPress | "Collect applications on our site" | Bypasses HR Duo workflow, data in two places, compliance risk | Link to HR Duo for applications |

## Feature Dependencies

```
[Playwright Scraper]
    └──requires──> [HR Duo page accessible]
                       └──feeds──> [WordPress REST API sync]
                                       └──requires──> [ACF Custom Post Type]
                                                          └──requires──> [Card Template]

[Job Removal] ──requires──> [Scraper + WP sync working]

[Error Handling] ──enhances──> [Scraper]
```

### Dependency Notes

- **Card Template requires ACF Custom Post Type:** Fields must be defined before template can render them
- **Sync requires Scraper:** Can't push data without first extracting it
- **Job Removal requires Sync:** Need to compare scraped list against existing WP posts

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Playwright scraper extracts jobs from HR Duo portal — core capability
- [ ] WordPress custom post type with ACF fields — data storage
- [ ] REST API sync (create/update/delete) — automation
- [ ] Card template matching current style — visual parity
- [ ] Apply link to HR Duo — candidate flow
- [ ] Scheduled daily execution — hands-off operation
- [ ] Basic error handling (graceful failure) — reliability

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] WP Admin sync status dashboard — when team wants visibility
- [ ] Email alerts on sync failure — when reliability matters
- [ ] Department/category grouping — if enough roles to justify

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Multiple job board scraping (Indeed + HR Duo) — if needed
- [ ] Analytics (click tracking on apply links) — when measuring recruitment effectiveness

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Auto-sync listings | HIGH | MEDIUM | P1 |
| Job removal | HIGH | LOW | P1 |
| Apply link to HR Duo | HIGH | LOW | P1 |
| Card template | HIGH | MEDIUM | P1 |
| Error resilience | HIGH | LOW | P1 |
| Scheduled execution | HIGH | LOW | P1 |
| No open roles message | MEDIUM | LOW | P2 |
| Sync status (admin) | MEDIUM | MEDIUM | P2 |
| Email alerts | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---
*Feature research for: Job board scraping + WordPress career page integration*
*Researched: 2026-02-17*
