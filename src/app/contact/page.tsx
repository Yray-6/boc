import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCard } from "@/components/contact/contact-info-card";
import { ContactFormCard } from "@/components/contact/contact-form-card";
import { SiteFooter } from "@/components/home/site-footer";
import { publicGetSiteSettings } from "@/server/public-properties-api";
import type { SiteSettings } from "@/types/site-settings";

function isSiteSettings(v: unknown): v is SiteSettings {
  return !!v && typeof v === "object" && "company_name" in v;
}

export default async function ContactPage() {
  let settings: SiteSettings | null = null;
  try {
    const res = await publicGetSiteSettings();
    if (res.ok && isSiteSettings(res.data)) settings = res.data;
  } catch {
    /* use defaults */
  }

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <ContactHero />

      {/* -mt-8 pulls form card up to overlap hero on mobile; resets at lg */}
      <div className="-mt-8 lg:mt-0">
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-0 sm:px-6 lg:px-[85px] lg:py-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
            {/* Mobile: form first (overlaps hero), info below — Desktop: info left, form right */}
            <div className="relative z-10 min-w-0 flex-1 lg:order-2">
              <ContactFormCard />
            </div>
            <div className="w-full shrink-0 lg:order-1 lg:w-[400px] xl:w-[440px]">
              <ContactInfoCard settings={settings} />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
