"use client";

import { useLayoutEffect, useState } from "react";

const DEFAULT_DURATION_MS = 320;

/**
 * Keeps a right drawer mounted briefly after `open` becomes false so exit
 * transform/opacity transitions can finish.
 */
export function useRightDrawerMount(
  open: boolean,
  durationMs = DEFAULT_DURATION_MS,
) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), durationMs);
    return () => window.clearTimeout(t);
  }, [open, durationMs]);

  return { mounted, entered };
}
