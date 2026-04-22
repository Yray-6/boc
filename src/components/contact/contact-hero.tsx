"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SiteDesktopNavPill,
  SiteMobileNav,
} from "@/components/layout/site-navigation";

/** Contact page hero — desktop pill nav + mobile hamburger, matches Properties hero pattern */
export function ContactHero() {
  return (
    <div className="relative w-full">
      <div className="relative h-[248px] w-full overflow-hidden text-white sm:h-[300px] lg:h-[20dvh] lg:min-h-[200px]">
        <Image
          src="/assets/figma/hero-section-bg.png"
          alt=""
          fill
          priority
          className="animate-fade-in object-cover object-[center_25%] lg:object-[center_20%]"
          style={{ animationDuration: "1.1s" }}
        />
        <div className="absolute inset-0 bg-[#d9d9d9]/40" />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,820px)] bg-linear-to-r from-[#ececec] via-[#ececec]/65 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto h-full w-full max-w-[1440px]">
          {/* Logo */}
          <Link
            href="/"
            className="absolute left-[13px] top-[13px] z-20 block animate-fade-down delay-100 sm:left-6 lg:left-[85px] lg:top-4"
          >
            <Image
              src="/assets/figma/hero-logo.png"
              alt="BOC Real Estate"
              width={90}
              height={50}
              className="h-[25px] w-auto sm:h-9 lg:h-[50px] lg:w-[90px]"
            />
          </Link>

          <SiteDesktopNavPill
            active="contact"
            className="absolute left-1/2 top-3 z-10 hidden h-9 w-[min(630px,calc(100%-12rem))] -translate-x-1/2 animate-fade-down delay-150 items-center rounded-[20px] bg-white px-2 lg:flex lg:top-[29px] lg:h-[41px]"
            navClassName="flex w-full items-center justify-center gap-[70px] text-sm [font-family:var(--font-urbanist)]"
          />

          <SiteMobileNav
            active="contact"
            hamburgerClassName="absolute right-[13px] top-[13px] z-30 animate-fade-down delay-100"
          />

          {/* Title + subtitle */}
          <div className="absolute left-0 right-0 top-[92px] z-10 flex flex-col items-center px-4 text-center lg:bottom-5 lg:left-[85px] lg:right-auto lg:top-auto lg:items-start lg:px-0 lg:text-left">
            <h1
              className="animate-fade-up text-[32px] font-medium leading-[0.86] text-[#2a478d] sm:text-3xl lg:text-4xl [font-family:var(--font-playfair)]"
              style={{ animationDelay: "0.2s" }}
            >
              Contact Us
            </h1>
            <p
              className="mt-1 animate-fade-up text-xs font-normal text-white [text-shadow:0_0_10px_rgba(0,0,0,1)] sm:text-sm lg:text-base [font-family:var(--font-urbanist)]"
              style={{ animationDelay: "0.35s" }}
            >
              You can reach out to us via the available channels below
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
