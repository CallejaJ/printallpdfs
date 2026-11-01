import { PDFDocument } from "pdf-lib";
import { chunk, countPages, isPdf, mergePdfs, pagesToPrint, sortItems } from "../pdf";
import { formatSize } from "../format";

async function makePdf(pages: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([595, 842]);
  return doc.save();
}

const item = (name: string, lastModified: number) => ({ file: { name, lastModified } });

describe("isPdf", () => {
  it("accepts the PDF mime type or extension", () => {
    expect(isPdf({ name: "a.pdf", type: "" })).toBe(true);
    expect(isPdf({ name: "a.bin", type: "application/pdf" })).toBe(true);
    expect(isPdf({ name: "notes.txt", type: "text/plain" })).toBe(false);
  });
});

describe("sortItems", () => {
  const items = [item("alb_10.pdf", 3), item("alb_2.pdf", 1), item("alb_1.pdf", 2)];

  it("keeps the order in manual mode", () => {
    expect(sortItems(items, "manual", "asc")).toBe(items);
  });

  it("sorts names in natural numeric order and can reverse", () => {
    expect(sortItems(items, "name", "asc").map((i) => i.file.name)).toEqual(["alb_1.pdf", "alb_2.pdf", "alb_10.pdf"]);
    expect(sortItems(items, "name", "desc").map((i) => i.file.name)).toEqual(["alb_10.pdf", "alb_2.pdf", "alb_1.pdf"]);
  });

  it("sorts by last modified date", () => {
    expect(sortItems(items, "date", "asc").map((i) => i.file.lastModified)).toEqual([1, 2, 3]);
    expect(sortItems(items, "date", "desc").map((i) => i.file.lastModified)).toEqual([3, 2, 1]);
  });
});

describe("chunk", () => {
  it("returns one group when size is 0 or larger than the list", () => {
    expect(chunk([1, 2, 3], 0)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it("splits into consecutive groups", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns no groups for an empty list", () => {
    expect(chunk([], 5)).toEqual([]);
  });
});

describe("pagesToPrint", () => {
  it("adds one blank page per odd-length document when padding", () => {
    expect(pagesToPrint([2, 3, 1], false)).toBe(6);
    expect(pagesToPrint([2, 3, 1], true)).toBe(8);
  });
});

describe("mergePdfs", () => {
  it("merges pages in order and reports progress", async () => {
    const sources = [await makePdf(2), await makePdf(3), await makePdf(1)];
    const progress: number[] = [];
    const { bytes, pages } = await mergePdfs(sources, { padBlank: false }, (done) => progress.push(done));
    expect(pages).toBe(6);
    expect(await countPages(bytes)).toBe(6);
    expect(progress).toEqual([1, 2, 3]);
  });

  it("pads odd-length documents with a blank page", async () => {
    const sources = [await makePdf(2), await makePdf(3), await makePdf(1)];
    const { pages } = await mergePdfs(sources, { padBlank: true });
    expect(pages).toBe(pagesToPrint([2, 3, 1], true));
  });
});

describe("formatSize", () => {
  it("formats KB, MB and GB", () => {
    expect(formatSize(2048)).toBe("2 KB");
    expect(formatSize(3 * 1024 * 1024)).toBe("3.0 MB");
    expect(formatSize(2 * 1024 * 1024 * 1024)).toBe("2.00 GB");
  });
});
