import { AGENT_SPEC_OPTIONS } from "@/components/admin/agent-form-modal";
import type { AgentFormValues } from "@/components/admin/agent-form-modal";
import type { AgentAssignedListing } from "@/components/admin/agent-assigned-properties-modal";
import type {
  AdminAgentCreatePayload,
  AdminAgentDetail,
  AdminAgentPropertySummary,
  AdminAgentUpdatePayload,
} from "@/types/admin-agent";

export type AdminAgentRecord = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  specialisations: string[];
  listingsCount: number;
  visible: boolean;
  bio: string;
};

const DEFAULT_AVATAR = "/admin-dashboard/modal-agent-avatar-56586a.png";

function splitFullName(fullName: string): { first_name: string; last_name: string } {
  const t = fullName.trim();
  if (!t) return { first_name: "", last_name: "" };
  const parts = t.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function specKeysToSpecialisation(keys: string[]): string {
  const labels = keys.flatMap((k) => {
    const o = AGENT_SPEC_OPTIONS.find((x) => x.id === k);
    return o ? [o.label] : [];
  });
  return labels.join(", ");
}

export function specialisationStringToKeys(s: string): string[] {
  if (!s.trim()) return [];
  const parts = s.split(/[,;|]/g).map((x) => x.trim()).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    const opt = AGENT_SPEC_OPTIONS.find(
      (o) => o.label.toLowerCase() === p.toLowerCase(),
    );
    if (opt) out.push(opt.id);
  }
  return [...new Set(out)];
}

function splitSpecialisationLabels(s: string): string[] {
  if (!s.trim()) return [];
  return s.split(/[,;|]/g).map((x) => x.trim()).filter(Boolean);
}

function avatarForTable(url: string | undefined | null): string {
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  return DEFAULT_AVATAR;
}

export function apiAgentToRecord(a: AdminAgentDetail): AdminAgentRecord {
  return {
    id: String(a.id),
    name: a.full_name,
    title: a.title,
    email: a.email,
    phone: a.phone,
    avatar: avatarForTable(a.avatar_url),
    specialisations: splitSpecialisationLabels(a.specialisation),
    listingsCount: a.active_listings_count ?? a.total_listings_count ?? 0,
    visible: a.is_active,
    bio: a.bio ?? "",
  };
}

export function detailToFormValues(d: AdminAgentDetail): AgentFormValues {
  return {
    fullName: d.full_name,
    jobTitle: d.title,
    email: d.email,
    phone: d.phone,
    bio: d.bio ?? "",
    specializationKeys: specialisationStringToKeys(d.specialisation),
  };
}

export function formToCreatePayload(values: AgentFormValues): AdminAgentCreatePayload {
  const { first_name, last_name } = splitFullName(values.fullName);
  return {
    full_name: values.fullName.trim(),
    first_name,
    last_name,
    title: values.jobTitle.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    whatsapp: values.phone.trim(),
    bio: values.bio.trim(),
    years_of_experience: 0,
    specialisation: specKeysToSpecialisation(values.specializationKeys),
    is_active: true,
  };
}

export function detailAndFormToUpdatePayload(
  d: AdminAgentDetail,
  values: AgentFormValues,
): AdminAgentUpdatePayload {
  const { first_name, last_name } = splitFullName(values.fullName);
  return {
    full_name: values.fullName.trim(),
    first_name,
    last_name,
    title: values.jobTitle.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    whatsapp: d.whatsapp || values.phone.trim(),
    avatar: d.avatar_url?.startsWith("http") ? d.avatar_url : "",
    bio: values.bio.trim(),
    years_of_experience: Number.isFinite(d.years_of_experience)
      ? d.years_of_experience
      : 0,
    specialisation: specKeysToSpecialisation(values.specializationKeys),
    is_active: d.is_active,
  };
}

export function detailWithActiveFlag(
  d: AdminAgentDetail,
  is_active: boolean,
): AdminAgentUpdatePayload {
  return {
    full_name: d.full_name,
    first_name: d.first_name,
    last_name: d.last_name,
    title: d.title,
    email: d.email,
    phone: d.phone,
    whatsapp: d.whatsapp || d.phone,
    avatar: d.avatar_url?.startsWith("http") ? d.avatar_url : "",
    bio: d.bio ?? "",
    years_of_experience: Number.isFinite(d.years_of_experience)
      ? d.years_of_experience
      : 0,
    specialisation: d.specialisation ?? "",
    is_active,
  };
}

export function assignedPropertyToListing(
  p: AdminAgentPropertySummary,
): AgentAssignedListing {
  const loc = [p.neighborhood, p.city].filter(Boolean).join(", ") || "—";
  const thumb =
    p.primary_image?.startsWith("http") || p.primary_image?.startsWith("//")
      ? p.primary_image
      : DEFAULT_AVATAR;
  const active =
    p.status === "ACTIVE" ||
    String(p.status_display).toLowerCase().includes("active");
  return {
    id: `${p.id}-${p.slug}`,
    slug: p.slug,
    title: p.title,
    location: loc,
    price: p.formatted_price || p.price,
    thumb,
    status: active ? "Active" : "Inactive",
  };
}
