import { upstreamGet } from "@/server/upstream";
import type { AdminPropertyDetail } from "@/types/admin-property";
import type { AdminAmenity } from "@/types/admin-catalog";
import type {
  PublicPropertyListItem,
  PublicPropertyPaginatedResponse,
} from "@/types/public-property";
import type { SiteSettings } from "@/types/site-settings";

function withQuery(path: string, searchParams: URLSearchParams | string): string {
  const qs = typeof searchParams === "string" ? searchParams : searchParams.toString();
  if (!qs) return path;
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}${qs}`;
}

/** Featured listings (paginated). */
export function publicListFeatured(searchParams?: URLSearchParams | string) {
  const base = "/api/v1/properties/featured/";
  return upstreamGet<PublicPropertyPaginatedResponse | unknown>(
    searchParams ? withQuery(base, searchParams) : base,
  );
}

/** All properties with filters (paginated). */
export function publicListProperties(searchParams?: URLSearchParams | string) {
  const base = "/api/v1/properties/";
  return upstreamGet<PublicPropertyPaginatedResponse | unknown>(
    searchParams ? withQuery(base, searchParams) : base,
  );
}

export function publicListSimilar(slug: string) {
  return upstreamGet<PublicPropertyListItem[] | unknown>(
    `/api/v1/properties/${encodeURIComponent(slug)}/similar/`,
  );
}

/** Property detail for public site (same schema as admin detail when authenticated). */
export function publicGetPropertyDetail(slug: string) {
  return upstreamGet<AdminPropertyDetail | unknown>(
    `/api/v1/properties/${encodeURIComponent(slug)}/`,
  );
}

/** Listing videos when the backend exposes `GET …/properties/{slug}/videos/` (with or without trailing slash). */
export async function publicGetPropertyVideos(slug: string) {
  const enc = encodeURIComponent(slug);
  const withSlash = await upstreamGet<unknown>(`/api/v1/properties/${enc}/videos/`);
  if (withSlash.ok || withSlash.status !== 404) return withSlash;
  return upstreamGet<unknown>(`/api/v1/properties/${enc}/videos`);
}

/** Optional catalog for amenity filter IDs (omit if backend has no public route). */
export function publicListAmenities() {
  return upstreamGet<AdminAmenity[] | unknown>("/api/v1/amenities/");
}

/** Public site settings — company name, email, phone, social URLs, logo. */
export function publicGetSiteSettings() {
  return upstreamGet<SiteSettings | unknown>("/api/v1/site-settings/", {
    headers: {
      "Cache-Control": "no-cache, no-store",
      Pragma: "no-cache",
    },
  });
}
