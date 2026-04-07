/**
 * ═══════════════════════════════════════════════════════════
 *  UNSTOP SCRAPER - Playwright Automation
 *  Scrapes opportunities from Unstop (formerly D2C)
 * ═══════════════════════════════════════════════════════════
 */
import { BaseScraper } from './baseScraper.js';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';

export class UnstopScraper extends BaseScraper {
  constructor() {
    super('Unstop');
    this.baseUrl = 'https://unstop.com';
  }

  async scrape(jobTitle, location = '', maxJobs = 20) {
    const jobs = [];

    try {
      await this.launch(true);

      const url = `${this.baseUrl}/jobs?keyword=${encodeURIComponent(jobTitle)}&type=hiring-challenges,jobs`;

      console.log(`🔍 [Unstop] Searching: "${jobTitle}"`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.humanDelay(3000, 5000);

      await this.autoScroll(4);
      await this.humanDelay(2000, 3000);

      const html = await this.page.content();
      const pageJobs = this.parseJobListings(html);

      for (const job of pageJobs) {
        if (jobs.length >= maxJobs) break;
        const exists = await Job.findOne({ jobId: job.jobId });
        if (exists) continue;
        jobs.push(job);
        console.log(`✅ [Unstop] Scraped: ${job.title} @ ${job.company} (${jobs.length}/${maxJobs})`);
      }

      if (jobs.length > 0) {
        await Job.insertMany(jobs, { ordered: false }).catch(() => {});
        console.log(`💾 [Unstop] Saved ${jobs.length} new jobs`);
      }

    } catch (error) {
      console.error(`❌ [Unstop] Error:`, error.message);
    } finally {
      await this.close();
    }

    return jobs;
  }

  parseJobListings(html) {
    const $ = cheerio.load(html);
    const jobs = [];

    const jobCards = $('.single_profile, .opp-listing, .opportunity-card, .listing-card');

    jobCards.each((i, el) => {
      const card = $(el);
      const title = card.find('.single_profile_title, .opp-title, h2, h3').first().text().trim();
      const company = card.find('.opp-company, .company-name, .single_profile_company').first().text().trim();
      const location = card.find('.location, .loc').first().text().trim();
      const applyUrl = card.find('a').first().attr('href') || '';
      const logo = card.find('img').first().attr('src') || '';
      const posted = card.find('.date, .days-left').first().text().trim();

      if (title) {
        jobs.push({
          jobId: this.generateJobId('unstop', company || 'unknown', title),
          title,
          company: company || 'Unstop Opportunity',
          location: location || 'Not specified',
          platform: 'Unstop',
          jdText: '',
          applyUrl: applyUrl.startsWith('http') ? applyUrl : `${this.baseUrl}${applyUrl}`,
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
