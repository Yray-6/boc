import { PropertiesHero } from "@/components/properties/properties-hero";
import { PropertiesListing } from "@/components/properties/properties-listing";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsAppFab } from "@/components/home/whatsapp-fab";
import { properties } from "@/data/home";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <PropertiesHero foundCount={properties.length} />
      <PropertiesListing initialProperties={properties} />
      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
