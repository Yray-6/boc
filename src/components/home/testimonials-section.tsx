"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import type { Testimonial } from "@/data/home";
import { AnimateIn } from "@/components/common/animate-in";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    const gap = 10;
    const cardWidth = (card?.offsetWidth ?? 1) + gap;
    const i = Math.round(track.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(i, 0), testimonials.length - 1));
  }, [testimonials.length]);

  return (
    <section className="w-full bg-white px-6 py-10 sm:px-8 sm:py-14 lg:py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:gap-16">

        {/* Header */}
        <AnimateIn animation="fade-up" className="flex flex-col items-center text-center">
          <h2 className="text-[26px] font-medium leading-tight text-[#2a478d] sm:text-[36px] lg:text-[48px] lg:leading-none [font-family:var(--font-playfair)]">
            What Our Clients Say
          </h2>
          <p className="mt-3 max-w-[700px] text-[14px] leading-relaxed text-[#6b6b6b] sm:mt-4 sm:text-base lg:text-lg lg:leading-[1.56] [font-family:var(--font-dm-sans)]">
            Hear from our satisfied clients about their experiences with BOC Real Estate Limited
          </p>
        </AnimateIn>

        {/* Carousel track */}
        <AnimateIn animation="fade-up" delay={100} className="contents">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-[10px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*:last-child]:mr-6 sm:[&>*:last-child]:mr-8"
        >
          {testimonials.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="flex w-[78vw] max-w-[268px] shrink-0 snap-start flex-col gap-[13.8px] rounded-[9.2px] bg-white px-[18.4px] pt-[18.4px] shadow-[0px_2.3px_3.45px_-2.3px_rgba(0,0,0,0.1),0px_5.75px_8.63px_-1.73px_rgba(0,0,0,0.1)] sm:max-w-[300px] lg:max-w-[467px] lg:rounded-2xl lg:px-8 lg:pt-8 lg:gap-6"
            >
              {/* Opening quote */}
              <div className="flex items-start">
                <Image
                  src="/assets/figma/testimonial-quote.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-auto opacity-40 lg:h-12"
                />
              </div>

              {/* Quote text */}
              <p className="text-xs leading-relaxed text-[#6b6b6b] lg:text-base lg:leading-relaxed [font-family:var(--font-dm-sans)]">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div>
                <Image
                  src="/assets/figma/testimonial-stars.svg"
                  alt="5 stars"
                  width={115}
                  height={23}
                  className="h-[11.5px] w-auto lg:h-10"
                />
              </div>

              {/* Author */}
              <div className="mt-auto flex items-center gap-[9.2px] border-t border-[rgba(26,26,26,0.1)] pt-[9.2px] pb-[18.4px] lg:gap-4 lg:pt-4 lg:pb-6">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={37}
                  height={37}
                  className="h-[36.8px] w-[36.8px] shrink-0 rounded-full object-cover lg:h-16 lg:w-16"
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-semibold text-[#1a1a1a] lg:text-base [font-family:var(--font-dm-sans)]">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-[#6b6b6b] lg:text-sm [font-family:var(--font-dm-sans)]">{t.role}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#6b6b6b] lg:text-sm [font-family:var(--font-dm-sans)]">
                    <Image src="/assets/figma/testimonial-pin.svg" alt="" width={7} height={7} className="shrink-0 lg:h-3 lg:w-3" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        </AnimateIn>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "h-2.5 w-6 bg-[#2a478d]"
                  : "h-2.5 w-2.5 bg-[#2a478d]/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
