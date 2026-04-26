"use client";

import { useState, useRef, useEffect } from "react";

const PROPERTY_TYPES = ["All Types", "Buy", "Rent", "Lease", "Short let"] as const;
const BEDROOM_OPTIONS = ["Any", "1+", "2+", "3+", "4+", "5+"] as const;
const BATHROOM_OPTIONS = ["Any", "1+", "2+", "3+", "4+"] as const;

export interface FilterState {
  propertyType: string;
  /** Free-text search (title / keyword). */
  location: string;
  /** API `state` filter — Nigerian state name e.g. "Lagos". */
  state: string;
  priceMin: string;
  priceMax: string;
  bedrooms: string;
  bathrooms: string;
  /** Amenity IDs for `amenities` query (all selected must match). */
  amenityIds: Set<number>;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  propertyType: "All Types",
  location: "",
  state: "",
  priceMin: "",
  priceMax: "",
  bedrooms: "Any",
  bathrooms: "Any",
  amenityIds: new Set(),
};

export type AmenityOption = { id: number; name: string };

/* ── Reusable amenities dropdown ── */
function AmenitiesDropdown({
  options,
  selected,
  onToggle,
  compact = false,
}: {
  options: AmenityOption[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label =
    selected.size === 0
      ? "Select..."
      : selected.size === 1
        ? options.find((o) => selected.has(o.id))?.name ?? "1 selected"
        : `${selected.size} selected`;

  if (compact) {
    /* Mobile compact version */
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-[26px] w-full items-center justify-between rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white px-[8.8px] text-left outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]"
        >
          <span className={`truncate text-[10px] ${selected.size === 0 ? "text-[rgba(26,26,26,0.5)]" : "text-[#1a1a1a]"}`}>
            {label}
          </span>
          <svg className="ml-1 shrink-0" width="8" height="8" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[160px] overflow-y-auto rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white shadow-md">
            {options.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-center gap-[6px] px-[8.8px] py-[5px] hover:bg-[#f5f0e8]">
                <input
                  type="checkbox"
                  checked={selected.has(o.id)}
                  onChange={() => onToggle(o.id)}
                  className="h-[9px] w-[9px] shrink-0 cursor-pointer accent-[#2a478d]"
                />
                <span className="text-[10px] text-[#1a1a1a] [font-family:var(--font-dm-sans)]">{o.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* Desktop full version */
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[41px] w-full items-center justify-between rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 text-left outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]"
      >
        <span className={`truncate text-base ${selected.size === 0 ? "text-[rgba(26,26,26,0.5)]" : "text-[#1a1a1a]"}`}>
          {label}
        </span>
        <svg className="ml-2 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-y-auto rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white shadow-lg">
          {options.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-3 px-4 py-[10px] hover:bg-[#f5f0e8]">
              <input
                type="checkbox"
                checked={selected.has(o.id)}
                onChange={() => onToggle(o.id)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[#2a478d]"
              />
              <span className="text-sm text-[#1a1a1a] [font-family:var(--font-dm-sans)]">{o.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Chevron icon ── */
const Chevron = ({ size = 16 }: { size?: number }) => (
  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface PropertiesFiltersProps {
  amenityOptions: AmenityOption[];
  initialFilters?: Partial<Omit<FilterState, "amenityIds">>;
  onChange?: (filters: FilterState) => void;
  mobile?: boolean;
}

export function PropertiesFilters({ amenityOptions, initialFilters, onChange, mobile = false }: PropertiesFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    ...initialFilters,
    amenityIds: new Set(),
  });
  const [locationInput, setLocationInput] = useState(() => initialFilters?.location ?? "");

  function update(patch: Partial<FilterState>) {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      onChange?.(next);
      return next;
    });
  }

  function toggleAmenity(id: number) {
    const next = new Set(filters.amenityIds);
    next.has(id) ? next.delete(id) : next.add(id);
    update({ amenityIds: next });
  }

  function resetAll() {
    const blank: FilterState = { ...DEFAULT_FILTER_STATE, amenityIds: new Set() };
    setLocationInput(blank.location);
    setFilters(blank);
    onChange?.(blank);
  }

  useEffect(() => {
    if (locationInput === filters.location) return;
    const t = window.setTimeout(() => {
      update({ location: locationInput });
    }, 350);
    return () => window.clearTimeout(t);
  }, [locationInput, filters.location]);

  const selectCls = "w-full appearance-none rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white px-[8.8px] py-[4.4px] text-[10px] text-[#1a1a1a] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[26px]";
  const inputCls = "w-full rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white px-[8.8px] py-[4.4px] text-[10px] text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[26px]";
  const labelCls = "block text-[10px] font-medium text-[#1a1a1a] [font-family:var(--font-dm-sans)]";

  if (mobile) {
    return (
      <div className="rounded-[8.78px] bg-white px-[13.17px] pt-[13.17px] pb-0 shadow-[0px_2.2px_3.29px_-2.2px_rgba(0,0,0,0.1),0px_5.49px_8.23px_-1.65px_rgba(0,0,0,0.1)]">
        <div className="mb-[13.17px] flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#1a1a1a] [font-family:var(--font-playfair)]">Filters</h2>
          <button onClick={resetAll} className="text-[10px] font-medium text-[#2a478d] [font-family:var(--font-dm-sans)]">
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-[13.17px] gap-y-[13.17px] pb-[13.17px]">
          {/* Property Type */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Property Type</label>
            <div className="relative">
              <select value={filters.propertyType} onChange={(e) => update({ propertyType: e.target.value })} className={selectCls}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <Chevron size={8} />
            </div>
          </div>

          {/* State */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>State</label>
            <input type="text" placeholder="e.g. Lagos" value={filters.state}
              onChange={(e) => update({ state: e.target.value })} className={inputCls} />
          </div>

          {/* Search keyword */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Search</label>
            <input type="text" placeholder="Keyword, area…" value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)} className={inputCls} />
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Price Range (₦)</label>
            <div className="flex gap-1">
              <input type="number" placeholder="Min" value={filters.priceMin}
                onChange={(e) => update({ priceMin: e.target.value })}
                className="w-1/2 rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white px-[8.8px] py-[4.4px] text-[10px] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[26px]" />
              <input type="number" placeholder="Max" value={filters.priceMax}
                onChange={(e) => update({ priceMax: e.target.value })}
                className="w-1/2 rounded-[3.3px] border border-[rgba(26,26,26,0.1)] bg-white px-[8.8px] py-[4.4px] text-[10px] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[26px]" />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Bedrooms</label>
            <input type="number" min={0} placeholder="0"
              value={filters.bedrooms === "Any" ? "" : filters.bedrooms.replace("+", "")}
              onChange={(e) => update({ bedrooms: e.target.value ? `${e.target.value}+` : "Any" })}
              className={inputCls} />
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Bathrooms</label>
            <div className="relative">
              <select value={filters.bathrooms} onChange={(e) => update({ bathrooms: e.target.value })} className={selectCls}>
                {BATHROOM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Chevron size={8} />
            </div>
          </div>

          {/* Amenities — dropdown */}
          <div className="flex flex-col gap-[4.4px]">
            <label className={labelCls}>Amenities</label>
            <AmenitiesDropdown
              options={amenityOptions}
              selected={filters.amenityIds}
              onToggle={toggleAmenity}
              compact
            />
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop sidebar ── */
  const desktopSelectCls = "w-full appearance-none rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-[10px] text-base text-[#1a1a1a] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)] h-[41px]";
  const desktopLabelCls = "block text-base font-medium text-[#1a1a1a] [font-family:var(--font-dm-sans)]";

  return (
    <aside className="w-[280px] shrink-0 rounded-[16px] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] px-6 pt-6 pb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">Filters</h2>
        <button onClick={resetAll} className="text-sm font-medium text-[#2a478d] hover:underline [font-family:var(--font-dm-sans)]">
          Reset All
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Property Type</label>
          <div className="relative">
            <select value={filters.propertyType} onChange={(e) => update({ propertyType: e.target.value })} className={desktopSelectCls}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <Chevron />
          </div>
        </div>

        {/* State */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>State</label>
          <input type="text" placeholder="e.g. Lagos" value={filters.state}
            onChange={(e) => update({ state: e.target.value })}
            className="w-full rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]" />
        </div>

        {/* Search keyword */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Search</label>
          <input type="text" placeholder="Keyword, neighbourhood…" value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]" />
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Price Range (₦)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.priceMin} onChange={(e) => update({ priceMin: e.target.value })}
              className="w-[132px] rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]" />
            <input type="number" placeholder="Max" value={filters.priceMax} onChange={(e) => update({ priceMax: e.target.value })}
              className="w-[132px] rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-2 text-base placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] [font-family:var(--font-dm-sans)]" />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Bedrooms</label>
          <div className="relative">
            <select value={filters.bedrooms} onChange={(e) => update({ bedrooms: e.target.value })} className={desktopSelectCls}>
              {BEDROOM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Bathrooms</label>
          <div className="relative">
            <select value={filters.bathrooms} onChange={(e) => update({ bathrooms: e.target.value })} className={desktopSelectCls}>
              {BATHROOM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Amenities — dropdown */}
        <div className="flex flex-col gap-2">
          <label className={desktopLabelCls}>Amenities</label>
          <AmenitiesDropdown options={amenityOptions} selected={filters.amenityIds} onToggle={toggleAmenity} />
        </div>
      </div>
    </aside>
  );
}
