// End-to-end test: loads the app in Chromium, adds fixture PDFs and checks the merged output.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { createServer } = require('./server');

let server, browser, baseUrl, tmp;

async function makePdf(name, pages) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i++) doc.addPage().drawText(`${name} p${i + 1}`, { x: 50, y: 700, size: 24, font });
  const file = path.join(tmp, name);
  fs.writeFileSync(file, await doc.save());
  return file;
}

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'printallpdfs-'));
  server = createServer().listen(0);
  baseUrl = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('merges PDFs with ordering, copies and duplex padding', async () => {
  const files = [await makePdf('b.pdf', 3), await makePdf('a.pdf', 2), await makePdf('c.pdf', 1)];
  const notPdf = path.join(tmp, 'notes.txt');
  fs.writeFileSync(notPdf, 'not a pdf');

  const page = await browser.newPage({ acceptDownloads: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(baseUrl);

  await page.setInputFiles('#file', [...files, notPdf]);
  await page.waitForFunction(() => document.querySelectorAll('#list li').length === 3);
  assert.match(await page.textContent('#status'), /Skipped 1 non-PDF/);

  await page.check('input[name="sort"][value="name"]', { force: true });
  assert.deepStrictEqual(await page.$$eval('#list .name', (els) => els.map((e) => e.textContent)), ['a.pdf', 'b.pdf', 'c.pdf']);

  await page.fill('#copies', '2');
  await page.check('#blank');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#download')]);
  const out = path.join(tmp, 'merged.pdf');
  await download.saveAs(out);

  // Per copy: a(2) + b(3) + blank(1) + c(1) + blank(1) = 8 pages.
  const merged = await PDFDocument.load(fs.readFileSync(out));
  assert.strictEqual(merged.getPageCount(), 16);

  await page.click('#print');
  await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Opening'));
  assert.deepStrictEqual(errors, []);
});
