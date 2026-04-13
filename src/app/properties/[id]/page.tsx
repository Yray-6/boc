import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { properties } from "@/data/home";
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { PropertyImageCarousel } from "@/components/properties/property-image-carousel";
import { PropertyDetailInfo } from "@/components/properties/property-detail-info";
import { PropertyContactCard } from "@/components/properties/property-contact-card";
import { SimilarProperties } from "@/components/properties/similar-properties";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsAppFab } from "@/components/home/whatsapp-fab";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Navbar */}
      <div className="w-full px-4 pt-4 sm:px-6 lg:px-[85px]">
        <div className="relative mx-auto flex h-[60px] w-full max-w-[1440px] items-center">
          <Link href="/" className="shrink-0">
            <Image src="/assets/figma/hero-logo.png" alt="BOC Real Estate" width={90} height={50} className="h-[50px] w-[90px]" />
          </Link>
          <div className="absolute left-1/2 z-10 flex h-[41px] w-[min(630px,calc(100%-12rem))] -translate-x-1/2 items-center justify-center rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <nav className="flex h-full items-center justify-center gap-6 text-sm sm:gap-10 lg:gap-[70px] [font-family:var(--font-urbanist)]">
              <SiteNavLinks active="properties" />
            </nav>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[85px]">
        {/* Back link */}
        <Link
          href="/properties"
          className="mt-6 flex items-center gap-2 text-sm font-medium text-[#2a478d] hover:underline [font-family:var(--font-dm-sans)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Properties
        </Link>

        {/* Hero image */}
        <div className="mt-6">
          <PropertyImageCarousel
            images={[property.image]}
            title={property.title}
            type={property.type}
          />
        </div>

        {/* Two-column: info + contact */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: detail info */}
          <div className="flex-1 min-w-0">
            <PropertyDetailInfo property={property} />
          </div>

          {/* Right: contact card */}
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <PropertyContactCard />
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties current={property} all={properties} />
      </div>

      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
