"use client";

import { useState, useMemo } from "react";
import { PropertiesFilters, FilterState } from "./properties-filters";
import { PropertyCardBlock } from "./property-card-block";
import { PropertyCardList } from "./property-card-list";
import type { Property } from "@/data/home";

type SortKey = "newest" | "oldest" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest Listing" },
  { value: "oldest", label: "Oldest Listing" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

const INITIAL_FILTERS: FilterState = {
  propertyType: "All Types", location: "", priceMin: "", priceMax: "",
  bedrooms: "Any", bathrooms: "Any", amenities: new Set(),
};

interface PropertiesListingProps {
  initialProperties: Property[];
}

export function PropertiesListing({ initialProperties }: PropertiesListingProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const filtered = useMemo(() => {
    let list = [...initialProperties];
    if (filters.propertyType !== "All Types") list = list.filter((p) => p.type === filters.propertyType.toUpperCase());
    if (filters.location.trim()) { const loc = filters.location.toLowerCase(); list = list.filter((p) => p.location.toLowerCase().includes(loc)); }
    if (filters.priceMin) list = list.filter((p) => parsePrice(p.price) >= parseFloat(filters.priceMin));
    if (filters.priceMax) list = list.filter((p) => parsePrice(p.price) <= parseFloat(filters.priceMax));
    if (filters.bedrooms !== "Any") list = list.filter((p) => p.beds >= parseInt(filters.bedrooms));
    if (filters.bathrooms !== "Any") list = list.filter((p) => p.baths >= parseInt(filters.bathrooms));
    if (sort === "price-asc") list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-desc") list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return list;
  }, [initialProperties, filters, sort]);

  const GridIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
  const ListIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line x1="5" y1="4.5" x2="17" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="13.5" x2="17" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="1.5" cy="4.5" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="9" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-4 pt-0 sm:px-6 sm:py-6 lg:px-[85px] lg:py-8">

      {/* ── Mobile: compact filter panel above cards ── */}
      <div className="mb-4 lg:hidden">
        <PropertiesFilters onChange={setFilters} mobile />
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* ── Desktop: sidebar ── */}
        <div className="hidden lg:block">
          <PropertiesFilters onChange={setFilters} />
        </div>

        {/* ── Main content ── */}
        <div className="flex flex-1 flex-col gap-4 min-w-0 lg:gap-6">

          {/* Sort + view toggle */}
          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-[26px] appearance-none rounded-[4px] border border-[rgba(26,26,26,0.1)] bg-white py-0 pl-[8px] pr-[22px] text-[9px] text-[#1a1a1a] outline-none focus:border-[#2a478d] lg:h-[42px] lg:rounded-[6px] lg:pl-4 lg:pr-8 lg:text-base [font-family:var(--font-dm-sans)]">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-[6px] top-1/2 -translate-y-1/2 lg:right-2" width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex gap-[6px] lg:gap-2">
              <button aria-label="Grid view" onClick={() => setView("grid")}
                className={`flex h-[26px] w-[26px] items-center justify-center rounded-[4px] transition-colors lg:h-9 lg:w-9 lg:rounded-md ${view === "grid" ? "bg-[#2a478d] text-white" : "border border-[rgba(26,26,26,0.1)] bg-white text-[#1a1a1a]"}`}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none" className="lg:hidden">
                  <rect x="1" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className="hidden lg:block"><GridIcon /></span>
              </button>
              <button aria-label="List view" onClick={() => setView("list")}
                className={`flex h-[26px] w-[26px] items-center justify-center rounded-[4px] transition-colors lg:h-9 lg:w-9 lg:rounded-md ${view === "list" ? "bg-[#2a478d] text-white" : "border border-[rgba(26,26,26,0.1)] bg-white text-[#1a1a1a]"}`}>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none" className="lg:hidden">
                  <line x1="5" y1="4.5" x2="17" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="5" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="5" y1="13.5" x2="17" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="1.5" cy="4.5" r="1.5" fill="currentColor" />
                  <circle cx="1.5" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="1.5" cy="13.5" r="1.5" fill="currentColor" />
                </svg>
                <span className="hidden lg:block"><ListIcon /></span>
              </button>
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-[rgba(26,26,26,0.5)] lg:text-sm [font-family:var(--font-dm-sans)]">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
          </p>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-[16px] bg-white shadow-sm lg:min-h-[300px]">
              <p className="text-sm text-[rgba(26,26,26,0.5)] [font-family:var(--font-dm-sans)]">No properties match your filters.</p>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6" : "flex flex-col gap-[21px]"}>
              {filtered.map((property, i) =>
                view === "grid" ? (
                  <PropertyCardBlock key={i} property={property} />
                ) : (
                  <PropertyCardList key={i} property={property} />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
