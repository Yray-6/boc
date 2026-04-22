import {
  AGENTS,
  AMENITY_OPTIONS,
  PROPERTY_TYPES,
} from "@/lib/property-form-constants";
import type { ListingMode, PropertyStatus } from "@/types/admin-property";

export type FormDropdownOption = { id: string; label: string };

export type NormalizedPropertyFormData = {
  propertyTypes: FormDropdownOption[];
  agents: FormDropdownOption[];
  amenities: FormDropdownOption[];
  listingModes: Array<{ id: ListingMode; label: string }>;
  statuses: FormDropdownOption[];
};

const DEFAULT_LISTING_MODES: NormalizedPropertyFormData["listingModes"] = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "lease", label: "Lease" },
  { id: "short_let", label: "Short let" },
];

const FALLBACK_STATUSES: PropertyStatus[] = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "SOLD",
  "RENTED",
  "LEASED",
];

export function buildFallbackPropertyFormData(): NormalizedPropertyFormData {
  return {
    propertyTypes: PROPERTY_TYPES.map((t) => ({ id: t, label: t })),
    agents: AGENTS.map((a) => ({ id: a.id, label: a.label })),
    amenities: AMENITY_OPTIONS.map((a) => ({ id: a.id, label: a.label })),
    listingModes: [...DEFAULT_LISTING_MODES],
    statuses: FALLBACK_STATUSES.map((s) => ({ id: s, label: s })),
  };
}

function firstRecord(obj: unknown): Record<string, unknown> | null {
  if (!obj || typeof obj !== "object") return null;
  return obj as Record<string, unknown>;
}

function pickArray(
  root: Record<string, unknown>,
  keys: string[],
): unknown[] | null {
  for (const k of keys) {
    const v = root[k];
    if (Array.isArray(v)) return v;
  }
  return null;
}

function mapToOptions(
  arr: unknown[] | null,
  fallback: FormDropdownOption[],
): FormDropdownOption[] {
  if (!arr?.length) return fallback;
  const out: FormDropdownOption[] = [];
  for (const item of arr) {
    if (item === null || item === undefined) continue;
    if (typeof item === "string") {
      out.push({ id: item, label: item });
      continue;
    }
    if (typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    /** Prefer numeric `id` over `slug` (e.g. property_types / amenities). */
    const idRaw = r.id ?? r.value ?? r.pk ?? r.slug;
    if (idRaw === undefined || idRaw === null) continue;
    const labelRaw =
      r.name ??
      r.label ??
      r.title ??
      r.full_name ??
      r.display ??
      String(idRaw);
    out.push({ id: String(idRaw), label: String(labelRaw) });
  }
  return out.length ? out : fallback;
}

/**
 * `property_types[]` from form-data: `{ id, name, order, ... }` — sort by `order`.
 */
function mapPropertyTypesFromApi(
  arr: unknown[] | null,
  fallback: FormDropdownOption[],
): FormDropdownOption[] {
  if (!arr?.length) return fallback;
  type Row = { sortKey: number; opt: FormDropdownOption };
  const rows: Row[] = [];
  let i = 0;
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (r.is_active === false) continue;
    const idRaw = r.id ?? r.value ?? r.pk;
    if (idRaw === undefined || idRaw === null) continue;
    const labelRaw =
      r.name ?? r.label ?? r.title ?? String(idRaw);
    let sortKey: number;
    if (typeof r.order === "number" && Number.isFinite(r.order)) {
      sortKey = r.order;
    } else if (typeof r.order === "string" && /^\d+$/.test(r.order)) {
      sortKey = Number(r.order);
    } else {
      sortKey = 1_000_000 + i;
    }
    rows.push({
      sortKey,
      opt: { id: String(idRaw), label: String(labelRaw) },
    });
    i += 1;
  }
  if (!rows.length) return fallback;
  rows.sort((a, b) => a.sortKey - b.sortKey || a.opt.label.localeCompare(b.opt.label));
  return rows.map((x) => x.opt);
}

/**
 * `amenities[]` — group by `category`, then sort by `name` within category.
 */
