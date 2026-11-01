"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

/** Counts smoothly from the previous value to the new one. */
export default function AnimatedNumber({ value, id }: { value: number; id?: string }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, value]);

  return (
    <motion.b id={id} data-value={value}>
      {rounded}
    </motion.b>
  );
}
