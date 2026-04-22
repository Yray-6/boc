/** API `ListingTypeEnum` — matches backend OpenAPI. */
export type ListingType =
  | "BUY"
  | "RENT"
  | "LEASE"
  | "SHORT_LET";

/** Admin property form listing segment (lowercase UI keys). */
export type ListingMode = "buy" | "rent" | "lease" | "short_let";

/** API `Status108Enum` — matches backend OpenAPI. */
export type PropertyStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "SOLD"
  | "RENTED"
  | "LEASED";

export type AdminPropertyListItem = {
  id: number;
  slug: string;
  /** 1–255 characters (API). */
  title: string;
  listing_type: ListingType;
  listing_type_display: string;
  property_type_name: string;
  status: PropertyStatus;
  status_display: string;
  /** When true, property may appear in homepage featured section (API). */
  is_featured: boolean;
  price: string;
  formatted_price: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  agent_name: string;
  primary_image: string;
  image_count: number;
  enquiry_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminPropertyListResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: AdminPropertyListItem[];
};

export type AdminPropertyAmenity = {
  id: number;
  name: string;
  icon: string;
  category: string;
};

export type AdminAgentObject = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsapp_link: string;
  specialisation: string;
  years_of_experience: number;
  avatar_url: string | null;
};

export type AdminPropertyImage = {
  id: number;
  image_url: string;
  caption: string;
  is_primary: boolean;
  order: number;
  property_title: string;
  property_slug: string;
  created_at: string;
};

export type AdminPropertyDetail = {
  id: number;
  slug: string;
  title: string;
  listing_type: ListingType;
  listing_type_display: string;
  property_type_name: string;
  /** Present when API includes FK id on detail responses. */
  property_type?: number;
  status: PropertyStatus;
  status_display: string;
  is_featured: boolean;
  price: string;
  formatted_price: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  sqm: number;
  parking: number;
  year_built: number;
  description: string;
  /** API may return object array, number[], string[], or a plain string. */
  amenities: AdminPropertyAmenity[] | number[] | string[] | string | unknown;
  /** API may return a nested object, a numeric id, or a string name. */
  agent: AdminAgentObject | number | string;
  agent_name?: string;
  images: AdminPropertyImage[];
  image_count: number;
  enquiry_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};

/** Request body for POST/PUT property (matches API schema). */
export type AdminPropertyWritePayload = {
  /** Array of amenity integer IDs (API). */
  amenities: number[];
  /** 1–255 characters (API). */
  title: string;
  listing_type: ListingType;
  status: PropertyStatus;
  /** When true, show on the home page featured section (API). */
  is_featured: boolean;
  price: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  sqm: number;
  parking: number;
  year_built: number;
  description: string;
  property_type: number;
  agent: number;
};
