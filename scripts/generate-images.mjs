import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'cases');
const API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!API_TOKEN) {
  console.error('Set REPLICATE_API_TOKEN env variable');
  process.exit(1);
}

const BASE_NEGATIVE = 'no faces, no people, no text, no words, no letters, no numbers, no watermark, no artifacts, blurry text';

const IMAGE_SPECS = [
  // LuxeGlow Beauty (3 images)
  { slug: 'luxeglow', n: 1, prompt: 'Professional modern beauty salon reception desk with laptop showing appointment calendar dashboard, warm ambient lighting, cosmetic products neatly arranged, minimalist dark interior design, cinematic photography, moody lighting, 4k' },
  { slug: 'luxeglow', n: 2, prompt: 'Close-up of hands typing on laptop keyboard in a modern beauty salon, booking management software on screen, soft warm bokeh lights in background, dark elegant interior, professional photography' },
  { slug: 'luxeglow', n: 3, prompt: 'Modern tablet displaying customer notification interface on marble countertop, beauty products in background blurred, warm golden hour lighting, dark moody aesthetic, product photography' },

  // FreshBite Delivery (3 images)
  { slug: 'freshbite', n: 1, prompt: 'Multiple computer monitors showing food delivery order management dashboard in dark office, blue and orange interface glow, delivery tracking map on screen, modern tech startup office, cinematic lighting' },
  { slug: 'freshbite', n: 2, prompt: 'Smartphone displaying food delivery app interface next to laptop with analytics dashboard, dark desk, warm LED strip lighting, modern office setup, professional product photography' },
  { slug: 'freshbite', n: 3, prompt: 'Wide angle of modern logistics control room with screens showing delivery routes and order queues, dark ambient lighting, blue and orange accent lights, high-tech atmosphere' },

  // HealthFirst Clinic (3 images)
  { slug: 'healthfirst', n: 1, prompt: 'Medical dashboard on laptop screen in modern clinic office, stethoscope on desk, blue accent ambient lighting, clean minimalist medical interior, professional photography, dark moody tones' },
  { slug: 'healthfirst', n: 2, prompt: 'Tablet showing patient scheduling interface on white medical desk, medical equipment softly blurred in background, cool blue lighting, modern healthcare technology, cinematic shot' },
  { slug: 'healthfirst', n: 3, prompt: 'Modern clinic reception area with digital check-in screen showing appointment interface, dark elegant medical interior, ambient blue lighting, architectural photography' },

  // MetroFit Gym (3 images)
  { slug: 'metrofit', n: 1, prompt: 'Tablet mounted on wall showing gym class schedule app interface, gym equipment blurred in background, orange accent lighting, modern fitness center interior, professional photography' },
  { slug: 'metrofit', n: 2, prompt: 'Laptop on gym reception counter showing member management dashboard, dumbbells and equipment in background bokeh, orange and black color scheme, modern fitness studio' },
  { slug: 'metrofit', n: 3, prompt: 'Wide shot of modern gym interior with digital screens showing workout tracking interface, dark atmospheric lighting with orange accents, professional interior photography' },

  // UrbanNest Realty (3 images)
  { slug: 'urbannest', n: 1, prompt: 'Dual monitor setup showing real estate property listings and interactive map visualization, modern dark office, warm desk lamp, professional workspace photography, cinematic lighting' },
  { slug: 'urbannest', n: 2, prompt: 'Laptop displaying real estate CRM dashboard with lead pipeline, modern minimalist office desk, large window with city skyline blurred behind, moody atmospheric photography' },
  { slug: 'urbannest', n: 3, prompt: 'Modern real estate office with large screen showing property virtual tour interface, dark elegant interior design, warm accent lighting, architectural photography' },

  // TechEdge SaaS (3 images)
  { slug: 'techedge', n: 1, prompt: 'Ultrawide monitor showing code editor and terminal with deployment output, dim RGB LED lighting, modern developer desk setup, dark room, professional tech photography' },
  { slug: 'techedge', n: 2, prompt: 'Multiple monitors showing Slack integration dashboard and customer support analytics, dark modern office, purple and blue ambient lighting, tech startup atmosphere' },
  { slug: 'techedge', n: 3, prompt: 'Close-up of laptop screen showing API documentation and integration workflow diagram, dark desk, minimal lighting, professional developer workspace photography' },
];

