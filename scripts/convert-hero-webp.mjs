import sharp from 'sharp';
import { join } from 'node:path';
import { access } from 'node:fs/promises';

const root = join(process.cwd(), 'public', 'images');
const files = [
  { src: 'hero2.png', dst: 'hero2.webp' },
  { src: 'hero2-overlay.png', dst: 'hero2-overlay.webp' },
  { src: 'hero2mobile.png', dst: 'hero2mobile.webp' },
  { src: 'hero2mobile-overlay.png', dst: 'hero2mobile-overlay.webp' },
  { src: 'hero_fullbleed.png', dst: 'hero_fullbleed.webp' },
];

for (const { src, dst } of files) {
  const inputPath = join(root, src);
  const outputPath = join(root, dst);
  try {
    await access(inputPath);
    console.log(`Converting ${src} → ${dst}`);
    await sharp(inputPath).webp({ lossless: true }).toFile(outputPath);
    const metadata = await sharp(outputPath).metadata();
    console.log(`Done ${dst} ${metadata.width}x${metadata.height}`);
  } catch (error) {
    console.error(`Failed ${src} → ${dst}:`, error.message || error);
    process.exitCode = 1;
  }
}
