"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminSiteSettings,
  patchAdminSiteSettings,
  uploadAdminSiteLogo,
} from "@/lib/admin-settings-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";
import type { AdminSiteSettingsWritePayload } from "@/types/admin-settings";

export function useAdminSiteSettingsQuery() {
  return useQuery({
    queryKey: adminQueryKeys.settings.site(),
    queryFn: fetchAdminSiteSettings,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAdminSiteSettingsPatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<AdminSiteSettingsWritePayload>) =>
      patchAdminSiteSettings(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminQueryKeys.settings.site() });
    },
  });
}

export function useAdminSiteLogoUploadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAdminSiteLogo(file),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminQueryKeys.settings.site() });
    },
  });
}
