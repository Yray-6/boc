"use client";

import Image from "next/image";
import { useState } from "react";
import {
  PropertyDetailsModal,
  type PropertyDetail,
} from "@/components/admin/property-details-modal";
import { AdminDeleteConfirmModal } from "@/components/admin/admin-delete-confirm-modal";
import {
  AdminSuccessModal,
  type AdminSuccessVariant,
} from "@/components/admin/admin-success-modal";
import {
  PropertyFormModal,
  type PropertyFormValues,
  amenityIdsFromLabels,
} from "@/components/admin/property-form-modal";

type ModeKind = "buy" | "rent";

const properties = [
  {
    id: "1",
    title: "Luxury 5 Bedroom Duplex",
    agentName: "Sarah Johnson",
    locationLine1: "Lekki Phase 1",
    locationLine2: "Lagos",
    locationDisplay: "Lekki Phase 1, Lagos",
    type: "Duplex",
    mode: { kind: "buy" as ModeKind, label: "Buy" },
    price: "₦250,000,000",
    tableThumb: "/admin-dashboard/dash-thumb-1-36497e.png",
    heroImage: "/admin-dashboard/modal-hero.png",
    bedrooms: 5,
    bathrooms: 6,
    area: "450 sqm",
    parking: 4,
    description:
      "A stunning contemporary duplex in the heart of Lekki Phase 1.",
    amenities: ["Swimming Pool", "Gym", "24/7 Security"] as const,
    agentTitle: "Senior Property Consultant",
    agentAvatar: "/admin-dashboard/modal-agent-avatar-56586a.png",
  },
  {
    id: "2",
    title: "Modern 3 Bedroom Apartment",
    agentName: "Michael Chen",
    locationLine1: "Ikoyi",
    locationLine2: "Lagos",
    locationDisplay: "GRA, Ikoyi, Lagos",
    type: "Apartment",
    mode: { kind: "rent" as ModeKind, label: "Rent" },
    price: "₦15,000,000",
    tableThumb: "/admin-dashboard/dash-thumb-2-36497e.png",
    heroImage: "/admin-dashboard/dash-thumb-2-36497e.png",
    bedrooms: 3,
    bathrooms: 4,
    area: "210 sqm",
    parking: 2,
    description:
      "Bright, modern apartment with skyline views and premium finishes in Ikoyi.",
    amenities: ["Elevator", "Concierge", "Backup Power"] as const,
    agentTitle: "Property Advisor",
    agentAvatar: "/admin-dashboard/modal-agent-avatar-56586a.png",
  },
] as const;

function propertyToFormValues(
  p: (typeof properties)[number],
): PropertyFormValues {
  const agentByRow: Record<string, string> = { "1": "a1", "2": "a2" };
  const rawPrice = p.price.replace(/[₦,\s]/g, "").trim();
  return {
    title: p.title,
    propertyType: p.type,
    featured: false,
    description: p.description,
    agentId: agentByRow[p.id] ?? "",
    amenityIds: amenityIdsFromLabels([...p.amenities]),
    price: rawPrice || "0",
    listingMode: p.mode.kind === "rent" ? "rent" : "buy",
  };
}

function toPropertyDetail(
  p: (typeof properties)[number],
): PropertyDetail {
  return {
    id: p.id,
    title: p.title,
    locationDisplay: p.locationDisplay,
    price: p.price,
    modeLabel: p.mode.label,
    modeKind: p.mode.kind,
    heroImage: p.heroImage,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    parking: p.parking,
    description: p.description,
    amenities: [...p.amenities],
    agentName: p.agentName,
    agentTitle: p.agentTitle,
    agentAvatar: p.agentAvatar,
  };
}

function ModeBadge({ mode }: { mode: { kind: ModeKind; label: string } }) {
  if (mode.kind === "buy") {
    return (
      <span className="inline-flex rounded bg-[rgba(42,71,141,0.1)] px-2 py-0.5 text-[10px] font-bold uppercase leading-normal tracking-wide text-[#003A8C]">
        {mode.label}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded bg-[#F0FDFA] px-2 py-0.5 text-[10px] font-bold uppercase leading-normal tracking-wide text-[#009689]">
      {mode.label}
    </span>
  );
}

function StatusActive() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] py-1 pl-2 pr-2.5">
      <span className="size-1.5 shrink-0 rounded-full bg-[#00A63E]" aria-hidden />
      <span className="text-xs font-semibold leading-[1.333] text-[#00A63E]">
        Active
      </span>
    </span>
  );
}

const selectClass =
  "h-10 min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2 text-sm font-normal leading-[1.357] text-[#6A7282] outline-none ring-[#003A8C]/20 focus:ring-2";

