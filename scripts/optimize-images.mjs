import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const QUALITY = 80;
const MAX_WIDTH = 1920;

async function optimizeDir(dir, deleteOriginals = false) {
  const files = await readdir(dir);
  let totalSaved = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const inputPath = join(dir, file);
    const outputPath = join(dir, basename(file, ext) + '.webp');

    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
      }

      await pipeline.webp({ quality: QUALITY }).toFile(outputPath);

      const newStat = await stat(outputPath);
      const saved = originalSize - newStat.size;
      totalSaved += saved;

      console.log(
        `${file} → ${basename(outputPath)} | ` +
        `${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newStat.size / 1024).toFixed(0)}KB | ` +
        `saved ${(saved / 1024 / 1024).toFixed(1)}MB`
      );

      if (deleteOriginals) {
        await unlink(inputPath);
      }
    } catch (err) {
      console.error(`Failed: ${file} - ${err.message}`);
    }
  }

  return totalSaved;
}

async function main() {
  console.log('=== Image Optimization ===\n');

  let total = 0;

  console.log('--- Web Portfolio ---');
  total += await optimizeDir('public/assets/web', true);

  console.log('\n--- Upwork Reviews ---');
  total += await optimizeDir('public/assets/upwork', true);

  console.log('\n--- Profile ---');
  // me.jpg → me.webp
  try {
    const inputPath = 'public/assets/me.jpg';
    const outputPath = 'public/assets/me.webp';
    const originalStat = await stat(inputPath);

    await sharp(inputPath)
      .resize(800, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const newStat = await stat(outputPath);
    const saved = originalStat.size - newStat.size;
    total += saved;
    console.log(
      `me.jpg → me.webp | ${(originalStat.size / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB`
    );
  } catch (err) {
    console.error(`Failed: me.jpg - ${err.message}`);
  }

  console.log(`\n=== Total saved: ${(total / 1024 / 1024).toFixed(1)}MB ===`);
}

main().catch(console.error);
