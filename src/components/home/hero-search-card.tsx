"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ListingMode = "BUY" | "RENT" | "LEASE" | "SHORT_LET";

const MODES: { value: ListingMode; label: string }[] = [
  { value: "BUY", label: "Buy" },
  { value: "RENT", label: "Rent" },
  { value: "LEASE", label: "Lease" },
  { value: "SHORT_LET", label: "Short let" },
];

/** Sliding pill left position for the 4-tab toggle */
function pillLeft(index: number) {
  return `calc(5px + ${index} * (100% - 10px) / 4)`;
}

export function HeroSearchCard() {
  const router = useRouter();
  const [mode, setMode] = useState<ListingMode>("BUY");
  const [state, setState] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    qs.set("listing_type", mode);
    if (state.trim()) qs.set("state", state.trim());
    if (priceMin.trim()) qs.set("price_min", priceMin.trim());
    if (priceMax.trim()) qs.set("price_max", priceMax.trim());
    router.push(`/properties?${qs.toString()}`);
  }

  const modeIndex = MODES.findIndex((m) => m.value === mode);

  const inputCls =
    "flex h-10 w-full items-center gap-3 rounded-md border border-[rgba(26,26,26,0.1)] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#969696] outline-none focus:border-[#2a478d] transition-colors lg:h-[50px] lg:min-w-0 lg:flex-1 lg:basis-0 lg:rounded-md lg:px-3 [font-family:var(--font-dm-sans)]";

  return (
    <div className="absolute bottom-0 left-1/2 z-30 w-[calc(100%-2rem)] max-w-[405px] -translate-x-1/2 translate-y-1/2 rounded-[6px] bg-white px-[9.5px] pt-[9.5px] pb-[9.5px] shadow-[0px_4px_16px_-5px_rgba(0,0,0,0.25)] sm:max-w-[600px] lg:max-w-[1024px] lg:rounded-2xl lg:px-6 lg:pt-6 lg:pb-6 lg:shadow-[0px_10px_40px_-12px_rgba(0,0,0,0.25)]">

      {/* ── Buy / Rent / Lease / Short let toggle ── */}
      <div className="relative h-10 w-full rounded-[8px] bg-[#f6f6f6] lg:h-[70px] lg:rounded-[20px]">
        <div
          className="pointer-events-none absolute top-[3px] h-[calc(100%-6px)] rounded-[6px] bg-[#2a478d] transition-[left] duration-300 ease-out lg:top-[5px] lg:h-[60px] lg:rounded-[15px]"
          style={{ left: pillLeft(modeIndex), width: "calc((100% - 10px) / 4)" }}
          aria-hidden
        />
        <div className="absolute inset-0 flex" role="tablist" aria-label="Listing type">
          {MODES.map((m) => {
            const active = mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m.value)}
                className={`relative z-10 flex flex-1 items-center justify-center transition-colors [font-family:var(--font-urbanist)]
                  text-[11px] lg:text-base
                  ${active ? "font-semibold text-white" : "font-medium text-[#1a1a1a]"}`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search fields ── */}
      <form
        onSubmit={handleSearch}
        className="mt-[4px] flex flex-col gap-[4px] lg:mt-[23px] lg:flex-row lg:flex-nowrap lg:items-center lg:gap-3"
      >
        {/* State */}
        <div className="relative flex lg:flex-1 lg:basis-0">
          <Image
            src="/assets/figma/icon-location.svg"
            alt=""
            width={16}
            height={16}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 shrink-0 lg:size-5"
          />
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State (e.g. Lagos)"
            className={`${inputCls} pl-9 lg:pl-10`}
          />
        </div>

        {/* Min Price */}
        <div className="relative flex lg:flex-1 lg:basis-0">
          <Image
            src="/assets/figma/icon-trade-down.svg"
            alt=""
            width={16}
            height={16}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 shrink-0 lg:size-5"
          />
          <input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Min Price (₦)"
            className={`${inputCls} pl-9 lg:pl-10`}
          />
        </div>

        {/* Max Price */}
        <div className="relative flex lg:flex-1 lg:basis-0">
          <Image
            src="/assets/figma/icon-trade-up.svg"
            alt=""
            width={16}
            height={16}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 shrink-0 lg:size-5"
          />
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Max Price (₦)"
            className={`${inputCls} pl-9 lg:pl-10`}
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#2a478d] text-sm font-semibold text-white shadow-[0px_1.58px_2.37px_-1.58px_rgba(0,0,0,0.1),0px_3.95px_5.93px_-1.19px_rgba(0,0,0,0.1)] lg:h-[50px] lg:w-[182px] lg:shrink-0 lg:text-base"
        >
          <Image src="/assets/figma/icon-819-5735.svg" alt="" width={16} height={16} className="size-4 shrink-0 lg:size-5" />
          Search
        </button>
      </form>
    </div>
  );
}
