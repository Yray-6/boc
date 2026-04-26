/** Public listing API — aligns with `/api/v1/properties/` list items. */
export type PublicListingType =
  | "BUY"
  | "RENT"
  | "LEASE"
  | "SHORT_LET";

export type PublicPropertyStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "SOLD"
  | "RENTED"
  | "LEASED"
  | string;

export type PublicPropertyListItem = {
  id: number;
  slug: string;
  title: string;
  listing_type: PublicListingType;
  listing_type_display: string;
  property_type_name: string;
  status: PublicPropertyStatus;
  status_display: string;
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
  parking: number;
  primary_image: string;
  /**
   * Optional gallery on list/featured responses — same shape as detail `images`, or plain URL strings.
   */
  images?: Array<
    | string
    | {
        image_url?: string;
        url?: string;
        order?: number;
        is_primary?: boolean;
      }
  >;
  agent_name: string;
  views_count: number;
  created_at: string;
};

export type PublicPropertyPaginatedResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: PublicPropertyListItem[];
};
