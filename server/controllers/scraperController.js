import { runAllScrapers } from '../scrapers/index.js';

// POST /api/scraper/start - Start scraping job
export const startScraping = async (req, res) => {
  try {
    const { jobTitle, location, maxJobs = 20, platforms = [] } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ success: false, error: 'jobTitle is required' });
    }

    console.log(`\n🚀 Starting scrape: "${jobTitle}" in "${location || 'All'}"`);
    console.log(`   Platforms: ${platforms.length ? platforms.join(', ') : 'All'}`);
    console.log(`   Max jobs per platform: ${maxJobs}\n`);

    // Run scraping (this takes time)
    const { jobs, results } = await runAllScrapers(jobTitle, location, maxJobs, platforms);

    res.json({
      success: true,
      message: `Scraping complete. Found ${jobs.length} new jobs.`,
      data: {
        totalFound: jobs.length,
        results,
      }
    });
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/scraper/status
export const getScraperStatus = async (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'idle',
      lastRun: null,
      message: 'Ready to scrape',
    }
  });
};
