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

interface PropertiesListingProps {
  initialProperties: Property[];
}

export function PropertiesListing({ initialProperties }: PropertiesListingProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "All Types",
    location: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "Any",
    bathrooms: "Any",
    amenities: new Set(),
  });

  const filtered = useMemo(() => {
    let list = [...initialProperties];

    if (filters.propertyType !== "All Types") {
      list = list.filter((p) => p.type === filters.propertyType.toUpperCase());
    }
    if (filters.location.trim()) {
      const loc = filters.location.toLowerCase();
      list = list.filter((p) => p.location.toLowerCase().includes(loc));
    }
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      list = list.filter((p) => parsePrice(p.price) >= min);
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      list = list.filter((p) => parsePrice(p.price) <= max);
    }
    if (filters.bedrooms !== "Any") {
      const min = parseInt(filters.bedrooms);
      list = list.filter((p) => p.beds >= min);
    }
    if (filters.bathrooms !== "Any") {
      const min = parseInt(filters.bathrooms);
      list = list.filter((p) => p.baths >= min);
    }

    if (sort === "price-asc") list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-desc") list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [initialProperties, filters, sort]);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-8 sm:px-6 lg:gap-8 lg:px-[85px]">
      {/* Filter Sidebar */}
      <div className="hidden lg:block">
        <PropertiesFilters onChange={setFilters} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 min-w-0">
        {/* Sort + View Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="relative flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-[42px] appearance-none rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white py-2 pl-4 pr-10 text-base text-[#1a1a1a] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Grid / List toggle */}
          <div className="flex gap-2">
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === "grid" ? "bg-[#2a478d] text-white" : "bg-white text-[#1a1a1a] border border-[rgba(26,26,26,0.1)]"}`}
            >
              {/* Grid icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === "list" ? "bg-[#2a478d] text-white" : "bg-white text-[#1a1a1a] border border-[rgba(26,26,26,0.1)]"}`}
            >
              {/* List icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="5" y1="4.5" x2="17" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="13.5" x2="17" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="1.5" cy="4.5" r="1.5" fill="currentColor" />
                <circle cx="1.5" cy="9" r="1.5" fill="currentColor" />
                <circle cx="1.5" cy="13.5" r="1.5" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[rgba(26,26,26,0.5)] [font-family:var(--font-dm-sans)]">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
        </p>

        {/* Property Cards */}
        {filtered.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-[16px] bg-white shadow-sm">
            <p className="text-base text-[rgba(26,26,26,0.5)] [font-family:var(--font-dm-sans)]">
              No properties match your filters.
            </p>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2"
                : "flex flex-col gap-[21px]"
            }
          >
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
  );
}
