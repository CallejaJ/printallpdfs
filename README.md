# PrintAllPDFs

<div align="center">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Motion-12-FFF312?style=for-the-badge&logo=framer&logoColor=black" alt="Motion" />
    <img src="https://img.shields.io/badge/pdf--lib-1.17.1-D32F2F?style=for-the-badge" alt="pdf-lib" />
    <img src="https://img.shields.io/badge/Jest-30-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
    <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
    <img src="https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<p align="center">
    <i>A Next.js app that merges many PDFs in the browser and sends them to the local printer through a single print dialog, in one job or in batches.</i>
</p>

## Printing Modes

Browsers do not let a web page send jobs to a printer directly; a page can only open the system print dialog. **PrintAllPDFs** works within that limit by merging the selected files into one document, so the printer is chosen once per job.

| Mode | Trigger | Output | Requires install |
|---|---|---|---|
| **Print all** | `#print` button with batches set to "All" | One merged PDF loaded in a hidden `iframe`, then `print()` | No |
| **Batch printing** | `#print` button with 5, 10 or 20 per job | One merged PDF per batch, printed in sequence with sent/pending tracking | No |
| **Download merged PDF** | `#download` button | `printallpdfs-merged.pdf` with the whole queue | No |
| **Silent printing** | Not implemented | Direct job to the printer without a dialog | Yes, a local helper program |

## File Queue

Files are added by drag and drop or the file picker and kept in React state as `QueueItem` objects. Each PDF is parsed once with `countPages` to show its page count and flag unreadable files before printing.

| Behavior | Detail |
|---|---|
| **Accepted input** | `application/pdf` or `.pdf` extension (`isPdf`); other files are skipped and reported |
| **Unreadable files** | Marked as "Unreadable" and excluded from every merge |
| **Ordering** | Drag by the handle (`Reorder.Group`), up/down buttons, by name (numeric-aware) or by last-modified date, with an ascending/descending toggle |
| **Removal** | Per-file remove button with exit animation and a "Clear list" action |
| **Size guidance** | Shows the queue weight and warns above 500 MB (`SIZE_WARN_BYTES`), since merging happens in browser memory |

## Merge Engine

`lib/pdf.ts` holds the framework-free logic. `mergePdfs` copies every page with `copyPages` and reports progress per file, which drives the fill animation on the print button. Pages are never re-encoded, so quality and barcodes stay intact and the output weighs about the sum of its inputs.

| Option | Source | Effect |
|---|---|---|
| **Batches** | `chunk(items, size)` | Splits the queue into consecutive groups of 5, 10 or 20 so each print job stays small |
| **Duplex padding** | `pagesToPrint`, `mergePdfs({ padBlank })` | Appends a blank page, sized like the previous one, after documents with an odd page count |
| **Copies** | Printer dialog | Left to the printer so the merged file does not grow with each copy |

## Motion Design

Animations use **Motion** (`motion/react`) and follow the operating system's reduced-motion setting through `MotionConfig reducedMotion="user"` in `components/MotionProvider.tsx`.

| Element | Animation |
|---|---|
| **Queue rows** | Spring entrance, slide-out on removal, lift and shadow while dragging |
| **Drop zone** | Scales up and the icon bobs while files are dragged over it |
| **Segmented controls** | Shared-layout pill (`layoutId`) glides between options; same for the ES/EN toggle |
| **Counters** | `AnimatedNumber` counts from the previous value to the new one |
| **Print button** | Fills from left to right while files are merged |
| **Batch list and size warning** | Expand and collapse with height transitions |
| **How it works and FAQ** | Fade up on scroll with a short stagger |

## Search and Generative Engine Optimization

The app is a single static page, so discoverability is handled at build time by the App Router metadata files and a JSON-LD graph in the root layout.

| Signal | Source | Purpose |
|---|---|---|
| **Breadcrumbs** | `components/Breadcrumbs.tsx`, `BreadcrumbList` in `lib/seo.ts` | Visible trail "Jorge Calleja › PrintAllPDFs" plus matching structured data |
| **robots.txt** | `app/robots.ts` | Allows all crawlers, including Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended |
| **sitemap.xml** | `app/sitemap.ts` | Lists the home page and `llms.txt` |
| **llms.txt** | `public/llms.txt` | Plain-language summary for generative engines: features, limits and privacy |
| **Structured data** | `lib/seo.ts` | `WebSite`, `Person`, `WebApplication`, `BreadcrumbList`, `HowTo` and `FAQPage` in one `@graph` |
| **Geo tags** | `lib/site.ts` | `geo.region` ES-AN, `geo.placename` Málaga, `geo.position` and `ICBM` |
| **Social preview** | `public/og.png` | 1200×630 Open Graph and Twitter card image |
| **Canonical URL** | `NEXT_PUBLIC_SITE_URL` | Defaults to `https://printallpdfs.vercel.app` |