async function createPrediction(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: '16:9',
        output_format: 'webp',
        output_quality: 90,
        go_fast: true,
      },
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function pollPrediction(id) {
  const url = `https://api.replicate.com/v1/predictions/${id}`;
  for (let i = 0; i < 90; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` },
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      if (data.status === 'succeeded') return data;
      if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(`Prediction ${id} ${data.status}: ${data.error}`);
      }
    } catch (e) {
      if (e.message.includes('Prediction')) throw e;
      console.log(`    poll retry (${e.message})`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error(`Prediction ${id} timed out`);
}

async function downloadAndProcess(imageUrl, outputPath) {
  let buffer;
  for (let r = 0; r < 3; r++) {
    try {
      const res = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
      buffer = Buffer.from(await res.arrayBuffer());
      break;
    } catch (e) {
      if (r === 2) throw e;
      console.log(`    download retry ${r + 1} (${e.message})`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Create dark tint overlay (gradient: dark top-left → subtle orange bottom-right)
  const { width, height } = await sharp(buffer).metadata();
  const w = Math.min(width || 1200, 1200);
  const h = Math.round(w * 9 / 16);

  const overlay = Buffer.from(
    `<svg width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgb(18,18,18)" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="rgb(255,94,0)" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>`
  );

  await sharp(buffer)
    .resize(w, h, { fit: 'cover' })
    .composite([{ input: overlay, blend: 'over' }])
    .webp({ quality: 85 })
    .toFile(outputPath);
}

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  console.log(`Generating ${IMAGE_SPECS.length} images...`);
  let cost = 0;

  for (const spec of IMAGE_SPECS) {
    const outFile = join(OUT_DIR, `${spec.slug}-${spec.n}.webp`);

    // Skip if already exists
    if (existsSync(outFile)) {
      console.log(`  SKIP ${spec.slug}-${spec.n}.webp (exists)`);
      continue;
    }

    console.log(`  [${spec.slug}-${spec.n}] Creating prediction...`);
    let prediction;
    for (let retry = 0; retry < 5; retry++) {
      try {
        prediction = await createPrediction(spec.prompt);
        break;
      } catch (e) {
        if (retry < 4) {
          const wait = e.message.includes('429') ? (10 + retry * 5) : (5 + retry * 3);
          console.log(`  [${spec.slug}-${spec.n}] Retry ${retry + 1} (${e.message.slice(0, 60)}), waiting ${wait}s...`);
          await new Promise(r => setTimeout(r, wait * 1000));
        } else throw e;
      }
    }
    console.log(`  [${spec.slug}-${spec.n}] Polling ${prediction.id}...`);
    const result = await pollPrediction(prediction.id);

    const imageUrl = result.output?.[0] || result.output;
    if (!imageUrl) {
      console.error(`  [${spec.slug}-${spec.n}] No output URL!`);
      continue;
    }

    console.log(`  [${spec.slug}-${spec.n}] Downloading + processing...`);
    await downloadAndProcess(imageUrl, outFile);
    cost += 0.003;
    console.log(`  [${spec.slug}-${spec.n}] DONE → ${spec.slug}-${spec.n}.webp ($${cost.toFixed(3)} total)`);

    // Rate limit: max 6 req/min with low credit, wait 11s between
    await new Promise(r => setTimeout(r, 11000));
  }

  console.log(`\nAll done! Generated ${IMAGE_SPECS.length} images. Estimated cost: $${cost.toFixed(3)}`);
}

main().catch(e => { console.error(e); process.exit(1); });
