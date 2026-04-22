"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconAgents,
  IconDashboard,
  IconEnquiries,
  IconProperties,
  IconSettings,
  IconSignOut,
  IconViewWebsite,
} from "@/components/admin/admin-nav-icons";
import { useAdminNav } from "@/components/admin/admin-nav-context";

const mainNav: {
  href: string;
  label: string;
  Icon: typeof IconDashboard;
  match: (path: string) => boolean;
}[] = [
  {
    href: "/admin",
    label: "Dashboard",
    Icon: IconDashboard,
    match: (p) => p === "/admin" || p === "/admin/",
  },
  {
    href: "/admin/properties",
    label: "Properties",
    Icon: IconProperties,
    match: (p) => p.startsWith("/admin/properties"),
  },
  {
    href: "/admin/agents",
    label: "Agents",
    Icon: IconAgents,
    match: (p) => p.startsWith("/admin/agents"),
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    Icon: IconEnquiries,
    match: (p) => p.startsWith("/admin/enquiries"),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    Icon: IconSettings,
    match: (p) => p.startsWith("/admin/settings"),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { mobileNavOpen, closeMobileNav } = useAdminNav();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Mobile drawer: always show labels; desktop collapsed hides labels */
  const showLabels = !collapsed || !isDesktop;
  const navJustify = showLabels ? "px-3" : "justify-center px-2";

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
          mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileNav}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh max-h-dvh shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-[transform,width] duration-200 ease-out [font-family:var(--font-urbanist)] lg:static lg:z-0 lg:h-screen lg:max-h-none lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"
        } ${collapsed && isDesktop ? "w-[72px] lg:w-[72px]" : "w-[260px] lg:w-[240px]"}`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between gap-2 px-3 pb-2 pt-3 lg:h-24 lg:px-4 lg:pb-4">
          <Link
            href="/admin"
            className="inline-flex min-w-0 shrink-0"
            title="Admin home"
            onClick={closeMobileNav}
          >
            <Image
              src="/admin-login/admin-logo-1b9721.png"
              alt="BOC Real Estate"
              width={90}
              height={50}
              className={`object-contain ${collapsed && isDesktop ? "h-9 w-10" : "h-9 w-[90px] sm:h-[50px]"}`}
              priority
            />
          </Link>
          <button
            type="button"
            onClick={closeMobileNav}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#62748E] transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={`absolute left-full top-[72px] z-20 hidden size-11 -translate-x-1/2 items-center justify-center transition-transform duration-200 motion-reduce:transition-none lg:flex ${
            collapsed ? "rotate-180" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Image
            src="/admin-dashboard/nav-collapse.svg"
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0"
          />
        </button>

        <nav
          className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 pt-0"
          aria-label="Admin"
        >
          {mainNav.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                title={!showLabels ? label : undefined}
                onClick={closeMobileNav}
                className={`relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] transition-colors ${navJustify} ${
                  active
                    ? "bg-[rgba(42,71,141,0.1)] text-[#003A8C]"
                    : "text-[#99A1AF] hover:bg-gray-50"
                } `}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#003A8C]"
                    aria-hidden
                  />
                )}
                <Icon active={active} className="shrink-0" />
                {showLabels && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex shrink-0 flex-col gap-1 border-t border-[#F3F4F6] p-2">
          <Link
            href="/"
            onClick={closeMobileNav}
            className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] text-[#99A1AF] transition-colors hover:bg-gray-50 ${navJustify}`}
            title={!showLabels ? "View Website" : undefined}
          >
            <IconViewWebsite className="shrink-0" />
            {showLabels && <span>View Website</span>}
          </Link>
          <Link
            href="/admin-login"
            onClick={closeMobileNav}
            className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] transition-colors hover:bg-gray-50 ${navJustify}`}
            title={!showLabels ? "Sign Out" : undefined}
          >
            <IconSignOut className="shrink-0" />
            {showLabels && (
              <span className="text-[rgba(251,44,54,0.6)]">Sign Out</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