## System Architecture

| Component | Role |
|---|---|
| **`app/layout.tsx`** | Root layout with theme bootstrap script, language and motion providers, header and footer |
| **`app/page.tsx`** | Client page that owns queue state, sorting, batches and the print and download flow |
| **`app/globals.css`** | Design tokens for dark and light themes, layout and component styles |
| **`components/`** | `SiteHeader`, `SiteFooter`, `Breadcrumbs`, `DropZone`, `FileQueue`, `PrintOptions`, `HowItWorks`, toggles and icons |
| **`lib/pdf.ts`** | Sorting, batching, page counting and merging with pdf-lib |
| **`lib/strings.ts`** | English and Spanish dictionaries, shared by the client UI and the server-side structured data |
| **`lib/i18n.tsx`** | Typed `t()` helper and language React context |
| **`lib/site.ts`, `lib/seo.ts`** | Site URL, author and geo constants, metadata copy and the JSON-LD graph |
| **`app/robots.ts`, `app/sitemap.ts`** | Static `robots.txt` and `sitemap.xml` generated at build time |
| **Hidden print `iframe`** | Hosts each merged PDF and opens the browser print dialog |
| **`public/`** | `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`, and `images/logo.svg` |
| **`tests/server.js`** | Static server for the exported build, used by `npm start` and the e2e tests |
| **`tools/`** | Icon generation script and LinkedIn cover sources, rendered images and post copy |
| **CI** | `.github/workflows/test.yml` runs `npm ci`, `npm test` and `npm run build` on Node 22 for every push to `main` and every pull request |

## Technology Stack

- **Frontend**: Next.js 16 (App Router, static export), React 19, TypeScript 5.5
- **Animation**: Motion 12 (`motion/react`)
- **PDF Processing**: pdf-lib 1.17.1, bundled with the app
- **Testing**: Jest 30 with ts-jest for unit tests, Node.js test runner with Playwright for end-to-end tests
- **CI**: GitHub Actions on Node 22
- **Deployment**: Vercel

## Key Features

1. **One dialog per job** — any number of PDFs print together after choosing the printer once.
2. **Batch printing** — long queues of heavy scans split into smaller jobs with sent and pending tracking.
3. **Private by design** — files are read and merged locally and never uploaded or compressed.
4. **Drag-and-drop ordering** — reorder rows by hand or sort by name or date in either direction.
5. **Duplex-safe output** — optional blank-page padding keeps each document starting on a new sheet.
6. **Fluid interface** — spring animations, animated counters and merge progress that respect reduced-motion settings.
7. **Bilingual and themed** — English and Spanish with light and dark modes remembered per browser.

## Testing Strategy

Unit tests in `lib/__tests__/pdf.test.ts` run with Jest and cover file filtering, natural sorting in both directions, batching, page totals with padding, and merging real pdf-lib documents with progress callbacks. End-to-end tests in `tests/e2e/app.test.js` serve the exported build, drive it in headless Chromium and check filtering, sorting, duplex totals, the downloaded page count and the batch flow from "Print batch 1 of 2" to "All batches sent". GitHub Actions runs the unit tests and the build on every push to `main`. The physical print dialog is verified manually, since browsers do not expose it to automation.

## Localization

All interface strings live in `lib/strings.ts`, with `en` as the default and `es` as the second language. The Spanish dictionary is typed against the English one, so a missing key fails the build. The chosen language and theme are kept in `localStorage` when available.

## Project Setup

1. Install dependencies and the Chromium browser for tests:

   ```bash
   npm install
   npx playwright install chromium
   ```

2. Optionally copy `.env.example` to `.env.local`; every variable has a default:

   ```env
   # --- Site ---
   NEXT_PUBLIC_SITE_URL=https://printallpdfs.vercel.app
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`

5. Run the tests:

   ```bash
   npm test
   npm run build
   npm run test:e2e
   ```

---

Built for local printing from any desktop browser.
