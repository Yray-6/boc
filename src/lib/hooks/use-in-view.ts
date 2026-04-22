"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Trigger only once (default true). */
  once?: boolean;
  /** Intersection threshold 0–1 (default 0.15). */
  threshold?: number;
  /** Root margin (default "0px 0px -60px 0px" — triggers slightly before element hits viewport edge). */
  rootMargin?: string;
}

/**
 * Returns [ref, hasEntered].
 * Attach `ref` to the element you want to observe.
 * `hasEntered` becomes true when the element enters the viewport.
 */
export function useInView<T extends Element = Element>({
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
}: UseInViewOptions = {}): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, inView];
}
