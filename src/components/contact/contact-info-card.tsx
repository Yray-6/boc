"use client";

import { AnimateIn } from "@/components/common/animate-in";
import type { SiteSettings } from "@/types/site-settings";

interface ContactInfoCardProps {
  settings?: SiteSettings | null;
}

/** Contact Information card — Figma 819:8013 (desktop) + 819:9192 (mobile) */
export function ContactInfoCard({ settings }: ContactInfoCardProps) {
  const email   = settings?.primary_email || "info@bocrealestate.com";
  const phone   = settings?.phone_number  || "+2348012345678";
  const whatsappHref = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

  const items = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="lg:h-6 lg:w-6">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#2A478D" />
        </svg>
      ),
      label: "Phone",
      content: <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:underline">{phone}</a>,
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="lg:h-6 lg:w-6">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#2A478D" />
        </svg>
      ),
      label: "Email",
      content: <a href={`mailto:${email}`} className="break-all hover:underline">{email}</a>,
    },
    ...(settings?.instagram ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="lg:h-6 lg:w-6">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#2A478D" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" stroke="#2A478D" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="#2A478D" />
        </svg>
      ),
      label: "Instagram",
      content: <a href={settings.instagram!} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">Instagram</a>,
    }] : []),
    ...(settings?.facebook ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#2A478D" className="lg:h-6 lg:w-6">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
        </svg>
      ),
      label: "Facebook",
      content: <a href={settings.facebook!} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">Facebook</a>,
    }] : []),
    ...(settings?.twitter ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#2A478D" className="lg:h-6 lg:w-6">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: "Twitter / X",
      content: <a href={settings.twitter!} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">Twitter / X</a>,
    }] : []),
    ...(settings?.linkedin ? [{
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#2A478D" className="lg:h-6 lg:w-6">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: "LinkedIn",
      content: <a href={settings.linkedin!} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">LinkedIn</a>,
    }] : []),
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="lg:h-6 lg:w-6">
          <circle cx="12" cy="12" r="10" stroke="#2A478D" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#2A478D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Business Hours",
      content: (
        <span className="flex flex-col gap-0.5">
          <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
          <span>Saturday: 10:00 AM - 4:00 PM</span>
          <span>Sunday: Closed</span>
        </span>
      ),
    },
  ];

  return (
    <AnimateIn animation="fade-up" delay={150} threshold={0.05}>
      <div className="flex flex-col rounded-[9.59px] bg-white px-[19.17px] pt-[19.17px] shadow-[0px_0px_3.59px_-2.4px_rgba(0,0,0,0.1),0px_0px_8.99px_-1.8px_rgba(0,0,0,0.1)] lg:rounded-[16px] lg:px-8 lg:pt-8 lg:shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">

        <h2 className="text-center text-sm font-semibold leading-[1.4] text-[#1a1a1a] lg:text-left lg:text-2xl lg:leading-[1.33] [font-family:var(--font-playfair)]">
          Contact Information
        </h2>

        <div className="mt-[14.38px] flex flex-col gap-[14.38px] lg:mt-6 lg:gap-6">
          {items.map(({ icon, label, content }) => (
            <div key={label} className="flex items-start gap-[9.59px] lg:gap-4">
              <div className="flex h-[28.76px] w-[28.76px] shrink-0 items-center justify-center rounded-full bg-[rgba(42,71,141,0.1)] lg:h-12 lg:w-12">
                {icon}
              </div>
              <div className="flex flex-col gap-[2.4px] lg:gap-1">
                <span className="text-xs font-semibold leading-normal text-[#1a1a1a] lg:text-[18px] [font-family:var(--font-playfair)]">
                  {label}
                </span>
                <span className="text-[10px] leading-normal text-[#6b6b6b] lg:text-[16px] [font-family:var(--font-dm-sans)]">
                  {content}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[14.38px] border-t border-[rgba(26,26,26,0.1)] pt-[19.77px] pb-[19.17px] lg:mt-8 lg:pb-8 lg:pt-8">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-full items-center justify-center gap-[9.59px] rounded-[3.59px] bg-[#00C950] text-xs font-semibold text-white transition-colors hover:bg-[#00b347] lg:h-14 lg:gap-3 lg:rounded-[6px] lg:text-base [font-family:var(--font-dm-sans)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12" height="12" className="lg:h-5 lg:w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </AnimateIn>
  );
}
