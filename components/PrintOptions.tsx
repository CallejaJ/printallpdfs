"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { formatSize } from "@/lib/format";
import { BATCH_SIZES, type SortDir, type SortMode } from "@/lib/pdf";
import AnimatedNumber from "./AnimatedNumber";
import {
  CalendarIcon,
  CheckIcon,
  CopiesIcon,
  DownloadIcon,
  GripIcon,
  LayersIcon,
  LockIcon,
  PrintIcon,
  SortNameIcon,
  SwapIcon,
  WarnIcon,
} from "./icons";

export interface BatchInfo {
  files: number;
  pages: number;
  printed: boolean;
}

interface Props {
  sortMode: SortMode;
  sortDir: SortDir;
  onSortMode: (m: SortMode) => void;
  onToggleDir: () => void;
  batchSize: number;
  onBatchSize: (n: number) => void;
  padBlank: boolean;
  onPadBlank: (v: boolean) => void;
  stats: { files: number; pages: number; toPrint: number; bytes: number; tooBig: boolean };
  batches: BatchInfo[];
  busy: boolean;
  progress: { done: number; total: number } | null;
  status: { text: string; error: boolean } | null;
  onPrint: (batchIndex?: number) => void;
  onDownload: () => void;
}

const SORTS: { mode: SortMode; icon: React.ReactNode; key: "orderManual" | "orderName" | "orderDate" }[] = [
  { mode: "manual", icon: <GripIcon />, key: "orderManual" },
  { mode: "name", icon: <SortNameIcon />, key: "orderName" },
  { mode: "date", icon: <CalendarIcon />, key: "orderDate" },
];

const spring = { type: "spring" as const, stiffness: 500, damping: 38 };

export default function PrintOptions(p: Props) {
  const { t, dict } = useLang();
  const multi = p.batches.length > 1;
  const nextBatch = p.batches.findIndex((b) => !b.printed);
  const allSent = multi && nextBatch === -1;
  const disabled = p.busy || p.stats.files === 0;

  let printLabel = t("print");
  if (multi) printLabel = allSent ? t("allPrinted") : t("printBatch", nextBatch + 1, p.batches.length);

  return (
    <aside className="panel">
      <h2>{t("optionsTitle")}</h2>
      <p className="panel-sub">{t("optionsSub")}</p>

      {/* Order */}
      <div className="opt-group">
        <div className="opt-head">
          <span className="opt-label" id="orderLabel">
            {t("order")}
          </span>
          <AnimatePresence>
            {p.sortMode !== "manual" && (
              <motion.button
                id="sortDir"
                className="dir-btn"
                type="button"
                data-dir={p.sortDir}
                title={t("dirToggle")}
                onClick={p.onToggleDir}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span animate={{ rotate: p.sortDir === "desc" ? 180 : 0 }} style={{ display: "inline-flex" }}>
                  <SwapIcon />
                </motion.span>
                <span>{(p.sortDir === "asc" ? dict.dirAsc : dict.dirDesc)[p.sortMode]}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="opt-hint">{dict.orderHint[p.sortMode]}</p>
        <div className="seg" role="radiogroup" aria-labelledby="orderLabel">
          {SORTS.map((s) => (
            <label key={s.mode} className="seg-opt">
              <input
                type="radio"
                name="sort"
                value={s.mode}
                checked={p.sortMode === s.mode}
                onChange={() => p.onSortMode(s.mode)}
              />
              <span className={`seg-card${p.sortMode === s.mode ? " active" : ""}`}>
                {p.sortMode === s.mode && <motion.span layoutId="sort-pill" className="seg-pill" transition={spring} />}
                {s.icon}
                <b>{t(s.key)}</b>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Batches */}
      <div className="opt-group">
        <div className="opt-head">
          <span className="opt-label" id="batchLabel">
            <LayersIcon /> {t("batch")}
          </span>
        </div>
        <p className="opt-hint">{t("batchHint")}</p>
        <div className="seg" role="radiogroup" aria-labelledby="batchLabel">
          {BATCH_SIZES.map((n) => (
            <label key={n} className="seg-opt">
              <input type="radio" name="batch" value={n} checked={p.batchSize === n} onChange={() => p.onBatchSize(n)} />
              <span className={`seg-card${p.batchSize === n ? " active" : ""}`}>
                {p.batchSize === n && <motion.span layoutId="batch-pill" className="seg-pill" transition={spring} />}
                <b>{n === 0 ? t("batchAll") : n}</b>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Duplex */}
      <div className="opt-group">
        <label className="switch">
          <input id="blank" type="checkbox" checked={p.padBlank} onChange={(e) => p.onPadBlank(e.target.checked)} />
          <span>
            <span className="opt-label">{t("blank")}</span>
            <small>{t("blankHint")}</small>
          </span>
        </label>
      </div>

      {/* Copies */}
      <div className="opt-group copies-info">
        <CopiesIcon />
        <span>
          <span className="opt-label">{t("copiesTitle")}</span>
          <small>{t("copiesInfo")}</small>
        </span>
      </div>

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
    </aside>
  );
}
