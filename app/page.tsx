"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import {
  SIZE_WARN_BYTES,
  chunk,
  countPages,
  isPdf,
  mergePdfs,
  pagesToPrint,
  sortItems,
  type QueueItem,
  type SortDir,
  type SortMode,
} from "@/lib/pdf";
import DropZone from "@/components/DropZone";
import FileQueue from "@/components/FileQueue";
import PrintOptions from "@/components/PrintOptions";
import PrintJob, { type BatchInfo } from "@/components/PrintJob";
import HowItWorks from "@/components/HowItWorks";

type Status = { fn: (t: ReturnType<typeof useLang>["t"]) => string; error?: boolean } | null;

let nextId = 0;
const newId = () => `f${Date.now().toString(36)}${(nextId++).toString(36)}`;

export default function Home() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("manual");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [padBlank, setPadBlank] = useState(false);
  const [batchSize, setBatchSize] = useState(0);
  const [printed, setPrinted] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const lastUrl = useRef<string | null>(null);

  // Any change to what would be printed resets the batch progress.
  const okItems = useMemo(() => items.filter((i) => !i.error), [items]);
  const groups = useMemo(() => chunk(okItems, batchSize), [okItems, batchSize]);
  const groupKey = groups.map((g) => g.map((i) => i.id).join(",")).join("|") + String(padBlank);
  useEffect(() => setPrinted(new Set()), [groupKey]);

  const stats = useMemo(() => {
    const pages = okItems.map((i) => i.pages ?? 0);
    const bytes = okItems.reduce((s, i) => s + i.file.size, 0);
    return {
      files: okItems.length,
      pages: pages.reduce((a, b) => a + b, 0),
      toPrint: pagesToPrint(pages, padBlank),
      bytes,
      tooBig: bytes > SIZE_WARN_BYTES,
    };
  }, [okItems, padBlank]);

  const batches: BatchInfo[] = groups.map((g, i) => ({
    files: g.length,
    pages: pagesToPrint(
      g.map((x) => x.pages ?? 0),
      padBlank,
    ),
    printed: printed.has(i),
  }));

  const addFiles = useCallback(
    async (files: File[]) => {
      const pdfs = files.filter(isPdf);
      const skipped = files.length - pdfs.length;
      const added: QueueItem[] = pdfs.map((file) => ({ id: newId(), file, pages: null, error: false }));
      setItems((prev) => sortItems([...prev, ...added], sortMode, sortDir, lang));
      setStatus(skipped ? { fn: (tt) => tt("skipped", skipped) } : null);

      for (const item of added) {
        let pages: number | null = null;
        let error = false;
        try {
          pages = await countPages(await item.file.arrayBuffer());
        } catch {
          error = true;
        }
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, pages, error } : x)));
      }
    },
    [sortMode, sortDir, lang],
  );

  function changeSort(mode: SortMode, dir: SortDir = sortDir) {
    setSortMode(mode);
    setSortDir(dir);
    setItems((prev) => sortItems(prev, mode, dir, lang));
  }

  function move(index: number, delta: number) {
    setItems((prev) => {
      const next = [...prev];
      const j = index + delta;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setSortMode("manual");
  }

  async function build(list: QueueItem[]) {
    setProgress({ done: 0, total: list.length });
    const sources: ArrayBuffer[] = [];
    for (const it of list) sources.push(await it.file.arrayBuffer());
    const result = await mergePdfs(sources, { padBlank }, (done, total) => setProgress({ done, total }));
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    const url = URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: "application/pdf" }));
    lastUrl.current = url;
    return { url, pages: result.pages };
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ fn: (tt) => tt("error", msg), error: true });
    } finally {
      setProgress(null);
      setBusy(false);
    }
  }

  function print(batchIndex?: number) {
    const index = batchIndex ?? Math.max(0, batches.findIndex((b) => !b.printed));
    const list = groups[index];
    if (!list?.length) return;
    run(async () => {
      const { url, pages } = await build(list);
      const el = frame.current!;
      el.onload = () => {
        try {
          el.contentWindow?.focus();
          el.contentWindow?.print();
        } catch {
          window.open(url, "_blank");
        }
      };
      el.src = url;
      setPrinted((prev) => new Set(prev).add(index));
      setStatus({ fn: (tt) => tt("opening", pages) });
    });
  }

  function download() {
    run(async () => {
      const { url, pages } = await build(okItems);
      const a = document.createElement("a");
      a.href = url;
      a.download = "printallpdfs-merged.pdf";
      a.click();
      setStatus({ fn: (tt) => tt("downloaded", pages) });
    });
  }

  // Keep the browser from opening files dropped outside the drop zone.
  useEffect(() => {
    const stop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
      if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    };
  }, []);

  return (
    <>
      <div className="grid">
        <motion.section
          className="panel files-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h2>{t("filesTitle")}</h2>
          <p className="panel-sub">{t("filesSub")}</p>
          <DropZone onFiles={addFiles} />
          <FileQueue
            items={items}
            totalBytes={stats.bytes}
            busy={busy}
            onReorder={(next) => {
              setItems(next);
              setSortMode("manual");
            }}
            onMove={move}
            onRemove={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
            onClear={() => {
              setItems([]);
              setStatus(null);
            }}
          />
        </motion.section>

        <motion.div
          className="options-col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
        >
          <PrintOptions
            sortMode={sortMode}
            sortDir={sortDir}
            onSortMode={(m) => changeSort(m)}
            onToggleDir={() => changeSort(sortMode, sortDir === "asc" ? "desc" : "asc")}
            batchSize={batchSize}
            onBatchSize={setBatchSize}
            padBlank={padBlank}
            onPadBlank={setPadBlank}
          />
        </motion.div>

        <motion.div
          className="job-col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.16 }}
        >
          <PrintJob
            stats={stats}
            batches={batches}
            busy={busy}
            progress={progress}
            status={status ? { text: status.fn(t), error: !!status.error } : null}
            onPrint={print}
            onDownload={download}
          />
        </motion.div>
      </div>

      <HowItWorks />

      <iframe ref={frame} id="frame" title="Print preview" aria-hidden="true" tabIndex={-1} />
    </>
  );
}
