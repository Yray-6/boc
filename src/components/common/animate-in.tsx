"use client";

import { type ReactNode, type ElementType } from "react";
import { useInView } from "@/lib/hooks/use-in-view";

export type AnimationType =
  | "fade-up"
  | "fade-in"
  | "scale-in"
  | "slide-left"
  | "slide-right";

interface AnimateInProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;   // ms, e.g. 100, 200, 300 …
  duration?: number; // ms override (optional, defaults to CSS value)
  className?: string;
  as?: ElementType;
  threshold?: number;
  rootMargin?: string;
}

const ANIMATION_CLASS: Record<AnimationType, string> = {
  "fade-up":    "animate-fade-up",
  "fade-in":    "animate-fade-in",
  "scale-in":   "animate-scale-in",
  "slide-left": "animate-slide-left",
  "slide-right":"animate-slide-right",
};

/**
 * Wraps children in a container that plays a CSS animation once the element
 * enters the viewport. Invisible until triggered (no layout shift).
 */
export function AnimateIn({
  children,
  animation = "fade-up",
  delay,
  duration,
  className = "",
  as: Tag = "div",
  threshold,
  rootMargin,
}: AnimateInProps) {
  const [ref, inView] = useInView({ threshold, rootMargin });

  const style: React.CSSProperties = {};
  if (delay) style.animationDelay = `${delay}ms`;
  if (duration) style.animationDuration = `${duration}ms`;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`will-animate ${inView ? `in-view ${ANIMATION_CLASS[animation]}` : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
