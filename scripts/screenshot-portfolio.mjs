/**
 * Screenshot beautiful real websites for portfolio.
 * Saves to public/assets/web/ with clean English filenames.
 * Run: node scripts/screenshot-portfolio.mjs
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public/assets/web');

// 16 beautiful real websites — diverse categories, all English
const SITES = [
  { url: 'https://stripe.com', filename: 'corporate-portal.png', wait: 3000 },
  { url: 'https://shopify.com', filename: 'online-store.png', wait: 3000 },
  { url: 'https://linear.app', filename: 'landing-page.png', wait: 3000 },
  { url: 'https://cal.com', filename: 'business-card.png', wait: 3000 },
  { url: 'https://vercel.com', filename: 'multi-page.png', wait: 3000 },
  { url: 'https://supabase.com', filename: 'complex-interface.png', wait: 3000 },
  { url: 'https://raycast.com', filename: 'app-interface.png', wait: 3000 },
  { url: 'https://dub.co', filename: 'product-card.png', wait: 3000 },
  { url: 'https://framer.com', filename: 'configurator.png', wait: 3000 },
  { url: 'https://arc.net', filename: 'product-page.png', wait: 3000 },
  { url: 'https://posthog.com', filename: 'home-page.png', wait: 3000 },
  { url: 'https://zillow.com', filename: 'real-estate.png', wait: 3000 },
  { url: 'https://headspace.com', filename: 'medical-portal.png', wait: 3000 },
  { url: 'https://dribbble.com', filename: 'projects.png', wait: 3000 },
  { url: 'https://loom.com', filename: 'contacts.png', wait: 3000 },
  { url: 'https://pitch.com', filename: 'screenshot-app.png', wait: 3000 },
];

async function run() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  // Block cookie consent scripts where possible
  await context.addInitScript(() => {
    // Auto-accept common cookie banners
    window.addEventListener('load', () => {
      setTimeout(() => {
        const selectors = [
          '[data-testid="cookie-banner"] button',
          '#onetrust-accept-btn-handler',
          '.cookie-banner button',
          '[class*="cookie"] button[class*="accept"]',
          '[class*="consent"] button[class*="accept"]',
          'button[class*="cookie-accept"]',
          '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
          '.cc-dismiss',
          '.cc-accept',
        ];
        for (const sel of selectors) {
          const btn = document.querySelector(sel);
          if (btn) { btn.click(); break; }
        }
      }, 1500);
    });
  });

  let successes = 0;
  let failures = [];

  for (const site of SITES) {
    const outPath = path.join(OUTPUT_DIR, site.filename);
    console.log(`📸 ${site.url} → ${site.filename}`);
    
    const page = await context.newPage();
    try {
      await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // Extra wait for JS rendering + animations
      await page.waitForTimeout(site.wait);
      
      // Try to dismiss popups/overlays
      try {
        const overlay = await page.$('[class*="modal"], [class*="popup"], [class*="overlay"], [class*="banner"]');
        if (overlay) {
          const closeBtn = await overlay.$('button, [class*="close"], [aria-label="Close"]');
          if (closeBtn) await closeBtn.click();
        }
      } catch (_) { /* ignore */ }
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`  ✅ Saved`);
      successes++;
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      failures.push(site);
    }
    await page.close();
  }

  // Retry failures once with longer timeout
  if (failures.length > 0) {
    console.log(`\n🔄 Retrying ${failures.length} failed site(s)...`);
    for (const site of failures) {
      const outPath = path.join(OUTPUT_DIR, site.filename);
      console.log(`📸 Retry: ${site.url}`);
      const page = await context.newPage();
      try {
        await page.goto(site.url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(5000);
        await page.screenshot({ path: outPath, type: 'png' });
        console.log(`  ✅ Saved on retry`);
        successes++;
      } catch (err) {
        console.error(`  ❌ Still failed: ${err.message}`);
      }
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n🏁 Done: ${successes}/${SITES.length} screenshots saved to ${OUTPUT_DIR}`);
}

run().catch(console.error);
