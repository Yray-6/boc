"use client";

import Image from "next/image";
import type { WhyChooseItem } from "@/data/home";
import { AnimateIn } from "@/components/common/animate-in";

interface WhyChooseSectionProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
  return (
    <section className="flex w-full flex-col items-center gap-10 bg-white px-6 py-12 sm:gap-12 sm:px-10 sm:py-14 lg:min-h-[560px] lg:gap-16 lg:px-8 lg:py-16">
      {/* Header */}
      <AnimateIn animation="fade-up" className="flex w-full max-w-[1440px] flex-col items-center text-center">
        <h2 className="text-[26px] font-medium leading-tight text-[#2a478d] sm:text-[36px] lg:text-[48px] lg:leading-none [font-family:var(--font-playfair)]">
          Why Choose BOC Real Estate Limited
        </h2>
        <p className="mt-3 max-w-[672px] text-[15px] leading-[1.4] text-[#6b6b6b] sm:mt-4 sm:text-[17px] lg:text-[20px] [font-family:var(--font-urbanist)]">
          We are committed to making your property journey seamless and successful
        </p>
      </AnimateIn>

      {/* Cards */}
      <div className="flex w-full max-w-[1440px] flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-[39px]">
        {items.map((item, i) => (
          <AnimateIn
            key={item.title}
            animation="scale-in"
            delay={i * 130}
            className="relative w-full max-w-[406px] shrink-0"
          >
            {/* Blue drop-shadow offset card */}
            <div className="absolute left-0 top-[4px] h-[calc(100%-4px)] w-[calc(100%-7px)] rounded-[5px] bg-[#2a478d] sm:top-[6px] sm:h-[calc(100%-6px)] lg:top-[9px] lg:h-[calc(100%-9px)] lg:rounded-[10px]" />

            {/* White foreground card */}
            <div className="relative left-[7px] top-0 w-[calc(100%-7px)] rounded-[5px] bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 lg:rounded-[10px]">
              <div className="px-[18px] py-[16px] sm:px-[28px] sm:py-[22px] lg:px-[35px] lg:pb-[28px] lg:pt-[33px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(42,71,141,0.2)] sm:h-10 sm:w-10 lg:h-[32px] lg:w-[32px]">
                  <Image
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4"
                  />
                </div>

                <h3 className="mt-2 text-[14px] font-semibold leading-[1.4] text-[#1a1a1a] sm:text-[16px] lg:text-xl [font-family:var(--font-playfair)]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[12px] leading-normal text-[#6b6b6b] sm:mt-3 sm:text-[14px] lg:mt-3 lg:max-w-[356px] lg:text-base [font-family:var(--font-urbanist)]">
                  {item.body}
                </p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
