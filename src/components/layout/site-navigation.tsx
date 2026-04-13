"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SiteNavLinks,
  type SiteNavActive,
} from "@/components/layout/site-nav-links";

const MOBILE_NAV_ITEMS: {
  href: string;
  label: string;
  key: SiteNavActive;
}[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/properties", label: "Properties", key: "properties" },
  { href: "#", label: "About Us", key: "about" },
  { href: "/contact", label: "Contact Us", key: "contact" },
];

function HamburgerGlyph({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M4 4l12 12M16 4L4 16"
          stroke="#1A1A1A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <>
      <span className="block h-0 w-[12px] rounded border-t-[1.5px] border-[#1A1A1A]" />
      <span className="block h-0 w-[18px] rounded border-t-[1.5px] border-[#1A1A1A]" />
      <span className="block h-0 w-[12px] rounded border-t-[1.5px] border-[#1A1A1A]" />
    </>
  );
}

interface SiteDesktopNavPillProps {
  active: SiteNavActive;
  className: string;
  navClassName?: string;
}

/** Centered white pill with the main site links (desktop). */
export function SiteDesktopNavPill({
  active,
  className,
  navClassName = "flex h-full items-center justify-center gap-[70px] text-sm [font-family:var(--font-urbanist)]",
}: SiteDesktopNavPillProps) {
  return (
    <div className={className}>
      <nav className={navClassName}>
        <SiteNavLinks active={active} />
      </nav>
    </div>
  );
}

interface SiteMobileNavProps {
  active: SiteNavActive;
  /** Positioning and any extra classes for the toggle (e.g. absolute corners). */
  hamburgerClassName: string;
  /** Tailwind top offset for the dropdown panel (e.g. `top-[53px]` or `top-[58px]`). */
  dropdownTopClassName?: string;
  /** Hero-style 26×26 vs detail bar 30×30. */
  size?: "sm" | "md";
}

/** Hamburger + slide-down link list; manages open state internally. */
export function SiteMobileNav({
  active,
  hamburgerClassName,
  dropdownTopClassName = "top-[53px]",
  size = "sm",
}: SiteMobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sizeClass = size === "md" ? "h-[30px] w-[30px]" : "h-[26px] w-[26px]";

  return (
    <>
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className={`flex flex-col items-center justify-center gap-[5.25px] rounded-md bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] lg:hidden ${sizeClass} ${hamburgerClassName}`}
      >
        <HamburgerGlyph open={menuOpen} />
      </button>

      {menuOpen && (
        <div
          className={`absolute left-0 right-0 z-40 rounded-b-[10px] bg-white shadow-md lg:hidden ${dropdownTopClassName}`}
        >
          {MOBILE_NAV_ITEMS.map(({ href, label, key }) => {
            const isActive = active === key;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center border-b border-[rgba(0,0,0,0.06)] py-[10px] text-sm last:border-0 [font-family:var(--font-urbanist)] ${
                  isActive
                    ? "font-semibold text-[#2a478d]"
                    : "font-light text-[#1a1a1a]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
