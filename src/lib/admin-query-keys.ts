export const adminQueryKeys = {
  dashboard: {
    root: ["admin", "dashboard"] as const,
    summary: () => ["admin", "dashboard", "summary"] as const,
  },
  properties: {
    root: ["admin", "properties"] as const,
    list: (params: Record<string, string>) =>
      ["admin", "properties", "list", params] as const,
    detail: (slug: string) => ["admin", "properties", "detail", slug] as const,
    formData: () => ["admin", "properties", "form-data"] as const,
  },
  agents: {
    root: ["admin", "agents"] as const,
    list: (params: Record<string, string>) =>
      ["admin", "agents", "list", params] as const,
    detail: (id: number) => ["admin", "agents", "detail", id] as const,
    properties: (id: number) => ["admin", "agents", "properties", id] as const,
  },
  settings: {
    root: ["admin", "settings"] as const,
    site: () => ["admin", "settings", "site"] as const,
  },
  enquiries: {
    root: ["admin", "enquiries"] as const,
    list: (params: Record<string, string>) =>
      ["admin", "enquiries", "list", params] as const,
    detail: (id: number) => ["admin", "enquiries", "detail", id] as const,
  },
  amenities: {
    root: ["admin", "amenities"] as const,
    list: () => ["admin", "amenities", "list"] as const,
  },
  propertyTypes: {
    root: ["admin", "property-types"] as const,
    list: () => ["admin", "property-types", "list"] as const,
  },
};