function IconEye({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M1 12C2.5 7 7 4 12 4C17 4 21.5 7 23 12C21.5 17 17 20 12 20C7 20 2.5 17 1 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPen({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 20H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5C17.0304 2.96957 17.7348 2.67879 18.4655 2.67879C19.1962 2.67879 19.9006 2.96957 20.431 3.5C20.9614 4.03043 21.2522 4.73484 21.2522 5.46555C21.2522 6.19626 20.9614 6.90066 20.431 7.431L7.431 20.431C7.181 20.681 6.877 20.868 6.544 20.976L3 22L4.024 18.456C4.132 18.123 4.319 17.819 4.569 17.569L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3 6h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminProperties() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<PropertyFormValues | null>(
    null,
  );
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [successVariant, setSuccessVariant] =
    useState<AdminSuccessVariant | null>(null);
  const [deletePropertyTarget, setDeletePropertyTarget] = useState<
    (typeof properties)[number] | null
  >(null);

  const visibleProperties = properties.filter((p) => !removedIds.has(p.id));
  const selected = properties.find((p) => p.id === selectedId) ?? null;

  function openView(id: string) {
    setFormOpen(false);
    setSelectedId(id);
  }

  function openEdit(row: (typeof properties)[number]) {
    setSelectedId(null);
    setFormMode("edit");
    setFormInitial(propertyToFormValues(row));
    setFormOpen(true);
  }

  function openCreate() {
    setSelectedId(null);
    setFormMode("create");
    setFormInitial(null);
    setFormOpen(true);
  }

  function confirmDeleteProperty() {
    const row = deletePropertyTarget;
    if (!row) return;
    setRemovedIds((prev) => new Set([...prev, row.id]));
    if (selectedId === row.id) setSelectedId(null);
    setFormOpen(false);
    setDeletePropertyTarget(null);
    setSuccessVariant("property-deleted");
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <AdminDeleteConfirmModal
        open={deletePropertyTarget !== null}
        kind={deletePropertyTarget !== null ? "property" : null}
        onCancel={() => setDeletePropertyTarget(null)}
        onConfirm={confirmDeleteProperty}
      />
      <AdminSuccessModal
        open={successVariant !== null}
        variant={successVariant}
        onClose={() => setSuccessVariant(null)}
      />
      <PropertyDetailsModal
        property={selected ? toPropertyDetail(selected) : null}
        open={selected !== null}
        onClose={() => setSelectedId(null)}
      />
      <PropertyFormModal
        open={formOpen}
        mode={formMode}
        initial={formInitial}
        onClose={() => setFormOpen(false)}
        onPublish={() =>
          setSuccessVariant(
            formMode === "create" ? "property-listed" : "property-updated",
          )
        }
      />

      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
            Properties
          </h1>
          <p className="text-base font-normal leading-normal text-[#99A1AF]">
            Manage all your property listings from one place.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold leading-[1.4286] text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
          >
            <Image
              src="/admin-dashboard/props-export-csv.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            Export CSV
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003A8C] px-4 py-2 pb-[9px] pt-[9px] text-sm font-bold leading-[1.4286] text-white shadow-[0px_4px_6px_-4px_rgba(201,168,76,0.2),0px_10px_15px_-3px_rgba(201,168,76,0.2)] transition-colors hover:bg-[#002f73]"
          >
            <Image
              src="/admin-dashboard/props-add-property.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            Add New Property
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:flex-row sm:items-stretch sm:gap-4">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <Image
              src="/admin-dashboard/props-search.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          </span>
          <label htmlFor="props-search" className="sr-only">
            Search properties
          </label>
          <input
            id="props-search"
            type="search"
            placeholder="Search by title, location, or agent..."
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-4 text-sm font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <select
            name="status"
            defaultValue="all"
            className={`${selectClass} sm:min-w-[148px]`}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            name="type"
            defaultValue="all"
            className={`${selectClass} sm:min-w-[132px]`}
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="duplex">Duplex</option>
            <option value="apartment">Apartment</option>
          </select>
          <button
            type="button"
            className="flex h-10 shrink-0 items-center justify-center self-stretch rounded-xl border border-[#E5E7EB] bg-white px-2 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:w-10"
            aria-label="More filters"
          >
            <Image
              src="/admin-dashboard/props-filter.svg"
              alt=""
              width={36}
              height={39}
              className="h-9 w-9"
            />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[rgba(249,250,251,0.5)]">
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Property
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Mode
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleProperties.map((row) => (
                <tr
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openView(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openView(row.id);
                    }
                  }}
                  className="cursor-pointer border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-gray-50/80"
                >
                  <td className="px-6 py-4 align-middle">
                    <div className="flex max-w-[320px] items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
                        <Image
                          src={row.tableThumb}
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
                          Agent: {row.agentName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm font-normal leading-[1.4286] text-[#4A5565]">
                      {row.locationLine1}
                    </p>
                    <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
                      {row.locationLine2}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle text-sm font-normal leading-[1.4286] text-[#4A5565]">
                    {row.type}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <ModeBadge mode={row.mode} />
                  </td>
                  <td className="px-6 py-4 align-middle text-sm font-bold leading-[1.4286] text-[#1A1D24]">
                    {row.price}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <StatusActive />
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div
                      className="flex justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                        aria-label={`View details for ${row.title}`}
                        onClick={() => openView(row.id)}
                      >
                        <IconEye className="size-5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                        aria-label={`Edit ${row.title}`}
                        onClick={() => openEdit(row)}
                      >
                        <IconPen className="size-5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-red-50 hover:text-[#DC2626]"
                        aria-label={`Delete ${row.title}`}
                        onClick={() => setDeletePropertyTarget(row)}
                      >
                        <IconTrash className="size-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#F3F4F6] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
            Showing 1–25 of 143 properties
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 opacity-30"
              disabled
              aria-label="Previous page"
            >
              <Image
                src="/admin-dashboard/props-page-prev.svg"
                alt=""
                width={34}
                height={34}
                className="size-[34px]"
              />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg bg-[#003A8C] text-xs font-bold leading-[1.333] text-white"
                aria-current="page"
              >
                1
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg text-xs font-bold leading-[1.333] text-[#99A1AF] transition-colors hover:bg-gray-50"
              >
                2
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg text-xs font-bold leading-[1.333] text-[#99A1AF] transition-colors hover:bg-gray-50"
              >
                3
              </button>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50"
              aria-label="Next page"
            >
              <Image
                src="/admin-dashboard/props-page-next.svg"
                alt=""
                width={34}
                height={34}
                className="size-[34px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
