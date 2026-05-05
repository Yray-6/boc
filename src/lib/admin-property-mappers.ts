import type { PropertyDetail } from "@/components/admin/property-details-modal";
import type { PropertyFormValues } from "@/components/admin/property-form-modal";
import { AMENITY_OPTIONS, PROPERTY_TYPES } from "@/lib/property-form-constants";
import {
  formatPriceInputForDisplay,
  stripPriceSeparators,
} from "@/lib/price-input-format";
import type { NormalizedPropertyFormData } from "@/lib/property-form-dropdowns";
import { mapPublicDetailToVideoSlides } from "@/lib/public-property-mapper";
import type {
  AdminPropertyDetail,
  AdminPropertyExistingImage,
  AdminPropertyListItem,
  AdminPropertyWritePayload,
  ListingType,
  PropertyStatus,
} from "@/types/admin-property";

/** Map UI amenity keys to backend integer IDs (adjust to match your API). */
const AMENITY_KEY_TO_API_ID: Record<string, number> = Object.fromEntries(
  AMENITY_OPTIONS.map((a, i) => [a.id, i + 1]),
);

function amenitiesAreNumericIds(dropdowns?: NormalizedPropertyFormData | null): boolean {
  const first = dropdowns?.amenities[0]?.id;
  return typeof first === "string" && /^\d+$/.test(first);
}

const PROPERTY_STATUSES: readonly PropertyStatus[] = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "SOLD",
  "RENTED",
  "LEASED",
] as const;

function isPropertyStatus(s: string): s is PropertyStatus {
  return (PROPERTY_STATUSES as readonly string[]).includes(s);
}

/** Reverse map: API amenity id → form checkbox id (same ordering as `AMENITY_KEY_TO_API_ID`). */
function apiAmenityIdsToFormIds(apiIds: number[]): string[] {
  const byApiId = new Map<number, string>(
    AMENITY_OPTIONS.map((a, i) => [i + 1, a.id]),
  );
  const out: string[] = [];
  for (const id of apiIds) {
    const k = byApiId.get(id);
    if (k) out.push(k);
  }
  return out;
}

/** API requires `title` length 1–255 after trim. */
export function normalizePropertyTitle(raw: string): string {
  const t = raw.trim().slice(0, 255);
  return t.length > 0 ? t : "—";
}

/** Map property type label to API id (1..n by order in PROPERTY_TYPES). */
export function propertyTypeNameToId(name: string): number {
  const idx = (PROPERTY_TYPES as readonly string[]).indexOf(name);
  return idx >= 0 ? idx + 1 : 1;
}

function propertyTypeToApiId(
  value: string,
  dropdowns?: NormalizedPropertyFormData | null,
): number {
  const t = value.trim();
  if (/^\d+$/.test(t)) {
    return Number(t);
  }
  const byId = dropdowns?.propertyTypes.find((p) => p.id === t);
  if (byId && /^\d+$/.test(byId.id)) {
    return Number(byId.id);
  }
  return propertyTypeNameToId(value);
}

function listingTypeFromForm(mode: PropertyFormValues["listingMode"]): ListingType {
  if (mode === "rent") return "RENT";
  if (mode === "lease") return "LEASE";
  if (mode === "short_let") return "SHORT_LET";
  return "BUY";
}

function amenityIdsForApi(
  ids: string[],
  dropdowns?: NormalizedPropertyFormData | null,
): number[] {
  if (amenitiesAreNumericIds(dropdowns)) {
    const out: number[] = [];
    for (const id of ids) {
      const n = Number(id);
      if (Number.isFinite(n)) out.push(n);
    }
    return out;
  }
  const out: number[] = [];
  for (const id of ids) {
    const n = AMENITY_KEY_TO_API_ID[id];
    if (typeof n === "number") out.push(n);
  }
  return out;
}

