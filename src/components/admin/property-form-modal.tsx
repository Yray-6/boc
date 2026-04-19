"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRightDrawerMount } from "@/components/admin/use-right-drawer-mount";

export type ListingMode = "buy" | "rent" | "lease";

export type PropertyFormValues = {
  title: string;
  propertyType: string;
  featured: boolean;
  description: string;
  agentId: string;
  amenityIds: string[];
  price: string;
  listingMode: ListingMode;
};

const PROPERTY_TYPES = ["Apartment", "Duplex", "Penthouse", "Terrace", "Villa"] as const;

export const AGENTS = [
  { id: "a1", label: "Agent 001 - Chariss Forbes" },
  { id: "a2", label: "Agent 002 - Boluwatife Cole" },
  { id: "a3", label: "Agent 003 - Ephraim Johnson" },
  { id: "a4", label: "Agent 004 - Adeleke David" },
] as const;

export const AMENITY_OPTIONS = [
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "security", label: "24/7 Security" },
  { id: "generator", label: "Backup Generator" },
  { id: "backup-power", label: "Backup Power" },
  { id: "cctv", label: "CCTV" },
  { id: "kitchen", label: "Fitted Kitchen" },
  { id: "borehole", label: "Borehole" },
  { id: "parking", label: "Parking" },
  { id: "garden", label: "Garden" },
  { id: "ac", label: "Air Conditioning" },
  { id: "elevator", label: "Elevator" },
  { id: "concierge", label: "Concierge" },
] as const;

export function amenityIdsFromLabels(labels: string[]): string[] {
  const byLabel = new Map<string, string>(
    AMENITY_OPTIONS.map((a) => [a.label, a.id]),
  );
  return labels
    .map((l) => byLabel.get(l))
    .filter((x): x is string => x !== undefined);
}

const defaultForm: PropertyFormValues = {
  title: "",
  propertyType: "Apartment",
  featured: false,
  description: "",
  agentId: "",
  amenityIds: [],
  price: "0",
  listingMode: "buy",
};

function amenityLabelsFromIds(ids: string[]) {
  const map = new Map<string, string>(
    AMENITY_OPTIONS.map((a) => [a.id, a.label]),
  );
  return ids
    .map((id) => map.get(id))
    .filter((x): x is string => x !== undefined);
}

type PropertyFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initial: PropertyFormValues | null;
  onClose: () => void;
  /** Called when the user publishes the listing (before the drawer closes). */
  onPublish?: () => void;
};

