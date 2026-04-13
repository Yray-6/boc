"use client";

import Image from "next/image";
import { useState } from "react";

const searchFields = [
  { label: "Location", icon: "/assets/figma/icon-location.svg" },
  { label: "Property type", icon: "/assets/figma/icon-property.svg" },
  { label: "Min. Price", icon: "/assets/figma/icon-trade-down.svg" },
  { label: "Max. price", icon: "/assets/figma/icon-trade-up.svg" },
] as const;

type ListingMode = "buy" | "rent" | "lease";
const modes: ListingMode[] = ["buy", "rent", "lease"];

/** Pill left positions for desktop 3-tab toggle */
const pillLeft: Record<ListingMode, string> = {
  buy: "5px",
  rent: "calc(5px + (100% - 10px) / 3)",
  lease: "calc(5px + 2 * (100% - 10px) / 3)",
};

export function HeroSearchCard() {
  const [mode, setMode] = useState<ListingMode>("buy");

  return (
    <div className="absolute bottom-0 left-1/2 z-30 w-[calc(100%-2rem)] max-w-[405px] -translate-x-1/2 translate-y-1/2 rounded-[6px] bg-white px-[9.5px] pt-[9.5px] pb-[9.5px] shadow-[0px_4px_16px_-5px_rgba(0,0,0,0.25)] sm:max-w-[600px] lg:max-w-[1024px] lg:rounded-2xl lg:px-6 lg:pt-6 lg:pb-6 lg:shadow-[0px_10px_40px_-12px_rgba(0,0,0,0.25)]">

      {/* ── Buy / Rent / Lease toggle ── */}
      <div className="relative h-10 w-full rounded-[8px] bg-[#f6f6f6] lg:h-[70px] lg:rounded-[20px]">
        <div
          className="pointer-events-none absolute top-[3px] h-[calc(100%-6px)] rounded-[6px] bg-[#2a478d] transition-[left] duration-300 ease-out lg:top-[5px] lg:h-[60px] lg:rounded-[15px]"
          style={{ left: pillLeft[mode], width: "calc((100% - 10px) / 3)" }}
          aria-hidden
        />
        <div className="absolute inset-0 flex" role="tablist" aria-label="Listing type">
          {modes.map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={`relative z-10 flex flex-1 items-center justify-center capitalize transition-colors [font-family:var(--font-urbanist)]
                  text-sm lg:text-base
                  ${active ? "font-semibold text-white" : "font-medium text-[#1a1a1a]"}`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search fields ── */}
      {/* Mobile: vertical stack | Desktop: horizontal row */}
      <div className="mt-[4px] flex flex-col gap-[4px] lg:mt-[23px] lg:flex-row lg:flex-nowrap lg:items-center lg:gap-3 lg:overflow-x-auto lg:pb-0.5 lg:[scrollbar-width:thin]">
        {searchFields.map((field) => (
          <div
            key={field.label}
            className="flex h-10 w-full items-center gap-3 rounded-md border border-[rgba(26,26,26,0.1)] bg-white px-4 lg:h-[50px] lg:min-w-0 lg:flex-1 lg:basis-0 lg:rounded-md lg:px-3"
          >
            <Image src={field.icon} alt="" width={16} height={16} className="size-4 shrink-0 lg:size-5" />
            <span className="truncate text-sm font-medium leading-none text-[#969696] lg:text-sm">
              {field.label}
            </span>
          </div>
        ))}

        {/* Search button */}
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#2a478d] text-sm font-semibold text-white shadow-[0px_1.58px_2.37px_-1.58px_rgba(0,0,0,0.1),0px_3.95px_5.93px_-1.19px_rgba(0,0,0,0.1)] lg:h-[50px] lg:w-[182px] lg:shrink-0 lg:text-base"
        >
          <Image src="/assets/figma/icon-819-5735.svg" alt="" width={16} height={16} className="size-4 shrink-0 lg:size-5" />
          Search
        </button>
      </div>
    </div>
  );
}
