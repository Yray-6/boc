import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { properties } from "@/data/home";
import { PropertyImageCarousel } from "@/components/properties/property-image-carousel";
import { PropertyDetailInfo } from "@/components/properties/property-detail-info";
import { PropertyContactCard } from "@/components/properties/property-contact-card";
import { SimilarProperties } from "@/components/properties/similar-properties";
import { SiteFooter } from "@/components/home/site-footer";
import { DetailPageNav } from "@/components/properties/detail-page-nav";

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
      {/* Nav — desktop pill + mobile hamburger */}
      <DetailPageNav />

      {/* Carousel — full-bleed on mobile, padded on desktop */}
      <div className="mt-0">
        <div className="lg:mx-auto lg:max-w-[1440px] lg:px-[85px]">
          <div className="mt-4 hidden lg:block">
            <Link
              href="/properties"
              className="flex items-center gap-2 text-sm font-medium text-[#2a478d] hover:underline [font-family:var(--font-dm-sans)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Properties
            </Link>
          </div>
          <div className="mt-4 lg:mt-6">
            <PropertyImageCarousel
              images={[property.image]}
              title={property.title}
              type={property.type}
            />
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[85px]">
        {/* Mobile back link — shown below image */}
        <Link
          href="/properties"
          className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2a478d] hover:underline lg:hidden [font-family:var(--font-dm-sans)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Properties
        </Link>

        {/* Two-column: info + contact */}
        <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 min-w-0">
            <PropertyDetailInfo property={property} />
          </div>
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <PropertyContactCard />
          </div>
        </div>

        <SimilarProperties current={property} all={properties} />
      </div>

      <SiteFooter />
    </main>
  );
}
