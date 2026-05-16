"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRightDrawerMount } from "@/components/admin/use-right-drawer-mount";
import { formatPriceInputForDisplay } from "@/lib/price-input-format";
import type { NormalizedPropertyFormData } from "@/lib/property-form-dropdowns";
import { AMENITY_OPTIONS } from "@/lib/property-form-constants";
import type {
  AdminPropertyExistingImage,
  AdminPropertyExistingVideo,
  ListingMode,
  PropertyStatus,
} from "@/types/admin-property";
import {
  deleteAdminPropertyImage,
  deleteAdminPropertyVideo,
} from "@/lib/admin-properties-client";
import { RemoteOrLocalImage } from "@/components/common/remote-or-local-image";

export type { ListingMode } from "@/types/admin-property";
export { AGENTS, AMENITY_OPTIONS, PROPERTY_TYPES } from "@/lib/property-form-constants";

export type PropertyFormValues = {
  title: string;
  propertyType: string;
  featured: boolean;
  description: string;
  agentId: string;
  amenityIds: string[];
  price: string;
  listingMode: ListingMode;
  status: PropertyStatus;
  images: File[];
  /** Saved listing photos from `GET …/properties/{slug}/` (delete uses `DELETE …/images/{id}/`). */
  existingImages: AdminPropertyExistingImage[];
  /** Saved listing videos from property detail / `GET …/videos/` (delete uses `DELETE …/videos/{id}/`). */
  existingVideos: AdminPropertyExistingVideo[];
  /** MP4 / WebM only; max 5 files, 100 MB each (enforced on upload). */
  videos: File[];
  /** Optional custom thumbnail for the multipart video upload. */
  videoThumbnail: File | null;
  /** Optional title sent with the video upload request. */
  videoTitle: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  yearBuilt: number;
  sqm: number;
  parking: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
};

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
  propertyType: "",
  featured: false,
  description: "",
  agentId: "",
  amenityIds: [],
  price: "0",
  listingMode: "buy",
  status: "DRAFT",
  images: [],
  existingImages: [],
  existingVideos: [],
  videos: [],
  videoThumbnail: null,
  videoTitle: "",
  bedrooms: 0,
  bathrooms: 0,
  toilets: 0,
  yearBuilt: new Date().getFullYear(),
  sqm: 0,
  parking: 0,
  address: "",
  neighborhood: "",
  city: "Lagos",
  state: "Lagos",
};

type PropertyFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initial: PropertyFormValues | null;
  /** Options from `GET /api/v1/admin/properties/form-data/` (normalized). */
  dropdowns: NormalizedPropertyFormData;
  detailLoading?: boolean;
  onClose: () => void;
  /** Persist listing; parent should close the drawer on success. */
  onPublish?: (values: PropertyFormValues) => void | Promise<void>;
  /** Property slug when editing — required to delete saved images via the admin API. */
  editingSlug?: string | null;
};

