import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF_PATH = path.join(ROOT, 'src', 'assets', 'Todas.Figurinhas.2026.Qualidade.Media.pdf');

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url,
).href;

async function inspect() {
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

  console.log(`PDF: ${path.relative(ROOT, PDF_PATH)}`);
  console.log(`Total pages: ${doc.numPages}`);

  const samplePages = Math.min(12, doc.numPages);
  const distribution = {};
  let totalImageOps = 0;

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const op = await page.getOperatorList();
    let imageOps = 0;
    for (const fn of op.fnArray) {
      if (fn === pdfjsLib.OPS.paintImageXObject) imageOps += 1;
    }
    distribution[imageOps] = (distribution[imageOps] ?? 0) + 1;
    totalImageOps += imageOps;
  }

  console.log(`Total paintImageXObject ops: ${totalImageOps}`);
  console.log(`Distribution by page: ${JSON.stringify(distribution)}`);

  for (let p = 1; p <= samplePages; p++) {
    const page = await doc.getPage(p);
    const vp = page.getViewport({ scale: 1 });
    const op = await page.getOperatorList();

    let paintImageXObject = 0;
    let paintInlineImageXObject = 0;
    let paintJpegXObject = 0;

    for (const fn of op.fnArray) {
      if (fn === pdfjsLib.OPS.paintImageXObject) paintImageXObject += 1;
      if (fn === pdfjsLib.OPS.paintInlineImageXObject) paintInlineImageXObject += 1;
      if (fn === pdfjsLib.OPS.paintJpegXObject) paintJpegXObject += 1;
    }

    console.log(
      `Page ${String(p).padStart(2, '0')} | ${Math.round(vp.width)}x${Math.round(vp.height)} | imageXObject=${paintImageXObject} inline=${paintInlineImageXObject} jpeg=${paintJpegXObject}`,
    );
  }
}

inspect().catch((err) => {
  console.error(err);
  process.exit(1);
});
