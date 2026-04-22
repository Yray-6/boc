import type { ListingType, PropertyStatus } from "@/types/admin-property";

export type AdminAgentListItem = {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsapp_link: string;
  avatar_url: string;
  bio: string;
  specialisation: string;
  years_of_experience: number;
  is_active: boolean;
  active_listings_count: number;
  total_listings_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminAgentListResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: AdminAgentListItem[];
};

export type AdminAgentDetail = AdminAgentListItem;

/** POST `/api/v1/admin/agents/` */
export type AdminAgentCreatePayload = {
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  whatsapp: string;
  /** URL or path string per API (omit when not provided). */
  avatar?: string;
  bio: string;
  years_of_experience: number;
  specialisation: string;
  is_active: boolean;
};

/** PUT `/api/v1/admin/agents/{id}/` — same fields as create. */
export type AdminAgentUpdatePayload = AdminAgentCreatePayload;

/** Assigned property summary from `GET .../agents/{id}/properties/`. */
export type AdminAgentPropertySummary = {
  id: number;
  slug: string;
  title: string;
  listing_type: ListingType;
  listing_type_display: string;
  status: PropertyStatus;
  status_display: string;
  price: string;
  formatted_price: string;
  neighborhood: string;
  city: string;
  primary_image: string | null;
  created_at: string;
};

/** Wrapper shape from Django for assigned listings. */
export type AdminAgentAssignedPropertiesResponse = {
  agent_id: number;
  agent_name: string;
  total: number;
  properties: AdminAgentPropertySummary[];
};
