/**
 * ═══════════════════════════════════════════════════════════
 *  NAUKRI SCRAPER - Playwright Automation
 *  Scrapes job listings from Naukri.com
 * ═══════════════════════════════════════════════════════════
 */
import { BaseScraper } from './baseScraper.js';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';

export class NaukriScraper extends BaseScraper {
  constructor() {
    super('Naukri');
    this.baseUrl = 'https://www.naukri.com';
  }

  async scrape(jobTitle, location = '', maxJobs = 20) {
    const jobs = [];

    try {
      await this.launch(true);

      const slug = jobTitle.toLowerCase().replace(/\s+/g, '-');
      const locSlug = location ? `-in-${location.toLowerCase().replace(/\s+/g, '-')}` : '';
      const url = `${this.baseUrl}/${slug}-jobs${locSlug}?k=${encodeURIComponent(jobTitle)}`;

      console.log(`🔍 [Naukri] Searching: "${jobTitle}" in "${location}"`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.humanDelay(3000, 5000);

      // Dismiss popups
      await this.safeClick('#login-widget .cross-icon', 3000);
      await this.safeClick('.chatbot_closeButton', 2000);

      await this.autoScroll(4);
      await this.humanDelay(2000, 3000);

      const html = await this.page.content();
      const pageJobs = this.parseJobListings(html);

      for (const job of pageJobs) {
        if (jobs.length >= maxJobs) break;
        const exists = await Job.findOne({ jobId: job.jobId });
        if (exists) continue;
        jobs.push(job);
        console.log(`✅ [Naukri] Scraped: ${job.title} @ ${job.company} (${jobs.length}/${maxJobs})`);
      }

      if (jobs.length > 0) {
        await Job.insertMany(jobs, { ordered: false }).catch(() => {});
        console.log(`💾 [Naukri] Saved ${jobs.length} new jobs`);
      }

    } catch (error) {
      console.error(`❌ [Naukri] Error:`, error.message);
    } finally {
      await this.close();
    }

    return jobs;
  }

  parseJobListings(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    const jobCards = $('.srp-jobtuple-wrapper, .jobTupleHeader, article.jobTuple');

    jobCards.each((i, el) => {
      const card = $(el);
      const title = card.find('.title, a.title, .row1 a').first().text().trim();
      const company = card.find('.comp-name, .subTitle .companyName, a.comp-name').first().text().trim();
      const location = card.find('.loc-wrap .locWrap, .location .loc, .loc-wrap span, .locWrap').first().text().trim();
      const salary = card.find('.sal-wrap .salary, .ni-job-tuple-icon .salary, .sal-wrap span').first().text().trim();
      const experience = card.find('.exp-wrap .expwrap, .exp-wrap span, .ni-job-tuple-icon .experience').first().text().trim();
      const applyUrl = card.find('a.title, a[href*="/job-listings/"]').first().attr('href') || '';
      const logo = card.find('.comp-logo img, .logo img').first().attr('src') || '';
      const posted = card.find('.job-post-day, .fleft.fw500.grey-text').first().text().trim();
      const jdSnippet = card.find('.job-desc, .ellipsis.job-desc, .row6').first().text().trim();

      if (title && company) {
        jobs.push({
          jobId: this.generateJobId('naukri', company, title),
          title,
          company,
          location: location || 'Not specified',
          salary,
          experienceRequired: experience,
          platform: 'Naukri',
          jdText: jdSnippet,
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
