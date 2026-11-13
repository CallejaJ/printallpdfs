# Architecture

## Overview

PrintAllPDFs is a static Next.js export served by Vercel. Everything runs in the browser: files are read with the File API, merged with pdf-lib in memory and handed to the system print dialog through a hidden `iframe`. There is no server code, no storage and no external API.

## Components

| Component | Location | Role |
|---|---|---|
| **App shell** | `app/layout.tsx` | Metadata, theme bootstrap script, JSON-LD, language and motion providers, header and footer |
| **Page** | `app/page.tsx` | Owns queue state, sorting, batches and the print and download flow |
| **UI components** | `components/` | `SiteHeader`, `SiteFooter`, `Breadcrumbs`, `DropZone`, `FileQueue`, `PrintOptions`, `PrintJob`, `HowItWorks`, toggles and icons |
| **Core logic** | `lib/pdf.ts` | `isPdf`, `countPages`, `sortItems`, `chunk`, `pagesToPrint`, `mergePdfs`; covered by Jest |
| **Strings and i18n** | `lib/strings.ts`, `lib/i18n.tsx` | English and Spanish dictionaries and the typed `t()` helper |
| **Site and SEO** | `lib/site.ts`, `lib/seo.ts` | URL, brand, version, author, geo data and the JSON-LD graph |
| **SEO routes** | `app/robots.ts`, `app/sitemap.ts` | Static `robots.txt` and `sitemap.xml` built at export time |
| **Print frame** | Hidden `iframe#frame` in `app/page.tsx` | Loads each merged PDF as a blob URL and calls `print()` |
| **Test server** | `tests/server.js` | Serves `out/` for `npm start` and the E2E tests |

## Data Flow

| Step | From | To | Data |
|---|---|---|---|
| 1 | User | `DropZone` | Dropped or picked `File` objects |
| 2 | `app/page.tsx` | `isPdf`, `countPages` | File type check and page count per file |
| 3 | `app/page.tsx` | `sortItems`, `chunk` | Ordered queue split into batches of 5, 10 or 20 |
| 4 | `app/page.tsx` | `mergePdfs` | File bytes, optional blank-page padding, progress callback |
| 5 | `mergePdfs` | Print `iframe` or download link | Merged PDF as a `Blob` URL |
| 6 | Print `iframe` | Browser | System print dialog, once per job |

## External Services

| Service | Used for | Key | Where it is restricted |
|---|---|---|---|
| **Vercel** | Static hosting | none | n/a |

## Constraints

- Browsers cannot print without the system dialog, so the app merges files to show the dialog once per job.
- Merging happens in browser memory; the queue warns above 500 MB (`SIZE_WARN_BYTES`).
- Pages are copied, never re-encoded, so output size is about the sum of the inputs and barcodes stay sharp.
- Files never leave the browser; this is a product promise and must hold for every change.
