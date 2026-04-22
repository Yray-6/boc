/** GET `/api/v1/admin/settings/` response. */
export type AdminSiteSettings = {
  id: number;
  company_name: string;
  primary_email: string;
  phone_number: string;
  logo_url: string | null;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  updated_at: string;
};

/** PATCH/PUT body (no `logo_url`; file upload uses POST `/settings/logo/`). */
export type AdminSiteSettingsWritePayload = {
  company_name: string;
  primary_email: string;
  phone_number: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
};
