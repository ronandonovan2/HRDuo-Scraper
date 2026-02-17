'use strict';

const { chromium } = require('playwright');

/**
 * Scrapes job listings from the HR Duo candidate portal SPA.
 *
 * @param {object} config - Configuration object from src/config.js
 * @param {string} config.url - HR Duo portal URL to navigate to
 * @param {object} config.selectors - CSS selectors for job card elements
 * @param {number} config.timeout - Maximum wait time in milliseconds
 * @returns {Promise<Array<{title: string, type: string, description: string, applyUrl: string}>>}
 */
async function scrapeJobs(config) {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log(`Navigating to HR Duo: ${config.url}`);
    try {
      await page.goto(config.url, {
        waitUntil: 'networkidle',
        timeout: config.timeout,
      });
    } catch (navError) {
      console.warn(
        `WARNING: Navigation to HR Duo timed out or failed: ${navError.message}\n` +
        'HR Duo may be in maintenance or unreachable. Returning 0 jobs.'
      );
      return [];
    }

    // Wait for job cards to appear — the SPA needs JS to finish rendering
    try {
      await page.waitForSelector(config.selectors.jobCard, {
        timeout: config.timeout,
      });
    } catch (waitError) {
      console.warn(
        `WARNING: Job card selector "${config.selectors.jobCard}" not found within ${config.timeout}ms. ` +
        'HR Duo may be in maintenance or the selector needs updating.'
      );
      return [];
    }

    const jobCards = await page.$$(config.selectors.jobCard);
    console.log(`Found ${jobCards.length} job cards`);

    if (jobCards.length === 0) {
      return [];
    }

    const jobs = [];

    for (const card of jobCards) {
      try {
        // Extract title
        const titleEl = await card.$(config.selectors.title);
        const title = titleEl ? (await titleEl.textContent()).trim() : '';

        // Extract type / category
        const typeEl = await card.$(config.selectors.type);
        const type = typeEl ? (await typeEl.textContent()).trim() : '';

        // Extract description (truncate to 200 chars to avoid duplicating too much HR Duo content)
        const descEl = await card.$(config.selectors.description);
        const rawDescription = descEl ? (await descEl.textContent()).trim() : '';
        const description = rawDescription.length > 200
          ? rawDescription.slice(0, 197) + '...'
          : rawDescription;

        // Extract apply URL — resolve relative URLs against the base
        const applyEl = await card.$(config.selectors.applyLink);
        let applyUrl = '';
        if (applyEl) {
          const href = await applyEl.getAttribute('href');
          if (href) {
            // Resolve relative paths against the base URL
            applyUrl = href.startsWith('http')
              ? href
              : new URL(href, config.url).href;
          }
        }

        jobs.push({ title, type, description, applyUrl });
      } catch (cardError) {
        console.warn(`WARNING: Failed to extract data from a job card: ${cardError.message}`);
      }
    }

    console.log(`Extraction complete — extracted ${jobs.length} jobs`);
    return jobs;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeJobs };
