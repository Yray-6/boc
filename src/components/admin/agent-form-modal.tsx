"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { useRightDrawerMount } from "@/components/admin/use-right-drawer-mount";

export type AgentFormValues = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  bio: string;
  specializationKeys: string[];
};

export const AGENT_SPEC_OPTIONS = [
  { id: "sales", label: "Sales" },
  { id: "rentals", label: "Rentals" },
  { id: "commercial", label: "Commercial" },
] as const;

const defaultForm: AgentFormValues = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  bio: "",
  specializationKeys: [],
};

const labelClass =
  "text-xs font-bold uppercase leading-[1.333] tracking-wide text-[#99A1AF]";
const inputClass =
  "w-full rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3 text-base font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2";

type AgentFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initial: AgentFormValues | null;
  detailLoading?: boolean;
  onClose: () => void;
  onSave?: (values: AgentFormValues) => void | Promise<void>;
};

export function AgentFormModal({
  open,
  mode,
  initial,
  detailLoading = false,
  onClose,
  onSave,
}: AgentFormModalProps) {
  const formId = useId();
  const [values, setValues] = useState<AgentFormValues>(defaultForm);
  const [saving, setSaving] = useState(false);
  const { mounted, entered } = useRightDrawerMount(open);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && detailLoading && !initial) return;
    setValues(
      initial
        ? {
            ...defaultForm,
            ...initial,
            specializationKeys: [...initial.specializationKeys],
          }
        : defaultForm,
    );
  }, [open, initial, mode, detailLoading]);

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
    if (!open) setSaving(false);
  }, [open]);

  function toggleSpec(id: string) {
    setValues((v) => {
      const set = new Set(v.specializationKeys);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...v, specializationKeys: [...set] };
    });
  }

  if (!open && !mounted) return null;

  const title = mode === "create" ? "Add Agent" : "Edit Agent";

  return (
    <div
      className="fixed inset-0 z-110 flex justify-end [font-family:var(--font-urbanist)]"
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
        className={`relative flex h-full w-full max-w-[448px] flex-col border-l border-[#F3F4F6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 px-8 pb-8 pt-8">
          <h2
            id={`${formId}-title`}
            className="text-xl font-bold leading-[1.4] text-[#1A1D24]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50 hover:text-[#62748E]"
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

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!onSave) return;
            setSaving(true);
            try {
              await onSave(values);
              onClose();
            } catch {
              /* parent may show error; keep drawer open */
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-8 pb-8">
            {mode === "edit" && detailLoading ? (
              <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-[#F3F4F6] bg-[#F9FAFB] text-sm font-medium text-[#6A7282]">
                Loading agent details...
              </div>
            ) : (
            <>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-name`}>
                Full Name
              </label>
              <input
                id={`${formId}-name`}
                className={inputClass}
                placeholder="e.g. Sarah Johnson"
                value={values.fullName}
                onChange={(e) =>
                  setValues((v) => ({ ...v, fullName: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-title`}>
                Job Title
              </label>
              <input
                id={`${formId}-title`}
                className={inputClass}
                placeholder="e.g. Senior Consultant"
                value={values.jobTitle}
                onChange={(e) =>
                  setValues((v) => ({ ...v, jobTitle: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor={`${formId}-email`}>
                  Email
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  className={inputClass}
                  placeholder="sarah@boc.com"
                  value={values.email}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor={`${formId}-phone`}>
                  Phone
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  className={inputClass}
                  placeholder="+234..."
                  value={values.phone}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, phone: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-bio`}>
                Bio
              </label>
              <textarea
                id={`${formId}-bio`}
                className={`${inputClass} min-h-[120px] resize-y py-3 leading-normal`}
                placeholder="Short professional bio..."
                rows={4}
                value={values.bio}
                onChange={(e) =>
                  setValues((v) => ({ ...v, bio: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className={labelClass}>Specialization</span>
              <div className="flex flex-wrap gap-2">
                {AGENT_SPEC_OPTIONS.map((opt) => {
                  const on = values.specializationKeys.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleSpec(opt.id)}
                      className={`rounded-lg border px-4 py-2 text-sm font-normal leading-[1.4286] transition-colors ${
                        on
                          ? "border-[#003A8C] bg-[#003A8C] text-white"
                          : "border-[#F3F4F6] bg-[#F9FAFB] text-[#1A1D24] hover:border-[#E5E7EB]"
                      }`}
                      aria-pressed={on}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            </>
            )}
          </div>

          <div className="shrink-0 border-t border-[#F3F4F6] px-8 pb-8 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="flex flex-1 items-center justify-center rounded-lg border border-[#F3F4F6] bg-white py-3 text-sm font-bold leading-[1.4286] text-[#6A7282] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center rounded-lg bg-[#003A8C] py-3 text-sm font-bold leading-[1.4286] text-white transition-colors hover:bg-[#002f73] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Agent"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
