import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Buy", href: "/properties" },
  { label: "Rent", href: "/properties" },
  { label: "Lease", href: "/properties" },
  { label: "About", href: "#" },
  { label: "Agents", href: "#" },
  { label: "Contact", href: "/contact" },
] as const;

const propertyTypes = ["Apartments", "Duplexes", "Terraces", "Commercial", "Land"] as const;

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#1a1a1a]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 pb-8 pt-10 sm:px-6 sm:gap-10 lg:gap-12 lg:px-8 lg:pb-10 lg:pt-16">

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 xl:gap-x-[76px]">

          {/* Brand — full-width on mobile */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-2 lg:col-span-1 lg:max-w-[330px]">
            <p className="text-[18px] font-bold text-[#f5f0e8] sm:text-xl lg:text-2xl [font-family:var(--font-dm-sans)]">
              BOC Real Estate Limited
            </p>
            <p className="text-xs leading-relaxed text-[rgba(245,240,232,0.8)] sm:text-sm [font-family:var(--font-dm-sans)]">
              Nigeria&apos;s premier luxury real estate platform, connecting discerning clients with exceptional properties since 2021.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-1.svg" alt="" width={20} height={20} />
              </a>
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-2.svg" alt="" width={20} height={20} />
              </a>
              <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-3.svg" alt="" width={20} height={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[#f5f0e8] lg:text-base [font-family:var(--font-playfair)]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-[6px] text-xs text-[rgba(245,240,232,0.8)] lg:gap-2 lg:text-sm [font-family:var(--font-dm-sans)]">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-[#f5f0e8]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[#f5f0e8] lg:text-base [font-family:var(--font-playfair)]">
              Property Types
            </h4>
            <ul className="flex flex-col gap-[6px] text-xs text-[rgba(245,240,232,0.8)] lg:gap-2 lg:text-sm [font-family:var(--font-dm-sans)]">
              {propertyTypes.map((label) => (
                <li key={label}>
                  <a href="#" className="transition-colors hover:text-[#f5f0e8]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full-width on mobile */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 lg:col-span-1 lg:max-w-[330px]">
            <h4 className="text-sm font-semibold text-[#f5f0e8] lg:text-base [font-family:var(--font-playfair)]">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-[10px] text-xs text-[rgba(245,240,232,0.8)] lg:gap-3 lg:text-sm [font-family:var(--font-dm-sans)]">
              <li className="flex gap-2">
                <Image src="/assets/figma/footer-icon-location.svg" alt="" width={16} height={16} className="mt-0.5 shrink-0 lg:h-5 lg:w-5" />
                <span>Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-phone.svg" alt="" width={16} height={16} className="shrink-0 lg:h-5 lg:w-5" />
                <a href="tel:+2348012345678" className="transition-colors hover:text-[#f5f0e8]">
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-email.svg" alt="" width={16} height={16} className="shrink-0 lg:h-5 lg:w-5" />
                <a href="mailto:info@bocrealestate.com" className="transition-colors hover:text-[#f5f0e8] break-all">
                  info@bocrealestate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(245,240,232,0.1)] pt-6 text-center text-[11px] text-[rgba(245,240,232,0.8)] lg:pt-8 lg:text-sm [font-family:var(--font-dm-sans)]">
          © 2026 BOC Real Estate Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
