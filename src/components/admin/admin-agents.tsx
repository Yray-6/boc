"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AgentAssignedPropertiesModal,
  type AgentAssignedListing,
} from "@/components/admin/agent-assigned-properties-modal";
import { AdminDeleteConfirmModal } from "@/components/admin/admin-delete-confirm-modal";
import {
  PropertyDetailsModal,
  type PropertyDetail,
} from "@/components/admin/property-details-modal";
import {
  AdminSuccessModal,
  type AdminSuccessVariant,
} from "@/components/admin/admin-success-modal";
import {
  AgentFormModal,
  type AgentFormValues,
} from "@/components/admin/agent-form-modal";
import {
  apiAgentToRecord,
  assignedPropertyToListing,
  detailAndFormToUpdatePayload,
  detailToFormValues,
  detailWithActiveFlag,
  formToCreatePayload,
  type AdminAgentRecord,
} from "@/lib/admin-agent-mappers";
import {
  createAdminAgent,
  deleteAdminAgent,
  fetchAdminAgentDetail,
  updateAdminAgent,
} from "@/lib/admin-agents-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";
import {
  useAdminAgentDetailQuery,
  useAdminAgentListQuery,
  useAdminAgentPropertiesQuery,
} from "@/lib/hooks/use-admin-agents-queries";
import { useAdminPropertyDetailQuery } from "@/lib/hooks/use-admin-properties-queries";
import { detailToPropertyDetail } from "@/lib/admin-property-mappers";
import type { AdminAgentDetail } from "@/types/admin-agent";

const PAGE_SIZE = 12;