function mapAmenitiesFromApi(
  arr: unknown[] | null,
  fallback: FormDropdownOption[],
): FormDropdownOption[] {
  if (!arr?.length) return fallback;
  type Row = { category: string; name: string; opt: FormDropdownOption };
  const rows: Row[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (r.is_active === false) continue;
    const idRaw = r.id ?? r.value ?? r.pk;
    if (idRaw === undefined || idRaw === null) continue;
    const labelRaw = r.name ?? r.label ?? String(idRaw);
    const category = String(r.category ?? "");
    const name = String(labelRaw);
    rows.push({
      category,
      name,
      opt: { id: String(idRaw), label: name },
    });
  }
  if (!rows.length) return fallback;
  rows.sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  );
  return rows.map((x) => x.opt);
}

function apiListingValueToMode(v: string): ListingMode | null {
  const u = v.toUpperCase().replace(/-/g, "_");
  if (u === "BUY" || u === "FOR_SALE" || u === "SALE") return "buy";
  if (u === "RENT" || u === "FOR_RENT") return "rent";
  if (u === "LEASE") return "lease";
  if (u === "SHORT_LET" || u === "SHORTLET") return "short_let";
  return null;
}

function normalizeListingModes(
  arr: unknown[] | null,
  fallback: NormalizedPropertyFormData["listingModes"],
): NormalizedPropertyFormData["listingModes"] {
  if (!arr?.length) return fallback;
  const out: NormalizedPropertyFormData["listingModes"] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const raw = String(r.value ?? r.id ?? r.key ?? "").trim();
    const mode = apiListingValueToMode(raw);
    if (!mode) continue;
    const label = String(r.label ?? r.display ?? r.name ?? raw);
    out.push({ id: mode, label });
  }
  const seen = new Set<ListingMode>();
  const uniq = out.filter((x) => {
    if (seen.has(x.id)) return false;
    seen.add(x.id);
    return true;
  });
  return uniq.length ? uniq : fallback;
}

function normalizeStatuses(
  arr: unknown[] | null,
  fallback: FormDropdownOption[],
): FormDropdownOption[] {
  if (!arr?.length) return fallback;
  const mapped = mapToOptions(arr, []);
  return mapped.length ? mapped : fallback;
}

/**
 * Normalizes `GET /api/v1/admin/properties/form-data/` JSON.
 *
 * Known Django-style shape:
 * - `property_types`: `{ id, name, slug, order, ... }[]`
 * - `agents`: `{ id, full_name, specialisation }[]`
 * - `amenities`: `{ id, name, slug, category, ... }[]`
 * - `listing_types`: `{ value: "BUY" | ..., label }[]`
 * - `statuses`: `{ value: "DRAFT" | ..., label }[]`
 */
export function normalizePropertyFormData(raw: unknown): NormalizedPropertyFormData {
  const fb = buildFallbackPropertyFormData();
  const root = firstRecord(raw);
  if (!root) return fb;

  const propertyTypesRaw = pickArray(root, [
    "property_types",
    "propertyTypes",
    "types",
    "property_type_options",
  ]);
  const propertyTypes = mapPropertyTypesFromApi(propertyTypesRaw, fb.propertyTypes);

  const agents = mapToOptions(
    pickArray(root, ["agents", "agent_list", "assigned_agents"]),
    fb.agents,
  );

  const amenitiesRaw = pickArray(root, [
    "amenities",
    "amenity_options",
    "amenity_choices",
  ]);
  const amenities = mapAmenitiesFromApi(amenitiesRaw, fb.amenities);

  const listingModes = normalizeListingModes(
    pickArray(root, [
      "listing_types",
      "listingTypes",
      "listing_type_choices",
      "listing_modes",
    ]),
    fb.listingModes,
  );

  const statuses = normalizeStatuses(
    pickArray(root, ["statuses", "status_choices", "status_options"]),
    fb.statuses,
  );

  return {
    propertyTypes,
    agents,
    amenities,
    listingModes,
    statuses,
  };
}
