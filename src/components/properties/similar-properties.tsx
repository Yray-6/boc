import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/home";

interface SimilarPropertiesProps {
  current: Property;
  all: Property[];
}

/** Similar Properties section shown at the bottom of the detail page */
export function SimilarProperties({ current, all }: SimilarPropertiesProps) {
  const similar = all
    .filter(
      (p) =>
        p.id !== current.id &&
        (p.location === current.location || p.type === current.type),
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="mt-14 border-t border-[rgba(26,26,26,0.08)] pt-10">
      <h2 className="mb-6 text-[22px] font-semibold leading-snug text-[#1a1a1a] [font-family:var(--font-playfair)]">
        Similar Properties
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((p) => (
          <Link
            key={p.id}
            href={`/properties/${p.id}`}
            className="group flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0px_4px_16px_rgba(0,0,0,0.12)]"
          >
            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1 px-4 py-4">
              <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#1a1a1a] [font-family:var(--font-playfair)]">
                {p.title}
              </h3>
              <p className="text-[12px] text-[#6b6b6b] [font-family:var(--font-dm-sans)]">
                {p.location}
              </p>
              <p className="mt-1 text-[15px] font-bold text-[#2a478d] font-[Georgia,serif]">
                {p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
