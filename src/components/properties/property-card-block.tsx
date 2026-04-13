import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/home";

interface PropertyCardBlockProps {
  property: Property;
}

/** Grid/block view card — Figma nodes 819:6335 (desktop) + 819:8519 (mobile) */
export function PropertyCardBlock({ property }: PropertyCardBlockProps) {
  const { type, featured, title, location, beds, baths, sqm, price, image } = property;

  return (
    <div className="flex flex-col overflow-hidden rounded-[8px] bg-white shadow-[0px_1.91px_2.87px_-1.91px_rgba(0,0,0,0.1),0px_4.78px_7.17px_-1.43px_rgba(0,0,0,0.1)] lg:rounded-[14px] lg:shadow-[0px_3.58px_5.38px_-3.58px_rgba(0,0,0,0.1),0px_8.96px_13.44px_-2.69px_rgba(0,0,0,0.1)]">
      {/* Image */}
      <div className="relative aspect-403/122 w-full lg:aspect-482/229">
        <Image src={image} alt={title} fill className="object-cover"
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 480px" />
        {/* Type badge */}
        <div className="absolute left-[7px] top-[7px] rounded-full bg-white px-[7px] py-[2.9px] shadow-[0_0_1.07px_0_rgba(0,0,0,0.25)] lg:left-[14px] lg:top-[12px] lg:px-[14px] lg:py-[5px]">
          <span className="text-[10px] font-medium leading-[1.43] text-[#2a478d] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
            {type}
          </span>
        </div>
      
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-[11.25px] pb-[11.25px] pt-[11.92px] lg:px-[21.5px] lg:pb-[21.5px] lg:pt-[21.5px]">
        <h3 className="text-[13px] font-semibold leading-[1.4] text-[#1a1a1a] lg:text-[17.9px] [font-family:var(--font-playfair)]">
          {title}
        </h3>

        <div className="mt-[8px] flex items-center gap-[4px] lg:mt-[10px] lg:gap-[7px]">
          <svg width="7.65" height="7.65" viewBox="0 0 14 14" fill="none" className="shrink-0 lg:h-[14px] lg:w-[14px]">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 3.31 4 8 4 8s4-4.69 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="#6b6b6b" />
          </svg>
          <span className="text-[11px] leading-normal text-[#6b6b6b] lg:text-[14.3px] [font-family:var(--font-dm-sans)]">
            {location}
          </span>
        </div>

        <div className="mt-[9px] flex items-center justify-between lg:mt-[14px]">
          <div className="flex items-center gap-[9px] lg:gap-[18px]">
            <span className="flex items-center gap-[4px] text-[10px] text-[#6b6b6b] lg:gap-[5px] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bed.svg" alt="" width={7} height={7} className="lg:h-[14px] lg:w-[14px]" />
              {beds} Beds
            </span>
            <span className="text-[10px] text-[#6b6b6b] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
              {baths} Baths
            </span>
            <span className="text-[10px] text-[#6b6b6b] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
              {sqm} SQM
            </span>
          </div>
        </div>

        <div className="mt-[11px] flex items-center justify-between lg:mt-[18px]">
          <span className="text-[11.47px] font-bold leading-[1.33] text-[#2a478d] lg:text-[21.5px] font-[Georgia,serif]">
            {price}
          </span>
          <Link href={`/properties/${property.id}`}
            className="rounded-[2.87px] border border-[#2a478d] px-[11.95px] py-[4.3px] text-[10px] font-medium text-[#2a478d] transition-colors hover:bg-[#2a478d] hover:text-white lg:rounded-[5.4px] lg:px-[22px] lg:py-[8px] lg:text-[14.3px] [font-family:var(--font-dm-sans)]">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
