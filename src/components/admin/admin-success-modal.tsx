"use client";

import { useEffect } from "react";

export type AdminSuccessVariant =
  | "agent-added"
  | "agent-updated"
  | "agent-deleted"
  | "property-listed"
  | "property-updated"
  | "property-deleted";

export const ADMIN_SUCCESS_COPY: Record<
  AdminSuccessVariant,
  { title: string; description: string }
> = {
  "agent-added": {
    title: "Agent Added Successfully",
    description:
      "The Agent has been listed and viewers will be able to see property assigned to the agent and their contact information.",
  },
  "agent-updated": {
    title: "Agent Details Updated",
    description:
      "The Agent has been updated and viewers will be able to see property assigned to the agent and their contact information.",
  },
  "agent-deleted": {
    title: "Agent Deleted Successfully",
    description:
      "The Agent has been deleted and viewers will no longer be able to see agent and their contact information.",
  },
  "property-listed": {
    title: "Property Listed Successfully",
    description:
      "Your property has been listed and updated to the platform. Viewers will be able to see property and its details.",
  },
  "property-updated": {
    title: "Property Updated Successfully",
    description:
      "Your property details has been updated to the platform. Viewers will be able to see property and its details.",
  },
  "property-deleted": {
    title: "Property Deleted Successfully",
    description:
      "Your property details has been removed from the platform. Viewers will no longer be able to see property and its details.",
  },
};

type AdminSuccessModalProps = {
  open: boolean;
  variant: AdminSuccessVariant | null;
  onClose: () => void;
};

function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M8 20L16 28L32 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminSuccessModal({
  open,
  variant,
  onClose,
}: AdminSuccessModalProps) {

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

  if (!open || !variant) return null;

  const { title, description } = ADMIN_SUCCESS_COPY[variant];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 [font-family:var(--font-urbanist)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-success-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[608px] rounded-2xl border border-[#E2E8F0] bg-white px-8 pb-10 pt-12 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:px-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#DCFCE7]">
          <SuccessCheckIcon className="text-[#00A63E]" />
        </div>
        <h2
          id="admin-success-title"
          className="mt-6 text-center text-[30px] font-bold leading-[1.2] text-[#0F172B]"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[510px] text-center text-base font-normal leading-normal text-[#62748E]">
          {description}
        </p>
        <div className="mx-auto mt-8 max-w-[510px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#003A8C] text-base font-normal leading-normal text-white transition-colors hover:bg-[#002f73]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
