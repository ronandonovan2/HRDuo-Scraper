# Pitfalls Research

**Domain:** SPA web scraping + WordPress ACF integration
**Researched:** 2026-02-17
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: SPA DOM Structure Changes Break Scraper

**What goes wrong:**
HR Duo updates their frontend (new release, redesign, or even minor CSS class changes) and the scraper's CSS selectors stop matching. Jobs silently stop syncing or extract garbage data.

**Why it happens:**
SPAs bundle CSS classes with hashes (e.g., `.job-card_a3f2b`), and third-party sites have no obligation to maintain stable markup. HR Duo already shows version numbers in their config (`v2726`), meaning they deploy frequently.

**How to avoid:**
- Use resilient selectors: prefer `[data-*]` attributes, semantic HTML tags, and text-based selectors over CSS classes
- Validate scraped data structure before syncing (e.g., every job must have a title and apply URL)
- Add a "sanity check" — if scraper finds 0 jobs but WordPress has jobs, don't delete everything (could be a scraper failure, not actual delisting)
- Log scraper output for debugging

**Warning signs:**
- Sync reports 0 jobs found when you know roles are open
- Job titles or descriptions contain HTML fragments or empty strings
- Sudden change in job count without HR team making changes

**Phase to address:**
Phase 1 (Scraper) — build resilient selectors and validation from the start

---

### Pitfall 2: Deleting All Jobs When Scraper Fails

**What goes wrong:**
Scraper runs but HR Duo is down (maintenance, network issue) or page structure changed. Scraper finds 0 jobs. Diff-sync deletes all existing WordPress posts. Careers page goes blank.

**Why it happens:**
Naive sync logic: "scraped 0 jobs, existing has 6, delete 6." No distinction between "source has no jobs" and "scraper failed to extract jobs."

**How to avoid:**
- **Zero-result safety:** If scraper finds 0 jobs but WordPress has >0, treat as potential error — log warning, skip deletion, keep existing posts
- Only delete when scraper successfully finds at least 1 job (confirms page loaded correctly)
- Add a "force delete" flag for intentional cleanup

**Warning signs:**
- All jobs disappear from careers page unexpectedly
- Sync logs show 0 jobs scraped during known-good period

**Phase to address:**
Phase 2 (WordPress Sync) — implement zero-result safety check

---

### Pitfall 3: WordPress Authentication Exposed

**What goes wrong:**
WordPress Application Password or API credentials stored in plain text in code, committed to git, or visible in GitHub Actions logs. Attacker gains write access to WordPress.

**Why it happens:**
Developer stores credentials in `.env` but accidentally commits it, or logs API responses that include auth headers.

**How to avoid:**
- Use GitHub Actions secrets for credentials (never hardcode)
- Add `.env` to `.gitignore` from day one
- Never log full API request/response headers
- Use a WordPress user with minimal permissions (only manage the job CPT, not full admin)

**Warning signs:**
- `.env` file appears in git history
- API credentials visible in CI logs

**Phase to address:**
Phase 1 (Setup) — configure secrets management before writing any sync code

---

### Pitfall 4: Headless Browser Fails in CI/CD Environment

**What goes wrong:**
Playwright works locally but fails on GitHub Actions: missing browser binaries, sandbox errors, timeout on slow CI runners, or out-of-memory errors.

**Why it happens:**
Headless browsers need system-level dependencies (libgbm, libnss, etc.) and enough memory/CPU. CI environments are often minimal containers.

**How to avoid:**
- Use `npx playwright install --with-deps chromium` in CI setup step
- Set adequate timeout (30s+) for page navigation
- Use Chromium only (not full Chrome) to reduce footprint
- Test the full scraper in CI early — don't wait until everything else is built

**Warning signs:**
- "Browser closed unexpectedly" errors
- Timeout errors on page.goto()
- Missing dependency errors in CI logs

**Phase to address:**
Phase 1 (Scraper) — test in GitHub Actions from first working scraper

---

### Pitfall 5: ACF REST API Not Enabled

**What goes wrong:**
Scraper runs, tries to push data to WordPress, gets 200 OK but ACF fields are empty. Posts are created but without any custom field data.

**Why it happens:**
ACF field groups have "Show in REST API" disabled by default. Must be explicitly enabled in ACF settings.

**How to avoid:**
- Enable "Show in REST API" in ACF field group settings before any sync testing
- Test with a manual curl/Postman POST request first to verify fields accept data
- Document the ACF setup step clearly

**Warning signs:**
- Posts created in WordPress but all ACF fields are blank
- REST API response shows post data but no `acf` key

**Phase to address:**
Phase 2 (WordPress Plugin) — verify ACF REST API during CPT setup

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded CSS selectors | Fast to implement | Breaks on any HR Duo update | MVP only — add selector validation |
| Full page replace (delete all + recreate) | Simpler sync logic | Loses WordPress post IDs, breaks any internal links | Never — use diff-based sync |
| No logging | Faster development | Impossible to debug production failures | Never — logging is essential |
| Storing full job description | More content on site | Duplicates HR Duo content, goes stale between syncs | Never — use summary + link |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| WordPress REST API | Sending ACF fields as top-level POST fields | Must nest under `acf` key: `{ acf: { field_name: value } }` |
| WordPress REST API | Using basic auth over HTTP | Must use HTTPS — Application Passwords reject HTTP |
| ACF Custom Post Type | Not setting `show_in_rest: true` on CPT registration | CPT must have `show_in_rest => true` for REST API to work |
| Playwright in CI | Not installing browser deps | Must run `playwright install --with-deps` |
| GitHub Actions cron | Expecting exact timing | GitHub Actions cron can be delayed 5-15 minutes — don't rely on exact time |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| WordPress admin credentials in scraper | Full site compromise if leaked | Use Application Passwords with minimal-role user |
| .env committed to git | Credential exposure | .gitignore from first commit, use GitHub Secrets |
| No rate limiting on sync endpoint | DoS vector on WordPress | Use Application Passwords (inherently limited) |

## "Looks Done But Isn't" Checklist

- [ ] **Scraper:** Often missing error handling for page load timeout — verify scraper handles HR Duo being slow/down
- [ ] **Sync:** Often missing deletion logic — verify jobs removed from HR Duo are removed from WordPress
- [ ] **ACF:** Often missing REST API toggle — verify fields are visible in REST API responses
- [ ] **Template:** Often missing "no jobs" state — verify careers page shows message when 0 jobs exist
- [ ] **CI:** Often missing browser deps — verify GitHub Actions can actually run Playwright
- [ ] **Auth:** Often missing credential rotation plan — verify Application Password can be regenerated

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| SPA DOM changes | Phase 1 (Scraper) | Scraper validates data structure before returning |
| Delete-all on failure | Phase 2 (WP Sync) | Zero-result safety check in sync logic |
| Auth exposure | Phase 1 (Setup) | .env in .gitignore, secrets in GitHub Actions |
| Headless browser in CI | Phase 1 (Scraper) | First scraper test runs in GitHub Actions |
| ACF REST not enabled | Phase 2 (WP Plugin) | Manual verification of REST API response |

## Sources

- [Web scraping best practices 2025](https://www.scraperapi.com/web-scraping/best-practices/) — rate limiting, error handling
- [Playwright vs Puppeteer comparison](https://research.aimultiple.com/playwright-vs-puppeteer/) — SPA scraping challenges
- [ACF REST API documentation](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/) — field group REST toggle

---
*Pitfalls research for: SPA web scraping + WordPress ACF integration*
*Researched: 2026-02-17*