function AgentAvatar({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote API URLs
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

const selectClass =
  "h-10 min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-2 text-sm font-normal leading-[1.357] text-[#6A7282] outline-none ring-[#003A8C]/20 focus:ring-2";

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 6h16v12H4V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8.5 3h-1A2.5 2.5 0 005 5.5v13A2.5 2.5 0 007.5 21h9a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0016.5 3h-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconListings({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
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

function IconVisible({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VisibilityPill({ visible }: { visible: boolean }) {
  if (!visible) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1 text-xs font-semibold leading-[1.333] text-[#6A7282]">
        Hidden
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-xs font-semibold leading-[1.333] text-[#00A63E]">
      <IconVisible className="size-3 shrink-0" />
      Visible
    </span>
  );
}

function SpecBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded border border-[#F3F4F6] bg-[#F9FAFB] px-2 py-0.5 text-[10px] font-bold uppercase leading-normal tracking-wide text-[#6A7282]">
      {label}
    </span>
  );
}

export function AdminAgents() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [listError, setListError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [specFilter, setSpecFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const [assignedAgentId, setAssignedAgentId] = useState<string | null>(null);
  const [editingAgentId, setEditingAgentId] = useState<number | null>(null);

  const [viewPropertySlug, setViewPropertySlug] = useState<string | null>(null);
  const [propertyDetailOpen, setPropertyDetailOpen] = useState(false);
  const viewPropertyDetailQuery = useAdminPropertyDetailQuery(viewPropertySlug);
  const viewPropertyDetail = viewPropertyDetailQuery.data
    ? detailToPropertyDetail(viewPropertyDetailQuery.data)
    : null;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<AgentFormValues | null>(null);
  const [editingDetail, setEditingDetail] = useState<AdminAgentDetail | null>(
    null,
  );
  const [successVariant, setSuccessVariant] =
    useState<AdminSuccessVariant | null>(null);
  const [deleteAgentTarget, setDeleteAgentTarget] =
    useState<AdminAgentRecord | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const t = window.setTimeout(() => setSearchQuery(searchInput), 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const listParams = useMemo(() => {
    const params: Record<string, string> = {
      page: String(page),
      page_size: String(PAGE_SIZE),
    };
    if (searchQuery.trim()) params.search = searchQuery.trim();
    return params;
  }, [page, searchQuery]);

  const listQuery = useAdminAgentListQuery(listParams);
  const listData = listQuery.data ?? null;
  const listLoading = listQuery.isLoading || listQuery.isFetching;
  const agentRecords = useMemo(
    () => (listData ? listData.results.map((r) => apiAgentToRecord(r)) : []),
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

  useEffect(() => {
    if (listQuery.error) {
      setListError(
        listQuery.error instanceof Error
          ? listQuery.error.message
          : "Failed to load agents",
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

  const assignedAgentNum = assignedAgentId ? Number(assignedAgentId) : null;
  const assignedPropsQuery = useAdminAgentPropertiesQuery(
    assignedAgentNum,
    assignedAgentId !== null,
  );
  const assignedListings = useMemo(
    () => (assignedPropsQuery.data ?? []).map(assignedPropertyToListing),
    [assignedPropsQuery.data],
  );
  const listingsLoading = assignedPropsQuery.isLoading || assignedPropsQuery.isFetching;

  const editDetailQuery = useAdminAgentDetailQuery(
    editingAgentId,
    formMode === "edit" && formOpen,
  );

  useEffect(() => {
    if (formMode !== "edit" || !formOpen) return;
    if (!editDetailQuery.data) return;
    setEditingDetail(editDetailQuery.data);
    setFormInitial(detailToFormValues(editDetailQuery.data));
  }, [editDetailQuery.data, formMode, formOpen]);

  useEffect(() => {
    if (!formOpen || formMode !== "edit") return;
    if (!editDetailQuery.error) return;
    setListError(
      editDetailQuery.error instanceof Error
        ? editDetailQuery.error.message
        : "Failed to load agent",
    );
    setFormOpen(false);
    setEditingAgentId(null);
    setEditingDetail(null);
    setFormInitial(null);
  }, [editDetailQuery.error, formMode, formOpen]);

  const assignedAgent = useMemo(
    () => agentRecords.find((a) => a.id === assignedAgentId) ?? null,
    [agentRecords, assignedAgentId],
  );

  const visibleAgents = useMemo(() => {
    return agentRecords.filter((a) => {
      if (specFilter !== "all") {
        const match = a.specialisations.some(
          (s) => s.toLowerCase() === specFilter.toLowerCase(),
        );
        if (!match) return false;
      }
      if (visibilityFilter === "visible" && !a.visible) return false;
      if (visibilityFilter === "hidden" && a.visible) return false;
      return true;
    });
  }, [agentRecords, specFilter, visibilityFilter]);

  const createMutation = useMutation({
    mutationFn: createAdminAgent,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.agents.root }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.properties.formData(),
        }),
      ]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateAdminAgent>[1] }) =>
      updateAdminAgent(id, payload),
    onSuccess: async (_, vars) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.agents.root }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.agents.detail(vars.id),
        }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminAgent,
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.agents.root }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.agents.detail(id),
        }),
      ]);
    },
  });

  const openAssigned = useCallback((id: string) => {
    setFormOpen(false);
    setEditingAgentId(null);
    setAssignedAgentId(id);
  }, []);

  const openCreateAgent = useCallback(() => {
    setAssignedAgentId(null);
    setEditingAgentId(null);
    setEditingDetail(null);
    setFormMode("create");
    setFormInitial(null);
    setActionError(null);
    setFormOpen(true);
  }, []);

  const openEditAgent = useCallback((row: AdminAgentRecord) => {
    setActionError(null);
    setAssignedAgentId(null);
    setEditingAgentId(Number(row.id));
    setEditingDetail(null);
    setFormInitial(null);
    setFormMode("edit");
    setFormOpen(true);
  }, []);

  const handleSaveAgent = useCallback(
    async (values: AgentFormValues) => {
      setActionError(null);
      try {
        if (formMode === "create") {
          await createMutation.mutateAsync(formToCreatePayload(values));
          setSuccessVariant("agent-added");
        } else {
          if (!editingDetail) {
            throw new Error("Agent data is not loaded.");
          }
          await updateMutation.mutateAsync({
            id: editingDetail.id,
            payload: detailAndFormToUpdatePayload(editingDetail, values),
          });
          setSuccessVariant("agent-updated");
        }
        setEditingDetail(null);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Save failed";
        setActionError(msg);
        throw e;
      }
    },
    [createMutation, editingDetail, formMode, updateMutation],
  );

  const confirmDeleteAgent = useCallback(async () => {
    const row = deleteAgentTarget;
    if (!row) return;
    setListError(null);
    setActionError(null);
    try {
      await deleteMutation.mutateAsync(Number(row.id));
      if (assignedAgentId === row.id) setAssignedAgentId(null);
      if (editingDetail?.id === Number(row.id)) {
        setEditingAgentId(null);
        setEditingDetail(null);
        setFormOpen(false);
      }
      setDeleteAgentTarget(null);
      setSuccessVariant("agent-deleted");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed");
      setDeleteAgentTarget(null);
    }
  }, [assignedAgentId, deleteAgentTarget, deleteMutation, editingDetail]);

  const toggleVisibility = useCallback(
    async (row: AdminAgentRecord) => {
      setActionError(null);
      try {
        const d = await fetchAdminAgentDetail(Number(row.id));
        await updateMutation.mutateAsync({
          id: d.id,
          payload: detailWithActiveFlag(d, !d.is_active),
        });
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Update failed");
      }
    },
    [updateMutation],
  );

  const rangeLabel = useMemo(() => {
    if (!listMeta || listMeta.count === 0) return "No agents";
    const start = (listMeta.current_page - 1) * listMeta.page_size + 1;
    const end = Math.min(
      listMeta.current_page * listMeta.page_size,
      listMeta.count,
    );
    return `Showing ${start}–${end} of ${listMeta.count} agents`;
  }, [listMeta]);

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <AdminDeleteConfirmModal
        open={deleteAgentTarget !== null}
        kind={deleteAgentTarget !== null ? "agent" : null}
        onCancel={() => setDeleteAgentTarget(null)}
        onConfirm={() => void confirmDeleteAgent()}
      />
      <AdminSuccessModal
        open={successVariant !== null}
        variant={successVariant}
        onClose={() => setSuccessVariant(null)}
      />
      <PropertyDetailsModal
        property={viewPropertyDetail}
        open={propertyDetailOpen}
        onClose={() => {
          setPropertyDetailOpen(false);
          setViewPropertySlug(null);
        }}
      />
      <AgentAssignedPropertiesModal
        agentName={assignedAgent?.name ?? ""}
        listings={listingsLoading ? [] : assignedListings}
        open={assignedAgentId !== null && assignedAgent !== null}
        onClose={() => setAssignedAgentId(null)}
        onView={(slug) => {
          setViewPropertySlug(slug);
          setPropertyDetailOpen(true);
        }}
      />
      <AgentFormModal
        open={formOpen}
        mode={formMode}
        initial={formInitial}
        detailLoading={formMode === "edit" && !formInitial}
        onClose={() => {
          setFormOpen(false);
          setEditingAgentId(null);
          setEditingDetail(null);
          setFormInitial(null);
        }}
        onSave={handleSaveAgent}
      />

      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
            Agents
          </h1>
          <p className="text-base font-normal leading-normal text-[#99A1AF]">
            Manage agent profiles displayed on the website.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
          <button
            type="button"
            disabled
            title="Export is not available for agents yet"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold leading-[1.4286] text-[#99A1AF] opacity-60 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
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
            onClick={openCreateAgent}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003A8C] px-4 py-2 pb-[9px] pt-[9px] text-sm font-bold leading-[1.4286] text-white shadow-[0px_4px_6px_-4px_rgba(201,168,76,0.2),0px_10px_15px_-3px_rgba(201,168,76,0.2)] transition-colors hover:bg-[#002f73]"
          >
            <Image
              src="/admin-dashboard/dash-btn-add-agent.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            Add New Agent
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
          <label htmlFor="agents-search" className="sr-only">
            Search agents
          </label>
          <input
            id="agents-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-4 text-sm font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <select
            name="specialization"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className={`${selectClass} sm:min-w-[148px]`}
            aria-label="Filter by specialization"
          >
            <option value="all">All Specializations</option>
            <option value="Sales">Sales</option>
            <option value="Commercial">Commercial</option>
            <option value="Rentals">Rentals</option>
          </select>
          <select
            name="visibility"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className={`${selectClass} sm:min-w-[132px]`}
            aria-label="Filter by visibility"
          >
            <option value="all">All visibility</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
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
                  Agent
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Specialization
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Listings
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#99A1AF]"
                >
                  Visibility
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
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#99A1AF]">
                    Loading agents…
                  </td>
                </tr>
              ) : visibleAgents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#99A1AF]">
                    No agents match your filters.
                  </td>
                </tr>
              ) : (
                visibleAgents.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex max-w-[320px] items-center gap-4">
                        <AgentAvatar src={row.avatar} alt="" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-[1.4286] text-[#1A1D24]">
                            {row.name}
                          </p>
                          <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
                            {row.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-[#6A7282]">
                        <a
                          href={`mailto:${row.email}`}
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                          aria-label={`Email ${row.name}`}
                        >
                          <IconMail />
                        </a>
                        <a
                          href={`tel:${row.phone.replace(/\s/g, "")}`}
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                          aria-label={`Call ${row.name}`}
                        >
                          <IconPhone />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-wrap gap-1.5">
                        {row.specialisations.length === 0 ? (
                          <span className="text-xs text-[#99A1AF]">—</span>
                        ) : (
                          row.specialisations.map((s) => (
                            <SpecBadge key={s} label={String(s)} />
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <button
                        type="button"
                        onClick={() => openAssigned(row.id)}
                        className="inline-flex items-center gap-1 text-sm font-bold leading-[1.4286] text-[#003A8C] transition-opacity hover:opacity-80"
                        aria-label={`${row.listingsCount} listings for ${row.name}`}
                      >
                        {row.listingsCount}
                        <IconListings className="shrink-0" />
                      </button>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <button
                        type="button"
                        onClick={() => void toggleVisibility(row)}
                        className="text-left"
                        aria-pressed={row.visible}
                        aria-label={`Toggle visibility for ${row.name}`}
                      >
                        <VisibilityPill visible={row.visible} />
                      </button>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div
                        className="flex justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => openAssigned(row.id)}
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                          aria-label={`View details for ${row.name}`}
                        >
                          <IconEye className="size-5" />
                        </button>
                        <button
                          type="button"
                          onMouseEnter={() => {
                            const id = Number(row.id);
                            void queryClient.prefetchQuery({
                              queryKey: adminQueryKeys.agents.detail(id),
                              queryFn: () => fetchAdminAgentDetail(id),
                            });
                          }}
                          onFocus={() => {
                            const id = Number(row.id);
                            void queryClient.prefetchQuery({
                              queryKey: adminQueryKeys.agents.detail(id),
                              queryFn: () => fetchAdminAgentDetail(id),
                            });
                          }}
                          onClick={() => openEditAgent(row)}
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-gray-100 hover:text-[#62748E]"
                          aria-label={`Edit ${row.name}`}
                        >
                          <IconPen className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteAgentTarget(row)}
                          className="rounded-lg p-2 text-[#99A1AF] transition-colors hover:bg-red-50 hover:text-[#DC2626]"
                          aria-label={`Remove ${row.name}`}
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
            {listMeta
              ? `${rangeLabel} · ${visibleAgents.length} on this page after filters`
              : "—"}
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
