"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
} from "@/components/admin/property-form-modal";
import {
  createAdminProperty,
  deleteAdminProperty,
  downloadAdminPropertiesCsv,
  fetchAdminPropertyDetailMerged,
  uploadAdminPropertyImages,
  uploadAdminPropertyVideos,
  updateAdminProperty,
} from "@/lib/admin-properties-client";
import { buildFallbackPropertyFormData } from "@/lib/property-form-dropdowns";
import { adminQueryKeys } from "@/lib/admin-query-keys";
import {
  useAdminPropertyDetailQuery,
  useAdminPropertyFormDataQuery,
  useAdminPropertyListQuery,
} from "@/lib/hooks/use-admin-properties-queries";
import {
  detailToFormValues,
  detailToPropertyDetail,
  formValuesToWritePayload,
  listItemToTableRow,
  type PropertyTableRow,
} from "@/lib/admin-property-mappers";
import type { AdminPropertyDetail } from "@/types/admin-property";

type ModeKind = "buy" | "rent";

function Thumb({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote API URLs not in next/image config
      <img src={src} alt={alt} className="h-12 w-12 rounded-lg object-cover" />
    );
  }
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="48px"
      />
    </div>
  );
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

const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  ACTIVE:   { dot: "bg-[#00A63E]",  bg: "bg-[#F0FDF4]",  text: "text-[#00A63E]" },
  DRAFT:    { dot: "bg-amber-500",  bg: "bg-amber-50",    text: "text-amber-800" },
  INACTIVE: { dot: "bg-slate-400",  bg: "bg-slate-100",   text: "text-slate-600" },
  SOLD:     { dot: "bg-red-500",    bg: "bg-red-50",      text: "text-red-700"   },
  RENTED:   { dot: "bg-sky-500",    bg: "bg-sky-50",      text: "text-sky-800"   },
  LEASED:   { dot: "bg-violet-500", bg: "bg-violet-50",   text: "text-violet-800"},
};

const STATUS_FALLBACK = { dot: "bg-[#99A1AF]", bg: "bg-[#F3F4F6]", text: "text-[#4A5565]" };

