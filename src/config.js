'use strict';

/**
 * Scraper configuration for the HR Duo candidate portal.
 *
 * Selectors are best-guess defaults based on common SPA job board patterns.
 * HR Duo was in maintenance during initial build — update selectors after
 * inspecting the live DOM with DevTools.
 *
 * To update selectors:
 *   1. Open https://my.hrduo.com/candidate-jobs/Croom_Medical in Chrome
 *   2. Right-click a job card -> Inspect
 *   3. Find stable selectors (prefer data-* attributes over CSS class hashes)
 *   4. Update the values below and re-run `npm run scrape`
 */
const config = {
  /** Public HR Duo candidate portal URL for Croom Medical */
  url: 'https://my.hrduo.com/candidate-jobs/Croom_Medical',

  selectors: {
    /** Container element wrapping a single job listing */
    jobCard: '.job-card', // TODO: verify selector against live page (fallback: '[class*="job"]')

    /** Job title element inside a job card */
    title: 'h2, h3, [class*="title"]', // TODO: verify selector against live page

    /** Job type / employment category element inside a job card */
    type: '[class*="type"], [class*="category"]', // TODO: verify selector against live page

    /** Job description or summary element inside a job card */
    description: '[class*="description"], [class*="summary"], p', // TODO: verify selector against live page

    /** "Apply" link element inside a job card — href must contain the job UUID */
    applyLink: 'a[href*="candidate-jobs"]', // TODO: verify selector against live page
  },

  /** Maximum milliseconds to wait for job cards to appear after page load */
  timeout: 30000,

  /** Number of times to retry navigating if the first attempt fails */
  maxRetries: 2,
};

module.exports = { config };
