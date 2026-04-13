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

/** Slide positions: Figma 819:8117 uses a 976px track; equal thirds + 5px inset matches Buy/Rent/Lease states */
const pillLeft: Record<ListingMode, string> = {
  buy: "5px",
  rent: "calc(5px + (100% - 10px) / 3)",
  lease: "calc(5px + 2 * (100% - 10px) / 3)",
};

export function HeroSearchCard() {
  const [mode, setMode] = useState<ListingMode>("buy");

  return (
    <div className="absolute bottom-0 left-1/2 z-30 w-[1024px] max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-1/2 rounded-2xl bg-white px-6 pt-6 pb-6 shadow-[0px_10px_40px_-12px_rgba(0,0,0,0.25)]">
      <div className="relative h-[70px] w-full rounded-[20px] bg-[#f6f6f6]">
        <div
          className="pointer-events-none absolute top-[5px] h-[60px] rounded-[15px] bg-[#2a478d] transition-[left] duration-300 ease-out"
          style={{
            left: pillLeft[mode],
            width: "calc((100% - 10px) / 3)",
          }}
          aria-hidden
        />

        <div
          className="absolute inset-0 flex [font-family:var(--font-urbanist)]"
          role="tablist"
          aria-label="Listing type"
        >
          {modes.map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                className={`relative z-10 flex h-[70px] flex-1 items-center justify-center text-base capitalize transition-colors ${
                  active ? "font-semibold text-white" : "font-medium text-[#1a1a1a]"
                }`}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[23px] flex flex-nowrap items-center gap-3 overflow-x-auto pb-0.5 [scrollbar-width:thin]">
        {searchFields.map((field) => (
          <div
            key={field.label}
            className="flex h-[50px] min-w-0 flex-1 basis-0 items-center gap-2.5 rounded-md border border-[rgba(26,26,26,0.1)] bg-white px-3"
          >
            <Image src={field.icon} alt="" width={20} height={20} className="size-5 shrink-0" />
            <span className="truncate text-sm font-medium leading-none text-[#969696]">{field.label}</span>
          </div>
        ))}
        <button
          type="button"
          className="flex h-[50px] w-[182px] shrink-0 items-center justify-center gap-2 rounded-md bg-[#2a478d] text-base font-semibold text-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
        >
          <Image src="/assets/figma/icon-819-5735.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
          Search
        </button>
      </div>
    </div>
  );
}
