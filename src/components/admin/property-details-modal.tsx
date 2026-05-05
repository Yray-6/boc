"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRightDrawerMount } from "@/components/admin/use-right-drawer-mount";

/** Listing video for read-only admin Property Details (URLs from API). */
export type PropertyDetailVideo = {
  url: string;
  poster?: string;
  title: string;
};

export type PropertyDetail = {
  id: string;
  title: string;
  locationDisplay: string;
  price: string;
  modeLabel: string;
  modeKind: "buy" | "rent";
  heroImage: string;
  videos: PropertyDetailVideo[];
  bedrooms: number;
  bathrooms: number;
  area: string;
  parking: number;
  description: string;
  amenities: string[];
  agentName: string;
  agentTitle: string;
  agentAvatar: string;
};

type PropertyDetailsModalProps = {
  property: PropertyDetail | null;
  open: boolean;
  onClose: () => void;
};

export function PropertyDetailsModal({
  property,
  open,
  onClose,
}: PropertyDetailsModalProps) {
  const frozenProperty = useRef<PropertyDetail | null>(null);
  if (property) frozenProperty.current = property;
  const displayProperty = property ?? frozenProperty.current;

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

  if (!displayProperty) return null;
  if (!open && !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[105] flex min-h-0 justify-end [font-family:var(--font-urbanist)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-details-title"
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
        className={`relative flex h-full min-h-0 w-full max-w-[671px] flex-col overflow-hidden border-l border-[#F3F4F6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="relative z-10 flex h-20 shrink-0 items-center justify-between border-b border-[#F3F4F6] bg-white px-6 sm:px-8">
          <h2
            id="property-details-title"
            className="text-xl font-bold leading-[1.4] text-[#1A1D24]"
          >
            Property Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50 hover:text-[#62748E]"
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
          <div className="flex flex-col gap-8">
            <div className="relative aspect-607/320 w-full overflow-hidden rounded-xl bg-[#F3F4F6]">
              <Image
                src={displayProperty.heroImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 671px) 100vw, 607px"
                priority
              />
            </div>

            <section className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#99A1AF]">
                Videos
              </h4>
              {displayProperty.videos.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {displayProperty.videos.map((v, i) => (
                    <div
                      key={`${v.url}-${i}`}
                      className="overflow-hidden rounded-xl border border-[#F3F4F6] bg-[#0a0a0a]"
                    >
                      {v.title ? (
                        <p className="border-b border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm font-semibold text-white/95">
                          {v.title}
                        </p>
                      ) : null}
                      <video
                        src={v.url}
                        poster={v.poster || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full bg-black object-contain"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm leading-relaxed text-[#62748E]">
                  No videos yet. Use{" "}
                  <span className="font-semibold text-[#1A1D24]">Edit property</span> →{" "}
                  <span className="font-semibold text-[#1A1D24]">Videos (optional)</span> to upload MP4 or WebM,
                  publish, then open this view again.
                </p>
              )}
            </section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-2xl font-bold leading-[1.333] text-[#1A1D24]">
                  {displayProperty.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Image
                    src="/admin-dashboard/modal-pin.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5 shrink-0"
                  />
                  <p className="text-base font-normal leading-normal text-[#99A1AF]">
                    {displayProperty.locationDisplay}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <p className="text-right text-2xl font-bold leading-[1.333] text-[#003A8C]">
                  {displayProperty.price}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-[#99A1AF]">
                  {displayProperty.modeLabel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-y border-[#F3F4F6] py-6 sm:grid-cols-4 sm:gap-4">
              <Stat
                icon="/admin-dashboard/modal-icon-bed.svg"
                value={String(displayProperty.bedrooms)}
                label="Bedrooms"
              />
              <Stat
                icon="/admin-dashboard/modal-icon-bath.svg"
                value={String(displayProperty.bathrooms)}
                label="Bathrooms"
              />
              <Stat
                icon="/admin-dashboard/modal-icon-area.svg"
                value={displayProperty.area}
                label="Area"
              />
              <Stat
                icon="/admin-dashboard/modal-icon-parking.svg"
                value={String(displayProperty.parking)}
                label="Parking"
              />
            </div>

            <section className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#99A1AF]">
                Description
              </h4>
              <p className="text-base font-normal leading-relaxed text-[#4A5565]">
                {displayProperty.description}
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#99A1AF]">
                Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayProperty.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold leading-[1.333] text-[#4A5565]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#99A1AF]">
                Assigned Agent
              </h4>
              <div className="flex items-center gap-4 rounded-2xl border border-[#F3F4F6] bg-[#F9FAFB] p-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <Image
                    src={displayProperty.agentAvatar}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold leading-normal text-[#1A1D24]">
                    {displayProperty.agentName}
                  </p>
                  <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
                    {displayProperty.agentTitle}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0"
      />
      <p className="pt-1 text-sm font-bold leading-[1.4286] text-[#1A1D24]">
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase leading-normal text-[#99A1AF]">
        {label}
      </p>
    </div>
  );
}
