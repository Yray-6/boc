"use client";

import { useState } from "react";
import Image from "next/image";
import type { Property } from "@/data/home";

type Tab = "overview" | "features" | "location";

/** Property info section — Figma node 819:7259 + tabs */
export function PropertyDetailInfo({ property }: { property: Property }) {
  const [tab, setTab] = useState<Tab>("overview");

  const stats = [
    { icon: "/assets/figma/icon-bed.svg", value: property.beds, label: "Bedrooms" },
    { icon: "/assets/figma/icon-bath.svg", value: property.baths, label: "Bathrooms" },
    { icon: "/assets/figma/icon-property.svg", value: property.sqm, label: "SQM" },
    { icon: "/assets/figma/icon-trade-down.svg", value: property.parking, label: "Parking" },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "features", label: "Features" },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="flex flex-col">
      {/* Title */}
      <h1 className="text-[18px] font-medium leading-[1.12] text-[#2a478d] lg:text-[clamp(1.5rem,3vw,1.83rem)] [font-family:var(--font-playfair)]">
        {property.title}
      </h1>

      {/* Location */}
      <div className="mt-[10px] flex items-start gap-[4px] lg:mt-[18px] lg:gap-[6px]">
        <svg width="8.39" height="8.39" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0 lg:h-[16px] lg:w-[16px]">
          <path d="M7 1C4.79 1 3 2.79 3 5c0 3.31 4 8 4 8s4-4.69 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="#6b6b6b" />
        </svg>
        <span className="text-[10px] leading-normal text-[#6b6b6b] lg:text-[13px] [font-family:var(--font-dm-sans)]">
          {property.address}
        </span>
      </div>

      {/* Price */}
      <p className="mt-[10px] text-[15.1px] font-bold leading-[1.11] text-[#2a478d] lg:mt-[22px] lg:text-[clamp(1.5rem,3vw,1.83rem)] font-[Georgia,serif]">
        {property.price}
      </p>

      {/* Stats grid — Figma 819:9277: 4 equal tiles, light blue bg */}
      <div className="mt-[10px] grid grid-cols-4 gap-[6.71px] lg:mt-[32px] lg:gap-[13px]">
        {stats.map(({ icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col rounded-[2.52px] bg-[rgba(42,71,141,0.1)] px-[6.71px] py-[6.71px] lg:rounded-[5px] lg:px-[13px] lg:py-[13px]"
          >
            <Image src={icon} alt="" width={10} height={10} className="lg:h-[20px]  lg:w-[20px]" />
            <span className="mt-[8px] text-[12px] font-semibold leading-[1.33] text-[#1a1a1a] lg:mt-[14px] lg:text-[19.5px] [font-family:var(--font-dm-sans)]">
              {value}
            </span>
            <span className="mt-[2px] text-[10px] leading-[1.43] text-[#6b6b6b] lg:mt-[5px] lg:text-[11.4px] [font-family:var(--font-dm-sans)]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-[rgba(26,26,26,0.1)]">
        <div className="flex gap-8">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-3 text-sm font-medium transition-colors [font-family:var(--font-dm-sans)] ${
                tab === key
                  ? "border-b-2 border-[#2a478d] text-[#2a478d]"
                  : "text-[rgba(26,26,26,0.5)] hover:text-[#1a1a1a]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tab === "overview" && (
          <div className="flex flex-col gap-5">
            {/* Description */}
            <div>
              <h2 className="mb-3 text-base font-bold leading-snug text-[#1a1a1a] [font-family:var(--font-dm-sans)]">
                Property Description
              </h2>
              <p className="text-sm leading-relaxed text-[#575757] [font-family:var(--font-dm-sans)]">
                {property.description}
              </p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[rgba(26,26,26,0.08)] pt-5">
              {[
                { label: "Property Type", value: property.propertyType },
                { label: "Year Built", value: property.yearBuilt },
                { label: "Status", value: property.status },
                { label: "Toilets", value: property.toilets },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-[#6b6b6b] [font-family:var(--font-dm-sans)]">{label}</span>
                  <span className="text-sm font-semibold text-[#1a1a1a] [font-family:var(--font-dm-sans)]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "features" && (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {property.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#1a1a1a] [font-family:var(--font-dm-sans)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(42,71,141,0.12)]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#2a478d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {tab === "location" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#575757] [font-family:var(--font-dm-sans)]">{property.address}</p>
            <div className="mt-2 flex h-[260px] items-center justify-center rounded-[12px] bg-[rgba(42,71,141,0.06)] text-sm text-[rgba(26,26,26,0.4)] [font-family:var(--font-dm-sans)]">
              Map view coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
