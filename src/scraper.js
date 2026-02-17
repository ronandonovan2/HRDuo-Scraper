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
      // Use 'load' instead of 'networkidle' — the SPA keeps connections open
      // which causes networkidle to never resolve
      await page.goto(config.url, {
        waitUntil: 'load',
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
        // Extract title from h3 — strip the [Code: ...] span, keep only the title text
        const titleEl = await card.$(config.selectors.title);
        let title = '';
        if (titleEl) {
          title = await titleEl.evaluate(el => {
            // Get text from child nodes, excluding the .job-code span
            let text = '';
            for (const node of el.childNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
              }
            }
            return text.trim();
          });
        }

        // Extract detail rows (Location, Department, Job Type, Positions)
        const detailRows = await card.$$(config.selectors.detailRow);
        const details = {};
        for (const row of detailRows) {
          const label = await row.$('.job-detail-label');
          if (label) {
            const key = (await label.textContent()).replace(':', '').trim();
            // The value is the second span (sibling of the label)
            const val = await row.evaluate(el => {
              const spans = el.querySelectorAll('span');
              return spans.length > 1 ? spans[1].textContent.trim() : '';
            });
            details[key] = val;
          }
        }

        const type = details['Job Type'] || '';
        // Build description from available card details (no description on listing page)
        const descParts = [];
        if (details['Location']) descParts.push(details['Location']);
        if (details['Department']) descParts.push(details['Department']);
        const description = descParts.join(' — ');

        // Extract apply URL — resolve relative URLs against the base
        const applyEl = await card.$(config.selectors.applyLink);
        let applyUrl = '';
        if (applyEl) {
          const href = await applyEl.getAttribute('href');
          if (href) {
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
