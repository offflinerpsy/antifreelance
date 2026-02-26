/**
 * Screenshot collection script.
 * Takes full-page screenshots of beautiful modern websites,
 * crops to 1440×900 viewport shots, saves as WebP.
 *
 * Run: node scripts/take-screenshots.mjs
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'web');

// 16 beautiful websites matched to portfolio image slots
const SITES = [
  { url: 'https://linear.app',          file: 'corporate-portal.webp',   title: 'Linear – Project Management',   scroll: 0    },
  { url: 'https://vercel.com',           file: 'landing-page.webp',       title: 'Vercel – Deploy',               scroll: 0    },
  { url: 'https://raycast.com',          file: 'multi-page.webp',         title: 'Raycast – Productivity',        scroll: 0    },
  { url: 'https://resend.com',           file: 'business-card.webp',      title: 'Resend – Email API',            scroll: 0    },
  { url: 'https://stripe.com',           file: 'complex-interface.webp',  title: 'Stripe – Payments',             scroll: 0    },
  { url: 'https://framer.com',           file: 'home-page.webp',          title: 'Framer – Web Design',           scroll: 0    },
  { url: 'https://lottiefiles.com',      file: 'app-interface.webp',      title: 'LottieFiles – Animations',      scroll: 0    },
  { url: 'https://arc.net',              file: 'product-card.webp',       title: 'Arc Browser',                   scroll: 0    },
  { url: 'https://railway.app',          file: 'real-estate.webp',        title: 'Railway – Deploy',              scroll: 0    },
  { url: 'https://supabase.com',         file: 'product-page.webp',       title: 'Supabase – Backend',            scroll: 0    },
  { url: 'https://craft.do',             file: 'configurator.webp',       title: 'Craft – Writing App',           scroll: 0    },
  { url: 'https://notion.so',            file: 'medical-portal.webp',     title: 'Notion – Workspace',            scroll: 0    },
  { url: 'https://figma.com',            file: 'projects.webp',           title: 'Figma – Design Tool',           scroll: 0    },
  { url: 'https://warp.dev',             file: 'screenshot-app.webp',     title: 'Warp – Terminal',               scroll: 0    },
  { url: 'https://retool.com',           file: 'contacts.webp',           title: 'Retool – Internal Tools',       scroll: 0    },
  { url: 'https://planetscale.com',      file: 'online-store.webp',       title: 'PlanetScale – Database',        scroll: 0    },
];

const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, site) {
  console.log(`→ ${site.url}`);
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Dismiss cookie banners / popups
    try {
      await page.keyboard.press('Escape');
      const acceptors = ['[id*="accept"]', '[class*="accept"]', 'button:has-text("Accept")', 'button:has-text("Got it")', 'button:has-text("OK")', 'button:has-text("Agree")'];
      for (const sel of acceptors) {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 800 })) { await el.click(); break; }
      }
    } catch {}
    await page.waitForTimeout(2000);
    if (site.scroll) await page.evaluate((y) => window.scrollTo(0, y), site.scroll);
    await page.waitForTimeout(500);

    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    const outPath = path.join(OUT_DIR, site.file);
    await sharp(buf)
      .resize(1440, 900, { fit: 'cover', position: 'top' })
      .webp({ quality: 82 })
      .toFile(outPath);
    console.log(`   ✓ saved ${site.file}`);
  } catch (err) {
    console.error(`   ✗ ${site.url}: ${err.message}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'en-US', timezoneId: 'America/New_York' });
  const page = await ctx.newPage();

  // Block analytics / ads for speed
  await page.route('**/{google-analytics,gtag,hotjar,intercom,crisp,hubspot}**', r => r.abort());

  for (const site of SITES) {
    await shot(page, site);
  }

  await browser.close();
  console.log('\n✅ All done!');
})();
