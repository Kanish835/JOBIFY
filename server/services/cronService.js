import cron from 'node-cron';

export function startCronJobs() {
  // Run scraper every day at 7 AM IST
  cron.schedule('0 7 * * *', async () => {
    console.log('\n⏰ [CRON] Morning scraping job triggered at', new Date().toLocaleString());
    // Import dynamically to avoid circular deps
    const { runAllScrapers } = await import('../scrapers/index.js');
    try {
      await runAllScrapers('Software Developer', 'India', 15);
      console.log('✅ [CRON] Morning scrape complete');
    } catch (err) {
      console.error('❌ [CRON] Scrape failed:', err.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  console.log('⏰ Cron jobs scheduled (daily at 7:00 AM IST)');
}
