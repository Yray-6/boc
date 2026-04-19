import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    label: "Total Listings",
    value: "143",
    delta: "12%",
    icon: "/admin-dashboard/dash-stat-listings.svg",
    showDelta: true,
  },
  {
    label: "Active Listings",
    value: "89",
    delta: "5%",
    icon: "/admin-dashboard/dash-stat-active.svg",
    showDelta: true,
  },
  {
    label: "Total Agents",
    value: "12",
    icon: "/admin-dashboard/dash-stat-agents.svg",
    showDelta: false,
    delta: undefined,
  },
] as const;

const recentRows: (
  | {
      kind: "sale";
      title: string;
      address: string;
      price: string;
      badge: string;
      image: string;
    }
  | {
      kind: "views";
      title: string;
      address: string;
      views: string;
      image: string;
    }
)[] = [
  {
    kind: "sale",
    title: "Luxury 5 Bedroom Duplex",
    address: "Lekki Phase 1, Lagos Island.",
    price: "₦250,000,000",
    badge: "Buy",
    image: "/admin-dashboard/dash-thumb-1-36497e.png",
  },
  {
    kind: "sale",
    title: "Modern 3 Bedroom Apartment",
    address: "GRA, Ikoyi, Lagos Island",
    price: "₦250,000,000",
    badge: "Buy",
    image: "/admin-dashboard/dash-thumb-2-36497e.png",
  },
  {
    kind: "views",
    title: "Modern 3 Bedroom Apartment",
    address: "GRA, Ikoyi, Lagos Island",
    views: "11,735",
    image: "/admin-dashboard/dash-thumb-2-36497e.png",
  },
];

const purchaseLegend = [
  { label: "Buy", pct: "65%", color: "#003A8C" },
  { label: "Rent", pct: "25%", color: "#14B8A6" },
  { label: "Lease", pct: "10%", color: "#8B5CF6" },
] as const;

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M1.17 7C2.34 4.38 4.45 2.92 7 2.92C9.55 2.92 11.66 4.38 12.83 7C11.66 9.62 9.55 11.08 7 11.08C4.45 11.08 2.34 9.62 1.17 7Z"
        stroke="#141B34"
        strokeWidth="1.17"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z"
        stroke="#141B34"
        strokeWidth="1.17"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 [font-family:var(--font-urbanist)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
            Dashboard Overview
          </h1>
          <p className="text-base font-normal leading-normal text-[#99A1AF]">
            Welcome back, here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/agents"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold leading-[1.4286] text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
          >
            <Image
              src="/admin-dashboard/dash-btn-add-agent.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px]"
            />
            Add Agent
          </Link>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-[#003A8C] px-4 py-2 pb-[9px] pt-[9px] text-sm font-bold leading-[1.4286] text-white shadow-[0px_4px_6px_-4px_rgba(201,168,76,0.2),0px_10px_15px_-3px_rgba(201,168,76,0.2)] transition-colors hover:bg-[#002f73]"
          >
            <Image
              src="/admin-dashboard/dash-btn-add-property.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px]"
            />
            Add New Property
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-3">
              <Image
                src={card.icon}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0"
              />
              <span className="text-sm font-semibold leading-[1.4286] text-[#99A1AF]">
                {card.label}
              </span>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
                {card.value}
              </p>
              {card.showDelta && card.delta ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0FDF4] px-2 py-1 text-xs font-bold leading-[1.333] text-[#00A63E]">
                  <Image
                    src="/admin-dashboard/dash-trend-up.svg"
                    alt=""
                    width={12}
                    height={12}
                    className="size-3"
                  />
                  {card.delta}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,400px)] lg:items-start">
        <section className="flex flex-col gap-8 rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
            Recently Listed
          </h2>
          <ul className="flex flex-col">
            {recentRows.map((row, i) => (
              <li
                key={`${row.kind}-${i}`}
                className="flex flex-col gap-4 border-b border-[#F3F4F6] py-4 first:pt-0 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
                    <Image
                      src={row.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-[1.4286] text-[#1A1D24]">
                      {row.title}
                    </p>
                    <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
                      {row.address}
                    </p>
                  </div>
                </div>
                {row.kind === "sale" ? (
                  <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <p className="text-sm font-normal leading-[1.4286] text-[#4A5565]">
                      {row.price}
                    </p>
                    <span className="inline-flex w-10 justify-center rounded-lg bg-[#2A478D] px-0 py-1 text-xs font-normal leading-[1.333] text-white">
                      {row.badge}
                    </span>
                  </div>
                ) : (
                  <div className="relative flex shrink-0 flex-col items-end gap-0.5 pl-6 sm:min-w-[133px]">
                    <EyeIcon className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-3" />
                    <p className="text-sm font-normal leading-[1.4286] text-[#4A5565]">
                      {row.views}
                    </p>
                    <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
                      Total Views
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
            Listings by Purchase Type
          </h2>
          <div className="flex justify-center pt-4">
            <Image
              src="/admin-dashboard/dash-chart-donut.svg"
              alt="Listings by purchase type: 65% Buy, 25% Rent, 10% Lease"
              width={316}
              height={256}
              className="h-auto w-full max-w-[316px]"
            />
          </div>
          <ul className="flex flex-col gap-3">
            {purchaseLegend.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-normal leading-[1.4286] text-[#6A7282]">
                    {item.label}
                  </span>
                </span>
                <span className="font-bold leading-[1.4286] text-[#1A1D24]">
                  {item.pct}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
