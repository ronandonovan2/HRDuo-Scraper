'use strict';

/**
 * Scraper configuration for the HR Duo candidate portal.
 *
 * Selectors verified against live DOM (2026-02-17).
 * HR Duo uses a Vue SPA with Bulma CSS — cards use .custom-job-card class,
 * detail rows use .job-details-row with .job-detail-label spans.
 */
const config = {
  /** Public HR Duo candidate portal URL for Croom Medical */
  url: 'https://my.hrduo.com/candidate-jobs/Croom_Medical',

  selectors: {
    /** Container element wrapping a single job listing (Vue component with custom-job-card class) */
    jobCard: '.custom-job-card',

    /** Job title — h3 inside card-header; text node only (excludes .job-code span) */
    title: 'h3.title',

    /** Job detail rows inside .card-content — each row has a .job-detail-label and a value span */
    detailRow: '.job-details-row',

    /** Apply/View Job link in card footer */
    applyLink: 'a.card-footer-item',
  },

  /** Maximum milliseconds to wait for job cards to appear after page load */
  timeout: 30000,

  /** Number of times to retry navigating if the first attempt fails */
  maxRetries: 2,
};

module.exports = { config };
