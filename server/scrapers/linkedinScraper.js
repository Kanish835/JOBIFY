/**
 * ═══════════════════════════════════════════════════════════
 *  LINKEDIN SCRAPER - Playwright Automation
 *  Scrapes job listings from LinkedIn Jobs (public search)
 * ═══════════════════════════════════════════════════════════
 */
import { BaseScraper } from './baseScraper.js';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';

export class LinkedInScraper extends BaseScraper {
  constructor() {
    super('LinkedIn');
    this.baseUrl = 'https://www.linkedin.com';
  }

  async scrape(jobTitle, location = '', maxJobs = 20) {
    const jobs = [];

    try {
      await this.launch(true);

      const searchQuery = encodeURIComponent(jobTitle);
      const locationQuery = encodeURIComponent(location || 'India');
      const url = `${this.baseUrl}/jobs/search/?keywords=${searchQuery}&location=${locationQuery}&f_TPR=r604800`;

      console.log(`🔍 [LinkedIn] Searching: "${jobTitle}" in "${location}"`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.humanDelay(3000, 6000);

      // Handle auth wall - LinkedIn may redirect to login
      const currentUrl = this.page.url();
      if (currentUrl.includes('/login') || currentUrl.includes('/authwall')) {
        console.log('⚠️  [LinkedIn] Auth wall detected. Trying public jobs page...');
        const publicUrl = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${locationQuery}`;
        await this.page.goto(publicUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.humanDelay(3000, 5000);
      }

      // Scroll to load jobs
      await this.autoScroll(5);
      await this.humanDelay(2000, 3000);

      const html = await this.page.content();
      const pageJobs = this.parseJobListings(html);

      for (const job of pageJobs) {
        if (jobs.length >= maxJobs) break;

        const exists = await Job.findOne({ jobId: job.jobId });
        if (exists) continue;

        jobs.push(job);
        console.log(`✅ [LinkedIn] Scraped: ${job.title} @ ${job.company} (${jobs.length}/${maxJobs})`);
      }

      // ── Save to DB ──────────────────────────────────────
      if (jobs.length > 0) {
        await Job.insertMany(jobs, { ordered: false }).catch(err => {
          if (err.code === 11000) console.log('⚠️  Duplicates skipped');
          return err.insertedDocs || [];
        });
        console.log(`💾 [LinkedIn] Saved ${jobs.length} new jobs`);
      }

    } catch (error) {
      console.error(`❌ [LinkedIn] Error:`, error.message);
    } finally {
      await this.close();
    }

    return jobs;
  }

  parseJobListings(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    const selectors = [
      '.base-card',
      '.job-search-card',
      '.jobs-search__results-list li',
      'div[data-entity-urn]',
    ];

    let jobCards = $([]);
    for (const sel of selectors) {
      jobCards = $(sel);
      if (jobCards.length > 0) break;
    }

    jobCards.each((i, el) => {
      const card = $(el);
      const title = card.find('.base-search-card__title, .job-search-card__title, h3').first().text().trim();
      const company = card.find('.base-search-card__subtitle, .job-search-card__subtitle, h4').first().text().trim();
      const location = card.find('.job-search-card__location, .base-search-card__metadata').first().text().trim();
      const applyUrl = card.find('a.base-card__full-link, a[href*="/jobs/view/"]').first().attr('href') || '';
      const logo = card.find('img').first().attr('data-delayed-url') || card.find('img').first().attr('src') || '';
      const posted = card.find('time').first().text().trim();

      if (title && company) {
        jobs.push({
          jobId: this.generateJobId('linkedin', company, title),
          title,
          company,
          location: location || 'Not specified',
          platform: 'LinkedIn',
          jdText: '',
          applyUrl,
          companyLogo: logo,
          postedDate: posted,
          status: 'New',
          matchScore: 0,
          matchedSkills: [],
          missingSkills: [],
        });
      }
    });

    return jobs;
  }
}
