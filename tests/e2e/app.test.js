// End-to-end test: serves the exported build (`out/`), drives it in Chromium and checks the merged output.
// Run `npm run build` first. Set CHROMIUM_PATH to use a specific Chromium binary.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { createServer } = require('../server');

let server, browser, baseUrl, tmp;

async function makePdf(name, pages) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i++) doc.addPage().drawText(`${name} p${i + 1}`, { x: 50, y: 700, size: 24, font });
  const file = path.join(tmp, name);
  fs.writeFileSync(file, await doc.save());
  return file;
}

const statValue = (page, id) => page.getAttribute(`#${id}`, 'data-value').then(Number);

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'printallpdfs-'));
  server = createServer().listen(0);
  baseUrl = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});

after(async () => {
  await browser?.close();
  server?.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('merges PDFs with ordering and duplex padding', async () => {
  const files = [await makePdf('b.pdf', 3), await makePdf('a.pdf', 2), await makePdf('c.pdf', 1)];
  const notPdf = path.join(tmp, 'notes.txt');
  fs.writeFileSync(notPdf, 'not a pdf');

  const page = await browser.newPage({ acceptDownloads: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(baseUrl);

  await page.setInputFiles('#file', [...files, notPdf]);
  await page.waitForFunction(() => document.querySelectorAll('#list li').length === 3 && !document.querySelector('#list').textContent.includes('…'));
  assert.match(await page.textContent('#status'), /Skipped 1 non-PDF/);

  await page.check('input[name="sort"][value="name"]', { force: true });
  assert.deepStrictEqual(await page.$$eval('#list .name', (els) => els.map((e) => e.textContent)), ['a.pdf', 'b.pdf', 'c.pdf']);

  await page.click('#sortDir');
  assert.deepStrictEqual(await page.$$eval('#list .name', (els) => els.map((e) => e.textContent)), ['c.pdf', 'b.pdf', 'a.pdf']);

  await page.check('#blank');
  // c(1)+blank + b(3)+blank + a(2) = 8 pages.
  assert.strictEqual(await statValue(page, 'statSheets'), 8);

  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#download')]);
  const out = path.join(tmp, 'merged.pdf');
  await download.saveAs(out);
  const merged = await PDFDocument.load(fs.readFileSync(out));
  assert.strictEqual(merged.getPageCount(), 8);

  await page.click('#print');
  await page.waitForFunction(() => document.querySelector('#status')?.textContent.startsWith('Opening'));
  assert.deepStrictEqual(errors, []);
});

test('splits the queue into batches and tracks which were sent', async () => {
  const files = [];
  for (let i = 1; i <= 7; i++) files.push(await makePdf(`alb_${i}.pdf`, 1));

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(baseUrl);
  await page.setInputFiles('#file', files);
  await page.waitForFunction(() => document.querySelectorAll('#list li').length === 7);

  await page.check('input[name="batch"][value="5"]', { force: true });
  await page.waitForFunction(() => document.querySelectorAll('.batch-list li').length === 2);
  assert.match(await page.textContent('#print'), /Print batch 1 of 2/);

  await page.click('#print');
  await page.waitForFunction(() => document.querySelector('#print').textContent.includes('Print batch 2 of 2'));
  assert.strictEqual(await page.$$eval('.batch-list li.sent', (els) => els.length), 1);

  await page.click('#print');
  await page.waitForFunction(() => document.querySelector('#print').textContent.includes('All batches sent'));
  assert.strictEqual(await page.$$eval('.batch-list li.sent', (els) => els.length), 2);
  assert.deepStrictEqual(errors, []);
});
