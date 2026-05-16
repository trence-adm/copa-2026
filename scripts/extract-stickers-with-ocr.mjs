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

// Known player names for team identification (basic list)
const KNOWN_PLAYERS = {
  'ARG': ['Messi', 'Mbappe', 'Higuain', 'Aguero', 'Tevez', 'Mascherano', 'Maradona', 'Riquelme', 'Aimar', 'Cambiasso'],
  'BRA': ['Neymar', 'Pele', 'Ronaldo', 'Ronaldinho', 'Vinicius', 'Rodrygo', 'Fred', 'Casemiro', 'Neres', 'Antony'],
  'MEX': ['Hirving', 'Ochoa', 'Herrera', 'Lozano', 'Jimenez', 'Guardado', 'Moreno', 'Layun', 'Contreras', 'Campos'],
  'USA': ['Pulisic', 'McConnell', 'Reyna', 'Weah', 'Adams', 'Dest', 'Sergiwa', 'Sargent', 'McKenzie', 'Steffen'],
  'FRA': ['Mbappe', 'Griezmann', 'Benzema', 'Henry', 'Desailly', 'Vieira', 'Zidane', 'Thuram', 'Platini', 'Pastore'],
  'ESP': ['Busquets', 'Iniesta', 'Xavi', 'Puyol', 'Ramos', 'Casillas', 'Silva', 'Fabregas', 'Torres', 'Villa'],
  'GER': ['Muller', 'Kroos', 'Neuer', 'Reus', 'Kruse', 'Gomez', 'Ballack', 'Schweinsteiger', 'Klose', 'Bastian'],
  'ENG': ['Sterling', 'Grealish', 'Kane', 'Mount', 'Rice', 'Foden', 'Stones', 'Pickford', 'Maguire', 'Shaw'],
  'ITA': ['Insigne', 'Pellegrini', 'Barella', 'Immobile', 'Verratti', 'Chiellini', 'Buffon', 'Totti', 'Baggio', 'Pirlo'],
  'POR': ['Ronaldo', 'Nani', 'Quaresma', 'Pauleta', 'Figo', 'Coentrao', 'Patricio', 'Joao Felix', 'Bruno', 'Pepe'],
  'NED': ['Van Dijk', 'De Vrij', 'Dumfries', 'Akanji', 'Cruyff', 'Gullit', 'Van Basten', 'Bergkamp', 'Seedorf', 'Kluivert'],
  'BEL': ['Hazard', 'De Bruyne', 'Lukaku', 'Chadli', 'Wilmots', 'Kompany', 'Van der Elst', 'Desmet', 'Tielemans', 'Mertens'],
  'JPN': ['Honda', 'Nagatomo', 'Makino', 'Hasebe', 'Shibasaki', 'Kagawa', 'Matsuda', 'Obi', 'Kamada', 'Minamino'],
  'AUS': ['Leckie', 'Behich', 'Devlin', 'Karacic', 'Cahill', 'Brebner', 'Vidmar', 'Neill', 'Postiga', 'Duke'],
  'KOR': ['Son', 'Kim', 'Lee', 'Kwon', 'Koo', 'Park', 'Oh', 'Jung', 'Hwang', 'Paik'],
};

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
  const bwFile = path.join(OUTPUT_DIR, `${outputBaseName}-bw.webp`);

  const basePipeline = sharp(Buffer.from(imageObj.data), { raw })
    .resize({ width: 360, height: 520, fit: 'cover' });

  await basePipeline.clone().webp({ quality: 78, effort: 4 }).toFile(colorFile);
  await basePipeline.clone().grayscale().webp({ quality: 76, effort: 4 }).toFile(bwFile);

  // Return path to the color file for OCR
  return colorFile;
}

async function performOCR(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    return text;
  } catch (err) {
    console.warn(`  OCR failed for ${imagePath}: ${err.message}`);
    return '';
  }
}

function guessTeamFromOCR(ocrText) {
  if (!ocrText) return null;

  const text = ocrText.toUpperCase();
  
  // Try to match known player names
  for (const [teamCode, players] of Object.entries(KNOWN_PLAYERS)) {
    for (const player of players) {
      if (text.includes(player.toUpperCase())) {
        return teamCode;
      }
    }
  }

  // Try pattern matching for country names
  const countryPatterns = {
    'ARG': ['ARGENTINA', 'ARGENT'],
    'BRA': ['BRASIL', 'BRAZIL', 'BRAZILIAN'],
    'MEX': ['MEXICO', 'MEXIC'],
    'USA': ['UNITED STATES', 'USA', 'AMERICA'],
    'FRA': ['FRANCE', 'FRANCE'],
    'ESP': ['ESPAÑA', 'SPAIN'],
    'GER': ['GERMANY', 'DEUTSCH'],
    'ENG': ['ENGLAND', 'ENGLISH'],
    'ITA': ['ITALY', 'ITALIA'],
    'POR': ['PORTUGAL', 'PORTU'],
    'NED': ['NETHERLANDS', 'DUTCH', 'HOLLAND'],
    'BEL': ['BELGIUM', 'BELGIQUE'],
    'JPN': ['JAPAN', 'NIPPON'],
    'AUS': ['AUSTRALIA', 'AUSSIE'],
    'KOR': ['KOREA', 'KOREAN'],
  };

  for (const [teamCode, patterns] of Object.entries(countryPatterns)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return teamCode;
      }
    }
  }

  return null;
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

  const stickerMap = [];
  let index = 0;

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

    const tempKey = `sticker-${String(index + 1).padStart(3, '0')}`;
    const imagePath = await extractRawImage(imageObj, tempKey);
    
    // Do OCR on this image
    console.log(`[${index + 1}] Performing OCR...`);
    const ocrText = await performOCR(imagePath);
    const detectedTeam = guessTeamFromOCR(ocrText);
    
    if (ocrText.trim()) {
      console.log(`      Text: ${ocrText.substring(0, 80)}`);
    }
    if (detectedTeam) {
      console.log(`      → Team: ${detectedTeam}`);
    } else {
      console.log(`      → Team: UNKNOWN`);
    }

    stickerMap.push({
      index: index + 1,
      tempKey,
      ocrText: ocrText.substring(0, 100),
      detectedTeam,
      page: item.page,
    });

    index += 1;

    if (index >= 100) {
      console.log(`\nStopping at ${index} stickers for diagnostic.`);
      break;
    }
  }

  return stickerMap;
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  console.log(`Reading ${path.relative(ROOT, PDF_PATH)}...`);
  console.log(`Starting OCR-based sticker extraction (first 100)...\n`);
  
  const stickerMap = await extractFromPdf();

  // Print summary
  console.log(`\n\n=== DIAGNOSTIC SUMMARY ===\n`);
  const teamCounts = {};
  stickerMap.forEach(s => {
    const team = s.detectedTeam || 'UNKNOWN';
    teamCounts[team] = (teamCounts[team] || 0) + 1;
  });

  console.log('Detected team distribution:');
  Object.entries(teamCounts).sort((a, b) => b[1] - a[1]).forEach(([team, count]) => {
    console.log(`  ${team}: ${count}`);
  });

  // Save detailed report
  const reportPath = path.join(ROOT, 'sticker-extraction-report.json');
  await fs.writeFile(reportPath, JSON.stringify(stickerMap, null, 2), 'utf8');
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
