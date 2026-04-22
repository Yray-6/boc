"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminEnquiries,
  fetchAdminEnquiry,
  updateAdminEnquiryStatus,
} from "@/lib/admin-enquiries-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";
import type { AdminEnquiryStatusPayload } from "@/types/admin-enquiry";

export function useAdminEnquiriesQuery(params: Record<string, string>) {
  return useQuery({
    queryKey: adminQueryKeys.enquiries.list(params),
    queryFn: () => fetchAdminEnquiries(params),
  });
}

export function useAdminEnquiryDetailQuery(id: number | null) {
  return useQuery({
    queryKey: adminQueryKeys.enquiries.detail(id ?? 0),
    queryFn: () => fetchAdminEnquiry(id!),
    enabled: id !== null,
  });
}

export function useAdminEnquiryStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminEnquiryStatusPayload }) =>
      updateAdminEnquiryStatus(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.enquiries.root });
      void qc.invalidateQueries({
        queryKey: adminQueryKeys.enquiries.detail(id),
      });
    },
  });
}
