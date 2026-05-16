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

async function probe() {
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

  const page = await doc.getPage(1);
  const op = await page.getOperatorList();
  const ids = [];
  for (let i = 0; i < op.fnArray.length; i++) {
    if (op.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
      ids.push(op.argsArray[i][0]);
    }
  }

  console.log('image ids on page 1:', ids);

  // Probe whether objects are available right after operator list parsing.
  for (const id of ids.slice(0, 3)) {
    try {
      const imgObj = page.objs.get(id);
      const keys = imgObj && typeof imgObj === 'object' ? Object.keys(imgObj) : [];
      console.log('id', id, 'type', typeof imgObj, 'keys', keys);
      if (imgObj?.width && imgObj?.height) {
        console.log('dimensions', imgObj.width, imgObj.height);
      }
    } catch (err) {
      console.log('failed to get', id, err.message);
    }
  }
}

probe().catch((err) => {
  console.error(err);
  process.exit(1);
});
