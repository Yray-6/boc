"use client";

import { useId, useRef, useState } from "react";

const labelClass =
  "text-xs font-bold uppercase leading-[1.333] tracking-wide text-[#99A1AF]";
const inputClass =
  "w-full rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3 text-base font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2";

function IconSave({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 21v-8H7v8M7 3v5h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUploadSmall({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 15V3M9 6l3-3 3 3M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminSettings() {
  const formId = useId();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [companyName, setCompanyName] = useState("BOC Real Estate");
  const [primaryEmail, setPrimaryEmail] = useState("info@bocrealestate.com");
  const [phone, setPhone] = useState("+234 800 123 4567");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 3200);
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
              Settings
            </h1>
            <p className="text-base font-normal leading-normal text-[#99A1AF]">
              Configure your website and management portal.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#003A8C] px-6 py-2 text-sm font-bold leading-[1.4286] text-white shadow-[0px_4px_6px_-4px_rgba(201,168,76,0.2),0px_10px_15px_-3px_rgba(201,168,76,0.2)] transition-colors hover:bg-[#002f73]"
            >
              <IconSave className="size-[18px] shrink-0 text-white" />
              Save Changes
            </button>
          </div>
        </div>

        {savedFlash ? (
          <p
            className="text-sm font-semibold text-[#00A63E]"
            role="status"
            aria-live="polite"
          >
            Changes saved.
          </p>
        ) : null}

        <div className="rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:p-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
                General Information
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-company`}>
                    Company Name
                  </label>
                  <input
                    id={`${formId}-company`}
                    className={inputClass}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-email`}>
                    Primary Email
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    className={inputClass}
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-phone`}>
                    Phone Number
                  </label>
                  <input
                    id={`${formId}-phone`}
                    type="tel"
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-md">
              <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
                Branding
              </h2>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                  <span className="text-2xl font-bold leading-[1.333] text-[#003A8C]">
                    B
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold leading-[1.4286] text-[#1A1D24]">
                    Company Logo
                  </p>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="Upload company logo"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center gap-1 self-start text-xs font-normal leading-[1.333] text-[#003A8C] transition-opacity hover:opacity-80"
                  >
                    <IconUploadSmall className="shrink-0" />
                    Replace Logo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#F3F4F6] pt-8">
            <h2 className="mb-4 text-lg font-bold leading-[1.556] text-[#1A1D24]">
              Social Media
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1 pt-1">
                <label className={labelClass} htmlFor={`${formId}-ig`}>
                  Instagram
                </label>
                <input
                  id={`${formId}-ig`}
                  className={inputClass}
                  placeholder="https://..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <label className={labelClass} htmlFor={`${formId}-fb`}>
                  Facebook
                </label>
                <input
                  id={`${formId}-fb`}
                  className={inputClass}
                  placeholder="https://..."
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <label className={labelClass} htmlFor={`${formId}-x`}>
                  X (Twitter)
                </label>
                <input
                  id={`${formId}-x`}
                  className={inputClass}
                  placeholder="https://..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <label className={labelClass} htmlFor={`${formId}-li`}>
                  LinkedIn
                </label>
                <input
                  id={`${formId}-li`}
                  className={inputClass}
                  placeholder="https://..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
