export type EnquiryType = "GENERAL" | "INSPECTION" | "PURCHASE" | "RENT" | "LEASE";
export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type AdminEnquiry = {
  id: number;
  property: number | null;
  property_title: string;
  property_slug: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  enquiry_type: EnquiryType;
  enquiry_type_display: string;
  status: EnquiryStatus;
  status_display: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
};

export type AdminEnquiryListResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: AdminEnquiry[];
};

export type AdminEnquiryStatusPayload = {
  status: EnquiryStatus;
};
