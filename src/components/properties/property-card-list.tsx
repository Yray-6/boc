import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/home";

interface PropertyCardListProps {
  property: Property;
}

/** Horizontal list-view card — Figma node 819:6872 */
export function PropertyCardList({ property }: PropertyCardListProps) {
  const { type, title, location, beds, baths, sqm, price, image } = property;

  return (
    <div className="flex overflow-hidden rounded-[14px] bg-white shadow-[0px_3.53px_5.29px_-3.53px_rgba(0,0,0,0.1),0px_8.81px_13.22px_-2.64px_rgba(0,0,0,0.1)]">
      {/* Image — ~35% width, fixed aspect on mobile */}
      <div className="relative w-[34.5%] shrink-0 self-stretch">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, 340px"
        />
        {/* BUY / RENT / LEASE badge */}
        <div className="absolute left-[14px] top-[11px] rounded-full bg-white px-[14px] py-[5px] shadow-[0_0_2px_0_rgba(0,0,0,0.25)]">
          <span className="text-[12.5px] font-medium leading-[1.43] text-[#2a478d] [font-family:var(--font-dm-sans)]">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between px-[21px] py-[21px]">
        <div className="flex flex-col gap-[10px]">
          {/* Title */}
          <h3 className="text-[17.6px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-[7px]">
            <Image
              src="/assets/figma/icon-pin.svg"
              alt=""
              width={14}
              height={14}
              className="shrink-0"
            />
            <span className="text-[14.1px] leading-normal text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              {location}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-[14px]">
            <span className="flex items-center gap-[5px] text-[12.3px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bed.svg" alt="" width={14} height={14} />
              {beds}
            </span>
            <span className="flex items-center gap-[5px] text-[12.3px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-bath.svg" alt="" width={14} height={14} />
              {baths}
            </span>
            <span className="flex items-center gap-[5px] text-[12.3px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
              <Image src="/assets/figma/icon-property.svg" alt="" width={14} height={14} />
              {sqm} SQM
            </span>
          </div>
        </div>

        {/* Price + Button */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[21px] font-bold leading-[1.33] text-[#2a478d] font-[Georgia,serif]">
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
