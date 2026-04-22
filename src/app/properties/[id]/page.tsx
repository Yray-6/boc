import { notFound } from "next/navigation";
import Link from "next/link";
import { PropertyImageCarousel } from "@/components/properties/property-image-carousel";
import { PropertyDetailInfo } from "@/components/properties/property-detail-info";
import { PropertyContactCard, type PropertyAgent } from "@/components/properties/property-contact-card";
import { SimilarProperties } from "@/components/properties/similar-properties";
import { SiteFooter } from "@/components/home/site-footer";
import { DetailPageNav } from "@/components/properties/detail-page-nav";
import { publicGetPropertyDetail } from "@/server/public-properties-api";
import {
  mapPublicDetailToProperty,
  mapPublicDetailToImageUrls,
  mapPublicListItemToProperty,
} from "@/lib/public-property-mapper";
import type { AdminPropertyDetail } from "@/types/admin-property";
import type { PublicPropertyListItem } from "@/types/public-property";

export const dynamic = "force-dynamic";

function isPropertyDetailPayload(data: unknown): data is AdminPropertyDetail {
  return (
    data !== null &&
    typeof data === "object" &&
    "slug" in data &&
    "title" in data &&
    "listing_type" in data
  );
}

function extractAgent(detail: AdminPropertyDetail): PropertyAgent | null {
  const raw = detail.agent;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const a = raw as Record<string, unknown>;
  const fullName = typeof a.full_name === "string" ? a.full_name : "";
  if (!fullName) return null;
  return {
    full_name: fullName,
    title: typeof a.title === "string" ? a.title : undefined,
    specialisation: typeof a.specialisation === "string" ? a.specialisation : undefined,
    years_of_experience: typeof a.years_of_experience === "number" ? a.years_of_experience : undefined,
    phone: typeof a.phone === "string" ? a.phone : undefined,
    whatsapp_link: typeof a.whatsapp_link === "string" ? a.whatsapp_link : undefined,
    avatar_url: typeof a.avatar_url === "string" ? a.avatar_url : null,
  };
}

function extractSimilarFromDetail(detail: AdminPropertyDetail, currentSlug: string) {
  const raw = (detail as unknown as Record<string, unknown>).similar_properties;
  if (!Array.isArray(raw)) return null;
  return (raw as PublicPropertyListItem[])
    .filter((r) => r.slug !== currentSlug)
    .map((r) => mapPublicListItemToProperty(r))
    .slice(0, 3);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id: slug } = await params;
  if (!slug) notFound();

  let detailRes;
  try {
    detailRes = await publicGetPropertyDetail(slug);
  } catch {
    notFound();
  }

  if (!detailRes.ok || !isPropertyDetailPayload(detailRes.data)) {
    notFound();
  }

  const detail = detailRes.data;
  const propertyId = typeof (detail as { id?: unknown }).id === "number"
    ? (detail as { id: number }).id
    : undefined;
  const property = mapPublicDetailToProperty(detail);
  const images = mapPublicDetailToImageUrls(detail);
  const agent = extractAgent(detail);

  // Use similar_properties embedded in the detail response; fall back to []
  const similarItems = extractSimilarFromDetail(detail, slug) ?? [];

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <DetailPageNav />

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
            <PropertyImageCarousel images={images} title={property.title} type={property.type} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[85px]">
        <Link
          href="/properties"
          className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2a478d] hover:underline lg:hidden [font-family:var(--font-dm-sans)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Properties
        </Link>

        <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 min-w-0">
            <PropertyDetailInfo property={property} />
          </div>
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <PropertyContactCard
              agent={agent}
              propertyId={propertyId}
              propertyTitle={property.title}
            />
          </div>
        </div>

        <SimilarProperties items={similarItems} />
      </div>

      <SiteFooter />
    </main>
  );
}
