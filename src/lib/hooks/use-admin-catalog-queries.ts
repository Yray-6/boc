"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminAmenity,
  createAdminPropertyType,
  deleteAdminAmenity,
  deleteAdminPropertyType,
  fetchAdminAmenities,
  fetchAdminPropertyTypes,
  updateAdminAmenity,
  updateAdminPropertyType,
} from "@/lib/admin-catalog-client";
import { adminQueryKeys } from "@/lib/admin-query-keys";
import type {
  AdminAmenityWritePayload,
  AdminPropertyTypeWritePayload,
} from "@/types/admin-catalog";

// ── Amenities ─────────────────────────────────────────────────────────────────

export function useAdminAmenitiesQuery() {
  return useQuery({
    queryKey: adminQueryKeys.amenities.list(),
    queryFn: fetchAdminAmenities,
  });
}

export function useAdminAmenityCreateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminAmenityWritePayload) => createAdminAmenity(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.amenities.root });
    },
  });
}

export function useAdminAmenityUpdateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminAmenityWritePayload }) =>
      updateAdminAmenity(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.amenities.root });
    },
  });
}

export function useAdminAmenityDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminAmenity(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.amenities.root });
    },
  });
}

// ── Property Types ────────────────────────────────────────────────────────────

export function useAdminPropertyTypesQuery() {
  return useQuery({
    queryKey: adminQueryKeys.propertyTypes.list(),
    queryFn: fetchAdminPropertyTypes,
  });
}

export function useAdminPropertyTypeCreateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminPropertyTypeWritePayload) =>
      createAdminPropertyType(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.propertyTypes.root });
    },
  });
}

export function useAdminPropertyTypeUpdateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: AdminPropertyTypeWritePayload;
    }) => updateAdminPropertyType(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.propertyTypes.root });
    },
  });
}

export function useAdminPropertyTypeDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminPropertyType(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminQueryKeys.propertyTypes.root });
    },
  });
}
