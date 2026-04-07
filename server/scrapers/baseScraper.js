/**
 * ═══════════════════════════════════════════════════════════
 *  BASE SCRAPER - Playwright Stealth Engine
 *  Common functionality for all platform scrapers
 * ═══════════════════════════════════════════════════════════
 */
import { chromium } from 'playwright';

// ── Stealth User Agents ────────────────────────────────────
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
];

export class BaseScraper {
  constructor(platformName) {
    this.platformName = platformName;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.minDelay = parseInt(process.env.SCRAPE_DELAY_MIN) || 5000;
    this.maxDelay = parseInt(process.env.SCRAPE_DELAY_MAX) || 10000;
  }

  // ── Launch Browser with Stealth ──────────────────────────
  async launch(headless = false) {
    console.log(`🌐 [${this.platformName}] Launching Playwright browser...`);

    this.browser = await chromium.launch({
      headless,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ]
    });

    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    this.context = await this.browser.newContext({
      userAgent,
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'Asia/Kolkata',
      geolocation: { latitude: 11.0168, longitude: 76.9558 },
      permissions: ['geolocation'],
      javaScriptEnabled: true,
    });

    // ── Stealth: Override navigator properties ──
    await this.context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      window.chrome = { runtime: {} };
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters);
    });

    this.page = await this.context.newPage();

    // Block unnecessary resources for speed
    await this.page.route('**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf}', route => route.abort());
    await this.page.route('**/analytics**', route => route.abort());
    await this.page.route('**/tracking**', route => route.abort());
    await this.page.route('**/ads**', route => route.abort());

    console.log(`✅ [${this.platformName}] Browser launched with stealth mode`);
    return this.page;
  }

  // ── Random Human-like Delay ──────────────────────────────
  async humanDelay(min = this.minDelay, max = this.maxDelay) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏳ [${this.platformName}] Waiting ${delay}ms (human simulation)...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // ── Scroll Down Smoothly ─────────────────────────────────
  async autoScroll(scrollCount = 3) {
    for (let i = 0; i < scrollCount; i++) {
      await this.page.evaluate(() => {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      });
      await this.humanDelay(1000, 2500);
    }
  }

  // ── Safe Click with Retry ────────────────────────────────
  async safeClick(selector, timeout = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      await this.page.click(selector);
      return true;
    } catch {
      console.log(`⚠️ [${this.platformName}] Could not click: ${selector}`);
      return false;
    }
  }

  // ── Safe Text Extraction ─────────────────────────────────
  async safeText(selector, fallback = '') {
    try {
      const el = await this.page.$(selector);
      if (el) return (await el.textContent()).trim();
      return fallback;
    } catch {
      return fallback;
    }
  }

  // ── Type Like a Human ────────────────────────────────────
  async humanType(selector, text) {
    await this.page.click(selector);
    for (const char of text) {
      await this.page.keyboard.type(char, { delay: Math.random() * 150 + 50 });
    }
  }

  // ── Close Browser ────────────────────────────────────────
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log(`🔒 [${this.platformName}] Browser closed`);
    }
  }

  // ── Generate Unique Job ID ───────────────────────────────
  generateJobId(platform, company, title) {
    const slug = `${platform}-${company}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100);
    return slug;
  }
}
