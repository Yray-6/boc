"use client";

import { useEffect } from "react";

export type AdminDeleteConfirmKind = "property" | "agent";

const COPY: Record<
  AdminDeleteConfirmKind,
  { title: string; description: string }
> = {
  property: {
    title: "Delete Property",
    description:
      "The property will be deleted and viewers will no longer be able to see this property and the details.",
  },
  agent: {
    title: "Delete Agent",
    description:
      "The Agent will be deleted and viewers will no longer be able to see agent and their contact information.",
  },
};

type AdminDeleteConfirmModalProps = {
  open: boolean;
  kind: AdminDeleteConfirmKind | null;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3 6h18"
        stroke="#EF4343"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
        stroke="#EF4343"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        stroke="#EF4343"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6M14 11v6"
        stroke="#EF4343"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminDeleteConfirmModal({
  open,
  kind,
  onCancel,
  onConfirm,
}: AdminDeleteConfirmModalProps) {
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
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !kind) return null;

  const { title, description } = COPY[kind];

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center p-4 [font-family:var(--font-urbanist)]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="admin-delete-title"
      aria-describedby="admin-delete-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cancel delete"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-[540px] rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-[25px] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <DeleteIcon className="size-[42px] shrink-0" />
            <h2
              id="admin-delete-title"
              className="text-2xl font-bold leading-tight tracking-[-0.01875em] text-[#272C34]"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-7">
          <p
            id="admin-delete-desc"
            className="max-w-[420px] text-center text-base font-normal leading-normal text-[#62748E]"
          >
            {description}
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 flex-1 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#FAFAFA] text-sm font-semibold leading-[1.4286] text-[#272C34] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-100 sm:min-w-0"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-10 flex-1 items-center justify-center rounded-md bg-[#EF4343] text-sm font-semibold leading-[1.4286] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#dc2626] sm:min-w-0"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
