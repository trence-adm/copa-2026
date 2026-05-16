import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Tesseract from 'tesseract.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PDF_PATH = path.join(ROOT, 'src', 'assets', 'Todas.Figurinhas.2026.Qualidade.Media.pdf');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'stickers');
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'stickerImageCatalog.ts');

// Country codes to match
const COUNTRY_CODES = [
  'MEX', 'CAN', 'USA', 'ARG', 'BRA', 'URU', 'COL', 'ECU', 'CHI', 'PER',
  'PAR', 'VEN', 'ENG', 'FRA', 'ESP', 'GER', 'POR', 'NED', 'ITA', 'BEL',
  'CRO', 'SUI', 'DEN', 'SWE', 'NOR', 'POL', 'SRB', 'AUT', 'TUR', 'UKR',
  'MAR', 'SEN', 'NGA', 'GHA', 'CMR', 'TUN', 'ALG', 'EGY', 'JPN', 'KOR',
  'AUS', 'IRN', 'KSA', 'QAT', 'IRQ', 'UAE', 'NZL', 'CRC',
];

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

async function extractAndAnalyzeSticker(imageObj, index) {
  const channels = detectChannels(imageObj);
  const raw = {
    width: imageObj.width,
    height: imageObj.height,
    channels,
  };

  // Convert to buffer
  const buffer = Buffer.from(imageObj.data);
  
  // Full sticker image for reference
  const fullImage = sharp(buffer, { raw }).resize({ width: 360, height: 520, fit: 'cover' });

  // Crop for player name (upper-middle area, wider horizontal)
  const nameRegionPath = path.join(OUTPUT_DIR, `.temp-name-${index}.webp`);
  await fullImage.clone()
    .extract({ left: 10, top: 380, width: 340, height: 100 })
    .webp({ quality: 85 })
    .toFile(nameRegionPath);

  // Crop for country code (bottom-right corner, vertical adjustment)
  const countryRegionPath = path.join(OUTPUT_DIR, `.temp-country-${index}.webp`);
  await fullImage.clone()
    .extract({ left: 300, top: 400, width: 60, height: 110 }) // Adjusted dimensions
    .webp({ quality: 85 })
    .toFile(countryRegionPath);

  // Perform OCR on country region (more reliable)
  let detectedCountry = null;
  try {
    const { data: { text: countryText } } = await Tesseract.recognize(countryRegionPath, 'eng');
    const cleaned = countryText.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Find matching country code
    for (const code of COUNTRY_CODES) {
      if (cleaned.includes(code)) {
        detectedCountry = code;
        break;
      }
    }
  } catch (err) {
    // Silent fail
  }

  // Perform OCR on name region
  let playerName = '';
  try {
    const { data: { text: nameText } } = await Tesseract.recognize(nameRegionPath, 'eng');
    playerName = nameText.trim().split('\n')[0].substring(0, 40);
  } catch (err) {
    // Silent fail
  }

  // Clean up temp files
  await Promise.all([
    fs.unlink(nameRegionPath).catch(() => {}),
    fs.unlink(countryRegionPath).catch(() => {}),
  ]);

  return { detectedCountry, playerName };
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

  const extractedImageIds = [];

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
      extractedImageIds.push({ page: pageIndex, id, pageObj: page });
    }
  }

  const stickerResults = [];
  let index = 0;

  console.log('Starting sticker analysis with OCR...\n');

  for (const item of extractedImageIds) {
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

    const { detectedCountry, playerName } = await extractAndAnalyzeSticker(imageObj, index);

    process.stdout.write(`[${String(index + 1).padStart(4, '0')}] `);
    
    if (detectedCountry) {
      process.stdout.write(`${detectedCountry}`.padEnd(6));
    } else {
      process.stdout.write('????  ');
    }

    process.stdout.write(` | ${playerName.padEnd(35)}\n`);

    stickerResults.push({
      index: index + 1,
      country: detectedCountry || 'UNKNOWN',
      playerName,
      page: item.page,
    });

    index += 1;
  }

  return stickerResults;
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  console.log(`Reading ${path.relative(ROOT, PDF_PATH)}...\n`);
  const results = await extractFromPdf();

  // Statistics
  console.log(`\n\n=== EXTRACTION SUMMARY ===\n`);
  console.log(`Total stickers analyzed: ${results.length}\n`);

  const countryCount = {};
  const unknownStickers = [];

  results.forEach(r => {
    countryCount[r.country] = (countryCount[r.country] || 0) + 1;
    if (r.country === 'UNKNOWN') {
      unknownStickers.push(r);
    }
  });

  console.log('Country distribution:');
  Object.entries(countryCount)
    .sort((a, b) => {
      if (a[0] === 'UNKNOWN') return 1;
      if (b[0] === 'UNKNOWN') return -1;
      return b[1] - a[1];
    })
    .forEach(([country, count]) => {
      console.log(`  ${country}: ${count}`);
    });

  // Save full report
  const reportPath = path.join(ROOT, 'sticker-mapping-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nFull report saved to: ${reportPath}`);

  // Save unknown stickers for manual review
  if (unknownStickers.length > 0) {
    console.log(`\n⚠️  ${unknownStickers.length} stickers could not be identified:`);
    console.log('\nUnidentified stickers (first 20):');
    unknownStickers.slice(0, 20).forEach(s => {
      console.log(`  [${String(s.index).padStart(4, '0')}] ${s.playerName || '(no name)'}`);
    });

    const unknownPath = path.join(ROOT, 'sticker-unknown-list.json');
    await fs.writeFile(unknownPath, JSON.stringify(unknownStickers, null, 2), 'utf8');
    console.log(`\nUnknown stickers list: ${unknownPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
