"use client";

import type { Property } from "@/data/home";
import { PropertyCardBlock } from "./property-card-block";
import { AnimateIn } from "@/components/common/animate-in";

interface SimilarPropertiesProps {
  items: Property[];
}

export function SimilarProperties({ items }: SimilarPropertiesProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-[rgba(26,26,26,0.08)] pt-6 lg:mt-14 lg:pt-10">
      <AnimateIn animation="fade-up">
        <h2 className="mb-4 text-[16px] font-semibold leading-snug text-[#1a1a1a] lg:mb-6 lg:text-[22px] [font-family:var(--font-playfair)]">
          Similar Properties
        </h2>
      </AnimateIn>

      {/* Mobile: horizontal carousel */}
      <AnimateIn animation="fade-up" delay={80} className="lg:hidden">
        <div className="flex snap-x snap-mandatory gap-[13px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p) => (
            <div key={p.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
              <PropertyCardBlock property={p} />
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Desktop: 3-column grid with stagger */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
        {items.map((p, i) => (
          <AnimateIn key={p.id} animation="fade-up" delay={i * 120}>
            <PropertyCardBlock property={p} />
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
