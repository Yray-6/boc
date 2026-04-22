import type { FilterState } from "@/components/properties/properties-filters";

export type ListingSortKey = "newest" | "oldest" | "price-asc" | "price-desc";

const LISTING_TYPE_UI: Record<string, string> = {
  Buy: "BUY",
  Rent: "RENT",
  Lease: "LEASE",
  "Short let": "SHORT_LET",
};

function sortToOrdering(sort: ListingSortKey): string {
  switch (sort) {
    case "newest":
      return "-created_at";
    case "oldest":
      return "created_at";
    case "price-asc":
      return "price";
    case "price-desc":
      return "-price";
    default:
      return "-created_at";
  }
}

/** Build query string for `/api/v1/properties/` from UI filters. */
export function buildPropertiesListSearchParams(
  filters: FilterState,
  sort: ListingSortKey,
  page: number,
  pageSize: number,
): URLSearchParams {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("page_size", String(pageSize));
  q.set("ordering", sortToOrdering(sort));

  if (filters.propertyType !== "All Types") {
    const lt = LISTING_TYPE_UI[filters.propertyType];
    if (lt) q.set("listing_type", lt);
  }

  const loc = filters.location.trim();
  if (loc) q.set("search", loc);

  if (filters.state?.trim()) q.set("state", filters.state.trim());

  if (filters.priceMin.trim()) q.set("price_min", filters.priceMin.trim());
  if (filters.priceMax.trim()) q.set("price_max", filters.priceMax.trim());

  if (filters.bedrooms !== "Any") {
    const raw = filters.bedrooms.replace("+", "").trim();
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) q.set("bedrooms_min", String(n));
  }

  if (filters.bathrooms !== "Any") {
    const raw = filters.bathrooms.replace("+", "").trim();
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) q.set("bathrooms_min", String(n));
  }

  for (const id of filters.amenityIds) {
    q.append("amenities", String(id));
  }

  return q;
}
