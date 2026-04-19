"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  AgentAssignedPropertiesModal,
  type AgentAssignedListing,
} from "@/components/admin/agent-assigned-properties-modal";
import { AdminDeleteConfirmModal } from "@/components/admin/admin-delete-confirm-modal";
import {
  AdminSuccessModal,
  type AdminSuccessVariant,
} from "@/components/admin/admin-success-modal";
import {
  AgentFormModal,
  AGENT_SPEC_OPTIONS,
  type AgentFormValues,
} from "@/components/admin/agent-form-modal";

export type AdminAgentRecord = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  specializations: string[];
  listingsCount: number;
  visible: boolean;
  bio: string;
};

const INITIAL_AGENT_RECORDS: AdminAgentRecord[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Senior Property Consultant",
    email: "sarah.j@bocrealestate.com",
    phone: "+234 801 234 5678",
    avatar: "/admin-dashboard/modal-agent-avatar-56586a.png",
    specializations: ["Sales", "Commercial"],
    listingsCount: 3,
    visible: true,
    bio: "Experienced consultant focused on luxury residential sales in Lagos.",
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Leasing Specialist",
    email: "michael.c@bocrealestate.com",
    phone: "+234 802 345 6789",
    avatar: "/admin-dashboard/dash-thumb-2-36497e.png",
    specializations: ["Rentals"],
    listingsCount: 3,
    visible: true,
    bio: "Specialist in high-end rentals and tenant placement across Ikoyi.",
  },
];

const SPEC_LABEL_TO_KEY: Record<string, string> = {
  Sales: "sales",
  Rentals: "rentals",
  Commercial: "commercial",
};

function labelSpecsToKeys(labels: readonly string[]) {
  return labels
    .map((l) => SPEC_LABEL_TO_KEY[l])
    .filter((x): x is string => Boolean(x));
}

function specKeysToLabels(keys: string[]): string[] {
  return keys.flatMap((k) => {
    const o = AGENT_SPEC_OPTIONS.find((x) => x.id === k);
    return o ? [o.label] : [];
  });
}

function rowToFormValues(row: AdminAgentRecord): AgentFormValues {
  return {
    fullName: row.name,
    jobTitle: row.title,
    email: row.email,
    phone: row.phone,
    bio: row.bio,
    specializationKeys: labelSpecsToKeys(row.specializations),
  };
}

