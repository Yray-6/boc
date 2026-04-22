import {
  CtaSection,
  FeaturedPropertiesSection,
  HeroSection,
  SiteFooter,
  TestimonialsSection,
  WhyChooseSection,
} from "@/components/home";
import { testimonials, whyChoose } from "@/data/home";
import { publicListFeatured } from "@/server/public-properties-api";
import { mapPublicListItemToProperty } from "@/lib/public-property-mapper";
import type { PublicPropertyListItem, PublicPropertyPaginatedResponse } from "@/types/public-property";

async function loadFeaturedProperties() {
  try {
    const params = new URLSearchParams({ page: "1", page_size: "12" });
    const res = await publicListFeatured(params);
    if (!res.ok || !res.data || typeof res.data !== "object" || !("results" in res.data)) {
      return [];
    }
    const data = res.data as PublicPropertyPaginatedResponse;
    return (data.results ?? []).map((r) => mapPublicListItemToProperty(r as PublicPropertyListItem));
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredProperties = await loadFeaturedProperties();

  return (
    <main className="bg-white text-[#241b12]">
      <HeroSection />
      <FeaturedPropertiesSection properties={featuredProperties} />
      <WhyChooseSection items={whyChoose} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}
