"use client";

import { useState } from "react";
import {
  useAdminEnquiriesQuery,
  useAdminEnquiryStatusMutation,
} from "@/lib/hooks/use-admin-enquiries-queries";
import type { AdminEnquiry, EnquiryStatus } from "@/types/admin-enquiry";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  NEW: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    dot: "bg-[#2563EB]",
  },
  IN_PROGRESS: {
    bg: "bg-[#FFFBEB]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  RESOLVED: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#00A63E]",
    dot: "bg-[#00A63E]",
  },
  CLOSED: {
    bg: "bg-[#F9FAFB]",
    text: "text-[#6B7280]",
    dot: "bg-[#6B7280]",
  },
};

const STATUS_OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const s = STATUS_STYLES[status] ?? {
    bg: "bg-[#F9FAFB]",
    text: "text-[#6B7280]",
    dot: "bg-[#6B7280]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-[1.333] ${s.bg} ${s.text}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

// ── Enquiry detail drawer ─────────────────────────────────────────────────────

function EnquiryDetailDrawer({
  enquiry,
  onClose,
}: {
  enquiry: AdminEnquiry;
  onClose: () => void;
}) {
  const statusMutation = useAdminEnquiryStatusMutation();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<EnquiryStatus>(
    enquiry.status,
  );

  async function handleStatusChange(next: EnquiryStatus) {
    setStatusError(null);
    setLocalStatus(next);
    try {
      await statusMutation.mutateAsync({ id: enquiry.id, body: { status: next } });
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Failed to update status");
      setLocalStatus(enquiry.status);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal>
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col gap-6 overflow-y-auto bg-white p-6 shadow-xl [font-family:var(--font-urbanist)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold leading-[1.3] text-[#1A1D24]">
              Enquiry #{enquiry.id}
            </h2>
            <p className="mt-0.5 text-sm text-[#99A1AF]">
              {new Date(enquiry.created_at).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#99A1AF] transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-4">
          <Row label="From" value={enquiry.name} />
          <Row label="Email" value={enquiry.email} />
          {enquiry.phone ? <Row label="Phone" value={enquiry.phone} /> : null}
          <Row label="Type" value={enquiry.enquiry_type_display} />
          {enquiry.property_title ? (
            <Row label="Property" value={enquiry.property_title} />
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
            Message
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1A1D24]">
            {enquiry.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={statusMutation.isPending}
                onClick={() => void handleStatusChange(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  localStatus === opt.value
                    ? `${STATUS_STYLES[opt.value]?.bg ?? "bg-gray-100"} ${STATUS_STYLES[opt.value]?.text ?? "text-gray-700"} ring-2 ring-current`
                    : "bg-[#F3F4F6] text-[#6B7280] hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {statusError ? (
            <p className="text-xs text-red-600">{statusError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-bold uppercase tracking-wide text-[#99A1AF]">
        {label}
      </span>
      <span className="text-sm leading-[1.4] text-[#1A1D24]">{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export function AdminEnquiries() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(
    null,
  );

  const params: Record<string, string> = { page: String(page) };
  if (statusFilter) params.status = statusFilter;
  if (typeFilter) params.enquiry_type = typeFilter;

  const query = useAdminEnquiriesQuery(params);
  const results = query.data?.results ?? [];
  const totalPages = query.data?.total_pages ?? 1;
  const count = query.data?.count ?? 0;

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
          Enquiries
        </h1>
        <p className="text-base font-normal leading-normal text-[#99A1AF]">
          {count > 0 ? `${count} total enquiries` : "Manage incoming property enquiries"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-2 text-sm font-medium text-[#1A1D24] outline-none focus:ring-2 focus:ring-[#003A8C]/20"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-2 text-sm font-medium text-[#1A1D24] outline-none focus:ring-2 focus:ring-[#003A8C]/20"
        >
          <option value="">All Types</option>
          <option value="GENERAL">General</option>
          <option value="INSPECTION">Inspection</option>
          <option value="PURCHASE">Purchase</option>
          <option value="RENT">Rent</option>
          <option value="LEASE">Lease</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
        {query.isLoading ? (
          <div className="p-12 text-center text-sm text-[#99A1AF]">
            Loading enquiries…
          </div>
        ) : query.isError ? (
          <div className="p-12 text-center text-sm font-semibold text-red-600">
            {query.error instanceof Error
              ? query.error.message
              : "Failed to load enquiries"}
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#99A1AF]">
            No enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  {["Sender", "Property", "Type", "Status", "Received", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#99A1AF] first:pl-6 last:pr-6"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((enq) => (
                  <tr
                    key={enq.id}
                    className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB]"
                  >
                    <td className="pl-6 pr-4 py-3">
                      <p className="font-semibold text-[#1A1D24]">{enq.name}</p>
                      <p className="text-xs text-[#99A1AF]">{enq.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#1A1D24]">
                      {enq.property_title || <span className="text-[#99A1AF]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#1A1D24]">
                      {enq.enquiry_type_display}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={enq.status}
                        label={enq.status_display}
                      />
                    </td>
                    <td className="px-4 py-3 text-[#99A1AF]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 pl-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(enq)}
                        className="text-xs font-semibold text-[#003A8C] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[#99A1AF]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#F3F4F6] px-4 py-1.5 text-sm font-semibold text-[#1A1D24] transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#F3F4F6] px-4 py-1.5 text-sm font-semibold text-[#1A1D24] transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {selectedEnquiry ? (
        <EnquiryDetailDrawer
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
        />
      ) : null}
    </div>
  );
}
