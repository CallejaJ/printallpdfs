"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { BATCH_SIZES, type SortDir, type SortMode } from "@/lib/pdf";
import { CalendarIcon, CopiesIcon, GripIcon, LayersIcon, SortNameIcon, SwapIcon } from "./icons";

interface Props {
  sortMode: SortMode;
  sortDir: SortDir;
  onSortMode: (m: SortMode) => void;
  onToggleDir: () => void;
  batchSize: number;
  onBatchSize: (n: number) => void;
  padBlank: boolean;
  onPadBlank: (v: boolean) => void;
}

const SORTS: { mode: SortMode; icon: React.ReactNode; key: "orderManual" | "orderName" | "orderDate" }[] = [
  { mode: "manual", icon: <GripIcon />, key: "orderManual" },
  { mode: "name", icon: <SortNameIcon />, key: "orderName" },
  { mode: "date", icon: <CalendarIcon />, key: "orderDate" },
];

const spring = { type: "spring" as const, stiffness: 500, damping: 38 };

export default function PrintOptions(p: Props) {
  const { t, dict } = useLang();
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

    </aside>
  );
}
