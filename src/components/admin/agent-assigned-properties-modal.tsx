"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export type AgentAssignedListing = {
  id: string;
  title: string;
  location: string;
  price: string;
  thumb: string;
  status: "Active" | "Inactive";
};

type AgentAssignedPropertiesModalProps = {
  agentName: string;
  listings: AgentAssignedListing[];
  open: boolean;
  onClose: () => void;
};

function IconEyeTiny({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M1 12C2.5 7 7 4 12 4c5 0 9.5 3 11 8c-1.5 5-6 8-11 8S2.5 17 1 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ListingCard({ row }: { row: AgentAssignedListing }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#F3F4F6] p-4 sm:flex-row sm:items-stretch">
      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-lg border border-[#F3F4F6] bg-[#F3F4F6]">
        <Image
          src={row.thumb}
          alt=""
          fill
          className="object-cover"
          sizes="78px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold leading-[1.4286] text-[#1A1D24]">
              {row.title}
            </h4>
            <span
              className={`inline-flex rounded px-2 py-0.5 text-[8px] font-bold uppercase leading-[1.875] text-white ${
                row.status === "Active" ? "bg-[#34CA6C]" : "bg-[#99A1AF]"
              }`}
            >
              {row.status}
            </span>
          </div>
          <div className="flex shrink-0 items-center">
            <Link
              href="/admin/properties"
              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1.5 text-[10px] font-semibold leading-normal text-[#99A1AF] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50"
            >
              <IconEyeTiny className="shrink-0" />
              View
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-light leading-normal text-black">
          <Image
            src="/admin-dashboard/modal-pin.svg"
            alt=""
            width={10}
            height={10}
            className="size-2.5 shrink-0"
          />
          <span className="truncate">{row.location}</span>
        </div>
        <p className="pt-1 text-sm font-bold leading-[1.4286] text-[#003A8C]">
          {row.price}
        </p>
      </div>
    </div>
  );
}

export function AgentAssignedPropertiesModal({
  agentName,
  listings,
  open,
  onClose,
}: AgentAssignedPropertiesModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[105] flex items-center justify-center p-4 [font-family:var(--font-urbanist)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-assigned-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative flex max-h-[min(92vh,1184px)] w-full max-w-[896px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#F3F4F6] bg-[rgba(249,250,251,0.5)] px-6 py-6 sm:px-8">
          <div className="min-w-0">
            <h2
              id="agent-assigned-title"
              className="text-xl font-bold leading-[1.4] text-[#1A1D24]"
            >
              Properties Assigned to {agentName}
            </h2>
            <p className="mt-1 text-sm font-normal leading-[1.4286] text-[#99A1AF]">
              Manage listings for this agent
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-[#99A1AF] transition-colors hover:bg-white hover:text-[#62748E]"
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4">
            {listings.map((row) => (
              <ListingCard key={row.id} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
