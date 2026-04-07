/**
 * ═══════════════════════════════════════════════════════════
 *  GLASSDOOR SCRAPER - Playwright Automation
 *  Scrapes job listings from Glassdoor with stealth mode
 * ═══════════════════════════════════════════════════════════
 */
import { BaseScraper } from './baseScraper.js';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';

export class GlassdoorScraper extends BaseScraper {
  constructor() {
    super('Glassdoor');
    this.baseUrl = 'https://www.glassdoor.co.in';
  }

  /**
   * Main scrape method
   * @param {string} jobTitle - e.g., "React Developer"
   * @param {string} location - e.g., "Coimbatore"
   * @param {number} maxJobs - max jobs to scrape per run
   */
  async scrape(jobTitle, location = '', maxJobs = 20) {
    const jobs = [];

    try {
      await this.launch(true);

      // ── Build Search URL ─────────────────────────────────
      const searchQuery = encodeURIComponent(jobTitle);
      const locationQuery = location ? encodeURIComponent(location) : '';
      let url = `${this.baseUrl}/Job/jobs.htm?sc.keyword=${searchQuery}`;
      if (locationQuery) url += `&locT=C&locKeyword=${locationQuery}`;

      console.log(`🔍 [Glassdoor] Searching: "${jobTitle}" in "${location}"`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.humanDelay(3000, 5000);

      // ── Handle Cookie/Modal Popups ───────────────────────
      await this.dismissPopups();

      // ── Scrape Multiple Pages ────────────────────────────
      let pageNum = 1;
      while (jobs.length < maxJobs && pageNum <= 3) {
        console.log(`📄 [Glassdoor] Scraping page ${pageNum}...`);

        // Scroll to load lazy content
        await this.autoScroll(3);
        await this.humanDelay(2000, 4000);

        // Get page HTML
        const html = await this.page.content();
        const pageJobs = this.parseJobListings(html);

        for (const job of pageJobs) {
          if (jobs.length >= maxJobs) break;

          // Check for duplicates in DB
          const exists = await Job.findOne({ jobId: job.jobId });
          if (exists) {
            console.log(`⏭️  [Glassdoor] Skipping duplicate: ${job.title} @ ${job.company}`);
            continue;
          }

          // Try to get full JD by clicking into the job
          const fullJD = await this.getJobDescription(job);
          job.jdText = fullJD || job.jdText;

          jobs.push(job);
          console.log(`✅ [Glassdoor] Scraped: ${job.title} @ ${job.company} (${jobs.length}/${maxJobs})`);

          await this.humanDelay();
        }

        // Navigate to next page
        const hasNext = await this.goToNextPage();
        if (!hasNext) break;
        pageNum++;
        await this.humanDelay(3000, 6000);
      }

      // ── Save to Database ─────────────────────────────────
      if (jobs.length > 0) {
        const savedJobs = await Job.insertMany(jobs, { ordered: false }).catch(err => {
          // Handle duplicate key errors gracefully
          if (err.code === 11000) console.log('⚠️  Some duplicates skipped during insert');
          return err.insertedDocs || [];
        });
        console.log(`💾 [Glassdoor] Saved ${Array.isArray(savedJobs) ? savedJobs.length : 0} new jobs to DB`);
      }

    } catch (error) {
      console.error(`❌ [Glassdoor] Scraping error:`, error.message);
    } finally {
      await this.close();
    }

    return jobs;
  }

  // ── Parse Job Cards from HTML ────────────────────────────
  parseJobListings(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    // Glassdoor job card selectors (multiple patterns for resilience)
    const selectors = [
      'li[data-test="jobListing"]',
      '.JobsList_jobListItem__wjTHv',
      '.react-job-listing',
      'li.JobsList_jobListItem__JBBUV',
      '[data-jobid]',
    ];

    let jobCards = $([]);
    for (const sel of selectors) {
      jobCards = $(sel);
      if (jobCards.length > 0) break;
    }

    jobCards.each((i, el) => {
      const card = $(el);

      const title = card.find('[data-test="job-title"], .JobCard_jobTitle__GLyJ1, .jobTitle, a[data-test="job-link"]').first().text().trim()
        || card.find('a').first().text().trim();

      const company = card.find('[data-test="emp-name"], .EmployerProfile_compactEmployerName__9MGcV, .jobEmpolyerName').first().text().trim()
        || card.find('.employer-name').text().trim();

      const location = card.find('[data-test="emp-location"], .JobCard_location__Ds1fM, .location').first().text().trim();

      const salary = card.find('[data-test="detailSalary"], .JobCard_salaryEstimate__QpbTW, .salary-estimate').first().text().trim();

      const applyUrl = card.find('a[data-test="job-link"], a[href*="/job-listing/"]').first().attr('href') || '';

      const logoImg = card.find('img').first().attr('src') || '';

      const posted = card.find('[data-test="job-age"], .JobCard_listingAge__KopGm, .listing-age').first().text().trim();

      if (title && company) {
        jobs.push({
          jobId: this.generateJobId('glassdoor', company, title),
          title,
          company,
          location: location || 'Not specified',
          salary,
          platform: 'Glassdoor',
          jdText: '',
          applyUrl: applyUrl.startsWith('http') ? applyUrl : `${this.baseUrl}${applyUrl}`,
          companyLogo: logoImg,
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

  // ── Get Full Job Description ─────────────────────────────
  async getJobDescription(job) {
    try {
      // Try clicking on the job card to open detail pane
      const jobLink = await this.page.$(`a[href*="${job.applyUrl?.split('/').pop()}"]`);
      if (jobLink) {
        await jobLink.click();
        await this.humanDelay(2000, 3000);
      }

      // Extract JD from the detail pane
      const jdSelectors = [
        '[data-test="jobDescriptionContent"]',
        '.JobDetails_jobDescription__uW_fK',
        '.jobDescriptionContent',
        '.desc',
        '#JobDescriptionContainer',
      ];

      for (const sel of jdSelectors) {
        const jd = await this.safeText(sel);
        if (jd && jd.length > 50) return jd;
      }

      return '';
    } catch {
      return '';
    }
  }

  // ── Dismiss Cookie/Email Popups ──────────────────────────
  async dismissPopups() {
    const popupSelectors = [
      'button[data-test="close-button"]',
      '.modal_closeIcon',
      '#onetrust-accept-btn-handler',
      'button.ModalStyle_closeButton__3k5NS',
      '[aria-label="Close"]',
      'button[data-dismiss="modal"]',
    ];

    for (const sel of popupSelectors) {
      await this.safeClick(sel, 3000);
    }
    await this.humanDelay(1000, 2000);
  }

  // ── Navigate to Next Page ────────────────────────────────
  async goToNextPage() {
    const nextSelectors = [
      'button[data-test="pagination-next"]',
      '.nextButton',
      'a[data-test="pagination-next"]',
      'button.nextButton',
    ];

    for (const sel of nextSelectors) {
      const success = await this.safeClick(sel, 5000);
      if (success) return true;
    }
    return false;
  }
}
