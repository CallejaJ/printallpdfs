# PrintAllPDFs

<div align="center">
    <img src="https://img.shields.io/badge/HTML5-Static-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-Dark_Mode-1572B6?style=for-the-badge&logo=css&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/pdf--lib-1.17.1-D32F2F?style=for-the-badge" alt="pdf-lib" />
    <img src="https://img.shields.io/badge/jsDelivr-CDN-E84D3D?style=for-the-badge&logo=jsdelivr&logoColor=white" alt="jsDelivr" />
    <img src="https://img.shields.io/badge/Node.js-22-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
    <img src="https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<p align="center">
    <i>A static web app that merges many PDFs in the browser and sends them to the local printer through a single print dialog.</i>
</p>

## Printing Modes

Browsers do not let a web page send jobs to a printer directly; a page can only open the system print dialog. **PrintAllPDFs** works within that limit by merging every selected file into one document, so the printer is chosen once and the whole batch prints in one job.

| Mode | Trigger | Output | Requires install |
|---|---|---|---|
| **Print all** | `#print` button | Merged PDF loaded in a hidden `iframe`, then `print()` | No |
| **Download merged PDF** | `#download` button | `printallpdfs-merged.pdf` saved locally | No |
| **Silent printing** | Not implemented | Direct job to the printer without a dialog | Yes, a local helper program |

## File Queue

Files are added by drag and drop or the file picker and kept in an in-memory `items` array. Each PDF is parsed once with `PDFDocument.load` to show its page count and detect unreadable files before printing.

| Behavior | Detail |
|---|---|
| **Accepted input** | `application/pdf` or `.pdf` extension; other files are skipped and reported |
| **Unreadable files** | Marked as "Unreadable" and excluded from the merge |
| **Ordering** | Manual (up/down buttons), by name (numeric-aware `localeCompare`), or by last-modified date |
| **Removal** | Per-file remove button and a "Clear list" action |

## Merge Engine

The `buildMerged` function creates a new `PDFDocument`, copies every page from each source with `copyPages`, and returns a Blob URL. Options are applied during the merge rather than relying on printer driver settings, so they behave the same on every operating system.

| Option | Element | Effect |
|---|---|---|
| **Copies** | `#copies` | Repeats the full ordered set 1 to 50 times |
| **Duplex padding** | `#blank` | Appends a blank page, sized like the previous one, after documents with an odd page count |

## System Architecture

| Component | Role |
|---|---|
| **`index.html`** | Single-page UI, styles and application logic with no build step |
| **pdf-lib** | Parses and merges PDFs entirely in the browser |
| **`vendor/pdf-lib.min.js`** | Local fallback loaded when the jsDelivr CDN is unreachable |
| **Hidden print `iframe`** | Hosts the merged PDF and opens the browser print dialog |
| **`tests/server.js`** | Minimal Node.js static server used for local development and tests |
| **`tests/e2e.test.js`** | Playwright end-to-end test of the full merge flow |
| **`vercel.json`** | Static hosting configuration with security headers |

## Technology Stack

- **Frontend**: HTML5, CSS3 with `prefers-color-scheme` dark mode, vanilla JavaScript (ES2022)
- **PDF Processing**: pdf-lib 1.17.1 via jsDelivr, with a vendored copy
- **Testing**: Node.js 22 built-in test runner (`node:test`), Playwright with Chromium
- **Deployment**: Vercel static hosting

## Key Features

1. **One dialog for the whole batch** — any number of PDFs print as a single job after choosing the printer once.
2. **Private by design** — files are read and merged locally and never uploaded to a server.
3. **Duplex-safe output** — optional blank-page padding keeps each document starting on a new sheet.
4. **Flexible ordering** — reorder manually or sort by name or date before printing.
5. **Works offline** — the vendored pdf-lib lets the page run from disk without network access.
6. **Zero build** — a single HTML file deploys to any static host.

## Testing Strategy

The end-to-end test in `tests/e2e.test.js` generates fixture PDFs with pdf-lib, serves the app with `tests/server.js`, and drives it in headless Chromium through Playwright. It checks non-PDF filtering, name sorting, and that the downloaded merge has the exact expected page count with copies and duplex padding enabled. It also confirms the print action runs without page errors. The physical print dialog is verified manually, since browsers do not expose it to automation.

## Project Setup

1. Install dependencies and the Chromium browser for tests:

   ```bash
   npm install
   npx playwright install chromium
   ```

2. No environment variables are required.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`

5. Run the end-to-end tests:

   ```bash
   npm test
   ```

---

Built for local printing from any desktop browser.
