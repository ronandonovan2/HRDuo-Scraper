# Stack Research

**Domain:** SPA web scraping + WordPress ACF integration
**Researched:** 2026-02-17
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20 LTS | Runtime for scraper | Stable LTS, native async/await, matches WordPress ecosystem tooling |
| Playwright | 1.50+ | Headless browser for SPA scraping | Better SPA handling than Puppeteer, auto-wait for elements, multi-browser support, actively maintained by Microsoft |
| WordPress REST API | native (wp/v2) | Push job data to WordPress | Built into WordPress core, no additional plugins needed beyond ACF |
| ACF (Advanced Custom Fields) | 6.x | Custom fields for job posts | Already installed on Croom Medical site, native REST API support since v5.11 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node-cron | 3.x | Schedule scraper runs | If running as a persistent Node service |
| axios | 1.x | HTTP client for WP REST API calls | Pushing scraped data to WordPress |
| cheerio | 1.x | HTML parsing (backup) | If Playwright extracts raw HTML and we need to parse it |
| dotenv | 16.x | Environment variables | Store WordPress credentials, URLs, config |
| winston | 3.x | Logging | Track scraper runs, errors, and sync results |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| GitHub Actions | Scheduled scraper execution | Free tier, runs on cron schedule, no server needed |
| Docker (optional) | Containerize scraper | Only if deploying to cloud VM instead of GitHub Actions |

## Installation

```bash
# Core
npm install playwright axios dotenv

# Supporting
npm install node-cron winston cheerio

# Dev dependencies
npm install -D @playwright/test
npx playwright install chromium
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Playwright | Puppeteer | If stealth/anti-detection is critical (better stealth plugins) |
| GitHub Actions | AWS Lambda | If scraper needs to run more than 2x daily or needs sub-minute scheduling |
| GitHub Actions | Railway/Render | If you want a persistent always-on service |
| axios | node-fetch | If you prefer native fetch API style |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Puppeteer alone | Less robust SPA handling, Chromium-only, less active development | Playwright |
| Simple HTTP (fetch/axios) for scraping | HR Duo is an SPA — HTML is empty without JS rendering | Playwright headless browser |
| acf-to-rest-api plugin | Outdated third-party plugin, ACF 6.x has native REST support | ACF's built-in REST API |
| WP All Import | Overkill for this use case, adds plugin dependency | Direct REST API calls |
| Selenium | Slower, heavier, older API design | Playwright |

## Stack Patterns by Variant

**If running on GitHub Actions (recommended):**
- Use Playwright with Chromium only (smaller install)
- GitHub Actions cron schedule (e.g., `0 8,18 * * *` for 8am and 6pm)
- No persistent server needed

**If running on a VM/server:**
- Use node-cron for scheduling
- Consider PM2 for process management
- Docker for isolation

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Playwright 1.50+ | Node.js 18+ | Requires Node 18 minimum |
| ACF 6.x REST API | WordPress 6.x | Native support, no additional plugins |
| GitHub Actions | Playwright | Use `npx playwright install --with-deps chromium` in CI |

## Sources

- [Playwright vs Puppeteer 2026 comparison](https://research.aimultiple.com/playwright-vs-puppeteer/) — Playwright recommended for SPA scraping
- [ACF REST API docs](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/) — Native REST support confirmed
- [Serverless web scraping with cloud functions](https://www.grepsr.com/blog/serverless-web-scraping-scaling-scraping-with-cloud-functions/) — Architecture patterns

---
*Stack research for: SPA web scraping + WordPress ACF integration*
*Researched: 2026-02-17*
