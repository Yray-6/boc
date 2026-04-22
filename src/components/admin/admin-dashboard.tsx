"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminDashboardQuery } from "@/lib/hooks/use-admin-dashboard-query";
import {
  PropertyDetailsModal,
} from "@/components/admin/property-details-modal";
import { useAdminPropertyDetailQuery } from "@/lib/hooks/use-admin-properties-queries";
import { detailToPropertyDetail } from "@/lib/admin-property-mappers";

const LISTING_TYPE_COLORS: Record<string, string> = {
  BUY: "#003A8C",
  RENT: "#14B8A6",
  LEASE: "#8B5CF6",
  SHORT_LET: "#F59E0B",
};
const LISTING_TYPE_FALLBACK_COLORS = ["#003A8C", "#14B8A6", "#8B5CF6", "#F59E0B", "#EC4899"];

const LISTING_TYPE_LABELS: Record<string, string> = {
  BUY: "Buy",
  RENT: "Rent",
  LEASE: "Lease",
  SHORT_LET: "Short Let",
};

function formatListingTypeLabel(key: string): string {
  return (
    LISTING_TYPE_LABELS[key] ??
    key
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

const DONUT_R = 80;
const DONUT_CX = 100;
const DONUT_CY = 100;
const DONUT_STROKE = 32;

function DonutChart({
  segments,
}: {
  segments: { pct: number; color: string }[];
}) {
  const circumference = 2 * Math.PI * DONUT_R;
  const total = segments.reduce((s, x) => s + x.pct, 0);
  if (total === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[200px]">
        <circle
          cx={DONUT_CX}
          cy={DONUT_CY}
          r={DONUT_R}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={DONUT_STROKE}
        />
      </svg>
    );
  }

  let offset = circumference * 0.25;
  const arcs: { dasharray: string; dashoffset: number; color: string }[] = [];
  for (const seg of segments) {
    const frac = seg.pct / 100;
    const dash = frac * circumference;
    arcs.push({
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: circumference - offset,
      color: seg.color,
    });
    offset += dash;
  }

  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[200px]">
      <circle
        cx={DONUT_CX}
        cy={DONUT_CY}
        r={DONUT_R}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={DONUT_STROKE}
      />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={DONUT_CX}
          cy={DONUT_CY}
          r={DONUT_R}
          fill="none"
          stroke={arc.color}
          strokeWidth={DONUT_STROKE}
          strokeDasharray={arc.dasharray}
          strokeDashoffset={arc.dashoffset}
        />
      ))}
    </svg>
  );
}

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
  const dashboardQuery = useAdminDashboardQuery();
  const data = dashboardQuery.data;

  const [viewSlug, setViewSlug] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const viewDetailQuery = useAdminPropertyDetailQuery(viewSlug);
  const viewDetail = viewDetailQuery.data
    ? detailToPropertyDetail(viewDetailQuery.data)
    : null;

  const stats = useMemo(
    () => [
      {
        label: "Total Listings",
        value: String(data?.total_listings ?? 0),
        icon: "/admin-dashboard/dash-stat-listings.svg",
      },
      {
        label: "Active Listings",
        value: String(data?.active_listings ?? 0),
        icon: "/admin-dashboard/dash-stat-active.svg",
      },
      {
        label: "Total Agents",
        value: String(data?.total_agents ?? 0),
        icon: "/admin-dashboard/dash-stat-agents.svg",
      },
    ],
    [data],
  );

  const recentRows = useMemo(
    () =>
      (data?.recently_listed ?? []).map((row) => ({
        slug: row.slug,
        title: row.title,
        address: [row.neighborhood, row.city].filter(Boolean).join(", ") || "—",
        views: Number(row.views_count ?? 0).toLocaleString(),
        image:
          row.primary_image && row.primary_image.startsWith("http")
            ? row.primary_image
            : "/admin-dashboard/dash-thumb-1-36497e.png",
      })),
    [data],
  );

  const purchaseLegend = useMemo(() => {
    const entries = Object.entries(data?.listing_type_breakdown ?? {});
    return entries.map(([key, value], idx) => ({
      key,
      label: formatListingTypeLabel(key),
      pct: Math.round(value?.percentage ?? 0),
      color:
        LISTING_TYPE_COLORS[key] ??
        LISTING_TYPE_FALLBACK_COLORS[idx % LISTING_TYPE_FALLBACK_COLORS.length],
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:p-6 md:p-8 [font-family:var(--font-urbanist)]">
      <PropertyDetailsModal
        property={viewDetail}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setViewSlug(null);
        }}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="text-2xl font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24] sm:text-[30px]">
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

      {dashboardQuery.error ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {dashboardQuery.error instanceof Error
            ? dashboardQuery.error.message
            : "Failed to load dashboard"}
        </p>
      ) : null}

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
              {dashboardQuery.isLoading ? (
                <span className="text-xs text-[#99A1AF]">Loading...</span>
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
                key={`recent-${i}`}
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
                <div className="flex shrink-0 items-center gap-4">
               
                  <button
                    type="button"
                    onClick={() => {
                      setViewSlug(row.slug);
                      setDetailOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
                  >
                    <EyeIcon />
                    View
                  </button>
                </div>
              </li>
            ))}
            {!dashboardQuery.isLoading && recentRows.length === 0 ? (
              <li className="py-4 text-sm text-[#99A1AF]">No recent listings.</li>
            ) : null}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
            Listings by Purchase Type
          </h2>
          <div className="flex justify-center pt-4">
            <DonutChart segments={purchaseLegend} />
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
                  {item.pct}%
                </span>
              </li>
            ))}
            {!dashboardQuery.isLoading && purchaseLegend.length === 0 ? (
              <li className="text-sm text-[#99A1AF]">No listing type data.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
