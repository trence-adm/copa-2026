/**
 * scripts/extract-albums.mjs
 *
 * Extracts all pages from Copa World Cup PDF albums as WebP images.
 * Generates src/data/pastAlbumsCatalog.ts with require() calls for each page.
 *
 * Usage:
 *   npm run extract:albums
 *
 * Output:
 *   assets/albums/{albumKey}/page-{N}.webp
 *   src/data/pastAlbumsCatalog.ts  (auto-updated)
 *
 * Requires: pdfjs-dist, @napi-rs/canvas, sharp (all devDependencies)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url,
).href;

const ALBUM_SOURCE_DIR = path.join(ROOT, 'src', 'assets', 'album');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'albums');
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'pastAlbumsCatalog.ts');

// Target width for extracted pages (balance between quality and file size)
const TARGET_WIDTH = 480; // px — ~25-40KB per page as WebP
const WEBP_QUALITY = 78;
const SCALE_STEP = 0.1; // start at 1.0 and adjust to hit TARGET_WIDTH

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function pdfFileToKey(pdfFile) {
  // Derives a safe folder name from PDF filename
  // e.g. "Panini World Cup 1970.pdf" → "1970"
  // "1986 - PANINI.pdf" → "1986"
  // "panini world cup 2002.pdf" → "2002"
  // "ping+pong+espanha+82.pdf" → "1982-ping-pong"
  // "Panini Road to Rusia 2018.pdf" → "2018-road-to-russia"
  const name = pdfFile.toLowerCase().replace(/\.pdf$/, '');

  if (name.includes('road to rusia') || name.includes('road to russia')) {
    return '2018-road-to-russia';
  }
  if (name.includes('ping') || name.includes('pong')) {
    return '1982-ping-pong';
  }
  if (name.includes('brasil 1950') || name.includes('brazil 1950')) return '1950';
  if (name.includes('1954') || name.includes('copa 1954')) return '1954';
  if (name.includes('1958')) return '1958';
  if (name.includes('1962')) return '1962';
  if (name.includes('1966')) return '1966';
  if (name.includes('1970')) return '1970';
  if (name.includes('1974')) return '1974';
  if (name.includes('1978')) return '1978';
  if (name.includes('1982')) return '1982';
  if (name.includes('1986')) return '1986';
  if (name.includes('1990')) return '1990';
  if (name.includes('1994')) return '1994';
  if (name.includes('1998')) return '1998';
  if (name.includes('2002')) return '2002';
  if (name.includes('2006')) return '2006';
  if (name.includes('2010')) return '2010';
  if (name.includes('2014')) return '2014';
  if (name.includes('2018')) return '2018';

  // Fallback: sanitize the name
  return name.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function extractPdf(pdfFile, albumKey) {
  const pdfPath = path.join(ALBUM_SOURCE_DIR, pdfFile);
  const url =
    'file:///' + pdfPath.replace(/\\/g, '/').replace(/ /g, '%20').replace(/\+/g, '%2B');
  const outputAlbumDir = path.join(OUTPUT_DIR, albumKey);

  // Check if already extracted
  try {
    const existing = await fs.readdir(outputAlbumDir);
    const webpFiles = existing.filter((f) => f.endsWith('.webp'));
    if (webpFiles.length > 0) {
      console.log(`  [${albumKey}] Already extracted (${webpFiles.length} pages). Skipping.`);
      return webpFiles.length;
    }
  } catch {
    // dir doesn't exist yet — proceed
  }

  await ensureDir(outputAlbumDir);

  let doc;
  try {
    doc = await pdfjsLib
      .getDocument({
        url,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      })
      .promise;
  } catch (err) {
    console.error(`  [${albumKey}] Failed to open PDF: ${err.message}`);
    return 0;
  }

  const numPages = doc.numPages;
  console.log(`  [${albumKey}] ${numPages} pages — extracting...`);

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    // Calculate scale to hit TARGET_WIDTH
    const scale = TARGET_WIDTH / viewport.width;
    const scaledVp = page.getViewport({ scale });

    const canvas = createCanvas(Math.round(scaledVp.width), Math.round(scaledVp.height));
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      await page.render({ canvasContext: ctx, viewport: scaledVp }).promise;
    } catch (renderErr) {
      // Some PDFs have form XObjects or features unsupported by the canvas implementation.
      // We still save whatever was rendered so far (partial render is better than nothing).
      process.stdout.write(`\r  [${albumKey}] page ${i} partial render: ${renderErr.message.slice(0, 60)}`);
    }

    // Use sharp to convert to WebP for better compression
    const rawBuffer = canvas.toBuffer('image/png');
    await sharp(rawBuffer)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(path.join(outputAlbumDir, `page-${i - 1}.webp`));

    process.stdout.write(`\r  [${albumKey}] ${i}/${numPages}   `);
  }

  console.log(`\r  [${albumKey}] Done! ${numPages} pages extracted.   `);
  return numPages;
}

async function generateCatalog(albumResults) {
  // albumResults: Array<{ key: string, pdfFile: string, pages: number }>
  const requireLines = [];

  for (const { key, pages } of albumResults) {
    if (pages === 0) continue;
    for (let i = 0; i < pages; i++) {
      const relPath = `../../assets/albums/${key}/page-${i}.webp`;
      requireLines.push(`  '${key}-${i}': require('${relPath}'),`);
    }
  }

  const content = `// Auto-generated by scripts/extract-albums.mjs
// Do not edit manually — run: npm run extract:albums
export type AlbumPageCatalog = Record<string, ReturnType<typeof require>>;

export const ALBUM_PAGE_CATALOG: AlbumPageCatalog = {
${requireLines.join('\n')}
};
`;

  await fs.writeFile(CATALOG_PATH, content, 'utf8');
  console.log(`\nGenerated ${path.relative(ROOT, CATALOG_PATH)}`);
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  // Get all PDFs in album source dir
  const files = (await fs.readdir(ALBUM_SOURCE_DIR)).filter((f) =>
    f.toLowerCase().endsWith('.pdf'),
  );

  if (files.length === 0) {
    console.log('No PDF files found in', ALBUM_SOURCE_DIR);
    return;
  }

  console.log(`Found ${files.length} PDF(s) in src/assets/album/\n`);

  const albumResults = [];

  for (const pdfFile of files.sort()) {
    const key = pdfFileToKey(pdfFile);
    console.log(`Processing: ${pdfFile} → ${key}`);
    const pages = await extractPdf(pdfFile, key);
    albumResults.push({ key, pdfFile, pages });
  }

  await generateCatalog(albumResults);

  const total = albumResults.reduce((s, r) => s + r.pages, 0);
  console.log(`\nDone! ${total} total pages extracted across ${albumResults.length} album(s).`);
  console.log('Run your Metro bundler to pick up the new assets.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
