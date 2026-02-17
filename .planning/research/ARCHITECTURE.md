# Architecture Research

**Domain:** SPA web scraping + WordPress ACF integration
**Researched:** 2026-02-17
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     External Scraper Service                  │
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│  │ Scheduler │───>│ Scraper  │───>│ WP Sync  │                │
│  │ (Cron)   │    │(Playwright│    │ (REST API│                │
│  └──────────┘    │  + Parse) │    │  Client) │                │
│                  └──────────┘    └────┬─────┘                │
│                                       │                       │
└───────────────────────────────────────┼───────────────────────┘
                                        │ HTTPS
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    HR Duo SPA                                 │
│  my.hrduo.com/candidate-jobs/Croom_Medical                   │
│  (Source: JavaScript-rendered job listings)                    │
└─────────────────────────────────────────────────────────────┘

                                        │ HTTPS (WP REST API)
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    WordPress (croommedical.com)                │
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│  │  ACF     │    │ Custom   │    │ Card     │                │
│  │  Fields  │◄──│ Post Type│───>│ Template │                │
│  │          │    │ (Jobs)   │    │          │                │
│  └──────────┘    └──────────┘    └──────────┘                │
│                                       │                       │
│                                       ▼                       │
│                              /careers/ page                   │
│                          (public-facing cards)                │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Scheduler | Trigger scraper on schedule (daily) | GitHub Actions cron OR node-cron |
| Scraper | Load HR Duo SPA, wait for render, extract job data | Playwright with Chromium |
| Parser | Transform raw DOM data into structured job objects | JS selectors + data normalization |
| WP Sync Client | Create/update/delete WP posts via REST API | axios + WordPress Application Passwords |
| ACF Fields | Define job data schema | ACF field group (title, type, description, apply_url) |
| Custom Post Type | Store job listings as WP posts | Registered via functions.php or plugin |
| Card Template | Render job cards on /careers/ page | PHP template or shortcode matching Indeed-style |

## Recommended Project Structure

```
hrduo-scraper/
├── src/
│   ├── scraper.js          # Playwright scraping logic
│   ├── parser.js           # Extract structured data from page
│   ├── wp-sync.js          # WordPress REST API client
│   ├── index.js            # Main entry point (orchestrates scrape → sync)
│   └── config.js           # Environment config loader
├── wordpress/
│   ├── plugin/             # WP plugin for CPT + ACF + template
│   │   ├── hrduo-jobs.php  # Plugin main file (registers CPT, shortcode)
│   │   └── templates/
│   │       └── job-card.php # Card template
│   └── acf-export.json     # ACF field group export (importable)
├── .github/
│   └── workflows/
│       └── scrape.yml      # GitHub Actions scheduled workflow
├── .env.example            # Environment variable template
├── package.json
└── README.md
```

### Structure Rationale

- **src/:** Scraper code — runs externally, not on WordPress server
- **wordpress/:** WP plugin code — installed on WordPress site via admin
- **.github/:** CI/CD scheduling — triggers the scraper daily
- **Separation:** Scraper and WordPress plugin are independent — either can be updated without affecting the other

## Architectural Patterns

### Pattern 1: Scrape-Transform-Load (STL)

**What:** Three-stage pipeline: scrape raw data, transform to structured format, load into WordPress
**When to use:** Any external data → WordPress integration
**Trade-offs:** Clean separation but requires careful error handling between stages

**Example:**
```javascript
// index.js — orchestrator
const jobs = await scrapeHRDuo();     // Stage 1: Scrape
const parsed = parseJobs(jobs);        // Stage 2: Transform
await syncToWordPress(parsed);         // Stage 3: Load
```

### Pattern 2: Diff-based Sync

**What:** Compare scraped jobs against existing WP posts to determine create/update/delete operations
**When to use:** When source data changes over time and you need to keep destination in sync
**Trade-offs:** More complex than full replace, but avoids unnecessary API calls and preserves post IDs

**Example:**
```javascript
const scraped = await scrapeHRDuo();
const existing = await getExistingWPJobs();
const { toCreate, toUpdate, toDelete } = diffJobs(scraped, existing);
```

### Pattern 3: WordPress Application Passwords for Auth

**What:** Use WordPress built-in Application Passwords for REST API authentication
**When to use:** External service needs to create/update WP content
**Trade-offs:** Simple setup, no plugins needed, but password must be stored securely

## Data Flow

### Scrape → Sync Flow

```
[GitHub Actions Cron]
    ↓ (trigger)
[Playwright launches Chromium]
    ↓ (navigate)
[HR Duo SPA renders]
    ↓ (extract)
[Raw DOM elements]
    ↓ (parse)
[Structured job objects: {title, type, description, apply_url, hrduo_id}]
    ↓ (diff against existing)
[Create/Update/Delete operations]
    ↓ (WP REST API)
[WordPress custom posts updated]
    ↓ (page load)
[/careers/ renders updated job cards]
```

### Key Data Flows

1. **Job extraction:** Playwright → DOM query → structured JSON objects
2. **Sync to WP:** JSON objects → WP REST API POST/PUT/DELETE → ACF custom posts
3. **Public display:** ACF custom posts → PHP template → HTML cards on /careers/

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| HR Duo SPA | Headless browser scraping | No API — must render JavaScript to get content |
| WordPress REST API | HTTPS + Application Passwords | ACF fields exposed via native REST support (ACF 6.x) |
| GitHub Actions | Cron schedule trigger | Free tier sufficient for 2x daily runs |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Scraper ↔ WP Sync | In-process (JS objects) | Same Node.js process, no network call |
| WP Plugin ↔ Theme | Shortcode or template tag | Plugin registers CPT + shortcode, theme calls it |
| ACF ↔ REST API | Native integration | ACF 6.x exposes fields automatically when enabled |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1-20 jobs | Current architecture is perfect — no changes needed |
| 20-100 jobs | Add pagination handling in scraper if HR Duo paginates |
| 100+ jobs | Consider caching WP REST API responses, batch API calls |

Not a concern for Croom Medical — likely <20 open roles at any time.

---
*Architecture research for: SPA web scraping + WordPress ACF integration*
*Researched: 2026-02-17*
