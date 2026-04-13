import Link from "next/link";

export type SiteNavActive = "home" | "properties" | "about" | "contact";

const links: { href: string; label: string; key: SiteNavActive }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/properties", label: "Properties", key: "properties" },
  { href: "#", label: "About Us", key: "about" },
  { href: "/contact", label: "Contact", key: "contact" },
];

interface SiteNavLinksProps {
  active: SiteNavActive;
}

export function SiteNavLinks({ active }: SiteNavLinksProps) {
  return (
    <>
      {links.map(({ href, label, key }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            className={
              isActive
                ? "font-medium text-[#2a478d]"
                : "font-normal text-[#575757] transition-colors hover:text-[#2a478d]"
            }
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
