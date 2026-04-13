import {
  CtaSection,
  FeaturedPropertiesSection,
  HeroSection,
  SiteFooter,
  TestimonialsSection,
  WhyChooseSection,
  WhatsAppFab,
} from "@/components/home";
import { properties, testimonials, whyChoose } from "@/data/home";

export default function Home() {
  return (
    <main className="bg-white text-[#241b12]">
      <HeroSection />
      <FeaturedPropertiesSection properties={properties} />
      <WhyChooseSection items={whyChoose} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection />
      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
