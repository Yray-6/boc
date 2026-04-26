import Image from "next/image";
import Link from "next/link";
import { publicGetSiteSettings } from "@/server/public-properties-api";
import type { SiteSettings } from "@/types/site-settings";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "/contact" },
] as const;

const propertyTypes = ["Apartments", "Duplexes", "Terraces", "Commercial", "Land"] as const;

function isSiteSettings(v: unknown): v is SiteSettings {
  return !!v && typeof v === "object" && "company_name" in v;
}

/** Social icon SVGs keyed by platform */
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function buildSocialLinks(s: SiteSettings): SocialLink[] {
  const links: SocialLink[] = [];
  if (s.instagram) links.push({ href: s.instagram, label: "Instagram", icon: <InstagramIcon /> });
  if (s.facebook)  links.push({ href: s.facebook,  label: "Facebook",  icon: <FacebookIcon />  });
  if (s.twitter)   links.push({ href: s.twitter,   label: "Twitter/X", icon: <TwitterIcon />   });
  if (s.linkedin)  links.push({ href: s.linkedin,  label: "LinkedIn",  icon: <LinkedInIcon />  });
  return links;
}

/** Returns the default 3 social icons pointing nowhere when settings are unavailable. */
function FallbackSocials() {
  return (
    <>
      <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
        <Image src="/assets/figma/footer-social-1.svg" alt="" width={20} height={20} />
      </a>
      <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
        <Image src="/assets/figma/footer-social-2.svg" alt="" width={20} height={20} />
      </a>
      <a href="#" className="opacity-80 transition-opacity hover:opacity-100" aria-label="Social">
        <Image src="/assets/figma/footer-social-3.svg" alt="" width={20} height={20} />
      </a>
    </>
  );
}

export async function SiteFooter() {
  let settings: SiteSettings | null = null;
  try {
    const res = await publicGetSiteSettings();
    if (res.ok && isSiteSettings(res.data)) settings = res.data;
  } catch {
    /* use fallback values */
  }

  const companyName = settings?.company_name || "BOC Real Estate Limited";
  const email       = settings?.primary_email || "info@bocrealestate.com";
  const phone       = settings?.phone_number  || "+2348012345678";
  const socialLinks = settings ? buildSocialLinks(settings) : null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1a1a1a]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 pb-8 pt-10 sm:px-6 sm:gap-10 lg:gap-12 lg:px-8 lg:pb-10 lg:pt-16">

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 xl:gap-x-[76px]">

          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-2 lg:col-span-1 lg:max-w-[330px]">
            <p className="text-[18px] font-bold text-[#f5f0e8] sm:text-xl lg:text-2xl [font-family:var(--font-dm-sans)]">
              {companyName}
            </p>
            <p className="text-xs leading-relaxed text-[rgba(245,240,232,0.8)] sm:text-sm [font-family:var(--font-dm-sans)]">
              Nigeria&apos;s premier luxury real estate platform, connecting discerning clients with exceptional properties since 2021.
            </p>
            <div className="flex gap-3 pt-1 text-[rgba(245,240,232,0.8)]">
              {socialLinks && socialLinks.length > 0 ? (
                socialLinks.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="opacity-80 transition-opacity hover:opacity-100"
                  >
                    {icon}
                  </a>
                ))
              ) : (
                <FallbackSocials />
              )}
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
                  <Link
                    href={`/properties?search=${encodeURIComponent(label)}`}
                    className="transition-colors hover:text-[#f5f0e8]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 lg:col-span-1 lg:max-w-[330px]">
            <h4 className="text-sm font-semibold text-[#f5f0e8] lg:text-base [font-family:var(--font-playfair)]">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-[10px] text-xs text-[rgba(245,240,232,0.8)] lg:gap-3 lg:text-sm [font-family:var(--font-dm-sans)]">
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-phone.svg" alt="" width={16} height={16} className="shrink-0 lg:h-5 lg:w-5" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-[#f5f0e8]">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Image src="/assets/figma/footer-icon-email.svg" alt="" width={16} height={16} className="shrink-0 lg:h-5 lg:w-5" />
                <a href={`mailto:${email}`} className="break-all transition-colors hover:text-[#f5f0e8]">
                  {email}
                </a>
              </li>
              {settings?.linkedin && (
                <li className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[rgba(245,240,232,0.8)] lg:h-5 lg:w-5">
                    <LinkedInIcon />
                  </span>
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all transition-colors hover:text-[#f5f0e8]"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(245,240,232,0.1)] pt-6 text-center text-[11px] text-[rgba(245,240,232,0.8)] lg:pt-8 lg:text-sm [font-family:var(--font-dm-sans)]">
          © {currentYear} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
