import { GlassdoorScraper } from './glassdoorScraper.js';
import { LinkedInScraper } from './linkedinScraper.js';
import { NaukriScraper } from './naukriScraper.js';
import { UnstopScraper } from './unstopScraper.js';

export { GlassdoorScraper, LinkedInScraper, NaukriScraper, UnstopScraper };

/**
 * Run all scrapers for given search params
 */
export async function runAllScrapers(jobTitle, location, maxJobsPerPlatform = 20, platforms = []) {
  const allJobs = [];
  const results = { success: [], errors: [] };

  const scraperMap = {
    Glassdoor: GlassdoorScraper,
    LinkedIn: LinkedInScraper,
    Naukri: NaukriScraper,
    Unstop: UnstopScraper,
  };

  const activePlatforms = platforms.length > 0
    ? platforms
    : Object.keys(scraperMap);

  for (const platform of activePlatforms) {
    const ScraperClass = scraperMap[platform];
    if (!ScraperClass) {
      results.errors.push({ platform, error: 'Unknown platform' });
      continue;
    }

    try {
      console.log(`\n${'═'.repeat(50)}`);
      console.log(`  Starting ${platform} Scraper`);
      console.log(`${'═'.repeat(50)}\n`);

      const scraper = new ScraperClass();
      const jobs = await scraper.scrape(jobTitle, location, maxJobsPerPlatform);
      allJobs.push(...jobs);
      results.success.push({ platform, count: jobs.length });
    } catch (error) {
      console.error(`❌ ${platform} failed:`, error.message);
      results.errors.push({ platform, error: error.message });
    }
  }

  return { jobs: allJobs, results };
}