export function PropertyFormModal({
  open,
  mode,
  initial,
  dropdowns,
  detailLoading = false,
  onClose,
  onPublish,
  editingSlug = null,
}: PropertyFormModalProps) {
  const formId = useId();
  const [values, setValues] = useState<PropertyFormValues>(defaultForm);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  function mergeValues(patch: Partial<PropertyFormValues>) {
    setValues((v) => ({
      ...v,
      ...patch,
      images:
        patch.images !== undefined ? patch.images : (v.images ?? []),
      existingImages:
        patch.existingImages !== undefined ? patch.existingImages : (v.existingImages ?? []),
      existingVideos:
        patch.existingVideos !== undefined ? patch.existingVideos : (v.existingVideos ?? []),
      videos:
        patch.videos !== undefined ? patch.videos : (v.videos ?? []),
      videoThumbnail:
        patch.videoThumbnail !== undefined ? patch.videoThumbnail : (v.videoThumbnail ?? null),
      videoTitle:
        patch.videoTitle !== undefined ? patch.videoTitle : (v.videoTitle ?? ""),
    }));
  }

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && detailLoading && !initial) return;
    const firstType =
      dropdowns.propertyTypes[0]?.id ?? defaultForm.propertyType;
    if (initial) {
      setValues({
        ...defaultForm,
        ...initial,
        amenityIds: [...initial.amenityIds],
        status: initial.status,
        images: Array.isArray(initial.images) ? [...initial.images] : [],
        existingImages: Array.isArray(initial.existingImages)
          ? [...initial.existingImages]
          : [],
        existingVideos: Array.isArray(initial.existingVideos)
          ? [...initial.existingVideos]
          : [],
        videos: Array.isArray(initial.videos) ? [...initial.videos] : [],
        videoThumbnail: initial.videoThumbnail ?? null,
        videoTitle: initial.videoTitle ?? "",
        address: initial.address ?? defaultForm.address,
        neighborhood: initial.neighborhood ?? defaultForm.neighborhood,
        city: initial.city ?? defaultForm.city,
        state: initial.state ?? defaultForm.state,
      });
    } else {
      setValues({
        ...defaultForm,
        propertyType: firstType,
        status: "DRAFT",
      });
    }
    setAmenitiesOpen(false);
  }, [open, initial, dropdowns.propertyTypes, mode, detailLoading]);

  useEffect(() => {
    if (!open) {
      setPublishing(false);
      setMediaMessage(null);
    }
  }, [open]);

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

  const selectedAmenityLabels = useMemo(() => {
    const map = new Map(dropdowns.amenities.map((a) => [a.id, a.label]));
    return values.amenityIds
      .map((id) => map.get(id))
      .filter((x): x is string => x !== undefined);
  }, [values.amenityIds, dropdowns.amenities]);

  const selectedImages = values.images ?? [];
  const existingServerImages = values.existingImages ?? [];
  const existingServerVideos = values.existingVideos ?? [];
  const selectedVideos = values.videos ?? [];
  const [dragOver, setDragOver] = useState(false);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [deletingServerImageId, setDeletingServerImageId] = useState<number | null>(null);
  const [deletingServerVideoId, setDeletingServerVideoId] = useState<number | null>(null);
  const [mediaMessage, setMediaMessage] = useState<string | null>(null);

  function addImageFiles(incoming: File[]) {
    const accepted = incoming.filter((f) => f.type.startsWith("image/"));
    if (!accepted.length) return;
    setMediaMessage(null);
    setValues((v) => {
      const existing = v.images ?? [];
      const names = new Set(existing.map((f) => f.name + f.size));
      const deduped = accepted.filter((f) => !names.has(f.name + f.size));
      return { ...v, images: [...existing, ...deduped].slice(0, 20) };
    });
  }

  function removeImage(index: number) {
    setValues((v) => {
      const next = [...(v.images ?? [])];
      next.splice(index, 1);
      return { ...v, images: next };
    });
  }

  const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
  const MAX_VIDEOS = 5;

  function addVideoFiles(incoming: File[]) {
    const accepted = incoming.filter((f) => f.type === "video/mp4" || f.type === "video/webm");
    const withinSize = accepted.filter((f) => f.size <= MAX_VIDEO_BYTES);
    if (!withinSize.length) return;
    setValues((v) => {
      const existing = v.videos ?? [];
      const savedCount = v.existingVideos?.length ?? 0;
      const maxNew = Math.max(0, MAX_VIDEOS - savedCount);
      const names = new Set(existing.map((f) => f.name + f.size));
      const deduped = withinSize.filter((f) => !names.has(f.name + f.size));
      return { ...v, videos: [...existing, ...deduped].slice(0, maxNew) };
    });
  }

  function removeVideo(index: number) {
    setValues((v) => {
      const next = [...(v.videos ?? [])];
      next.splice(index, 1);
      return { ...v, videos: next };
    });
  }

  const titleText = mode === "create" ? "Add Property" : "Edit Property";

  function toggleAmenity(id: string) {
    setValues((v) => {
      const set = new Set(v.amenityIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return {
        ...v,
        amenityIds: [...set],
        images: v.images ?? [],
        existingImages: v.existingImages ?? [],
        existingVideos: v.existingVideos ?? [],
        videos: v.videos ?? [],
      };
    });
  }

  async function removeExistingServerImage(id: number) {
    if (!editingSlug) return;
    setDeletingServerImageId(id);
    setMediaMessage(null);
    try {
      await deleteAdminPropertyImage(editingSlug, id);
      setValues((v) => ({
        ...v,
        existingImages: (v.existingImages ?? []).filter((img) => img.id !== id),
      }));
    } catch (e) {
      setMediaMessage(e instanceof Error ? e.message : "Could not delete image");
    } finally {
      setDeletingServerImageId(null);
    }
  }

  async function removeExistingServerVideo(id: number) {
    if (!editingSlug) return;
    setDeletingServerVideoId(id);
    setMediaMessage(null);
    try {
      await deleteAdminPropertyVideo(editingSlug, id);
      setValues((v) => ({
        ...v,
        existingVideos: (v.existingVideos ?? []).filter((vid) => vid.id !== id),
      }));
    } catch (e) {
      setMediaMessage(e instanceof Error ? e.message : "Could not delete video");
    } finally {
      setDeletingServerVideoId(null);
    }
  }

  if (!open && !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-110 flex min-h-0 justify-end [font-family:var(--font-urbanist)]"
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
        className={`relative flex h-full min-h-0 w-full max-w-[896px] flex-col overflow-hidden border-l border-[#F3F4F6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-[#F3F4F6] bg-[rgba(249,250,251,0.5)] px-6 py-4 sm:px-8">
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
          {mode === "edit" && detailLoading ? (
            <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-[#F3F4F6] bg-[#F9FAFB] text-sm font-medium text-[#6A7282]">
              Loading property details...
            </div>
          ) : (
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
                    onChange={(e) => mergeValues({ title: e.target.value })}
                    maxLength={255}
                    placeholder="e.g. Luxury 5 Bedroom Duplex (1–255 characters)"
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
                      mergeValues({ propertyType: e.target.value })
                    }
                    className="h-12 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-5 py-2 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  >
                    {dropdowns.propertyTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-status`}
                  >
                    Status
                  </label>
                  <select
                    id={`${formId}-status`}
                    value={values.status}
                    onChange={(e) =>
                      mergeValues({
                        status: e.target.value as PropertyStatus,
                      })
                    }
                    className="h-12 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-5 py-2 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  >
                    {dropdowns.statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
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
                        mergeValues({ featured: e.target.checked })
                      }
                      className="size-5 rounded border-[#767676] text-[#003A8C] focus:ring-[#003A8C]"
                    />
                    <span className="text-sm text-[#6A7282]">
                      Featured on home page
                    </span>
                  </label>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-bedrooms`}
                  >
                    Bedrooms
                  </label>
                  <input
                    id={`${formId}-bedrooms`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.bedrooms}
                    onChange={(e) =>
                      mergeValues({ bedrooms: Math.max(0, Number(e.target.value) | 0) })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-bathrooms`}
                  >
                    Bathrooms
                  </label>
                  <input
                    id={`${formId}-bathrooms`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.bathrooms}
                    onChange={(e) =>
                      mergeValues({ bathrooms: Math.max(0, Number(e.target.value) | 0) })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-toilets`}
                  >
                    Toilets
                  </label>
                  <input
                    id={`${formId}-toilets`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.toilets}
                    onChange={(e) =>
                      mergeValues({ toilets: Math.max(0, Number(e.target.value) | 0) })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-sqm`}
                  >
                    Area (sqm)
                  </label>
                  <input
                    id={`${formId}-sqm`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.sqm}
                    onChange={(e) =>
                      mergeValues({ sqm: Math.max(0, Number(e.target.value) | 0) })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-parking`}
                  >
                    Parking Spaces
                  </label>
                  <input
                    id={`${formId}-parking`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={values.parking}
                    onChange={(e) =>
                      mergeValues({ parking: Math.max(0, Number(e.target.value) | 0) })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-year-built`}
                  >
                    Year Built
                  </label>
                  <input
                    id={`${formId}-year-built`}
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 5}
                    inputMode="numeric"
                    value={values.yearBuilt}
                    onChange={(e) =>
                      mergeValues({ yearBuilt: Number(e.target.value) | 0 })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
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
                      mergeValues({ description: e.target.value })
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
                        mergeValues({ agentId: e.target.value })
                      }
                      className="h-[50px] w-full appearance-none rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 pr-10 text-base text-[rgba(26,29,36,0.5)] outline-none ring-[#003A8C]/20 focus:ring-2"
                    >
                      <option value="">Assign property to agent</option>
                      {dropdowns.agents.map((a) => (
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
                        {dropdowns.amenities.map((a) => {
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
                      mergeValues({
                        price: formatPriceInputForDisplay(e.target.value),
                      })
                    }
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[rgba(26,29,36,0.5)] outline-none ring-[#003A8C]/20 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
                    Listing type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dropdowns.listingModes.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => mergeValues({ listingMode: m.id })}
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
                Location
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-address`}
                  >
                    Address
                  </label>
                  <input
                    id={`${formId}-address`}
                    value={values.address}
                    onChange={(e) => mergeValues({ address: e.target.value })}
                    placeholder="e.g. 12 Adeola Odeku Street"
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-neighborhood`}
                  >
                    Neighborhood
                  </label>
                  <input
                    id={`${formId}-neighborhood`}
                    value={values.neighborhood}
                    onChange={(e) => mergeValues({ neighborhood: e.target.value })}
                    placeholder="e.g. Victoria Island"
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-city`}
                  >
                    City
                  </label>
                  <input
                    id={`${formId}-city`}
                    value={values.city}
                    onChange={(e) => mergeValues({ city: e.target.value })}
                    placeholder="e.g. Lagos"
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                    htmlFor={`${formId}-state`}
                  >
                    State
                  </label>
                  <input
                    id={`${formId}-state`}
                    value={values.state}
                    onChange={(e) => mergeValues({ state: e.target.value })}
                    placeholder="e.g. Lagos"
                    className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold leading-[1.4] text-[#003A8C]">
                  Media Upload
                  {mode === "create" ? (
                    <span className="ml-1 text-base font-bold text-red-600">*</span>
                  ) : null}
                </h3>
                {mediaMessage ? (
                  <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                    {mediaMessage}
                  </p>
                ) : null}
                {mode === "create" ? (
                  <p className="mt-1 text-sm text-[#99A1AF]">
                    New listings require at least one image before you can publish.
                  </p>
                ) : null}
              </div>

              {existingServerImages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-[#6A7282]">
                    Saved listing photos ({existingServerImages.length})
                    <span className="ml-1 font-normal text-[#99A1AF]">
                      — remove any you no longer want (deleted immediately)
                    </span>
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {existingServerImages.map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-[#F3F4F6]"
                      >
                        <RemoteOrLocalImage
                          src={img.image_url}
                          alt={img.caption || "Listing photo"}
                          fill
                          className="object-cover"
                          sizes="(max-width:896px) 25vw, 160px"
                        />
                        {img.is_primary ? (
                          <span className="absolute bottom-1 left-1 rounded bg-[#003A8C] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Primary
                          </span>
                        ) : null}
                        <button
                          type="button"
                          disabled={deletingServerImageId === img.id || !editingSlug}
                          onClick={() => void removeExistingServerImage(img.id)}
                          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 disabled:opacity-40 group-hover:opacity-100"
                          aria-label="Delete saved photo"
                        >
                          {deletingServerImageId === img.id ? (
                            <span className="size-3 animate-pulse rounded-full bg-white/90" />
                          ) : (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 transition-colors ${
                  dragOver
                    ? "border-[#003A8C] bg-[#003A8C]/5"
                    : "border-[#E5E7EB] bg-[rgba(249,250,251,0.5)]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addImageFiles(Array.from(e.dataTransfer.files));
                }}
              >
                <div className="flex size-16 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                  <UploadIcon className="size-8 text-[#D1D5DC]" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#1A1D24]">
                    Click or drag images to upload
                  </p>
                  <p className="mt-1 text-sm text-[#99A1AF]">
                    {mode === "create"
                      ? "Required for new listings — up to 20 JPG, PNG or WEBP (max 5MB each)."
                      : "Up to 20 high-quality JPG, PNG or WEBP (max 5MB each)."}
                  </p>
                  <p className="mt-1 text-xs text-[#99A1AF]">
                    First new upload is auto-set as primary when added to a listing
                  </p>
                </div>
                <label
                  htmlFor={`${formId}-images`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
                >
                  {selectedImages.length > 0 ? "Add More Images" : "Choose Images"}
                </label>
                <input
                  id={`${formId}-images`}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addImageFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
              </div>

              {selectedImages.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-[#6A7282]">
                    {selectedImages.length} image{selectedImages.length === 1 ? "" : "s"} selected
                    <span className="ml-1 font-normal text-[#99A1AF]">— first will be set as primary</span>
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {selectedImages.map((file, i) => (
                      <div key={`${file.name}-${file.size}-${i}`} className="relative group aspect-square">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full rounded-xl object-cover border border-[#F3F4F6]"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 rounded bg-[#003A8C] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-[#F3F4F6] pt-6">
                <h4 className="text-base font-bold text-[#1A1D24]">Videos (optional)</h4>
                <p className="text-sm text-[#99A1AF]">
                  Up to 5 videos per listing — MP4 or WebM only, max 100 MB each. Optional custom thumbnail and title are sent with new uploads.
                </p>

                {existingServerVideos.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-[#6A7282]">
                      Saved listing videos ({existingServerVideos.length})
                      <span className="ml-1 font-normal text-[#99A1AF]">
                        — remove any you no longer want (deleted immediately)
                      </span>
                    </p>
                    <ul className="flex flex-col gap-3">
                      {existingServerVideos.map((vid) => (
                        <li
                          key={vid.id}
                          className="group relative flex gap-3 overflow-hidden rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-3"
                        >
                          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-[#1A1D24]">
                            {vid.thumbnail_url ? (
                              <RemoteOrLocalImage
                                src={vid.thumbnail_url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="112px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white/70">
                                Video
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 py-0.5">
                            <p className="truncate text-sm font-semibold text-[#1A1D24]">
                              {vid.title || `Video #${vid.id}`}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[#99A1AF]">{vid.video_url}</p>
                            {vid.is_primary ? (
                              <span className="mt-1 inline-block rounded bg-[#003A8C] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                Primary
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            disabled={deletingServerVideoId === vid.id || !editingSlug}
                            onClick={() => void removeExistingServerVideo(vid.id)}
                            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 disabled:opacity-40 group-hover:opacity-100"
                            aria-label="Delete saved video"
                          >
                            {deletingServerVideoId === vid.id ? (
                              <span className="size-3 animate-pulse rounded-full bg-white/90" />
                            ) : (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]" htmlFor={`${formId}-video-title`}>
                      Video title (optional)
                    </label>
                    <input
                      id={`${formId}-video-title`}
                      value={values.videoTitle}
                      onChange={(e) => mergeValues({ videoTitle: e.target.value })}
                      placeholder="e.g. Walkthrough tour"
                      className="h-[50px] rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 text-base text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]" htmlFor={`${formId}-video-thumb`}>
                      Thumbnail image (optional)
                    </label>
                    <input
                      id={`${formId}-video-thumb`}
                      type="file"
                      accept="image/*"
                      className="text-sm text-[#1A1D24] file:mr-3 file:rounded-lg file:border-0 file:bg-[#003A8C] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        mergeValues({ videoThumbnail: f });
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors ${
                    videoDragOver
                      ? "border-[#003A8C] bg-[#003A8C]/5"
                      : "border-[#E5E7EB] bg-[rgba(249,250,251,0.5)]"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
                  onDragLeave={() => setVideoDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setVideoDragOver(false);
                    addVideoFiles(Array.from(e.dataTransfer.files));
                  }}
                >
                  <label
                    htmlFor={`${formId}-videos`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
                  >
                    {selectedVideos.length > 0 ? "Add more videos" : "Choose videos"}
                  </label>
                  <input
                    id={`${formId}-videos`}
                    type="file"
                    accept="video/mp4,video/webm,.mp4,.webm"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addVideoFiles(Array.from(e.target.files ?? []));
                      e.target.value = "";
                    }}
                  />
                </div>

                {selectedVideos.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {selectedVideos.map((file, i) => (
                      <li
                        key={`${file.name}-${file.size}-${i}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-2 text-sm text-[#1A1D24]"
                      >
                        <span className="min-w-0 truncate font-medium">{file.name}</span>
                        <span className="shrink-0 text-xs text-[#99A1AF]">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVideo(i)}
                          className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
          )}
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
            disabled={publishing || (mode === "create" && selectedImages.length === 0)}
            onClick={async () => {
              if (!onPublish) return;
              setMediaMessage(null);
              if (mode === "create" && selectedImages.length === 0) {
                setMediaMessage("Add at least one listing image before publishing.");
                return;
              }
              setPublishing(true);
              try {
                await onPublish(values);
              } catch (e) {
                setMediaMessage(e instanceof Error ? e.message : "Save failed");
              } finally {
                setPublishing(false);
              }
            }}
            className="rounded-lg bg-[#003A8C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002f73] disabled:opacity-60"
          >
            {publishing ? "Saving…" : "Publish Listing"}
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
