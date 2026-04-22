"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminPropertyDetail,
  fetchAdminPropertyList,
  fetchPropertyFormData,
} from "@/lib/admin-properties-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";

export function useAdminPropertyListQuery(params: Record<string, string>) {
  return useQuery({
    queryKey: adminQueryKeys.properties.list(params),
    queryFn: () => fetchAdminPropertyList(params),
  });
}

export function useAdminPropertyDetailQuery(
  slug: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: adminQueryKeys.properties.detail(slug ?? ""),
    queryFn: () => fetchAdminPropertyDetail(slug ?? ""),
    enabled: enabled && !!slug,
  });
}

export function useAdminPropertyFormDataQuery() {
  return useQuery({
    queryKey: adminQueryKeys.properties.formData(),
    queryFn: fetchPropertyFormData,
    staleTime: 60 * 60 * 1000,
  });
}
