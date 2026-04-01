'use strict';

const fs = require('fs');
const path = require('path');

const { config } = require('./config.js');
const { scrapeJobs } = require('./scraper.js');

const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'jobs.json');

/**
 * Validates that a job object has the required fields for publishing.
 *
 * @param {object} job - Job object from scraper
 * @returns {boolean} true if the job is valid
 */
function isValidJob(job) {
  return (
    typeof job.title === 'string' && job.title.trim() !== '' &&
    typeof job.applyUrl === 'string' && job.applyUrl.trim() !== '' &&
    'type' in job &&
    'description' in job
  );
}

/**
 * Main orchestrator: scrape -> validate -> write jobs.json
 */
async function main() {
  console.log('=== HR Duo Job Scraper ===');

  let jobs, pageLoaded;
  try {
    ({ jobs, pageLoaded } = await scrapeJobs(config));
  } catch (err) {
    console.error(`ERROR: Scraper threw an unexpected error: ${err.message}`);
    process.exit(1);
  }

  // Validate and filter jobs
  const validJobs = [];
  for (const job of jobs) {
    if (isValidJob(job)) {
      validJobs.push(job);
    } else {
      console.warn(
        `WARNING: Skipping invalid job — missing title or applyUrl. ` +
        `title="${job.title}", applyUrl="${job.applyUrl}"`
      );
    }
  }

  console.log(`Validation complete: ${validJobs.length} valid jobs (${jobs.length - validJobs.length} filtered out)`);

  if (validJobs.length === 0) {
    if (!pageLoaded) {
      // Page failed to load — preserve existing data and signal failure so GitHub Actions alerts us
      console.warn(
        'WARNING: Scraper could not load HR Duo. Preserving existing jobs.json to prevent data loss.\n' +
        `Inspect ${config.url} manually to diagnose.`
      );
      process.exit(1);
    }

    // Page loaded cleanly but no roles are currently posted — this is normal
    console.log('No open roles currently posted on HR Duo. Writing empty jobs.json.');
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify([], null, 2), 'utf8');
    process.exit(0);
  }

  // Write valid jobs to data/jobs.json
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(validJobs, null, 2), 'utf8');
  console.log(`Successfully wrote ${validJobs.length} jobs to data/jobs.json`);
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
