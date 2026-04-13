import Image from "next/image";
import type { WhyChooseItem } from "@/data/home";

interface WhyChooseSectionProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
  return (
    <section className="flex w-full flex-col items-center gap-16 bg-white px-8 py-16 lg:min-h-[560px] lg:px-8">
      <div className="flex w-full max-w-[1440px] flex-col items-center text-center">
        <h2 className="text-[48px] font-medium leading-none text-[#2a478d] [font-family:var(--font-playfair)]">Why Choose BOC Real Estate Limited</h2>
        <p className="mt-4 max-w-[672px] text-[20px] leading-[1.4] text-[#6b6b6b] [font-family:var(--font-urbanist)]">
          We are committed to making your property journey seamless and successful
        </p>
      </div>

      <div className="flex w-full max-w-[1440px] flex-col flex-wrap items-center justify-center gap-10 lg:flex-row lg:gap-[39px]">
        {items.map((item) => (
          <div key={item.title} className="relative h-[252px] w-full max-w-[411px] shrink-0">
            <div className="absolute left-0 top-[9px] h-[243px] w-[min(404px,calc(100%-7px))] rounded-[10px] bg-[#2a478d]" />
            <div className="relative left-[10px] top-0 min-h-[239px] w-[min(401px,calc(100%-10px))] rounded-[10px] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
              <div className="px-[35px] pt-[33px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(42,71,141,0.2)]">
                  <Image src={item.icon} alt="" width={32} height={32} />
                </div>
                <h3 className="mt-2 text-xl font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">{item.title}</h3>
                <p className="mt-3 max-w-[356px] text-base leading-normal text-[#6b6b6b] [font-family:var(--font-urbanist)]">{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
