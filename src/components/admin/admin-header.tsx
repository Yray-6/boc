"use client";

import Image from "next/image";
import { useAdminNav } from "@/components/admin/admin-nav-context";

export function AdminHeader() {
  const { mobileNavOpen, toggleMobileNav } = useAdminNav();

  return (
    <header
      className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:justify-end lg:px-8 lg:py-3 [font-family:var(--font-urbanist)]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#1A1D24] transition-colors hover:bg-gray-100"
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className="truncate text-sm font-bold text-[#1A1D24] sm:text-base">Admin</span>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="rounded-lg p-1.5 text-[#99A1AF] transition-colors hover:bg-gray-50 hover:text-[#62748E] sm:p-2"
          aria-label="Notifications"
        >
          <Image
            src="/admin-dashboard/header-notifications.svg"
            alt=""
            width={36}
            height={36}
            className="size-8 sm:size-9"
          />
        </button>

        <div className="flex items-center gap-2 border-l border-[#F3F4F6] pl-3 sm:gap-3 sm:pl-6">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="text-sm font-semibold leading-[1.4286] text-[#1A1D24]">
              Demo Admin
            </p>
            <p className="text-[10px] font-normal uppercase leading-normal tracking-widest text-[#99A1AF]">
              Super Admin
            </p>
          </div>
          <div
            className="size-9 shrink-0 overflow-hidden rounded-full sm:size-10"
            aria-hidden
          >
            <Image
              src="/admin-dashboard/header-avatar.svg"
              alt=""
              width={40}
              height={40}
              className="size-9 sm:size-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
