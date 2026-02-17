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

  let jobs;
  try {
    jobs = await scrapeJobs(config);
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

  // Zero-result safety: protect existing data when scraper finds nothing
  if (validJobs.length === 0) {
    const existingDataExists = fs.existsSync(OUTPUT_PATH);

    if (existingDataExists) {
      console.warn(
        'WARNING: Scraper found 0 valid jobs. Preserving existing jobs.json to prevent data loss.\n' +
        'This may indicate HR Duo is in maintenance, the selectors need updating, or a scraper failure.\n' +
        'Inspect https://my.hrduo.com/candidate-jobs/Croom_Medical manually to diagnose.'
      );
      process.exit(1);
    } else {
      // First run with no results — write empty array so subsequent runs have a file to check
      console.log('No existing jobs.json found and 0 jobs scraped. Writing empty array for first run.');
      fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify([], null, 2), 'utf8');
      console.log('Wrote empty jobs.json. Re-run when HR Duo is live.');
      process.exit(1);
    }
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
