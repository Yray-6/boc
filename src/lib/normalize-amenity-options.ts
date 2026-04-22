import type { AmenityOption } from "@/components/properties/properties-filters";

function rowsFromPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in data) {
    const r = (data as { results: unknown }).results;
    if (Array.isArray(r)) return r;
  }
  return [];
}

/** Normalize public or admin amenity list payloads into `{ id, name }[]`. */
export function normalizeAmenityOptions(data: unknown): AmenityOption[] {
  return rowsFromPayload(data)
    .filter((r): r is { id: unknown; name: unknown } => r !== null && typeof r === "object" && "id" in r && "name" in r)
    .map((r) => ({ id: Number(r.id), name: String(r.name) }))
    .filter((o) => Number.isFinite(o.id) && o.name.length > 0);
}
