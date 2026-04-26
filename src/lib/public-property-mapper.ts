import type { Property, PropertyType } from "@/data/home";
import type { AdminPropertyAmenity, AdminPropertyDetail, AdminPropertyImage } from "@/types/admin-property";
import type { PublicPropertyListItem } from "@/types/public-property";

function listingTypeToPropertyType(listingType: string): PropertyType {
  const u = listingType.toUpperCase();
  if (u === "BUY" || u === "RENT" || u === "LEASE" || u === "SHORT_LET") {
    return u as PropertyType;
  }
  return "BUY";
}

function formatLocation(row: Pick<PublicPropertyListItem, "neighborhood" | "city" | "state" | "address">): string {
  const parts = [row.neighborhood, row.city, row.state].filter((p) => p && String(p).trim());
  if (parts.length) return parts.join(", ");
  return row.address || "";
}

const PLACEHOLDER_IMAGE = "/assets/figma/property-1.png";

/** Build ordered gallery URLs from featured/list API (primary first, then remaining). */
export function listItemImageUrls(row: PublicPropertyListItem): string[] {
  const primary = row.primary_image?.trim() || "";
  const raw = row.images;

  if (!Array.isArray(raw) || raw.length === 0) {
    return [primary || PLACEHOLDER_IMAGE];
  }

  type LooseImg = { image_url?: string; url?: string; order?: number; is_primary?: boolean };
  const entries: { url: string; order: number; isPrimary: boolean }[] = [];

  for (const item of raw) {
    if (typeof item === "string") {
      const u = item.trim();
      if (u) entries.push({ url: u, order: entries.length, isPrimary: false });
      continue;
    }
    if (item && typeof item === "object") {
      const o = item as LooseImg;
      const url = String(o.image_url ?? o.url ?? "").trim();
      if (!url) continue;
      entries.push({
        url,
        order: typeof o.order === "number" ? o.order : entries.length,
        isPrimary: Boolean(o.is_primary),
      });
    }
  }

  if (entries.length === 0) {
    return [primary || PLACEHOLDER_IMAGE];
  }

  entries.sort((a, b) => a.order - b.order);
  const primaryFirst = [...entries.filter((e) => e.isPrimary), ...entries.filter((e) => !e.isPrimary)];
  let urls = primaryFirst.map((e) => e.url);
  urls = [...new Set(urls)];

  if (primary) {
    const rest = urls.filter((u) => u !== primary);
    return [primary, ...rest];
  }

  return urls.length ? urls : [PLACEHOLDER_IMAGE];
}

export function mapPublicListItemToProperty(row: PublicPropertyListItem): Property {
  const priceDisplay = row.formatted_price?.trim() || row.price || "";
  const images = listItemImageUrls(row);
  const image = images[0] ?? PLACEHOLDER_IMAGE;

  return {
    id: row.slug,
    type: listingTypeToPropertyType(row.listing_type),
    featured: Boolean(row.is_featured),
    title: row.title,
    location: formatLocation(row),
    address: row.address || formatLocation(row),
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    toilets: row.bathrooms ?? 0,
    sqm: Number(row.sqm) || 0,
    parking: Number(row.parking) || 0,
    price: priceDisplay,
    image,
    images,
    propertyType: row.property_type_name || "—",
    yearBuilt: row.created_at ? new Date(row.created_at).getFullYear() : 0,
    status: row.status_display || String(row.status || ""),
    description: "",
    features: [],
  };
}

function normalizeAmenitiesForFeatures(
  amenities: AdminPropertyDetail["amenities"],
): string[] {
  if (!amenities) return [];
  if (typeof amenities === "string") return [amenities];
  if (!Array.isArray(amenities)) return [];
  return amenities
    .map((a) => {
      if (a && typeof a === "object" && "name" in (a as AdminPropertyAmenity)) {
        return String((a as AdminPropertyAmenity).name);
      }
      return typeof a === "string" || typeof a === "number" ? String(a) : "";
    })
    .filter(Boolean);
}

function detailImages(detail: AdminPropertyDetail): string[] {
  const list = detail.images;
  if (!Array.isArray(list) || list.length === 0) {
    return [PLACEHOLDER_IMAGE];
  }
  const sorted = [...list].sort((a, b) => {
    const ao = typeof a.order === "number" ? a.order : 0;
    const bo = typeof b.order === "number" ? b.order : 0;
    return ao - bo;
  });
  const primaryFirst = [...sorted.filter((i) => i.is_primary), ...sorted.filter((i) => !i.is_primary)];
  const urls = primaryFirst.map((i: AdminPropertyImage) => i.image_url).filter(Boolean);
  return urls.length ? urls : [PLACEHOLDER_IMAGE];
}

export function mapPublicDetailToProperty(detail: AdminPropertyDetail): Property {
  const priceDisplay = detail.formatted_price?.trim() || detail.price || "";
  const imgs = detailImages(detail);

  return {
    id: detail.slug,
    type: listingTypeToPropertyType(detail.listing_type),
    featured: Boolean(detail.is_featured),
    title: detail.title,
    location: formatLocation(detail),
    address: detail.address || formatLocation(detail),
    beds: detail.bedrooms ?? 0,
    baths: detail.bathrooms ?? 0,
    toilets: detail.toilets ?? detail.bathrooms ?? 0,
    sqm: Number(detail.sqm) || 0,
    parking: Number(detail.parking) || 0,
    price: priceDisplay,
    image: imgs[0] ?? PLACEHOLDER_IMAGE,
    images: imgs,
    propertyType: detail.property_type_name || "—",
    yearBuilt: detail.year_built ?? 0,
    status: detail.status_display || String(detail.status || ""),
    description: detail.description || "",
    features: normalizeAmenitiesForFeatures(detail.amenities),
  };
}

export function mapPublicDetailToImageUrls(detail: AdminPropertyDetail): string[] {
  return detailImages(detail);
}
