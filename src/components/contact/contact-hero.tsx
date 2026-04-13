import Image from "next/image";
import Link from "next/link";
import { SiteNavLinks } from "@/components/layout/site-nav-links";

/** Contact page hero — Figma node 819:7998 */
export function ContactHero() {
  return (
    <div className="relative w-full">
      <div className="relative h-[20dvh] w-full overflow-hidden text-white">
        <Image
          src="/assets/figma/hero-section-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_25%] lg:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#d9d9d9]/40" />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,820px)] bg-linear-to-r from-[#ececec] via-[#ececec]/65 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto h-full w-full max-w-[1440px] px-4 sm:px-6 lg:px-[85px]">
          <Link href="/" className="absolute left-4 top-3 z-10 block sm:left-6 lg:left-[85px] lg:top-4">
            <Image
              src="/assets/figma/hero-logo.png"
              alt="BOC Real Estate"
              width={90}
              height={50}
              className="h-9 w-auto sm:h-10 lg:h-[50px] lg:w-[90px]"
            />
          </Link>

          <div className="absolute left-1/2 top-3 z-10 flex h-9 w-[min(630px,calc(100%-2rem))] -translate-x-1/2 items-center rounded-[20px] bg-white px-2 sm:h-[41px] lg:top-[29px]">
            <nav className="flex w-full items-center justify-center gap-4 text-xs sm:gap-8 sm:text-sm lg:gap-[70px] [font-family:var(--font-urbanist)]">
              <SiteNavLinks active="contact" />
            </nav>
          </div>

          <div className="absolute bottom-3 left-4 z-10 max-w-[min(100%,600px)] pr-2 sm:bottom-4 sm:left-6 lg:bottom-5 lg:left-[85px]">
            <h1 className="text-xl font-medium leading-tight text-[#2a478d] sm:text-2xl md:text-3xl lg:text-4xl [font-family:var(--font-playfair)]">
              Contact Us
            </h1>
            <p className="mt-0.5 text-xs font-normal leading-snug text-white [text-shadow:0_0_24px_rgba(0,0,0,0.9),0_1px_4px_rgba(0,0,0,0.6)] sm:mt-1 sm:text-sm lg:text-base [font-family:var(--font-urbanist)]">
              You can reach out to us via the available channels below
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
