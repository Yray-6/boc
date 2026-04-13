import Image from "next/image";
import Link from "next/link";
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { HeroSearchCard } from "./hero-search-card";

export function HeroSection() {
  return (
    <>
      <div className="relative w-full">
        <div className="relative h-[821px] w-full overflow-hidden text-white">
          <Image
            src="/assets/figma/hero-section-bg.png"
            alt="BOC Real Estate hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#d9d9d9]/40" />

          <div className="relative mx-auto h-full w-full max-w-[1440px]">
            <Link href="/" className="absolute left-[85px] top-[25px] z-10 block">
              <Image src="/assets/figma/hero-logo.png" alt="BOC Real Estate" width={90} height={50} />
            </Link>

            <div className="absolute left-1/2 top-[29px] z-10 h-[41px] w-[630px] -translate-x-1/2 rounded-[20px] bg-white">
              <nav className="flex h-full items-center justify-center gap-[70px] text-sm [font-family:var(--font-urbanist)]">
                <SiteNavLinks active="home" />
              </nav>
            </div>

            <Link
              href="/properties"
              className="absolute right-[85px] top-[29px] z-10 flex h-[41px] items-center rounded-md bg-[#2a478d] px-8 text-base font-semibold text-[#f5f0e8]"
            >
              Browse Properties
            </Link>

            <h1 className="absolute left-1/2 top-[226px] z-10 w-[1174px] -translate-x-1/2 text-center text-[88px] font-medium leading-[1.09] text-[#2a478d] [font-family:var(--font-playfair)]">
              Claim Your Space.
              <br />
              Define Your Life.
            </h1>

            <div className="absolute left-1/2 top-[438px] z-10 w-[871px] -translate-x-1/2 text-center">
              <p className="text-xl leading-[1.6] text-white [text-shadow:0_0_40px_rgba(0,0,0,1)]">
                Discover spaces that go beyond walls and structures—thoughtfully crafted environments where your ambitions can
                thrive, your lifestyle is elevated, and every moment feels like a step toward the life you&apos;ve always
                envisioned.
              </p>
            </div>
          </div>
        </div>

        <HeroSearchCard />
      </div>

      <div className="h-[105px]" />
    </>
  );
}
