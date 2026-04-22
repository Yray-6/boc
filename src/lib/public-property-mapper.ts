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

export function mapPublicListItemToProperty(row: PublicPropertyListItem): Property {
  const priceDisplay = row.formatted_price?.trim() || row.price || "";
  const image = row.primary_image?.trim() || "/assets/figma/property-1.png";

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
    return ["/assets/figma/property-1.png"];
  }
  const sorted = [...list].sort((a, b) => {
    const ao = typeof a.order === "number" ? a.order : 0;
    const bo = typeof b.order === "number" ? b.order : 0;
    return ao - bo;
  });
  const primaryFirst = [...sorted.filter((i) => i.is_primary), ...sorted.filter((i) => !i.is_primary)];
  const urls = primaryFirst.map((i: AdminPropertyImage) => i.image_url).filter(Boolean);
  return urls.length ? urls : ["/assets/figma/property-1.png"];
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
    image: imgs[0] ?? "/assets/figma/property-1.png",
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
