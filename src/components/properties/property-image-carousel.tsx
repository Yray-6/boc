"use client";

import { useState } from "react";
import Image from "next/image";
import type { PropertyType } from "@/data/home";

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
  type: PropertyType;
}

const TYPE_LABEL: Record<PropertyType, string> = {
  BUY: "FOR BUY",
  RENT: "FOR RENT",
  LEASE: "FOR LEASE",
};

export function PropertyImageCarousel({ images, title, type }: PropertyImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="relative w-full overflow-hidden rounded-[20px]" style={{ aspectRatio: "1240/487" }}>
      <Image
        src={images[index]}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="(max-width:1440px) 100vw, 1240px"
      />

      {/* Type badge */}
      <div className="absolute left-4 top-4 rounded-md bg-[#00C950] px-3 py-1.5">
        <span className="text-xs font-semibold text-white [font-family:var(--font-dm-sans)]">
          {TYPE_LABEL[type]}
        </span>
      </div>

      {/* Prev / Next */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
