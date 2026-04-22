import { PropertiesHero } from "@/components/properties/properties-hero";
import { PropertiesListing } from "@/components/properties/properties-listing";
import { SiteFooter } from "@/components/home/site-footer";
import { publicListProperties, publicListAmenities } from "@/server/public-properties-api";
import { buildPropertiesListSearchParams } from "@/lib/public-properties-query";
import { DEFAULT_FILTER_STATE, type FilterState } from "@/components/properties/properties-filters";
import { mapPublicListItemToProperty } from "@/lib/public-property-mapper";
import { normalizeAmenityOptions } from "@/lib/normalize-amenity-options";
import type { PublicPropertyListItem, PublicPropertyPaginatedResponse } from "@/types/public-property";

const PAGE_SIZE = 12;

const LISTING_TYPE_LABELS: Record<string, string> = {
  BUY: "Buy",
  RENT: "Rent",
  LEASE: "Lease",
  SHORT_LET: "Short let",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function str(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  // Map URL params → FilterState seed
  const listingTypeRaw = str(sp.listing_type).toUpperCase();
  const seedFilters: Partial<Omit<FilterState, "amenityIds">> = {
    propertyType: LISTING_TYPE_LABELS[listingTypeRaw] ?? "All Types",
    state: str(sp.state),
    location: str(sp.search),
    priceMin: str(sp.price_min),
    priceMax: str(sp.price_max),
  };

  let amenityOptions = normalizeAmenityOptions([]);
  try {
    const amRes = await publicListAmenities();
    if (amRes.ok) amenityOptions = normalizeAmenityOptions(amRes.data);
  } catch {
    /* optional public amenities catalog */
  }

  let initialProperties: ReturnType<typeof mapPublicListItemToProperty>[] = [];
  let count = 0;
  let totalPages = 1;
  let page = 1;

  try {
    const merged: FilterState = {
      ...DEFAULT_FILTER_STATE,
      ...seedFilters,
      amenityIds: new Set(),
    };
    const qs = buildPropertiesListSearchParams(merged, "newest", 1, PAGE_SIZE);
    const res = await publicListProperties(qs);
    if (res.ok && res.data && typeof res.data === "object" && "results" in res.data) {
      const data = res.data as PublicPropertyPaginatedResponse;
      initialProperties = (data.results ?? []).map((r) =>
        mapPublicListItemToProperty(r as PublicPropertyListItem),
      );
      count = typeof data.count === "number" ? data.count : initialProperties.length;
      totalPages = typeof data.total_pages === "number" ? data.total_pages : 1;
      page = typeof data.current_page === "number" ? data.current_page : 1;
    }
  } catch {
    /* upstream error */
  }

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <PropertiesHero foundCount={count} />
      <div className="-mt-8 lg:mt-0">
        <PropertiesListing
          initialProperties={initialProperties}
          initialCount={count}
          initialTotalPages={totalPages}
          initialPage={page}
          pageSize={PAGE_SIZE}
          amenityOptions={amenityOptions}
          seedFilters={seedFilters}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
