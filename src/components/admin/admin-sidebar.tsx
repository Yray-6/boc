"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconAgents,
  IconDashboard,
  IconMedia,
  IconProperties,
  IconSettings,
  IconSignOut,
  IconViewWebsite,
} from "@/components/admin/admin-nav-icons";

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
    href: "/admin/media",
    label: "Media Library",
    Icon: IconMedia,
    match: (p) => p.startsWith("/admin/media"),
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

  return (
    <aside
      className={`relative z-10 flex h-screen shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-200 ease-out [font-family:var(--font-urbanist)] ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div
        className={`flex h-24 shrink-0 items-center ${collapsed ? "justify-center px-2" : "px-4 pb-4"}`}
      >
        <Link href="/admin" className="inline-flex shrink-0" title="Admin home">
          <Image
            src="/admin-login/admin-logo-1b9721.png"
            alt="BOC Real Estate"
            width={90}
            height={50}
            className={`object-contain ${collapsed ? "h-9 w-10" : "h-[50px] w-[90px]"}`}
            priority
          />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className={`absolute left-full top-[88px] z-20 flex size-11 -translate-x-1/2 items-center justify-center transition-transform duration-200 motion-reduce:transition-none ${
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
        className={`flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pt-0 ${collapsed ? "px-2" : "px-2"}`}
        aria-label="Admin"
      >
        {mainNav.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] transition-colors ${
                collapsed ? "justify-center px-2" : "px-3"
              } ${
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
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex shrink-0 flex-col gap-1 border-t border-[#F3F4F6] p-2">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] text-[#99A1AF] transition-colors hover:bg-gray-50 ${
            collapsed ? "justify-center px-2" : "px-3"
          }`}
          title={collapsed ? "View Website" : undefined}
        >
          <IconViewWebsite className="shrink-0" />
          {!collapsed && <span>View Website</span>}
        </Link>
        <Link
          href="/admin-login"
          className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold leading-[1.4286] transition-colors hover:bg-gray-50 ${
            collapsed ? "justify-center px-2" : "px-3"
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <IconSignOut className="shrink-0" />
          {!collapsed && (
            <span className="text-[rgba(251,44,54,0.6)]">Sign Out</span>
          )}
        </Link>
      </div>
    </aside>
  );
}
