import type { ListingType } from "@/types/admin-property";

export type AdminDashboardListingTypeBreakdown = Record<
  string,
  {
    count: number;
    percentage: number;
  }
>;

export type AdminDashboardRecentListing = {
  id: number;
  slug: string;
  title: string;
  listing_type: ListingType;
  listing_type_display: string;
  formatted_price: string;
  price: string;
  city: string;
  neighborhood: string;
  primary_image: string | null;
  agent_name: string;
  views_count: number;
  created_at: string;
};

export type AdminDashboardResponse = {
  total_listings: number;
  active_listings: number;
  draft_listings: number;
  total_agents: number;
  total_enquiries: number;
  new_enquiries: number;
  listing_type_breakdown: AdminDashboardListingTypeBreakdown;
  recently_listed: AdminDashboardRecentListing[];
};
