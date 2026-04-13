import Image from "next/image";

const quickLinks = ["Buy", "Rent", "Lease", "About", "Agents", "Contact"] as const;
const propertyTypes = ["Apartments", "Duplexes", "Terraces", "Commercial", "Land"] as const;

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#1a1a1a]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-8 pb-10 pt-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 xl:gap-[76px]">
          <div className="flex max-w-[330px] flex-col gap-4">
            <p className="text-2xl font-bold text-[#f5f0e8] [font-family:var(--font-dm-sans)]">BOC Real Estate Limited</p>
            <p className="text-sm leading-normal text-[rgba(245,240,232,0.8)] [font-family:var(--font-dm-sans)]">
              Nigeria&apos;s premier luxury real estate platform, connecting discerning clients with exceptional properties since 2021.
            </p>
            <div className="flex gap-4 pt-1">
              <a href="#" className="opacity-90 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-1.svg" alt="" width={20} height={20} />
              </a>
              <a href="#" className="opacity-90 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-2.svg" alt="" width={20} height={20} />
              </a>
              <a href="#" className="opacity-90 transition-opacity hover:opacity-100" aria-label="Social">
                <Image src="/assets/figma/footer-social-3.svg" alt="" width={20} height={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-base font-semibold text-[#f5f0e8] [font-family:var(--font-playfair)]">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-[rgba(245,240,232,0.8)] [font-family:var(--font-dm-sans)]">
              {quickLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-[#f5f0e8]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-base font-semibold text-[#f5f0e8] [font-family:var(--font-playfair)]">Property Types</h4>
            <ul className="flex flex-col gap-2 text-sm text-[rgba(245,240,232,0.8)] [font-family:var(--font-dm-sans)]">
              {propertyTypes.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-[#f5f0e8]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex max-w-[330px] flex-col gap-4">
            <h4 className="text-base font-semibold text-[#f5f0e8] [font-family:var(--font-playfair)]">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm text-[rgba(245,240,232,0.8)] [font-family:var(--font-dm-sans)]">
              <li className="flex gap-2">
                <Image src="/assets/figma/footer-icon-location.svg" alt="" width={20} height={20} className="mt-0.5 shrink-0" />
                <span>Plot 15, Admiralty Way, Lekki Phase 1, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-phone.svg" alt="" width={20} height={20} className="shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-[#f5f0e8]">
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-email.svg" alt="" width={20} height={20} className="shrink-0" />
                <a href="mailto:info@bocrealestate.com" className="hover:text-[#f5f0e8]">
                  info@bocrealestate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(245,240,232,0.1)] pt-8 text-center text-sm text-[rgba(245,240,232,0.8)] [font-family:var(--font-dm-sans)]">
          © 2026 BOC Real Estate Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
