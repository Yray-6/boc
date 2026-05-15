import { unstable_noStore as noStore } from "next/cache";
import { publicGetSiteSettings } from "@/server/public-properties-api";
import type { SiteSettings } from "@/types/site-settings";

export function isSiteSettings(v: unknown): v is SiteSettings {
  return !!v && typeof v === "object" && "company_name" in v;
}

/** Fresh site settings for public pages (opts out of Next.js static/data cache). */
export async function loadPublicSiteSettings(): Promise<SiteSettings | null> {
  noStore();
  try {
    const res = await publicGetSiteSettings();
    if (res.ok && isSiteSettings(res.data)) return res.data;
  } catch {
    /* use caller fallbacks */
  }
  return null;
}
