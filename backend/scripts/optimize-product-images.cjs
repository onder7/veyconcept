#!/usr/bin/env node
/**
 * Batch-normalize product images without cropping.
 * Originals are preserved; optimized WebP files are written to the output folder.
 * Usage:
 *   node scripts/optimize-product-images.cjs
 *   node scripts/optimize-product-images.cjs --input backend/uploads/products --output backend/uploads/products-optimized
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const inputDir = path.resolve(value('--input', 'backend/uploads/products'));
const outputDir = path.resolve(value('--output', 'backend/uploads/products-optimized'));
const width = Number(value('--width', '1200'));
const height = Number(value('--height', '1500'));
const quality = Number(value('--quality', '86'));
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);

async function filesIn(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(full));
    else if (allowed.has(path.extname(entry.name).toLowerCase())) result.push(full);
  }
  return result;
}

async function main() {
  const files = await filesIn(inputDir);
  if (!files.length) {
    console.log(`No supported images found in ${inputDir}`);
    return;
  }

  let completed = 0;
  for (const source of files) {
    const relative = path.relative(inputDir, source);
    const target = path.join(outputDir, relative.replace(/\.[^.]+$/, '.webp'));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await sharp(source)
      .rotate()
      .resize(width, height, { fit: 'contain', background: '#F3E7D6' })
      .webp({ quality, effort: 4 })
      .toFile(target);
    completed += 1;
    console.log(`${completed}/${files.length} ${relative} -> ${path.relative(process.cwd(), target)}`);
  }
  console.log(`Done: ${completed} images, ${width}x${height} 4:5 canvas, originals preserved.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