function StatusBadge({ status, label }: { status: string; label: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_FALLBACK;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-2 pr-2.5 ${style.bg}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${style.dot}`} aria-hidden />
      <span className={`text-xs font-semibold leading-[1.333] ${style.text}`}>
        {label}
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

const PAGE_SIZE = 12;

export function AdminProperties() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listError, setListError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [viewProperty, setViewProperty] = useState<PropertyDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<PropertyFormValues | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingDetail, setEditingDetail] = useState<AdminPropertyDetail | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const [successVariant, setSuccessVariant] =
    useState<AdminSuccessVariant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PropertyTableRow | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const t = window.setTimeout(() => setSearchQuery(searchInput), 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const listParams = useMemo(() => {
    const params: Record<string, string> = {
      page: String(page),
      page_size: String(PAGE_SIZE),
    };
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    return params;
  }, [page, searchQuery, statusFilter]);

  const listQuery = useAdminPropertyListQuery(listParams);
  const listData = listQuery.data ?? null;
  const rows = useMemo(
    () => (listData ? listData.results.map(listItemToTableRow) : []),
    [listData],
  );
  const listMeta = listData
    ? {
        count: listData.count,
        total_pages: listData.total_pages,
        current_page: listData.current_page,
        page_size: listData.page_size,
      }
    : null;
  const listLoading = listQuery.isLoading || listQuery.isFetching;

  useEffect(() => {
    if (listQuery.error) {
      setListError(
        listQuery.error instanceof Error
          ? listQuery.error.message
          : "Failed to load properties",
      );
      return;
    }
    setListError(null);
  }, [listQuery.error]);

  useEffect(() => {
    if (listData && listData.current_page !== page) {
      setPage(listData.current_page);
    }
  }, [listData, page]);

  const formDataQuery = useAdminPropertyFormDataQuery();
  const propertyFormDropdowns = formDataQuery.data ?? buildFallbackPropertyFormData();

  const editDetailQuery = useAdminPropertyDetailQuery(
    editingSlug,
    formOpen && formMode === "edit",
  );

  useEffect(() => {
    if (formMode !== "edit" || !formOpen) return;
    if (!editDetailQuery.data) return;
    setEditingDetail(editDetailQuery.data);
    setFormInitial(detailToFormValues(editDetailQuery.data, propertyFormDropdowns));
  }, [editDetailQuery.data, formMode, formOpen, propertyFormDropdowns]);

  useEffect(() => {
    if (!formOpen || formMode !== "edit") return;
    if (!editDetailQuery.error) return;
    const msg =
      editDetailQuery.error instanceof Error
        ? editDetailQuery.error.message
        : "Failed to load property";
    setListError(msg);
    setFormOpen(false);
    setEditingSlug(null);
    setEditingDetail(null);
    setFormInitial(null);
  }, [editDetailQuery.error, formMode, formOpen]);

  const visibleRows = useMemo(() => {
    if (typeFilter === "all") return rows;
    const q = typeFilter.toLowerCase();
    return rows.filter((r) => r.type.toLowerCase().includes(q));
  }, [rows, typeFilter]);

  const createMutation = useMutation({
    mutationFn: createAdminProperty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.properties.root,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: Parameters<typeof updateAdminProperty>[1] }) =>
      updateAdminProperty(slug, payload),
    onSuccess: async (_, vars) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.properties.root,
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.properties.detail(vars.slug),
        }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProperty,
    onSuccess: async (_, slug) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.properties.root,
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.properties.detail(slug),
        }),
      ]);
    },
  });

  async function openView(slug: string) {
    setListError(null);
    try {
      const d = await fetchAdminPropertyDetailMerged(slug);
      setViewProperty(detailToPropertyDetail(d, propertyFormDropdowns));
      setDetailOpen(true);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load property");
    }
  }

  function openEdit(row: PropertyTableRow) {
    setListError(null);
    setActionError(null);
    setEditingDetail(null);
    setFormInitial(null);
    setEditingSlug(row.slug);
    setFormMode("edit");
    setDetailOpen(false);
    setViewProperty(null);
    setFormOpen(true);
  }

  function openCreate() {
    setActionError(null);
    setEditingDetail(null);
    setEditingSlug(null);
    setFormMode("create");
    setFormInitial(null);
    setDetailOpen(false);
    setViewProperty(null);
    setFormOpen(true);
  }

  async function confirmDeleteProperty() {
    const row = deleteTarget;
    if (!row) return;
    setListError(null);
    try {
      await deleteMutation.mutateAsync(row.slug);
      if (viewProperty?.id === row.slug) {
        setDetailOpen(false);
        setViewProperty(null);
      }
      setDeleteTarget(null);
      setSuccessVariant("property-deleted");
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Delete failed");
      setDeleteTarget(null);
    }
  }

  async function handleExportCsv() {
    setExporting(true);
    setListError(null);
    try {
      await downloadAdminPropertiesCsv();
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const rangeLabel = useMemo(() => {
    if (!listMeta || listMeta.count === 0) return "No properties";
    const start = (listMeta.current_page - 1) * listMeta.page_size + 1;
    const end = Math.min(
      listMeta.current_page * listMeta.page_size,
      listMeta.count,
    );
    return `Showing ${start}–${end} of ${listMeta.count} properties`;
  }, [listMeta]);

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <AdminDeleteConfirmModal
        open={deleteTarget !== null}
        kind={deleteTarget !== null ? "property" : null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDeleteProperty()}
      />
      <AdminSuccessModal
        open={successVariant !== null}
        variant={successVariant}
        onClose={() => setSuccessVariant(null)}
      />
      <PropertyDetailsModal
        property={viewProperty}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setViewProperty(null);
        }}
      />
      <PropertyFormModal
        open={formOpen}
        mode={formMode}
        initial={formInitial}
        dropdowns={propertyFormDropdowns}
        detailLoading={formMode === "edit" && !formInitial}
        editingSlug={editingSlug}
        onClose={() => {
          setFormOpen(false);
          setEditingSlug(null);
          setEditingDetail(null);
          setFormInitial(null);
        }}
        onPublish={async (values) => {
          setActionError(null);
          if (formMode === "create" && (values.images?.length ?? 0) === 0) {
            throw new Error("Add at least one listing image before publishing.");
          }
          const payload = formValuesToWritePayload(
            values,
            formMode === "edit" ? editingDetail : null,
            propertyFormDropdowns,
          );
          if (!payload.agent) {
            throw new Error("Please assign an agent before publishing.");
          }
          try {
            if (formMode === "create") {
              const created = await createMutation.mutateAsync(payload);
              const files = values.images ?? [];
              if (files.length > 0 && created.slug) {
                await uploadAdminPropertyImages(created.slug, files);
              }
              const videos = values.videos ?? [];
              if (videos.length > 0 && created.slug) {
                await uploadAdminPropertyVideos(created.slug, videos, {
                  thumbnail: values.videoThumbnail ?? undefined,
                  title: values.videoTitle?.trim() || undefined,
                });
              }
            } else if (editingSlug) {
              await updateMutation.mutateAsync({ slug: editingSlug, payload });
              const files = values.images ?? [];
              if (files.length > 0) {
                await uploadAdminPropertyImages(editingSlug, files);
              }
              const videos = values.videos ?? [];
              if (videos.length > 0) {
                await uploadAdminPropertyVideos(editingSlug, videos, {
                  thumbnail: values.videoThumbnail ?? undefined,
                  title: values.videoTitle?.trim() || undefined,
                });
              }
            }
            setFormOpen(false);
            setEditingSlug(null);
            setEditingDetail(null);
            setSuccessVariant(
              formMode === "create" ? "property-listed" : "property-updated",
            );
          } catch (e) {
            setActionError(e instanceof Error ? e.message : "Save failed");
            throw e;
          }
        }}
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
            disabled={exporting || listLoading}
            onClick={() => void handleExportCsv()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold leading-[1.4286] text-[#1A1D24] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Image
              src="/admin-dashboard/props-export-csv.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            {exporting ? "Exporting…" : "Export CSV"}
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

      {listError ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {listError}
        </p>
      ) : null}
      {actionError ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {actionError}
        </p>
      ) : null}

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, location, or agent..."
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-4 text-sm font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${selectClass} sm:min-w-[148px]`}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
            <option value="LEASED">Leased</option>
          </select>
          <select
            name="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`${selectClass} sm:min-w-[132px]`}
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="duplex">Duplex</option>
            <option value="apartment">Apartment</option>
            <option value="penthouse">Penthouse</option>
            <option value="villa">Villa</option>
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
              {listLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#99A1AF]">
                    Loading properties…
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#99A1AF]">
                    No properties match your filters.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr
                    key={row.slug}
                    role="button"
                    tabIndex={0}
                    onClick={() => void openView(row.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        void openView(row.slug);
                      }
                    }}
                    className="cursor-pointer border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex max-w-[320px] items-center gap-4">
                        <Thumb src={row.tableThumb} alt="" />
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
                      <StatusBadge status={row.status} label={row.statusDisplay} />
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
                          onClick={() => void openView(row.slug)}
                        >
                          <IconEye className="size-5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                          aria-label={`Edit ${row.title}`}
                          onMouseEnter={() => {
                            void queryClient.prefetchQuery({
                              queryKey: adminQueryKeys.properties.detail(row.slug),
                              queryFn: () => fetchAdminPropertyDetailMerged(row.slug),
                            });
                          }}
                          onFocus={() => {
                            void queryClient.prefetchQuery({
                              queryKey: adminQueryKeys.properties.detail(row.slug),
                              queryFn: () => fetchAdminPropertyDetailMerged(row.slug),
                            });
                          }}
                          onClick={() => openEdit(row)}
                        >
                          <IconPen className="size-5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-red-50 hover:text-[#DC2626]"
                          aria-label={`Delete ${row.title}`}
                          onClick={() => setDeleteTarget(row)}
                        >
                          <IconTrash className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#F3F4F6] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
            {rangeLabel}
          </p>
          {listMeta && listMeta.total_pages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50 disabled:opacity-30"
                disabled={page <= 1 || listLoading}
                aria-label="Previous page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Image
                  src="/admin-dashboard/props-page-prev.svg"
                  alt=""
                  width={34}
                  height={34}
                  className="size-[34px]"
                />
              </button>
              <span className="px-2 text-xs font-semibold text-[#4A5565]">
                Page {listMeta.current_page} of {listMeta.total_pages}
              </span>
              <button
                type="button"
                className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-50 disabled:opacity-30"
                disabled={page >= listMeta.total_pages || listLoading}
                aria-label="Next page"
                onClick={() => setPage((p) => p + 1)}
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
