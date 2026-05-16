import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PDF_PATH = path.join(ROOT, 'src', 'assets', 'Todas.Figurinhas.2026.Qualidade.Media.pdf');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'stickers-diagnostic');

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url,
).href;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function detectChannels(imageObj) {
  const pixelCount = imageObj.width * imageObj.height;
  const ratio = imageObj.data.length / pixelCount;

  if (ratio >= 4) return 4;
  if (ratio >= 3) return 3;
  if (ratio >= 1) return 1;
  return 3;
}

async function extractRawImage(imageObj, outputBaseName) {
  const channels = detectChannels(imageObj);
  const raw = {
    width: imageObj.width,
    height: imageObj.height,
    channels,
  };

  const colorFile = path.join(OUTPUT_DIR, `${outputBaseName}.webp`);

  const basePipeline = sharp(Buffer.from(imageObj.data), { raw })
    .resize({ width: 360, height: 520, fit: 'cover' });

  await basePipeline.clone().webp({ quality: 78, effort: 4 }).toFile(colorFile);
}

async function extractFromPdf() {
  const url =
    'file:///' + PDF_PATH.replace(/\\/g, '/').replace(/ /g, '%20').replace(/\+/g, '%2B');

  const doc = await pdfjsLib
    .getDocument({
      url,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    })
    .promise;

  const extractedImages = [];

  for (let pageIndex = 1; pageIndex <= doc.numPages; pageIndex++) {
    const page = await doc.getPage(pageIndex);
    let op;
    try {
      op = await page.getOperatorList();
    } catch (err) {
      console.warn(`Skipping page ${pageIndex}: ${err.message}`);
      continue;
    }

    for (let i = 0; i < op.fnArray.length; i++) {
      if (op.fnArray[i] !== pdfjsLib.OPS.paintImageXObject) continue;
      const id = op.argsArray[i][0];
      if (typeof id !== 'string') continue;
      extractedImages.push({ page: pageIndex, id, pageObj: page });
    }
  }

  // Extract first 50 stickers as diagnostic
  let index = 0;
  for (const item of extractedImages) {
    if (index >= 50) break;

    let imageObj;
    try {
      imageObj = item.pageObj.objs.get(item.id);
    } catch {
      continue;
    }

    if (!imageObj || !imageObj.width || !imageObj.height || !imageObj.data) {
      continue;
    }

    // Filter out tiny artifacts/icons
    if (imageObj.width < 220 || imageObj.height < 300) {
      continue;
    }

    const outputName = `sticker-${String(index + 1).padStart(3, '0')}-page${item.page}`;
    await extractRawImage(imageObj, outputName);
    console.log(`Extracted ${outputName}`);
    index += 1;
  }

  console.log(`\nDone. First 50 sticker images saved to ${OUTPUT_DIR}`);
  console.log('Check these images to determine the actual team order in the PDF.');
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  console.log(`Reading ${path.relative(ROOT, PDF_PATH)}...`);
  await extractFromPdf();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
