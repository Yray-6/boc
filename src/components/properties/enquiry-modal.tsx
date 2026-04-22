"use client";

import { useState, useEffect, useRef } from "react";
import type { PublicEnquiryPayload } from "@/app/api/enquiries/route";

const ENQUIRY_TYPES: { value: PublicEnquiryPayload["enquiry_type"]; label: string }[] = [
  { value: "GENERAL", label: "General Enquiry" },
  { value: "SCHEDULE_VISIT", label: "Schedule a Visit" },
  { value: "BUY", label: "Interested in Buying" },
  { value: "RENT", label: "Interested in Renting" },
  { value: "LEASE", label: "Interested in Leasing" },
];

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: number;
  propertyTitle?: string;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  enquiry_type: PublicEnquiryPayload["enquiry_type"];
};

const BLANK: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  enquiry_type: "GENERAL",
};

type Phase = "form" | "submitting" | "success" | "error";

export function EnquiryModal({ open, onClose, propertyId, propertyTitle }: EnquiryModalProps) {
  const [form, setForm] = useState<FormState>({ ...BLANK });
  const [phase, setPhase] = useState<Phase>("form");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  /* Lock body scroll and focus first input when open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstInputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  /* Escape key */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    if (phase === "submitting") return;
    setPhase("form");
    setForm({ ...BLANK });
    setErrorMsg("");
    onClose();
  }

  function set(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("submitting");
    setErrorMsg("");

    const payload: PublicEnquiryPayload = {
      property: propertyId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      enquiry_type: form.enquiry_type,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { detail?: string };

      if (!res.ok) {
        const msg =
          data.detail && typeof data.detail === "string"
            ? data.detail
            : `Submission failed (${res.status}). Please try again.`;
        setErrorMsg(msg);
        setPhase("error");
        return;
      }

      setPhase("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setPhase("error");
    }
  }

  if (!open) return null;

  const inputCls =
    "w-full rounded-[8px] border border-[rgba(26,26,26,0.15)] bg-white px-4 py-[10px] text-sm text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.4)] outline-none focus:border-[#2a478d] transition-colors [font-family:var(--font-dm-sans)]";
  const labelCls = "block text-sm font-medium text-[#1a1a1a] mb-[6px] [font-family:var(--font-dm-sans)]";

  return (
    <div
      className="fixed inset-0 z-120 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={handleClose}
      />

      {/* Panel — bottom sheet on mobile, centered card on sm+ */}
      <div className="relative flex w-full max-w-[520px] flex-col rounded-t-[20px] bg-white shadow-xl sm:rounded-[20px]
                      max-h-[92dvh] sm:max-h-[calc(100dvh-2rem)]">

        {/* Drag handle (mobile only) */}
        <div className="flex shrink-0 justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[rgba(26,26,26,0.15)]" />
        </div>

        {/* Header row — sticky inside panel */}
        <div className="shrink-0 px-5 pt-4 pb-1 sm:px-8 sm:pt-6">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close enquiry form"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[rgba(26,26,26,0.06)] hover:text-[#1a1a1a] sm:right-5 sm:top-5"
          >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          </button>

          {/* ── Success state ── */}
          {phase === "success" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <path d="M8 20L16 28L32 12" stroke="#00A63E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-5 text-[22px] font-bold text-[#1a1a1a] [font-family:var(--font-playfair)]">
                Enquiry Sent!
              </h2>
              <p className="mt-2 max-w-[340px] text-sm text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                Thank you for your interest. An agent will get back to you shortly.
              </p>
            </div>
          ) : (
            <>
              <h2
                id="enquiry-modal-title"
                className="pr-8 text-[18px] font-semibold text-[#1a1a1a] sm:text-[20px] [font-family:var(--font-playfair)]"
              >
                Send Enquiry
              </h2>
              {propertyTitle && (
                <p className="mt-1 text-[12px] text-[#6b6b6b] sm:text-[13px] [font-family:var(--font-dm-sans)]">
                  Re: <span className="font-medium text-[#1a1a1a]">{propertyTitle}</span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 sm:px-8 sm:pb-8">
          {phase === "success" ? (
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#2a478d] text-sm font-medium text-white transition-colors hover:bg-[#1d3260] [font-family:var(--font-dm-sans)]"
            >
              Close
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Enquiry type */}
              <div>
                <label htmlFor="eq-type" className={labelCls}>Enquiry Type</label>
                <div className="relative">
                  <select
                    id="eq-type"
                    required
                    value={form.enquiry_type}
                    onChange={(e) => set({ enquiry_type: e.target.value as FormState["enquiry_type"] })}
                    className={`${inputCls} appearance-none pr-9`}
                  >
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="eq-name" className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input
                  ref={firstInputRef}
                  id="eq-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Email + Phone side by side on sm+ */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="eq-email" className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                  <input
                    id="eq-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set({ email: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="eq-phone" className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                  <input
                    id="eq-phone"
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={(e) => set({ phone: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="eq-message" className={labelCls}>Message</label>
                <textarea
                  id="eq-message"
                  rows={3}
                  placeholder="Any additional details or questions…"
                  value={form.message}
                  onChange={(e) => set({ message: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Error */}
              {phase === "error" && errorMsg ? (
                <p className="rounded-[8px] bg-red-50 px-4 py-3 text-sm text-red-600 [font-family:var(--font-dm-sans)]">
                  {errorMsg}
                </p>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                disabled={phase === "submitting"}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#2a478d] text-sm font-medium text-white transition-colors hover:bg-[#1d3260] disabled:opacity-60 [font-family:var(--font-dm-sans)]"
              >
                {phase === "submitting" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Send Enquiry"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
