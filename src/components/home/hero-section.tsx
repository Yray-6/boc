"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SiteDesktopNavPill,
  SiteMobileNav,
} from "@/components/layout/site-navigation";
import { HeroSearchCard } from "./hero-search-card";

export function HeroSection() {
  return (
    <>
      <div className="relative w-full">
        <div className="relative h-[452px] w-full overflow-hidden text-white sm:h-[600px] lg:h-[821px]">
          <Image
            src="/assets/figma/hero-section-bg.png"
            alt="BOC Real Estate hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#d9d9d9]/40" />

          <div className="relative mx-auto h-full w-full max-w-[1440px]">

            {/* ── Logo (both mobile + desktop) ── */}
            <Link
              href="/"
              className="absolute left-4 top-4 z-20 block sm:left-6 lg:left-[85px] lg:top-[25px]"
            >
              <Image
                src="/assets/figma/hero-logo.png"
                alt="BOC Real Estate"
                width={90}
                height={50}
                className="h-[25px] w-auto sm:h-[35px] lg:h-[50px] lg:w-[90px]"
              />
            </Link>

            {/* ── Desktop: pill nav + Browse Properties ── */}
            <SiteDesktopNavPill
              active="home"
              className="absolute left-1/2 top-[29px] z-10 hidden h-[41px] w-[630px] -translate-x-1/2 rounded-[20px] bg-white lg:block"
            />
            <Link
              href="/properties"
              className="absolute right-[85px] top-[29px] z-10 hidden h-[41px] items-center rounded-md bg-[#2a478d] px-8 text-base font-semibold text-[#f5f0e8] lg:flex"
            >
              Browse Properties
            </Link>

            <SiteMobileNav
              active="home"
              hamburgerClassName="absolute right-4 top-4 z-30"
            />

            {/* ── Title ── */}
            <h1 className="absolute left-1/2 top-[112px] z-10 w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[32px] font-medium leading-[0.86] text-[#2a478d] sm:top-[160px] sm:text-[52px] lg:top-[226px] lg:w-[1174px] lg:text-[88px] lg:leading-[1.09] [font-family:var(--font-playfair)]">
              Claim Your Space.
              <br />
              Define Your Life.
            </h1>

            {/* ── Description ── */}
            <div className="absolute left-1/2 top-[187px] z-10 w-[calc(100%-2rem)] -translate-x-1/2 text-center sm:top-[260px] lg:top-[438px] lg:w-[871px]">
              <p className="text-xs leading-relaxed text-white [text-shadow:0_0_10px_rgba(0,0,0,1)] sm:text-sm sm:leading-normal lg:text-xl lg:leading-[1.6]">
                Discover spaces that go beyond walls and structures—thoughtfully crafted environments where your ambitions can
                thrive, your lifestyle is elevated, and every moment feels like a step toward the life you&apos;ve always
                envisioned.
              </p>
            </div>
          </div>
        </div>

        <HeroSearchCard />
      </div>

      {/* Spacer below search card overlap */}
      <div className="h-[220px] sm:h-[200px] lg:h-[105px]" />
    </>
  );
}
