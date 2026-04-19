import Image from "next/image";

export function AdminHeader() {
  return (
    <header
      className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white/80 px-8 py-3 backdrop-blur-md [font-family:var(--font-urbanist)]"
    >
      <div className="relative min-w-0 flex-1">
        <label htmlFor="admin-global-search" className="sr-only">
          Search
        </label>
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <Image
            src="/admin-dashboard/header-search.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
            aria-hidden
          />
        </div>
        <input
          id="admin-global-search"
          type="search"
          name="q"
          placeholder="Search listings, agents, enquiries..."
          autoComplete="off"
          className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-4 pb-[9px] pt-2 text-sm font-normal leading-[1.2] text-[#1A1D24] shadow-none outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:border-[#003A8C]/40 focus:ring-2"
        />
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50 hover:text-[#62748E]"
          aria-label="Notifications"
        >
          <Image
            src="/admin-dashboard/header-notifications.svg"
            alt=""
            width={36}
            height={36}
            className="size-9"
          />
        </button>

        <div className="flex items-center gap-3 border-l border-[#F3F4F6] pl-6">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="text-sm font-semibold leading-[1.4286] text-[#1A1D24]">
              Demo Admin
            </p>
            <p className="text-[10px] font-normal uppercase leading-normal tracking-widest text-[#99A1AF]">
              Super Admin
            </p>
          </div>
          <div
            className="size-10 shrink-0 overflow-hidden rounded-full"
            aria-hidden
          >
            <Image
              src="/admin-dashboard/header-avatar.svg"
              alt=""
              width={40}
              height={40}
              className="size-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
