"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import type { Property } from "@/data/home";

interface FeaturedPropertiesSectionProps {
  properties: Property[];
}

export function FeaturedPropertiesSection({ properties }: FeaturedPropertiesSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  /* Keep dot in sync while the user manually swipes */
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
    const i = Math.round(track.scrollLeft / (cardWidth + 29));
    setActiveIndex(Math.min(Math.max(i, 0), properties.length - 1));
  }, [properties.length]);

  return (
    <section className="w-full py-10 sm:py-[60px]">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center px-6 text-center sm:mb-[37px] sm:px-10 lg:px-[76px]">
        <h2 className="text-[28px] font-medium leading-tight text-[#2a478d] sm:text-[36px] lg:text-[48px] lg:leading-none [font-family:var(--font-playfair)]">
          Featured Properties
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-[#6b6b6b] sm:mt-4 sm:text-[18px] lg:text-[20px] [font-family:var(--font-urbanist)]">
          Handpicked exclusive listings just for you
        </p>
      </div>

      {/* ── Mobile/tablet: horizontal carousel ── */}
      <div className="lg:hidden px-4">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-6 pb-2 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*:last-child]:mr-6 sm:[&>*:last-child]:mr-10"
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} className="w-[78vw] max-w-[300px] shrink-0 snap-start" />
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {properties.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${
                i === activeIndex ? "h-2.5 w-6 bg-[#2a478d]" : "h-2.5 w-2.5 bg-[#2a478d]/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop: 3-column grid ── */}
      <div className="mx-auto hidden max-w-[1332px] grid-cols-3 gap-[29px] px-[76px] lg:grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:mt-10">
        <Link
          href="/properties"
          className="text-base font-medium text-[#2a478d] hover:underline [font-family:var(--font-dm-sans)]"
        >
          View All Properties →
        </Link>
      </div>
    </section>
  );
}

function PropertyCard({ property, className = "" }: { property: Property; className?: string }) {
  return (
    <article
      className={`overflow-hidden rounded-[14px] bg-white shadow-[0px_3.58px_5.38px_-3.58px_rgba(0,0,0,0.1),0px_8.96px_13.44px_-2.69px_rgba(0,0,0,0.1)] ${className}`}
    >
      <div className="relative h-[180px] w-full sm:h-[210px] lg:h-[229px]">
        <Image src={property.image} alt={property.title} fill className="object-cover" sizes="(max-width:768px) 80vw, (max-width:1024px) 50vw, 33vw" />
        <span className="absolute left-[14px] top-[12px] rounded-full bg-white px-[14px] py-[5px] text-[12.5px] font-medium text-[#2a478d] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] [font-family:var(--font-dm-sans)]">
          {property.type}
        </span>
        {property.featured && (
          <span className="absolute right-[14px] top-[15px] rounded-full bg-[#1a1a1a] px-[11px] py-[3.5px] text-[10.75px] font-medium text-[#f5f0e8] [font-family:var(--font-dm-sans)]">
            FEATURED
          </span>
        )}
      </div>

      <div className="px-[22px] py-[18px] lg:py-[22px]">
        <h3 className="text-[15px] font-semibold leading-[1.4] text-[#1a1a1a] lg:text-[17.9px] [font-family:var(--font-playfair)]">
          {property.title}
        </h3>

        <div className="mt-[8px] flex items-center gap-[4px]">
          <Image src="/assets/figma/icon-pin.svg" alt="" width={14} height={14} />
          <span className="text-[13px] text-[#6b6b6b] lg:text-[14px] [font-family:var(--font-dm-sans)]">{property.location}</span>
        </div>

        <div className="mt-[12px] flex items-center gap-[14px]">
          <span className="flex items-center gap-[4px] text-[12px] text-[#6b6b6b] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
            <Image src="/assets/figma/icon-bed.svg" alt="" width={14} height={14} />
            {property.beds} Beds
          </span>
          <span className="flex items-center gap-[4px] text-[12px] text-[#6b6b6b] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
            <Image src="/assets/figma/icon-bath.svg" alt="" width={14} height={14} />
            {property.baths} Baths
          </span>
          <span className="text-[12px] text-[#6b6b6b] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">{property.sqm} SQM</span>
        </div>

        <div className="mt-[14px] flex items-center justify-between lg:mt-[18px]">
          <span className="text-[18px] font-bold text-[#2a478d] lg:text-[21.5px]" style={{ fontFamily: "Georgia, serif" }}>
            {property.price}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="rounded-[5.4px] border border-[#2a478d] px-[16px] py-[6px] text-[13px] font-medium text-[#2a478d] transition-colors hover:bg-[#2a478d] hover:text-white lg:px-[22px] lg:py-[8px] lg:text-[14px] [font-family:var(--font-dm-sans)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
