"use client";

import Link from "next/link";
import { AnimateIn } from "@/components/common/animate-in";

export function CtaSection() {
  return (
    <section className="w-full bg-[#2a478d] py-10 sm:py-14 lg:py-20">
      <AnimateIn animation="scale-in" className="mx-auto flex max-w-[1440px] flex-col items-center gap-[13px] px-6 sm:gap-5 sm:px-10 lg:gap-7 lg:px-8">

        <h2 className="text-center text-[21.5px] font-medium leading-[1.06] text-white sm:text-[32px] lg:text-[48px] lg:leading-none [font-family:var(--font-playfair)]">
          Ready to Find Your Dream Home?
        </h2>

        <p className="max-w-[320px] text-center text-xs leading-relaxed text-white/90 sm:max-w-[500px] sm:text-sm lg:max-w-[672px] lg:text-xl lg:leading-[1.4] [font-family:var(--font-dm-sans)]">
          Connect with our expert agents today and take the first step towards your ideal property.
        </p>

        <div className="mt-1 flex flex-row items-center justify-center gap-[7.6px] sm:gap-4 lg:mt-2 lg:gap-4">
          <Link
            href="/properties"
            className="flex h-9 items-center justify-center rounded-md bg-[#1a1a1a] px-4 text-xs font-semibold text-[#f5f0e8] transition-transform duration-200 hover:scale-105 sm:h-10 sm:px-6 sm:text-sm lg:h-14 lg:min-w-[205px] lg:px-8 lg:text-base [font-family:var(--font-dm-sans)]"
          >
            Browse Properties
          </Link>
          <Link
            href="/contact"
            className="flex h-9 items-center justify-center rounded-md bg-white px-4 text-xs font-semibold text-[#2a478d] transition-transform duration-200 hover:scale-105 sm:h-10 sm:px-6 sm:text-sm lg:h-14 lg:min-w-[150px] lg:px-8 lg:text-base [font-family:var(--font-dm-sans)]"
          >
            Contact Us
          </Link>
        </div>

      </AnimateIn>
    </section>
  );
}
