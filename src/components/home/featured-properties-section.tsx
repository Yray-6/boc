import Image from "next/image";
import type { Property } from "@/data/home";

interface FeaturedPropertiesSectionProps {
  properties: Property[];
}

export function FeaturedPropertiesSection({ properties }: FeaturedPropertiesSectionProps) {
  return (
    <section className="w-full px-6 py-[60px] sm:px-10 lg:px-[76px]">
      <div className="mb-[37px] flex flex-col items-center text-center">
        <h2 className="text-[48px] font-medium leading-none text-[#2a478d] [font-family:var(--font-playfair)]">Featured Properties</h2>
        <p className="mt-4 max-w-2xl text-[20px] text-[#6b6b6b] [font-family:var(--font-urbanist)]">Handpicked exclusive listings just for you</p>
      </div>

      <div className="mx-auto grid max-w-[1332px] grid-cols-1 gap-[29px] md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, i) => (
          <article
            key={i}
            className="overflow-hidden rounded-[14px] bg-white shadow-[0px_3.58px_5.38px_-3.58px_rgba(0,0,0,0.1),0px_8.96px_13.44px_-2.69px_rgba(0,0,0,0.1)]"
          >
            <div className="relative h-[229px] w-full">
              <Image src={property.image} alt={property.title} fill className="object-cover" />
              <span className="absolute left-[14px] top-[12px] rounded-full bg-white px-[14px] py-[5px] text-[12.5px] font-medium text-[#2a478d] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] [font-family:var(--font-dm-sans)]">
                {property.type}
              </span>
              {property.featured && (
                <span className="absolute right-[14px] top-[15px] rounded-full bg-[#1a1a1a] px-[11px] py-[3.5px] text-[10.75px] font-medium text-[#f5f0e8] [font-family:var(--font-dm-sans)]">
                  FEATURED
                </span>
              )}
            </div>

            <div className="px-[22px] py-[22px]">
              <h3 className="text-[17.9px] font-semibold leading-[1.4] text-[#1a1a1a] [font-family:var(--font-playfair)]">{property.title}</h3>

              <div className="mt-[10px] flex items-center gap-[4px]">
                <Image src="/assets/figma/icon-pin.svg" alt="" width={14} height={14} />
                <span className="text-[14px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">{property.location}</span>
              </div>

              <div className="mt-[14px] flex items-center gap-[18px]">
                <span className="flex items-center gap-[4px] text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                  <Image src="/assets/figma/icon-bed.svg" alt="" width={14} height={14} />
                  {property.beds} Beds
                </span>
                <span className="flex items-center gap-[4px] text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                  <Image src="/assets/figma/icon-bath.svg" alt="" width={14} height={14} />
                  {property.baths} Baths
                </span>
                <span className="text-[12.5px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">{property.sqm} SQM</span>
              </div>

              <div className="mt-[18px] flex items-center justify-between">
                <span className="text-[21.5px] font-bold text-[#2a478d]" style={{ fontFamily: "Georgia, serif" }}>
                  {property.price}
                </span>
                <button className="rounded-[5.4px] border border-[#2a478d] px-[22px] py-[8px] text-[14px] font-medium text-[#2a478d] [font-family:var(--font-dm-sans)]">
                  View Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a href="#" className="text-base font-medium text-[#2a478d] [font-family:var(--font-dm-sans)]">
          View All Properties →
        </a>
      </div>
    </section>
  );
}