export function PropertyFormModal({
  open,
  mode,
  initial,
  onClose,
  onPublish,
}: PropertyFormModalProps) {
  const formId = useId();
  const [values, setValues] = useState<PropertyFormValues>(defaultForm);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setValues(initial ? { ...defaultForm, ...initial } : defaultForm);
    setAmenitiesOpen(false);
  }, [open, initial]);

  const { mounted, entered } = useRightDrawerMount(open);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  useEffect(() => {
    if (!open) setAmenitiesOpen(false);
  }, [open]);

  useEffect(() => {
    if (!amenitiesOpen) return;
    function onDoc(e: MouseEvent) {
      if (
        amenitiesRef.current &&
        !amenitiesRef.current.contains(e.target as Node)
      ) {
        setAmenitiesOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [amenitiesOpen]);

  const selectedAmenityLabels = useMemo(
    () => amenityLabelsFromIds(values.amenityIds),
    [values.amenityIds],
  );

  const titleText = mode === "create" ? "Add Property" : "Edit Property";

  function toggleAmenity(id: string) {
    setValues((v) => {
      const set = new Set(v.amenityIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...v, amenityIds: [...set] };
    });
  }

  if (!open && !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex justify-end [font-family:var(--font-urbanist)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={`relative flex h-full w-full max-w-[896px] flex-col border-l border-[#F3F4F6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#F3F4F6] bg-[rgba(249,250,251,0.5)] px-6 py-4 sm:px-8">
          <div className="min-w-0">
            <h2
              id={`${formId}-title`}
              className="text-lg font-bold leading-[1.556] text-[#1A1D24]"
            >
              {titleText}
            </h2>
            <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
              Draft saved at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-white/80 hover:text-[#62748E]"
            aria-label="Close"
          >
            <Image
              src="/admin-dashboard/modal-close.svg"
              alt=""
              width={40}
              height={40}
              className="size-10"
            />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-[52px]">
            <section className="flex flex-col gap-6">
              <h3 className="text-xl font-bold leading-[1.4] text-[#003A8C]">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6">
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-title`}
                  >
                    Property Title
                  </label>
                  <input
                    id={`${formId}-title`}
                    value={values.title}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, title: e.target.value }))
                    }
                    placeholder="e.g. Luxury 5 Bedroom Duplex"
                    className="rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3 text-base leading-tight text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-type`}
                  >
                    Property Type
                  </label>
                  <select
                    id={`${formId}-type`}
                    value={values.propertyType}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        propertyType: e.target.value,
                      }))
                    }
                    className="h-12 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-5 py-2 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
                    Featured
                  </span>
                  <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-3">
                    <input
                      type="checkbox"
                      checked={values.featured}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          featured: e.target.checked,
                        }))
                      }
                      className="size-5 rounded border-[#767676] text-[#003A8C] focus:ring-[#003A8C]"
                    />
                    <span className="text-sm text-[#6A7282]">
                      Show on homepage
                    </span>
                  </label>
                </div>
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-desc`}
                  >
                    Description
                  </label>
                  <textarea
                    id={`${formId}-desc`}
                    value={values.description}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the property features, neighbourhood, and highlights..."
                    rows={6}
                    className="resize-y rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3 text-base leading-normal text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-agent`}
                  >
                    Assign agent
                  </label>
                  <div className="relative">
                    <select
                      id={`${formId}-agent`}
                      value={values.agentId}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          agentId: e.target.value,
                        }))
                      }
                      className="h-[50px] w-full appearance-none rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 pr-10 text-base text-[rgba(26,29,36,0.5)] outline-none ring-[#003A8C]/20 focus:ring-2"
                    >
                      <option value="">Assign property to agent</option>
                      {AGENTS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#141B34]">
                      <ChevronDown className="size-6" />
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-col gap-1" ref={amenitiesRef}>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
                    Amenities
                  </span>
                  <button
                    type="button"
                    id={`${formId}-amenities`}
                    onClick={() => setAmenitiesOpen((o) => !o)}
                    aria-expanded={amenitiesOpen}
                    aria-haspopup="listbox"
                    className="flex h-[50px] w-full items-center justify-between rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  >
                    <span
                      className={
                        selectedAmenityLabels.length === 0
                          ? "text-[rgba(26,29,36,0.5)]"
                          : ""
                      }
                    >
                      {selectedAmenityLabels.length === 0
                        ? "Select available amenities"
                        : selectedAmenityLabels.join(", ")}
                    </span>
                    <ChevronDown className="size-6 shrink-0 text-[#141B34]" />
                  </button>
                  {amenitiesOpen ? (
                    <div
                      className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[200px] overflow-y-auto rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-4 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]"
                      role="listbox"
                      aria-multiselectable="true"
                    >
                      <div className="flex flex-col gap-3">
                        {AMENITY_OPTIONS.map((a) => {
                          const checked = values.amenityIds.includes(a.id);
                          return (
                            <label
                              key={a.id}
                              className="flex cursor-pointer items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAmenity(a.id)}
                                className="size-[11px] rounded border-[#6B6B6B] accent-[#003A8C]"
                              />
                              <span className="text-base leading-tight text-[#1A1A1A]">
                                {a.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="text-xl font-bold leading-[1.4] text-[#003A8C]">
                Pricing &amp; Mode
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-price`}
                  >
                    Price (₦)
                  </label>
                  <input
                    id={`${formId}-price`}
                    inputMode="numeric"
                    value={values.price}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, price: e.target.value }))
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[rgba(26,29,36,0.5)] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
                    Listing type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: "buy" as const, label: "Buy" },
                        { id: "rent" as const, label: "Rent" },
                        { id: "lease" as const, label: "Lease" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setValues((v) => ({ ...v, listingMode: m.id }))
                        }
                        className={`min-w-[96px] rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
                          values.listingMode === m.id
                            ? "border-[#003A8C] bg-[#003A8C] text-white"
                            : "border-[#F3F4F6] bg-[#F9FAFB] text-[#6A7282] hover:border-[#003A8C]/40"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="text-xl font-bold leading-[1.4] text-[#003A8C]">
                Media Upload
              </h3>
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[rgba(249,250,251,0.5)] px-6 py-12">
                <div className="flex size-16 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                  <UploadIcon className="size-8 text-[#D1D5DC]" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#1A1D24]">
                    Click or drag images to upload
                  </p>
                  <p className="mt-1 text-sm text-[#99A1AF]">
                    Up to 20 high-quality JPG, PNG or WEBP (max 5MB each)
                  </p>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" />
              </div>
            </section>
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[#F3F4F6] bg-white px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-transparent bg-white px-4 py-2 text-sm font-semibold text-[#1A1D24] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50"
          >
            Cancel Listing
          </button>
          <button
            type="button"
            onClick={() => {
              onPublish?.();
              onClose();
            }}
            className="rounded-lg bg-[#003A8C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002f73]"
          >
            Publish Listing
          </button>
        </footer>
      </div>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.33 12L16 4.67L22.67 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 24H28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
