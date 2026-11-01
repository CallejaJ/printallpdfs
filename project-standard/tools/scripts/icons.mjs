// Generates the PNG icon set from public/favicon.svg using the preinstalled Playwright Chromium.
// Usage: node tools/scripts/icons.mjs [path/to/favicon.svg] [output/dir]
// favicon.ico: convert icon-48 with any ICO tool (e.g. `npx png-to-ico public/icon-48.png > public/favicon.ico`).
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const svgPath = process.argv[2] || "public/favicon.svg";
const outDir = process.argv[3] || "public";
const svg = await readFile(svgPath, "utf8");
const sizes = { "apple-touch-icon.png": 180, "icon-192.png": 192, "icon-512.png": 512, "icon-48.png": 48 };

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size] of Object.entries(sizes)) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace("<svg", `<svg width="${size}" height="${size}"`)}</body></html>`,
  );
  await page.locator("svg").screenshot({ path: `${outDir}/${name}`, omitBackground: true });
  console.log(`${outDir}/${name}`);
}
await browser.close();