function getListingsForAgent(agentId: string): AgentAssignedListing[] {
  if (agentId === "1") {
    const base = {
      title: "Luxury 5 Bedroom Duplex",
      location: "Lekki Phase 1, Lagos Island",
      price: "₦250,000,000",
      thumb: "/admin-dashboard/dash-thumb-1-36497e.png",
      status: "Active" as const,
    };
    return [0, 1, 2].map((i) => ({
      ...base,
      id: `1-${i}`,
    }));
  }
  if (agentId === "2") {
    const base = {
      title: "Modern 3 Bedroom Apartment",
      location: "GRA, Ikoyi, Lagos",
      price: "₦15,000,000",
      thumb: "/admin-dashboard/dash-thumb-2-36497e.png",
      status: "Active" as const,
    };
    return [0, 1, 2].map((i) => ({
      ...base,
      id: `2-${i}`,
    }));
  }
  return [];
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
  const [agentRecords, setAgentRecords] =
    useState<AdminAgentRecord[]>(INITIAL_AGENT_RECORDS);
  const [query, setQuery] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INITIAL_AGENT_RECORDS.map((a) => [a.id, a.visible])),
  );
  const [assignedAgentId, setAssignedAgentId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<AgentFormValues | null>(null);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [successVariant, setSuccessVariant] =
    useState<AdminSuccessVariant | null>(null);
  const [deleteAgentTarget, setDeleteAgentTarget] =
    useState<AdminAgentRecord | null>(null);

  const assignedAgent = useMemo(
    () => agentRecords.find((a) => a.id === assignedAgentId) ?? null,
    [agentRecords, assignedAgentId],
  );

  const assignedListings = useMemo(
    () => (assignedAgentId ? getListingsForAgent(assignedAgentId) : []),
    [assignedAgentId],
  );

  const visibleAgents = useMemo(() => {
    return agentRecords.filter((a) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const hay = `${a.name} ${a.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (specFilter !== "all") {
        if (!a.specializations.includes(specFilter)) return false;
      }
      const vis = visibility[a.id] ?? true;
      if (visibilityFilter === "visible" && !vis) return false;
      if (visibilityFilter === "hidden" && vis) return false;
      return true;
    });
  }, [agentRecords, query, specFilter, visibilityFilter, visibility]);

  const openAssigned = useCallback((id: string) => {
    setFormOpen(false);
    setAssignedAgentId(id);
  }, []);

  const openCreateAgent = useCallback(() => {
    setAssignedAgentId(null);
    setEditingAgentId(null);
    setFormMode("create");
    setFormInitial(null);
    setFormOpen(true);
  }, []);

  const openEditAgent = useCallback((row: AdminAgentRecord) => {
    setAssignedAgentId(null);
    setEditingAgentId(row.id);
    setFormMode("edit");
    setFormInitial(rowToFormValues(row));
    setFormOpen(true);
  }, []);

  const handleSaveAgent = useCallback(
    (values: AgentFormValues) => {
      const labels = specKeysToLabels(values.specializationKeys);
      if (formMode === "create") {
        const id = `a-${Date.now()}`;
        setAgentRecords((prev) => [
          ...prev,
          {
            id,
            name: values.fullName,
            title: values.jobTitle,
            email: values.email,
            phone: values.phone,
            avatar: "/admin-dashboard/modal-agent-avatar-56586a.png",
            specializations: labels,
            listingsCount: 0,
            visible: true,
            bio: values.bio,
          },
        ]);
        setVisibility((prev) => ({ ...prev, [id]: true }));
        setSuccessVariant("agent-added");
        return;
      }
      if (!editingAgentId) return;
      setAgentRecords((prev) =>
        prev.map((a) =>
          a.id === editingAgentId
            ? {
                ...a,
                name: values.fullName,
                title: values.jobTitle,
                email: values.email,
                phone: values.phone,
                bio: values.bio,
                specializations: labels,
              }
            : a,
        ),
      );
      setSuccessVariant("agent-updated");
    },
    [editingAgentId, formMode],
  );

  const confirmDeleteAgent = useCallback(() => {
    const row = deleteAgentTarget;
    if (!row) return;
    setAgentRecords((prev) => prev.filter((a) => a.id !== row.id));
    setVisibility((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    if (assignedAgentId === row.id) setAssignedAgentId(null);
    if (editingAgentId === row.id) {
      setEditingAgentId(null);
      setFormOpen(false);
    }
    setDeleteAgentTarget(null);
    setSuccessVariant("agent-deleted");
  }, [assignedAgentId, deleteAgentTarget, editingAgentId]);

  function toggleVisibility(id: string) {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <AdminDeleteConfirmModal
        open={deleteAgentTarget !== null}
        kind={deleteAgentTarget !== null ? "agent" : null}
        onCancel={() => setDeleteAgentTarget(null)}
        onConfirm={confirmDeleteAgent}
      />
      <AdminSuccessModal
        open={successVariant !== null}
        variant={successVariant}
        onClose={() => setSuccessVariant(null)}
      />
      <AgentAssignedPropertiesModal
        agentName={assignedAgent?.name ?? ""}
        listings={assignedListings}
        open={assignedAgentId !== null && assignedAgent !== null}
        onClose={() => setAssignedAgentId(null)}
      />
      <AgentFormModal
        open={formOpen}
        mode={formMode}
        initial={formInitial}
        onClose={() => setFormOpen(false)}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              {visibleAgents.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-gray-50/80"
                >
                  <td className="px-6 py-4 align-middle">
                    <div className="flex max-w-[320px] items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
                        <Image
                          src={row.avatar}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
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
                      {row.specializations.map((s) => (
                        <SpecBadge key={s} label={String(s)} />
                      ))}
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
                      onClick={() => toggleVisibility(row.id)}
                      className="text-left"
                      aria-pressed={visibility[row.id]}
                      aria-label={`Toggle visibility for ${row.name}`}
                    >
                      <VisibilityPill visible={visibility[row.id] ?? true} />
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#F3F4F6] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-normal leading-[1.333] text-[#99A1AF]">
            {visibleAgents.length === 0
              ? `Showing 0 of ${agentRecords.length} agents`
              : `Showing 1–${visibleAgents.length} of ${agentRecords.length} agents`}
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
