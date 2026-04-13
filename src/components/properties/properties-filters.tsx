"use client";

import { useState } from "react";

const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "24/7 Security",
  "Backup Generator",
  "CCTV",
  "Fitted Kitchen",
  "Air Conditioning",
  "Borehole",
  "Parking",
  "Garden",
] as const;

const PROPERTY_TYPES = ["All Types", "Buy", "Rent", "Lease"] as const;
const BEDROOM_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"] as const;
const BATHROOM_OPTIONS = ["Any", "1+", "2+", "3+", "4+"] as const;

export interface FilterState {
  propertyType: string;
  location: string;
  priceMin: string;
  priceMax: string;
  bedrooms: string;
  bathrooms: string;
  amenities: Set<string>;
}

interface PropertiesFiltersProps {
  onChange?: (filters: FilterState) => void;
}

export function PropertiesFilters({ onChange }: PropertiesFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "All Types",
    location: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "Any",
    bathrooms: "Any",
    amenities: new Set(),
  });

  function update(patch: Partial<FilterState>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    onChange?.(next);
  }

  function toggleAmenity(name: string) {
    const next = new Set(filters.amenities);
    next.has(name) ? next.delete(name) : next.add(name);
    update({ amenities: next });
  }

  function resetAll() {
    const blank: FilterState = {
      propertyType: "All Types",
      location: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "Any",
      bathrooms: "Any",
      amenities: new Set(),
    };
    setFilters(blank);
    onChange?.(blank);
  }

  const selectCls =
    "w-full appearance-none rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-[10px] text-base text-[#1a1a1a] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[41px]";
  const inputCls =
    "w-full rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]";
  const labelCls =
    "block text-base font-medium leading-[1.5] text-[#1a1a1a] [font-family:var(--font-dm-sans)]";

  return (
    <aside className="w-[280px] shrink-0 rounded-[16px] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] px-6 pt-6 pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
          Filters
        </h2>
        <button
          onClick={resetAll}
          className="text-sm font-medium text-[#2a478d] hover:underline [font-family:var(--font-dm-sans)]"
        >
          Reset All
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Property Type</label>
          <div className="relative">
            <select
              value={filters.propertyType}
              onChange={(e) => update({ propertyType: e.target.value })}
              className={selectCls}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Location</label>
          <input
            type="text"
            placeholder="City or Neighborhood"
            value={filters.location}
            onChange={(e) => update({ location: e.target.value })}
            className={inputCls}
          />
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Price Range (₦)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => update({ priceMin: e.target.value })}
              className="w-[132px] rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => update({ priceMax: e.target.value })}
              className="w-[132px] rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Bedrooms</label>
          <div className="relative">
            <select
              value={filters.bedrooms}
              onChange={(e) => update({ bedrooms: e.target.value })}
              className={selectCls}
            >
              {BEDROOM_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Bathrooms */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Bathrooms</label>
          <div className="relative">
            <select
              value={filters.bathrooms}
              onChange={(e) => update({ bathrooms: e.target.value })}
              className={selectCls}
            >
              {BATHROOM_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Amenities</label>
          <div className="flex flex-col gap-2 pr-[15px]">
            {AMENITIES.map((name) => (
              <label key={name} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.amenities.has(name)}
                  onChange={() => toggleAmenity(name)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#2a478d]"
                />
                <span className="text-sm font-medium leading-[1.43] text-[#1a1a1a] [font-family:var(--font-dm-sans)]">
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
