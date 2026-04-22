import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/home";
import { RemoteOrLocalImage } from "@/components/common/remote-or-local-image";

interface PropertyCardListProps {
  property: Property;
}

/** Horizontal list-view card — Figma nodes 819:6872 (desktop) + 819:8765 (mobile) */
export function PropertyCardList({ property }: PropertyCardListProps) {
  const { type, title, location, beds, baths, sqm, price, image } = property;

  return (
    <div className="flex overflow-hidden rounded-[7.65px] bg-white shadow-[0px_1.91px_2.87px_-1.91px_rgba(0,0,0,0.1),0px_4.78px_7.17px_-1.43px_rgba(0,0,0,0.1)] lg:rounded-[14px] lg:shadow-[0px_3.53px_5.29px_-3.53px_rgba(0,0,0,0.1),0px_8.81px_13.22px_-2.64px_rgba(0,0,0,0.1)]">
      {/* Image */}
      <div className="relative w-[36%] shrink-0 self-stretch lg:w-[34.5%]">
        <RemoteOrLocalImage
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 40vw, 340px"
        />
        <div className="absolute left-[6px] top-[6px] rounded-full bg-white px-[7px] py-[2.9px] shadow-[0_0_1.07px_0_rgba(0,0,0,0.25)] lg:left-[14px] lg:top-[11px] lg:px-[14px] lg:py-[5px]">
          <span className="text-[10px] font-medium leading-[1.43] text-[#2a478d] lg:text-[12.5px] [font-family:var(--font-dm-sans)]">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between px-[11px] py-[11px] lg:px-[21px] lg:py-[21px]">
        <div className="flex flex-col gap-[6px] lg:gap-[10px]">
          <h3 className="text-xs font-semibold leading-[1.4] text-[#1a1a1a] lg:text-[17.6px] [font-family:var(--font-playfair)]">
            {title}
          </h3>

          <div className="flex items-center gap-[4px] lg:gap-[7px]">
            <svg width="7.65" height="7.65" viewBox="0 0 14 14" fill="none" className="shrink-0 lg:h-[14px] lg:w-[14px]">
              <path d="M7 1C4.79 1 3 2.79 3 5c0 3.31 4 8 4 8s4-4.69 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="#6b6b6b" />
            </svg>
            <span className="text-[10px] leading-normal text-[#6b6b6b] lg:text-[14.1px] [font-family:var(--font-dm-sans)]">
              {location}
            </span>
          </div>

          <div className="flex items-center gap-[9px] lg:gap-[14px]">
            <span className="flex items-center gap-[4px] text-[10px] text-[#6b6b6b] lg:gap-[5px] lg:text-[12.3px] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bed.svg" alt="" width={7} height={7} className="lg:h-[14px] lg:w-[14px]" />
              {beds}
            </span>
            <span className="flex items-center gap-[4px] text-[10px] text-[#6b6b6b] lg:gap-[5px] lg:text-[12.3px] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bath.svg" alt="" width={7} height={7} className="lg:h-[14px] lg:w-[14px]" />
              {baths}
            </span>
            <span className="flex items-center gap-[4px] text-[10px] text-[#6b6b6b] lg:gap-[5px] lg:text-[12.3px] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-property.svg" alt="" width={7} height={7} className="lg:h-[14px] lg:w-[14px]" />
              {sqm} SQM
            </span>
          </div>
        </div>

        <div className="mt-[8px] flex items-center justify-between lg:mt-4">
          <span className="text-[11.47px] font-bold leading-[1.33] text-[#2a478d] lg:text-[21px] font-[Georgia,serif]">
            {price}
          </span>
          <Link href={`/properties/${property.id}`}
            className="rounded-[2.87px] border border-[#2a478d] px-[10px] py-[4px] text-[10px] font-medium text-[#2a478d] transition-colors hover:bg-[#2a478d] hover:text-white lg:rounded-[5.4px] lg:px-[22px] lg:py-[8px] lg:text-[14.3px] [font-family:var(--font-dm-sans)]">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
