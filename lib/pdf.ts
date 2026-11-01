import { PDFDocument } from "pdf-lib";

export type SortMode = "manual" | "name" | "date";
export type SortDir = "asc" | "desc";

export interface QueueItem {
  id: string;
  file: File;
  pages: number | null;
  error: boolean;
}

/** Soft limit above which the UI warns, since merging happens in memory. */
export const SIZE_WARN_BYTES = 500 * 1024 * 1024;

/** Batch sizes offered in the UI. 0 means "everything in one job". */
export const BATCH_SIZES = [0, 5, 10, 20] as const;

export function isPdf(file: { name: string; type: string }): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function countPages(bytes: ArrayBuffer | Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

/** Returns a new array sorted by mode and direction. Manual keeps the current order. */
export function sortItems<T extends { file: { name: string; lastModified: number } }>(
  items: T[],
  mode: SortMode,
  dir: SortDir,
  locale = "en",
): T[] {
  if (mode === "manual") return items;
  const sign = dir === "desc" ? -1 : 1;
  const copy = [...items];
  if (mode === "name") {
    copy.sort((a, b) => sign * a.file.name.localeCompare(b.file.name, locale, { numeric: true }));
  } else {
    copy.sort((a, b) => sign * (a.file.lastModified - b.file.lastModified));
  }
  return copy;
}

/** Splits a list into consecutive groups. A size of 0 returns a single group. */
export function chunk<T>(list: T[], size: number): T[][] {
  if (list.length === 0) return [];
  if (!size || size >= list.length) return [list];
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/** Pages that will come out of the printer, including duplex padding. */
export function pagesToPrint(pageCounts: number[], padBlank: boolean): number {
  return pageCounts.reduce((sum, n) => sum + n + (padBlank && n % 2 === 1 ? 1 : 0), 0);
}

export interface MergeResult {
  bytes: Uint8Array;
  pages: number;
}

/**
 * Merges PDFs in order into a single document. Pages are copied as-is, so
 * quality and file weight are preserved. With `padBlank`, a blank page sized
 * like the previous one is appended after each odd-length document.
 */
export async function mergePdfs(
  sources: (ArrayBuffer | Uint8Array)[],
  opts: { padBlank: boolean },
  onProgress?: (done: number, total: number) => void,
): Promise<MergeResult> {
  const out = await PDFDocument.create();
  let done = 0;
  for (const bytes of sources) {
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    if (opts.padBlank && pages.length % 2 === 1) {
      const { width, height } = pages[pages.length - 1].getSize();
      out.addPage([width, height]);
    }
    done += 1;
    onProgress?.(done, sources.length);
  }
  const bytes = await out.save();
  return { bytes, pages: out.getPageCount() };
}
