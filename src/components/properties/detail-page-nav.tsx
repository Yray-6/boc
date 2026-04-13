"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SiteDesktopNavPill,
  SiteMobileNav,
} from "@/components/layout/site-navigation";

export function DetailPageNav() {
  return (
    <header className="relative w-full px-4 pt-4 sm:px-6 lg:px-[85px]">
      <div className="relative mx-auto flex h-[50px] w-full max-w-[1440px] items-center justify-between lg:h-[60px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/figma/hero-logo.png"
            alt="BOC Real Estate"
            width={90}
            height={50}
            className="h-[32px] w-auto lg:h-[50px]"
          />
        </Link>

        <SiteDesktopNavPill
          active="properties"
          className="absolute left-1/2 z-10 hidden h-[41px] w-[min(630px,calc(100%-12rem))] -translate-x-1/2 items-center justify-center rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] lg:flex"
        />

        <SiteMobileNav
          active="properties"
          hamburgerClassName="shrink-0"
          dropdownTopClassName="top-[58px]"
          size="md"
        />
      </div>
    </header>
  );
}
