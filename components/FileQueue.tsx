"use client";

import { AnimatePresence, Reorder, motion, useDragControls } from "motion/react";
import { useLang } from "@/lib/i18n";
import { formatSize } from "@/lib/format";
import type { QueueItem } from "@/lib/pdf";
import { FileIcon, GripIcon } from "./icons";

interface Props {
  items: QueueItem[];
  totalBytes: number;
  busy: boolean;
  onReorder: (next: QueueItem[]) => void;
  onMove: (index: number, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function FileQueue({ items, totalBytes, busy, onReorder, onMove, onRemove, onClear }: Props) {
  const { t } = useLang();

  return (
    <>
      <div className="queue-head">
        <span id="queueCount">{t("queue", items.length, formatSize(totalBytes))}</span>
        <button id="clear" className="link" type="button" onClick={onClear} disabled={busy || items.length === 0}>
          {t("clear")}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {items.length === 0 && (
          <motion.p
            className="queue-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
          >
            {t("empty")}
          </motion.p>
        )}
      </AnimatePresence>

      <Reorder.Group as="ul" id="list" axis="y" values={items} onReorder={onReorder}>
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <QueueRow
              key={item.id}
              item={item}
              index={i}
              last={i === items.length - 1}
              onMove={onMove}
              onRemove={onRemove}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </>
  );
}

function QueueRow({
  item,
  index,
  last,
  onMove,
  onRemove,
}: {
  item: QueueItem;
  index: number;
  last: boolean;
  onMove: (index: number, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useLang();
  const controls = useDragControls();
  const meta = item.error
    ? t("unreadable")
    : `${item.pages == null ? "…" : t("pages", item.pages)} · ${formatSize(item.file.size)}`;

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={item.error ? "err" : undefined}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 28px -10px rgba(0,0,0,.45)", zIndex: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    >
      <span
        className="drag-handle"
        title={t("drag")}
        aria-label={t("drag")}
        onPointerDown={(e) => controls.start(e)}
      >
        <GripIcon />
      </span>
      <span className="n">{index + 1}</span>
      <FileIcon className="file-icon" size={20} />
      <span className="name" title={item.file.name}>
        {item.file.name}
      </span>
      <span className="meta">{meta}</span>
      <span className="row-actions">
        <button className="mini" type="button" title={t("up")} aria-label={t("up")} disabled={index === 0} onClick={() => onMove(index, -1)}>
          ↑
        </button>
        <button className="mini" type="button" title={t("down")} aria-label={t("down")} disabled={last} onClick={() => onMove(index, 1)}>
          ↓
        </button>
        <button className="icon" type="button" title={t("remove")} aria-label={t("remove")} onClick={() => onRemove(item.id)}>
          ✕
        </button>
      </span>
    </Reorder.Item>
  );
}