/** Human-readable amenity labels for display (supports API object[], number[], or string forms). */
function amenitiesLabelsForDisplay(
  raw: AdminPropertyDetail["amenities"],
  dropdowns?: NormalizedPropertyFormData | null,
): string[] {
  if (Array.isArray(raw) && raw.length > 0) {
    if (raw.every((x) => x !== null && typeof x === "object" && "name" in x)) {
      return (raw as { name: string }[]).map((x) => x.name).filter(Boolean);
    }
    if (raw.every((x) => typeof x === "number")) {
      if (amenitiesAreNumericIds(dropdowns)) {
        const idToLabel = new Map(
          (dropdowns?.amenities ?? []).map((a) => [a.id, a.label]),
        );
        return (raw as number[])
          .map((id) => idToLabel.get(String(id)))
          .filter((x): x is string => x !== undefined);
      }
      const idToLabel = new Map<number, string>(
        AMENITY_OPTIONS.map((a, i) => [i + 1, a.label]),
      );
      return (raw as number[])
        .map((id) => idToLabel.get(id))
        .filter((x): x is string => x !== undefined);
    }
  }
  return parseAmenityLabels(raw);
}

function parseAmenityLabels(raw: AdminPropertyDetail["amenities"]): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string");
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(/[,|]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/** Best-effort map API amenities (object[], number[], or labels) back to form checkbox ids. */
export function amenityFormIdsFromDetail(
  raw: AdminPropertyDetail["amenities"],
  dropdowns?: NormalizedPropertyFormData | null,
): string[] {
  if (Array.isArray(raw) && raw.length > 0) {
    if (raw.every((x) => x !== null && typeof x === "object" && "id" in x)) {
      const objects = raw as { id: number | string }[];
      if (amenitiesAreNumericIds(dropdowns)) {
        return objects.map((x) => String(x.id));
      }
      return apiAmenityIdsToFormIds(objects.map((x) => Number(x.id)));
    }
    if (raw.every((x) => typeof x === "number")) {
      if (amenitiesAreNumericIds(dropdowns)) {
        return (raw as number[]).map((id) => String(id));
      }
      return apiAmenityIdsToFormIds(raw as number[]);
    }
  }
  const labels = parseAmenityLabels(raw);
  const labelToId = new Map<string, string>(
    AMENITY_OPTIONS.map((a) => [a.label, a.id]),
  );
  const out: string[] = [];
  for (const l of labels) {
    const id = labelToId.get(l);
    if (id !== undefined) out.push(id);
  }
  return out;
}

export function agentIdFromDetail(agent: AdminPropertyDetail["agent"]): string {
  if (typeof agent === "number" && Number.isFinite(agent)) return String(agent);
  if (agent && typeof agent === "object" && "id" in agent) {
    const id = (agent as { id: unknown }).id;
    if (typeof id === "number" && Number.isFinite(id)) return String(id);
  }
  return "";
}

const CREATE_DEFAULTS = {
  address: "—",
  neighborhood: "—",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  latitude: "0",
  longitude: "0",
  bedrooms: 0,
  bathrooms: 0,
  toilets: 0,
  sqm: 0,
  parking: 0,
  year_built: new Date().getFullYear(),
} as const;

export function formValuesToWritePayload(
  values: PropertyFormValues,
  existing: AdminPropertyDetail | null,
  dropdowns?: NormalizedPropertyFormData | null,
): AdminPropertyWritePayload {
  const listing_type = listingTypeFromForm(values.listingMode);
  const agentNum = values.agentId ? Number(values.agentId) : 0;
  const existingAgentId =
    existing?.agent && typeof existing.agent === "object" && "id" in existing.agent
      ? (existing.agent as { id: number }).id
      : typeof existing?.agent === "number"
        ? existing.agent
        : 0;
  const agent =
    Number.isFinite(agentNum) && agentNum > 0 ? agentNum : existingAgentId;

  const base = existing
    ? {
        address: existing.address,
        neighborhood: existing.neighborhood,
        city: existing.city,
        state: existing.state,
        country: existing.country,
        latitude: existing.latitude,
        longitude: existing.longitude,
        bedrooms: existing.bedrooms,
        bathrooms: existing.bathrooms,
        toilets: existing.toilets,
        sqm: existing.sqm,
        parking: existing.parking,
        year_built: existing.year_built,
      }
    : CREATE_DEFAULTS;

  const rawExistingStatus = existing?.status;
  const status: PropertyStatus =
    typeof values.status === "string" && isPropertyStatus(values.status)
      ? values.status
      : typeof rawExistingStatus === "string" &&
          isPropertyStatus(rawExistingStatus)
        ? rawExistingStatus
        : "DRAFT";

  return {
    amenities: amenityIdsForApi(values.amenityIds, dropdowns),
    title: normalizePropertyTitle(values.title),
    listing_type,
    status,
    is_featured: values.featured,
    price: (() => {
      const s = stripPriceSeparators(values.price);
      if (!s || s === ".") return "0";
      return s;
    })(),
    address: values.address?.trim() || base.address,
    neighborhood: values.neighborhood?.trim() || base.neighborhood,
    city: values.city?.trim() || base.city,
    state: values.state?.trim() || base.state,
    country: base.country,
    latitude: base.latitude,
    longitude: base.longitude,
    bedrooms: values.bedrooms ?? base.bedrooms,
    bathrooms: values.bathrooms ?? base.bathrooms,
    toilets: values.toilets ?? base.toilets,
    sqm: values.sqm ?? base.sqm,
    parking: values.parking ?? base.parking,
    year_built: values.yearBuilt ?? base.year_built,
    description: values.description,
    property_type: propertyTypeToApiId(values.propertyType, dropdowns),
    agent,
  };
}

function existingImagesFromDetail(d: AdminPropertyDetail): AdminPropertyExistingImage[] {
  const list = d.images;
  if (!Array.isArray(list) || list.length === 0) return [];
  const sorted = [...list].sort((a, b) => {
    const ao = typeof a.order === "number" ? a.order : 0;
    const bo = typeof b.order === "number" ? b.order : 0;
    return ao - bo;
  });
  const primaryFirst = [...sorted.filter((i) => i.is_primary), ...sorted.filter((i) => !i.is_primary)];
  return primaryFirst.map((img) => ({
    id: img.id,
    image_url: img.image_url,
    caption: img.caption,
    is_primary: img.is_primary,
    order: img.order,
  }));
}

export function detailToFormValues(
  d: AdminPropertyDetail,
  dropdowns?: NormalizedPropertyFormData | null,
): PropertyFormValues {
  let propertyType: string;
  if (
    typeof d.property_type === "number" &&
    Number.isFinite(d.property_type) &&
    dropdowns?.propertyTypes.some((p) => p.id === String(d.property_type))
  ) {
    propertyType = String(d.property_type);
  } else {
    const match = dropdowns?.propertyTypes.find(
      (p) => p.label === d.property_type_name,
    );
    propertyType =
      match?.id ??
      dropdowns?.propertyTypes[0]?.id ??
      (PROPERTY_TYPES.find((t) => t === d.property_type_name) ??
        PROPERTY_TYPES[0]);
  }
  return {
    title: d.title,
    propertyType,
    featured: d.is_featured,
    description: d.description ?? "",
    agentId: agentIdFromDetail(d.agent),
    amenityIds: amenityFormIdsFromDetail(d.amenities, dropdowns),
    price: formatPriceInputForDisplay(
      String(d.price ?? "").replace(/[^\d.]/g, "") || "0",
    ),
    listingMode:
      d.listing_type === "RENT"
        ? "rent"
        : d.listing_type === "LEASE"
          ? "lease"
          : d.listing_type === "SHORT_LET"
            ? "short_let"
            : "buy",
    status:
      typeof d.status === "string" && isPropertyStatus(d.status)
        ? d.status
        : "DRAFT",
    images: [],
    existingImages: existingImagesFromDetail(d),
    videos: [],
    videoThumbnail: null,
    videoTitle: "",
    bedrooms: d.bedrooms ?? 0,
    bathrooms: d.bathrooms ?? 0,
    toilets: d.toilets ?? 0,
    yearBuilt: d.year_built ?? new Date().getFullYear(),
    sqm: d.sqm ?? 0,
    parking: d.parking ?? 0,
    address: d.address === "—" ? "" : (d.address ?? ""),
    neighborhood: d.neighborhood === "—" ? "" : (d.neighborhood ?? ""),
    city: d.city ?? "Lagos",
    state: d.state ?? "Lagos",
  };
}

export function detailToPropertyDetail(
  d: AdminPropertyDetail,
  dropdowns?: NormalizedPropertyFormData | null,
): PropertyDetail {
  const primary =
    d.images?.find((i) => i.is_primary)?.image_url ?? d.images?.[0]?.image_url;
  const heroImage =
    primary && (primary.startsWith("http") || primary.startsWith("//"))
      ? primary
      : primary
        ? primary
        : "/admin-dashboard/modal-hero.png";

  const locationDisplay =
    [d.neighborhood, d.city, d.state].filter(Boolean).join(", ") ||
    d.address ||
    "—";

  const amenities = amenitiesLabelsForDisplay(d.amenities, dropdowns);
  const agentName =
    d.agent && typeof d.agent === "object" && "full_name" in d.agent
      ? ((d.agent as { full_name: string }).full_name ?? "—")
      : typeof d.agent === "string"
        ? d.agent
        : (d.agent_name ?? "—");

  return {
    id: d.slug,
    title: d.title,
    locationDisplay,
    price: d.formatted_price || d.price,
    modeLabel: d.listing_type_display,
    modeKind:
      d.listing_type === "RENT" ||
      d.listing_type === "LEASE" ||
      d.listing_type === "SHORT_LET"
        ? "rent"
        : "buy",
    heroImage,
    videos: mapPublicDetailToVideoSlides(d),
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    area: `${d.sqm ?? 0} sqm`,
    parking: d.parking ?? 0,
    description: d.description ?? "",
    amenities: amenities.length ? amenities : ["—"],
    agentName,
    agentTitle: "Property agent",
    agentAvatar: "/admin-dashboard/modal-agent-avatar-56586a.png",
  };
}

export type PropertyTableRow = {
  slug: string;
  title: string;
  agentName: string;
  locationLine1: string;
  locationLine2: string;
  type: string;
  mode: { kind: "buy" | "rent"; label: string };
  price: string;
  tableThumb: string;
  status: string;
  statusDisplay: string;
};

export function listItemToTableRow(item: AdminPropertyListItem): PropertyTableRow {
  const line1 = item.neighborhood || item.address || "—";
  const line2 = [item.city, item.state].filter(Boolean).join(", ") || "—";
  const isRent =
    item.listing_type === "RENT" ||
    item.listing_type === "LEASE" ||
    item.listing_type === "SHORT_LET";
  const thumb =
    item.primary_image?.startsWith("http") || item.primary_image?.startsWith("//")
      ? item.primary_image
      : "/admin-dashboard/dash-thumb-1-36497e.png";

  return {
    slug: item.slug,
    title: item.title,
    agentName: item.agent_name || "—",
    locationLine1: line1,
    locationLine2: line2,
    type: item.property_type_name || "—",
    mode: {
      kind: isRent ? "rent" : "buy",
      label: item.listing_type_display || (isRent ? "Rent" : "Buy"),
    },
    price: item.formatted_price || item.price,
    tableThumb: thumb,
    status: item.status,
    statusDisplay: item.status_display || item.status,
  };
}
