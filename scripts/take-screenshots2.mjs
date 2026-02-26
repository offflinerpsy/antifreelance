import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'web');
const VIEWPORT = { width: 1440, height: 900 };

const SITES = [
  { url: 'https://cal.com',             file: 'product-card.webp'    },
  { url: 'https://ghost.org',           file: 'product-page.webp'    },
  { url: 'https://posthog.com',         file: 'configurator.webp'    },
  { url: 'https://clerk.com',           file: 'medical-portal.webp'  },
  { url: 'https://cursor.com',          file: 'projects.webp'        },
  { url: 'https://deno.com',            file: 'screenshot-app.webp'  },
  { url: 'https://neon.tech',           file: 'contacts.webp'        },
  { url: 'https://turso.tech',          file: 'online-store.webp'    },
];

async function shot(page, site) {
  console.log(`→ ${site.url}`);
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    try { await page.keyboard.press('Escape'); } catch {}
    await page.waitForTimeout(2500);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    const outPath = path.join(OUT_DIR, site.file);
    await sharp(buf)
      .resize(1440, 900, { fit: 'cover', position: 'top' })
      .webp({ quality: 82 })
      .toFile(outPath);
    console.log(`   ✓ ${site.file}`);
  } catch (err) {
    console.error(`   ✗ ${err.message.slice(0, 60)}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'en-US' });
  const page = await ctx.newPage();
  await page.route('**/{analytics,gtag,hotjar,intercom}**', r => r.abort());

  for (const site of SITES) await shot(page, site);

  await browser.close();
  console.log('\n✅ Done!');
})();
