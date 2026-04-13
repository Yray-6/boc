"use client";

import { useState } from "react";

/** Send Us a Message form card — Figma node 819:8081 */
export function ContactFormCard() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputCls =
    "w-full rounded-[6px] border border-[rgba(26,26,26,0.1)] bg-white px-4 py-3 text-base text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.5)] outline-none focus:border-[#2a478d] transition-colors [font-family:var(--font-dm-sans)]";
  const labelCls =
    "block text-base font-medium text-[#1a1a1a] [font-family:var(--font-dm-sans)]";

  return (
    <div className="flex flex-col gap-6 rounded-[16px] bg-white px-8 pt-8 pb-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <h2 className="text-2xl font-semibold leading-[1.33] text-[#1a1a1a] [font-family:var(--font-playfair)]">
        Send Us a Message
      </h2>

      {submitted ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(42,71,141,0.1)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#2a478d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[#1a1a1a] [font-family:var(--font-playfair)]">Message Sent!</p>
          <p className="text-sm text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
            We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", subject: "", message: "" }); }}
            className="mt-2 text-sm font-medium text-[#2a478d] underline underline-offset-2 [font-family:var(--font-dm-sans)]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className={labelCls}>Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={form.fullName}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelCls}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelCls}>Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className={labelCls}>Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Property Inquiry"
              required
              value={form.subject}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className={labelCls}>Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us how we can help you..."
              required
              value={form.message}
              onChange={handleChange}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center rounded-[6px] bg-[#2a478d] text-base font-semibold text-white hover:bg-[#1e3570] transition-colors [font-family:var(--font-dm-sans)]"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
