import Image from "next/image";
import type { Testimonial } from "@/data/home";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="w-full bg-white px-8 py-16 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[48px] font-medium leading-none text-[#2a478d] [font-family:var(--font-playfair)]">What Our Clients Say</h2>
          <p className="mt-4 max-w-[700px] text-lg leading-[1.56] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
            Hear from our satisfied clients about their experiences with BOC Real Estate Limited
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
          <div className="flex w-max gap-[10px]">
            {testimonials.map((t, i) => (
              <article
                key={`${t.name}-${i}`}
                className="flex h-[397px] w-[min(466.66px,85vw)] shrink-0 flex-col gap-6 rounded-2xl bg-white px-8 pt-8 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
              >
                <div className="flex h-12 shrink-0 items-start justify-start">
                  <Image src="/assets/figma/testimonial-quote.svg" alt="" width={48} height={48} className="h-12 w-auto" />
                </div>
                <p className="min-h-[104px] text-base leading-relaxed text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="shrink-0">
                  <Image
                    src="/assets/figma/testimonial-stars.svg"
                    alt="5 stars"
                    width={200}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>
                <div className="mt-auto flex items-center gap-4 border-t border-[rgba(26,26,26,0.1)] pt-4 pb-6">
                  <Image src={t.image} alt={t.name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-base font-semibold text-[#1a1a1a] [font-family:var(--font-dm-sans)]">{t.name}</p>
                    <p className="text-sm text-[#6b6b6b] [font-family:var(--font-dm-sans)]">{t.role}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                      <Image src="/assets/figma/testimonial-pin.svg" alt="" width={12} height={12} className="shrink-0" />
                      <span>{t.location}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
