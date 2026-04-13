import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/home";

interface PropertyCardBlockProps {
  property: Property;
}

/** Grid/block view card — Figma node 819:6335 */
export function PropertyCardBlock({ property }: PropertyCardBlockProps) {
  const { type, featured, title, location, beds, baths, sqm, price, image } = property;

  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] bg-white shadow-[0px_3.58px_5.38px_-3.58px_rgba(0,0,0,0.1),0px_8.96px_13.44px_-2.69px_rgba(0,0,0,0.1)]">
      {/* Image area */}
      <div className="relative aspect-[482/229] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 480px"
        />
        {/* BUY / RENT / LEASE badge */}
        <div className="absolute left-[14px] top-[12px] rounded-full bg-white px-[14px] py-[5px] shadow-[0_0_2px_0_rgba(0,0,0,0.25)]">
          <span className="text-[12.5px] font-medium leading-[1.43] text-[#2a478d] [font-family:var(--font-dm-sans)]">
            {type}
          </span>
        </div>
        {/* FEATURED badge */}
        {featured && (
          <div className="absolute right-[14px] top-[15px] rounded-full bg-[#1a1a1a] px-[10.8px] py-[3.6px]">
            <span className="text-[10.8px] font-medium leading-[1.33] text-[#f5f0e8] [font-family:var(--font-dm-sans)]">
              FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-[21.5px] pb-[21.5px] pt-[21.5px]">
        {/* Title */}
        <h3 className="text-[17.9px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
          {title}
        </h3>

        {/* Location */}
        <div className="mt-[10px] flex items-center gap-[7px]">
          <Image
            src="/assets/figma/icon-pin.svg"
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
          <span className="text-[14.3px] leading-[1.5] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
            {location}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-[14px] flex items-center justify-between">
          <div className="flex items-center gap-[18px]">
            <span className="flex items-center gap-[5px] text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bed.svg" alt="" width={14} height={14} />
              {beds} Beds
            </span>
            <span className="text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              {baths} Baths
            </span>
            <span className="text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              {sqm} SQM
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-[18px] flex items-center justify-between">
          <span className="text-[21.5px] font-bold leading-[1.33] text-[#2a478d] [font-family:Georgia,_serif]">
            {price}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="rounded-[5.4px] border border-[#2a478d] px-[22px] py-[8px] text-[14.3px] font-medium text-[#2a478d] transition-colors hover:bg-[#2a478d] hover:text-white [font-family:var(--font-dm-sans)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
