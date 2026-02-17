# Roadmap: HR Duo Job Scraper for Croom Medical

## Overview

A Playwright scraper extracts job listings from the HR Duo candidate portal SPA, publishes a jobs.json file via GitHub Actions on a daily schedule, and a JavaScript snippet on the WordPress careers page fetches and renders that data as job cards. Two phases: build the data pipeline first, then wire up the display.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Scraper Pipeline** - Playwright scraper extracts HR Duo jobs and publishes jobs.json via GitHub Actions daily
- [ ] **Phase 2: Careers Page Display** - JavaScript snippet fetches jobs.json and renders job cards on the WordPress careers page

## Phase Details

### Phase 1: Scraper Pipeline
**Goal**: jobs.json containing current HR Duo listings is published to a public URL every day automatically
**Depends on**: Nothing (first phase)
**Requirements**: SCRP-01, SCRP-02, SCRP-03
**Success Criteria** (what must be TRUE):
  1. Running the scraper locally produces a valid jobs.json with title, type, description, and apply URL for each open role
  2. GitHub Actions runs the scraper on a daily cron schedule without manual intervention
  3. jobs.json is publicly accessible at a stable URL after each run
  4. If HR Duo returns zero jobs (downtime or error), the existing jobs.json is preserved and no empty file is published
**Plans**: TBD

Plans:
- [ ] 01-01: Build Playwright scraper that loads HR Duo SPA and extracts job data to jobs.json
- [ ] 01-02: Set up GitHub Actions workflow to run scraper daily and publish jobs.json

### Phase 2: Careers Page Display
**Goal**: Visitors to croommedical.com/careers see current HR Duo job listings as cards with working Apply Now links
**Depends on**: Phase 1
**Requirements**: DISP-01, DISP-02, DISP-03
**Success Criteria** (what must be TRUE):
  1. The careers page fetches jobs.json and renders one card per job showing title, type, short description, and an Apply Now button
  2. Clicking Apply Now on any card opens the correct HR Duo application page for that specific role
  3. When jobs.json contains no jobs, the careers page displays "No open roles at this time" instead of an empty section
**Plans**: TBD

Plans:
- [ ] 02-01: Add JavaScript snippet to WordPress careers page that fetches jobs.json and renders job cards

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scraper Pipeline | 0/2 | Not started | - |
| 2. Careers Page Display | 0/1 | Not started | - |
