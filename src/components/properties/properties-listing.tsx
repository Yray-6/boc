"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PropertiesFilters,
  type FilterState,
  type AmenityOption,
  DEFAULT_FILTER_STATE,
} from "./properties-filters";
import { PropertyCardBlock } from "./property-card-block";
import { PropertyCardList } from "./property-card-list";
import type { Property } from "@/data/home";
import { buildPropertiesListSearchParams, type ListingSortKey } from "@/lib/public-properties-query";
import { mapPublicListItemToProperty } from "@/lib/public-property-mapper";
import type { PublicPropertyListItem, PublicPropertyPaginatedResponse } from "@/types/public-property";

type SortKey = ListingSortKey;
type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest Listing" },
  { value: "oldest", label: "Oldest Listing" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function cloneFilters(f: FilterState): FilterState {
  return { ...f, amenityIds: new Set(f.amenityIds) };
}

interface PropertiesListingProps {
  initialProperties: Property[];
  initialCount: number;
  initialTotalPages: number;
  initialPage: number;
  pageSize: number;
  amenityOptions: AmenityOption[];
  /** Pre-populated filters from URL search params (hero search navigation). */
  seedFilters?: Partial<Omit<FilterState, "amenityIds">>;
}

export function PropertiesListing({
  initialProperties,
  initialCount,
  initialTotalPages,
  initialPage,
  pageSize,
  amenityOptions,
  seedFilters,
}: PropertiesListingProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>(() =>
    cloneFilters({ ...DEFAULT_FILTER_STATE, ...seedFilters }),
  );
  const [page, setPage] = useState(initialPage);
  const [rows, setRows] = useState<Property[]>(initialProperties);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Skip the first client-side fetch only when SSR already returned data.
  // If SSR came back empty (backend cold start, network hiccup, etc.) we
  // should still fetch on mount so the page isn't stuck showing "no results".
  const skipFetchOnce = useRef(initialProperties.length > 0);

  const load = useCallback(
    async (f: FilterState, s: SortKey, p: number, signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const qs = buildPropertiesListSearchParams(f, s, p, pageSize);
        const res = await fetch(`/api/properties?${qs.toString()}`, { signal });
        const body = (await res.json()) as PublicPropertyPaginatedResponse | { detail?: string };
        if (!res.ok) {
          const msg = typeof (body as { detail?: string }).detail === "string" ? (body as { detail: string }).detail : "Failed to load properties";
          throw new Error(msg);
        }
        const data = body as PublicPropertyPaginatedResponse;
        const list = Array.isArray(data.results) ? data.results : [];
        setRows(list.map((item) => mapPublicListItemToProperty(item as PublicPropertyListItem)));
        setTotalCount(typeof data.count === "number" ? data.count : list.length);
        setTotalPages(typeof data.total_pages === "number" ? data.total_pages : 1);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Something went wrong");
        setRows([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    if (skipFetchOnce.current) {
      skipFetchOnce.current = false;
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      void load(filters, sort, page, ctrl.signal);
    }, 320);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [filters, sort, page, load]);

  function handleFilterChange(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

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

      <div className="mb-4 animate-fade-up lg:hidden" style={{ animationDelay: "0.1s" }}>
        <PropertiesFilters amenityOptions={amenityOptions} initialFilters={seedFilters} onChange={handleFilterChange} mobile />
      </div>

      <div className="flex gap-6 lg:gap-8">
        <div className="hidden animate-slide-left lg:block" style={{ animationDelay: "0.1s" }}>
          <PropertiesFilters amenityOptions={amenityOptions} initialFilters={seedFilters} onChange={handleFilterChange} />
        </div>

        <div className="flex flex-1 flex-col gap-4 min-w-0 animate-fade-up lg:gap-6" style={{ animationDelay: "0.15s" }}>

          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
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

          <p className="text-xs text-[rgba(26,26,26,0.5)] lg:text-sm [font-family:var(--font-dm-sans)]">
            {loading ? "Loading…" : `${totalCount} ${totalCount === 1 ? "property" : "properties"} found`}
            {error ? ` — ${error}` : null}
          </p>

          {rows.length === 0 && !loading ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-[16px] bg-white shadow-sm lg:min-h-[300px]">
              <p className="text-sm text-[rgba(26,26,26,0.5)] [font-family:var(--font-dm-sans)]">
                {error ?? "No properties match your filters."}
              </p>
            </div>
          ) : (
            <div
              className={`transition-opacity duration-300 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"} ${view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6" : "flex flex-col gap-[21px]"}`}
            >
              {rows.map((property) =>
                view === "grid" ? (
                  <PropertyCardBlock key={property.id} property={property} />
                ) : (
                  <PropertyCardList key={property.id} property={property} />
                ),
              )}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 [font-family:var(--font-dm-sans)]">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-[rgba(26,26,26,0.15)] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-[rgba(26,26,26,0.6)]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-[rgba(26,26,26,0.15)] px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
