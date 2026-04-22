"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminAgentDetail,
  fetchAdminAgentList,
  fetchAdminAgentProperties,
} from "@/lib/admin-agents-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";

export function useAdminAgentListQuery(params: Record<string, string>) {
  return useQuery({
    queryKey: adminQueryKeys.agents.list(params),
    queryFn: () => fetchAdminAgentList(params),
  });
}

export function useAdminAgentDetailQuery(id: number | null, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.agents.detail(id ?? 0),
    queryFn: () => fetchAdminAgentDetail(id ?? 0),
    enabled: enabled && !!id,
  });
}

export function useAdminAgentPropertiesQuery(
  id: number | null,
  enabled = true,
) {
  return useQuery({
    queryKey: adminQueryKeys.agents.properties(id ?? 0),
    queryFn: () => fetchAdminAgentProperties(id ?? 0),
    enabled: enabled && !!id,
  });
}
