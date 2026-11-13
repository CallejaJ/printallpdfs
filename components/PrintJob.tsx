"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { formatSize } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import { CheckIcon, DownloadIcon, LockIcon, PrintIcon, WarnIcon } from "./icons";

export interface BatchInfo {
  files: number;
  pages: number;
  printed: boolean;
}

interface Props {
  stats: { files: number; pages: number; toPrint: number; bytes: number; tooBig: boolean };
  batches: BatchInfo[];
  busy: boolean;
  progress: { done: number; total: number } | null;
  status: { text: string; error: boolean } | null;
  onPrint: (batchIndex?: number) => void;
  onDownload: () => void;
}

// Third column: totals, batch progress and the print and download actions.
export default function PrintJob(p: Props) {
  const { t } = useLang();
  const multi = p.batches.length > 1;
  const nextBatch = p.batches.findIndex((b) => !b.printed);
  const allSent = multi && nextBatch === -1;
  const disabled = p.busy || p.stats.files === 0;

  let printLabel = t("print");
  if (multi) printLabel = allSent ? t("allPrinted") : t("printBatch", nextBatch + 1, p.batches.length);

  return (
    <section className="panel job-panel">
      <h2>{t("jobTitle")}</h2>
      <p className="panel-sub">{t("jobSub")}</p>

      <div className="summary">
        <div className="stat">
          <AnimatedNumber id="statFiles" value={p.stats.files} />
          <span>{t("statFiles")}</span>
        </div>
        <div className="stat">
          <AnimatedNumber id="statPages" value={p.stats.pages} />
          <span>{t("statPages")}</span>
        </div>
        <div className="stat">
          <AnimatedNumber id="statSheets" value={p.stats.toPrint} />
          <span>{t("statTotal")}</span>
        </div>
      </div>

      <AnimatePresence>
        {p.stats.tooBig && (
          <motion.div
            id="sizeWarn"
            className="size-warn"
            role="alert"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <WarnIcon />
            <span>{t("sizeWarn", formatSize(p.stats.bytes))}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {multi && (
          <motion.ol
            className="batch-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {p.batches.map((b, i) => (
              <motion.li
                key={i}
                layout
                className={b.printed ? "sent" : undefined}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="batch-dot">{b.printed ? <CheckIcon /> : i + 1}</span>
                <span className="batch-text">
                  <b>{t("batchLabel", i + 1)}</b>
                  <small>{t("batchMeta", b.files, b.pages)}</small>
                </span>
                <span className="batch-state">{b.printed ? t("batchSent") : t("batchPending")}</span>
                <button
                  type="button"
                  className="mini"
                  title={b.printed ? t("printAgain") : t("printBatch", i + 1, p.batches.length)}
                  aria-label={b.printed ? t("printAgain") : t("printBatch", i + 1, p.batches.length)}
                  disabled={p.busy}
                  onClick={() => p.onPrint(i)}
                >
                  <PrintIcon size={14} />
                </button>
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>

      <div className="actions">
        <motion.button
          id="print"
          className="primary"
          type="button"
          disabled={disabled || allSent}
          onClick={() => p.onPrint()}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence>
            {p.progress && (
              <motion.span
                className="btn-progress"
                initial={{ width: 0 }}
                animate={{ width: `${(p.progress.done / Math.max(1, p.progress.total)) * 100}%` }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeOut", duration: 0.25 }}
              />
            )}
          </AnimatePresence>
          <span className="btn-content">
            {allSent ? <CheckIcon size={18} /> : <PrintIcon />}
            <span>{p.progress ? t("merging", p.progress.done, p.progress.total) : printLabel}</span>
          </span>
        </motion.button>
        <motion.button id="download" className="secondary" type="button" disabled={disabled} onClick={p.onDownload} whileTap={{ scale: 0.97 }}>
          <DownloadIcon />
          <span>{t("download")}</span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {p.status && (
          <motion.p
            key={p.status.text}
            id="status"
            className={p.status.error ? "error" : undefined}
            aria-live="polite"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {p.status.text}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="privacy">
        <LockIcon />
        <span>{t("privacy")}</span>
      </div>
    </section>
  );
}
