/**
 * Screenshot beautiful real websites for portfolio.
 * Uses Playwright to capture FULL-PAGE screenshots of lesser-known
 * but award-winning sites (Awwwards SOTD, nominees, etc.).
 * Saves to public/assets/web/ with clean English filenames.
 * Run: node scripts/screenshot-portfolio.mjs
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public/assets/web');
const MIN_FILE_SIZE = 50_000; // 50 KB — anything smaller is likely a blank/error page

// 16 beautiful lesser-known websites — Awwwards winners/nominees, diverse categories
const SITES = [
  { url: 'https://www.farmminerals.com/promo', filename: 'corporate-portal.png', wait: 6000 },
  { url: 'https://littleampscoffee.com', filename: 'online-store.png', wait: 5000 },
  { url: 'https://tibico.co.uk', filename: 'landing-page.png', wait: 5000 },
  { url: 'https://www.izzywheels.com', filename: 'business-card.png', wait: 5000 },
  { url: 'https://www.absolutecollagen.com', filename: 'multi-page.png', wait: 5000 },
  { url: 'https://www.masonsofyorkshire.com', filename: 'complex-interface.png', wait: 5000 },
  { url: 'https://fresha-restaurant.ch', filename: 'app-interface.png', wait: 5000 },
  { url: 'https://www.chocolatfavoris.com', filename: 'product-card.png', wait: 5000 },
  { url: 'https://aupalevodka.com', filename: 'configurator.png', wait: 6000 },
  { url: 'https://bedouinsdaughter.com', filename: 'product-page.png', wait: 5000 },
  { url: 'https://bornandbred.com', filename: 'home-page.png', wait: 5000 },
  { url: 'https://ironhillbrewery.com', filename: 'real-estate.png', wait: 5000 },
  { url: 'https://olsonkundig.com', filename: 'medical-portal.png', wait: 5000 },
  { url: 'https://threadandmesh.com', filename: 'projects.png', wait: 5000 },
  { url: 'https://coolhunting.com', filename: 'contacts.png', wait: 5000 },
  { url: 'https://lepiantagionidelcaffe.com', filename: 'screenshot-app.png', wait: 5000 },
];

// Backup sites in case any primary site fails or returns a tiny image
const BACKUPS = [
  { url: 'https://scotts-shop.com', wait: 5000 },
  { url: 'https://slurpramen.dk', wait: 5000 },
  { url: 'https://www.neavita.it', wait: 5000 },
  { url: 'https://bastiensani.com', wait: 5000 },
  { url: 'https://www.silberthal.de', wait: 5000 },
  { url: 'https://gourou.fr', wait: 5000 },
];

/** Slowly scroll to the bottom of the page to trigger lazy-loaded content */
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top
          resolve();
        }
      }, 100);
      // Safety: max 30 seconds of scrolling
      setTimeout(() => { clearInterval(timer); window.scrollTo(0, 0); resolve(); }, 30000);
    });
  });
}

async function screenshotSite(context, site, outPath, attempt = 1) {
  const page = await context.newPage();
  try {
    const timeout = attempt === 1 ? 25000 : 40000;
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout });

    // Wait for initial render + animations
    await page.waitForTimeout(Math.min(site.wait, 3000));

    // Dismiss cookie banners / popups
    try {
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
        '[class*="modal"] button[class*="close"]',
        '[class*="popup"] button[class*="close"]',
        'button[aria-label="Close"]',
        'button[aria-label="close"]',
        'button[aria-label="Accept"]',
        'button[aria-label="Accept all"]',
        'button[aria-label="Accept cookies"]',
      ];
      for (const sel of selectors) {
        const btn = await page.$(sel);
        if (btn) { await btn.click().catch(() => {}); break; }
      }
    } catch (_) { /* ignore */ }

    // Scroll down to trigger lazy loading, then back to top
    await autoScroll(page);

    // Wait for remaining animations/images after scroll
    await page.waitForTimeout(site.wait);

    // Take FULL-PAGE screenshot
    await page.screenshot({ path: outPath, type: 'png', fullPage: true });

    // Validate file size
    const size = statSync(outPath).size;
    if (size < MIN_FILE_SIZE) {
      throw new Error(`File too small (${(size / 1024).toFixed(0)} KB) — likely a blank or error page`);
    }

    return true;
  } finally {
    await page.close();
  }
}

/** Create a fresh browser + context (isolated per-site to prevent cascading crashes) */
async function createBrowser() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  // Auto-accept cookie banners early
  await context.addInitScript(() => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const selectors = [
          '[data-testid="cookie-banner"] button',
          '#onetrust-accept-btn-handler',
          '.cookie-banner button',
          '[class*="cookie"] button[class*="accept"]',
          '[class*="consent"] button[class*="accept"]',
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

  return { browser, context };
}

async function run() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check which files already exist and are large enough to skip
  const skipExisting = process.argv.includes('--skip-existing');

  let successes = 0;
  const failed = [];
  let backupIdx = 0;

  for (const site of SITES) {
    const outPath = path.join(OUTPUT_DIR, site.filename);

    // Skip files that already exist and are large enough
    if (skipExisting && existsSync(outPath)) {
      try {
        const size = statSync(outPath).size;
        if (size >= MIN_FILE_SIZE) {
          console.log(`\n⏭️  ${site.filename} already exists (${(size / 1024).toFixed(0)} KB) — skipping`);
          successes++;
          continue;
        }
      } catch (_) { /* file error, re-screenshot */ }
    }

    console.log(`\n📸 ${site.url} → ${site.filename}`);

    // Each site gets its own browser to prevent cascading crashes
    let done = false;

    // Attempt 1
    {
      const { browser, context } = await createBrowser();
      try {
        await screenshotSite(context, site, outPath, 1);
        console.log(`  ✅ Saved (${(statSync(outPath).size / 1024).toFixed(0)} KB)`);
        successes++;
        done = true;
      } catch (err) {
        console.warn(`  ⚠️ Attempt 1 failed: ${err.message}`);
      }
      await browser.close().catch(() => {});
    }

    // Attempt 2 — retry same URL
    if (!done) {
      const { browser, context } = await createBrowser();
      try {
        await screenshotSite(context, site, outPath, 2);
        console.log(`  ✅ Saved on retry (${(statSync(outPath).size / 1024).toFixed(0)} KB)`);
        successes++;
        done = true;
      } catch (err) {
        console.warn(`  ⚠️ Attempt 2 failed: ${err.message}`);
      }
      await browser.close().catch(() => {});
    }

    // Attempt 3 — swap to backup
    if (!done && backupIdx < BACKUPS.length) {
      const backup = BACKUPS[backupIdx++];
      console.log(`  🔄 Trying backup: ${backup.url}`);
      const { browser, context } = await createBrowser();
      try {
        await screenshotSite(context, { ...backup, url: backup.url }, outPath, 1);
        console.log(`  ✅ Backup saved (${(statSync(outPath).size / 1024).toFixed(0)} KB)`);
        successes++;
        done = true;
      } catch (err) {
        console.error(`  ❌ Backup also failed: ${err.message}`);
      }
      await browser.close().catch(() => {});
    }

    if (!done) {
      failed.push(site);
      console.error(`  ❌ FAILED: ${site.filename}`);
    }
  }

  console.log(`\n🏁 Done: ${successes}/${SITES.length} screenshots saved to ${OUTPUT_DIR}`);
  if (failed.length) {
    console.log(`❌ Failed sites: ${failed.map(s => s.url).join(', ')}`);
  }
}

run().catch(console.error);
