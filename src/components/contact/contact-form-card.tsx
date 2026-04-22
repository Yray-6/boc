"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/common/animate-in";

/** Send Us a Message form card — Figma 819:8081 (desktop) + 819:9160 (mobile) */
export function ContactFormCard() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  /* Mobile sizes (Figma 819:9160) → scale up at lg */
  const inputCls = "w-full rounded-[3.43px] border border-[rgba(26,26,26,0.1)] bg-white px-[9.15px] py-[6.86px] text-xs text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] transition-colors [font-family:var(--font-dm-sans)] lg:rounded-[6px] lg:px-4 lg:py-3 lg:text-base";
  const labelCls = "block text-xs font-medium text-[#1a1a1a] [font-family:var(--font-dm-sans)] lg:text-base";

  return (
    <AnimateIn animation="fade-up" delay={50} threshold={0.05}>
    <div className="flex flex-col gap-[13.73px] rounded-[9.15px] bg-white px-[18.3px] pt-[18.3px] pb-0 shadow-[0px_2.29px_3.43px_-2.29px_rgba(0,0,0,0.1),0px_5.72px_8.58px_-1.72px_rgba(0,0,0,0.1)] lg:gap-6 lg:rounded-[16px] lg:px-8 lg:pt-8 lg:shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
      {/* Title — centered on mobile (Figma), left on desktop */}
      <h2 className="text-center text-sm font-semibold leading-[1.34] text-[#1a1a1a] lg:text-left lg:text-2xl lg:leading-[1.33] [font-family:var(--font-playfair)]">
        Send Us a Message
      </h2>

      {submitted ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center lg:py-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(42,71,141,0.1)] lg:h-14 lg:w-14">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:h-7 lg:w-7">
              <path d="M5 13l4 4L19 7" stroke="#2a478d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1a1a1a] lg:text-lg [font-family:var(--font-playfair)]">Message Sent!</p>
          <p className="text-xs text-[#6b6b6b] lg:text-sm [font-family:var(--font-dm-sans)]">
            We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", subject: "", message: "" }); }}
            className="mt-1 text-xs font-medium text-[#2a478d] underline underline-offset-2 lg:text-sm [font-family:var(--font-dm-sans)]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-[13.73px] pb-[18.3px] lg:gap-6 lg:pb-8">
          {/* Full Name */}
          <div className="flex flex-col gap-[4.58px] lg:gap-2">
            <label htmlFor="fullName" className={labelCls}>Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="John Doe" required value={form.fullName} onChange={handleChange} className={inputCls} />
          </div>

          {/* Email + Phone — 2-col on mobile (Figma), stays 2-col on desktop */}
          <div className="grid grid-cols-2 gap-[13.73px] lg:gap-6">
            <div className="flex flex-col gap-[4.58px] lg:gap-2">
              <label htmlFor="email" className={labelCls}>Email Address</label>
              <input id="email" name="email" type="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex flex-col gap-[4.58px] lg:gap-2">
              <label htmlFor="phone" className={labelCls}>Phone Number</label>
              <input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-[4.58px] lg:gap-2">
            <label htmlFor="subject" className={labelCls}>Subject</label>
            <input id="subject" name="subject" type="text" placeholder="Property Inquiry" required value={form.subject} onChange={handleChange} className={inputCls} />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-[4.58px] lg:gap-2">
            <label htmlFor="message" className={labelCls}>Message</label>
            <textarea
              id="message" name="message" rows={4}
              placeholder="Tell us how we can help you..."
              required value={form.message} onChange={handleChange}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex h-9 w-full items-center justify-center rounded-[3.43px] bg-[#2a478d] text-xs font-semibold text-white transition-colors hover:bg-[#1e3570] lg:h-14 lg:rounded-[6px] lg:text-base [font-family:var(--font-dm-sans)]"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
    </AnimateIn>
  );
}
