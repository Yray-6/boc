import { PropertiesHero } from "@/components/properties/properties-hero";
import { PropertiesListing } from "@/components/properties/properties-listing";
import { SiteFooter } from "@/components/home/site-footer";
import { properties } from "@/data/home";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <PropertiesHero foundCount={properties.length} />
      {/* -mt-8 on mobile pulls listing up so filter card overlaps hero bottom; lg resets */}
      <div className="-mt-8 lg:mt-0">
        <PropertiesListing initialProperties={properties} />
      </div>
      <SiteFooter />
    </main>
  );
}
