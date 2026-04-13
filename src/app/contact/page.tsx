import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCard } from "@/components/contact/contact-info-card";
import { ContactFormCard } from "@/components/contact/contact-form-card";
import { SiteFooter } from "@/components/home/site-footer";
import { WhatsAppFab } from "@/components/home/whatsapp-fab";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      <ContactHero />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-[85px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: Contact Information */}
          <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
            <ContactInfoCard />
          </div>

          {/* Right: Contact Form */}
          <div className="flex-1 min-w-0">
            <ContactFormCard />
          </div>
        </div>
      </div>

      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
