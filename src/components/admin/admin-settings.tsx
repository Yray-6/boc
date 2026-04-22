"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  useAdminSiteLogoUploadMutation,
  useAdminSiteSettingsPatchMutation,
  useAdminSiteSettingsQuery,
} from "@/lib/hooks/use-admin-settings-queries";
import {
  useAdminAmenitiesQuery,
  useAdminAmenityCreateMutation,
  useAdminAmenityDeleteMutation,
  useAdminAmenityUpdateMutation,
  useAdminPropertyTypeCreateMutation,
  useAdminPropertyTypeDeleteMutation,
  useAdminPropertyTypesQuery,
  useAdminPropertyTypeUpdateMutation,
} from "@/lib/hooks/use-admin-catalog-queries";
import type {
  AdminAmenity,
  AdminAmenityWritePayload,
  AdminPropertyType,
  AdminPropertyTypeWritePayload,
} from "@/types/admin-catalog";

const labelClass =
  "text-xs font-bold uppercase leading-[1.333] tracking-wide text-[#99A1AF]";
const inputClass =
  "w-full rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3 text-base font-normal leading-[1.2] text-[#1A1D24] outline-none ring-[#003A8C]/20 placeholder:text-[rgba(26,29,36,0.5)] focus:ring-2";

function IconSave({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 21v-8H7v8M7 3v5h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUploadSmall({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 15V3M9 6l3-3 3 3M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminSettings() {
  const formId = useId();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const settingsQuery = useAdminSiteSettingsQuery();
  const patchMutation = useAdminSiteSettingsPatchMutation();
  const logoMutation = useAdminSiteLogoUploadMutation();

  const [savedFlash, setSavedFlash] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    const d = settingsQuery.data;
    if (!d) return;
    setCompanyName(d.company_name ?? "");
    setPrimaryEmail(d.primary_email ?? "");
    setPhone(d.phone_number ?? "");
    setInstagram(d.instagram ?? "");
    setFacebook(d.facebook ?? "");
    setTwitter(d.twitter ?? "");
    setLinkedin(d.linkedin ?? "");
  }, [settingsQuery.data]);

  const logoUrl = settingsQuery.data?.logo_url;
  const initial = settingsQuery.data?.company_name?.trim()?.charAt(0) ?? "B";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const name = companyName.trim();
    if (!name || name.length > 200) {
      setSaveError("Company name must be between 1 and 200 characters.");
      return;
    }
    const email = primaryEmail.trim();
    if (!email || email.length > 254) {
      setSaveError("Enter a valid primary email.");
      return;
    }
    if (phone.trim().length > 50) {
      setSaveError("Phone number must be at most 50 characters.");
      return;
    }
    try {
      await patchMutation.mutateAsync({
        company_name: name,
        primary_email: email,
        phone_number: phone.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        twitter: twitter.trim(),
        linkedin: linkedin.trim(),
      });
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 3200);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleLogoChange(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setLogoError(null);
    try {
      await logoMutation.mutateAsync(file);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  const busy =
    settingsQuery.isLoading ||
    patchMutation.isPending ||
    logoMutation.isPending;

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 [font-family:var(--font-urbanist)]">
      <form onSubmit={(e) => void handleSave(e)} className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1A1D24]">
              Settings
            </h1>
            <p className="text-base font-normal leading-normal text-[#99A1AF]">
              Configure your website and management portal.
              {settingsQuery.data?.updated_at ? (
                <span className="mt-1 block text-xs">
                  Last updated{" "}
                  {new Date(settingsQuery.data.updated_at).toLocaleString()}
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="submit"
              disabled={busy || settingsQuery.isError}
              className="inline-flex items-center gap-2 rounded-xl bg-[#003A8C] px-6 py-2 text-sm font-bold leading-[1.4286] text-white shadow-[0px_4px_6px_-4px_rgba(201,168,76,0.2),0px_10px_15px_-3px_rgba(201,168,76,0.2)] transition-colors hover:bg-[#002f73] disabled:opacity-50"
            >
              <IconSave className="size-[18px] shrink-0 text-white" />
              {patchMutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {settingsQuery.isError ? (
          <p className="text-sm font-semibold text-red-600" role="alert">
            {settingsQuery.error instanceof Error
              ? settingsQuery.error.message
              : "Failed to load settings"}
          </p>
        ) : null}
        {saveError ? (
          <p className="text-sm font-semibold text-red-600" role="alert">
            {saveError}
          </p>
        ) : null}
        {logoError ? (
          <p className="text-sm font-semibold text-red-600" role="alert">
            {logoError}
          </p>
        ) : null}
        {savedFlash ? (
          <p
            className="text-sm font-semibold text-[#00A63E]"
            role="status"
            aria-live="polite"
          >
            Changes saved.
          </p>
        ) : null}

        {settingsQuery.isLoading ? (
          <div className="rounded-2xl border border-[#F3F4F6] bg-white p-12 text-center text-sm text-[#99A1AF] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
            Loading settings…
          </div>
        ) : (
          <div className="rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] sm:p-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
                  General Information
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 pt-1">
                    <label className={labelClass} htmlFor={`${formId}-company`}>
                      Company Name
                    </label>
                    <input
                      id={`${formId}-company`}
                      className={inputClass}
                      maxLength={200}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <label className={labelClass} htmlFor={`${formId}-email`}>
                      Primary Email
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      maxLength={254}
                      className={inputClass}
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <label className={labelClass} htmlFor={`${formId}-phone`}>
                      Phone Number
                    </label>
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      maxLength={50}
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-md">
                <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
                  Branding
                </h2>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
                  <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                    {logoUrl &&
                    (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) ? (
                      // eslint-disable-next-line @next/next/no-img-element -- signed / external storage URLs
                      <img
                        src={logoUrl}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl font-bold leading-[1.333] text-[#003A8C]">
                        {initial}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold leading-[1.4286] text-[#1A1D24]">
                      Company Logo
                    </p>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-label="Upload company logo"
                      disabled={logoMutation.isPending}
                      onChange={(e) => void handleLogoChange(e.target.files)}
                    />
                    <button
                      type="button"
                      disabled={logoMutation.isPending || settingsQuery.isError}
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1 self-start text-xs font-normal leading-[1.333] text-[#003A8C] transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      <IconUploadSmall className="shrink-0" />
                      {logoMutation.isPending ? "Uploading…" : "Replace Logo"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#F3F4F6] pt-8">
              <h2 className="mb-4 text-lg font-bold leading-[1.556] text-[#1A1D24]">
                Social Media
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-ig`}>
                    Instagram
                  </label>
                  <input
                    id={`${formId}-ig`}
                    className={inputClass}
                    placeholder="https://..."
                    maxLength={200}
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-fb`}>
                    Facebook
                  </label>
                  <input
                    id={`${formId}-fb`}
                    className={inputClass}
                    placeholder="https://..."
                    maxLength={200}
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-x`}>
                    X (Twitter)
                  </label>
                  <input
                    id={`${formId}-x`}
                    className={inputClass}
                    placeholder="https://..."
                    maxLength={200}
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <label className={labelClass} htmlFor={`${formId}-li`}>
                    LinkedIn
                  </label>
                  <input
                    id={`${formId}-li`}
                    className={inputClass}
                    placeholder="https://..."
                    maxLength={200}
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      <AmenitiesSection />
      <PropertyTypesSection />
    </div>
  );
}

// ── Amenities ─────────────────────────────────────────────────────────────────

const emptyAmenity: AdminAmenityWritePayload = {
  name: "",
  icon: "",
  category: "",
  is_active: true,
};

function AmenitiesSection() {
  const query = useAdminAmenitiesQuery();
  const createMutation = useAdminAmenityCreateMutation();
  const updateMutation = useAdminAmenityUpdateMutation();
  const deleteMutation = useAdminAmenityDeleteMutation();

  const [editing, setEditing] = useState<AdminAmenity | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AdminAmenityWritePayload>(emptyAmenity);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const formId = useId();

  function openAdd() {
    setEditing(null);
    setForm(emptyAmenity);
    setFormError(null);
    setAdding(true);
  }

  function openEdit(a: AdminAmenity) {
    setAdding(false);
    setForm({ name: a.name, icon: a.icon, category: a.category, is_active: a.is_active });
    setFormError(null);
    setEditing(a);
  }

  function closeForm() {
    setAdding(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, body: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteId(null);
    } catch {
      // silently ignore – list will reflect current state
    }
  }

  const items = query.data ?? [];
  const busy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-2xl border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#F3F4F6] px-6 py-4">
        <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
          Amenities
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#003A8C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002f73]"
        >
          <span aria-hidden>+</span> Add Amenity
        </button>
      </div>

      {(adding || editing) && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="border-b border-[#F3F4F6] bg-[#F9FAFB] px-6 py-4"
        >
          <p className="mb-3 text-sm font-bold text-[#1A1D24]">
            {editing ? "Edit Amenity" : "New Amenity"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-a-name`}>Name *</label>
              <input
                id={`${formId}-a-name`}
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-a-icon`}>Icon</label>
              <input
                id={`${formId}-a-icon`}
                className={inputClass}
                placeholder="e.g. wifi"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-a-cat`}>Category</label>
              <input
                id={`${formId}-a-cat`}
                className={inputClass}
                placeholder="e.g. Interior"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Active</label>
              <label className="flex cursor-pointer items-center gap-2 pt-3 text-sm font-medium text-[#1A1D24]">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="size-4 rounded"
                />
                Active
              </label>
            </div>
          </div>
          {formError ? (
            <p className="mt-2 text-xs font-semibold text-red-600">{formError}</p>
          ) : null}
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#003A8C] px-4 py-2 text-sm font-bold text-white hover:bg-[#002f73] disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-[#F3F4F6] px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {query.isLoading ? (
        <div className="p-8 text-center text-sm text-[#99A1AF]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#99A1AF]">
          No amenities yet. Add your first one above.
        </div>
      ) : (
        <ul className="divide-y divide-[#F3F4F6]">
          {items.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-6 py-3">
              <span className="min-w-0 flex-1">
                <span className="font-semibold text-[#1A1D24]">{a.name}</span>
                {a.category ? (
                  <span className="ml-2 text-xs text-[#99A1AF]">{a.category}</span>
                ) : null}
                {a.icon ? (
                  <span className="ml-2 rounded bg-[#F3F4F6] px-1.5 py-0.5 text-xs font-mono text-[#6B7280]">
                    {a.icon}
                  </span>
                ) : null}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  a.is_active
                    ? "bg-[#F0FDF4] text-[#00A63E]"
                    : "bg-[#F9FAFB] text-[#6B7280]"
                }`}
              >
                {a.is_active ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => openEdit(a)}
                className="shrink-0 text-xs font-semibold text-[#003A8C] hover:underline"
              >
                Edit
              </button>
              {deleteId === a.id ? (
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => void handleDelete(a.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    className="text-xs font-semibold text-[#6B7280] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteId(a.id)}
                  className="shrink-0 text-xs font-semibold text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Property Types ────────────────────────────────────────────────────────────

const emptyPropertyType: AdminPropertyTypeWritePayload = {
  name: "",
  icon: "",
  description: "",
  order: 0,
  is_active: true,
};

function PropertyTypesSection() {
  const query = useAdminPropertyTypesQuery();
  const createMutation = useAdminPropertyTypeCreateMutation();
  const updateMutation = useAdminPropertyTypeUpdateMutation();
  const deleteMutation = useAdminPropertyTypeDeleteMutation();

  const [editing, setEditing] = useState<AdminPropertyType | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AdminPropertyTypeWritePayload>(emptyPropertyType);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const formId = useId();

  function openAdd() {
    setEditing(null);
    setForm(emptyPropertyType);
    setFormError(null);
    setAdding(true);
  }

  function openEdit(pt: AdminPropertyType) {
    setAdding(false);
    setForm({
      name: pt.name,
      icon: pt.icon,
      description: pt.description,
      order: pt.order,
      is_active: pt.is_active,
    });
    setFormError(null);
    setEditing(pt);
  }

  function closeForm() {
    setAdding(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, body: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteId(null);
    } catch {
      // silently ignore
    }
  }

  const items = query.data ?? [];
  const busy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-2xl border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#F3F4F6] px-6 py-4">
        <h2 className="text-lg font-bold leading-[1.556] text-[#1A1D24]">
          Property Types
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#003A8C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002f73]"
        >
          <span aria-hidden>+</span> Add Type
        </button>
      </div>

      {(adding || editing) && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="border-b border-[#F3F4F6] bg-[#F9FAFB] px-6 py-4"
        >
          <p className="mb-3 text-sm font-bold text-[#1A1D24]">
            {editing ? "Edit Property Type" : "New Property Type"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-pt-name`}>Name *</label>
              <input
                id={`${formId}-pt-name`}
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-pt-icon`}>Icon</label>
              <input
                id={`${formId}-pt-icon`}
                className={inputClass}
                placeholder="e.g. building"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor={`${formId}-pt-order`}>Order</label>
              <input
                id={`${formId}-pt-order`}
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Active</label>
              <label className="flex cursor-pointer items-center gap-2 pt-3 text-sm font-medium text-[#1A1D24]">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="size-4 rounded"
                />
                Active
              </label>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-4">
              <label className={labelClass} htmlFor={`${formId}-pt-desc`}>Description</label>
              <input
                id={`${formId}-pt-desc`}
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          {formError ? (
            <p className="mt-2 text-xs font-semibold text-red-600">{formError}</p>
          ) : null}
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#003A8C] px-4 py-2 text-sm font-bold text-white hover:bg-[#002f73] disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-[#F3F4F6] px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {query.isLoading ? (
        <div className="p-8 text-center text-sm text-[#99A1AF]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#99A1AF]">
          No property types yet. Add your first one above.
        </div>
      ) : (
        <ul className="divide-y divide-[#F3F4F6]">
          {items.map((pt) => (
            <li key={pt.id} className="flex items-center gap-3 px-6 py-3">
              <span className="min-w-0 flex-1">
                <span className="font-semibold text-[#1A1D24]">{pt.name}</span>
                {pt.icon ? (
                  <span className="ml-2 rounded bg-[#F3F4F6] px-1.5 py-0.5 text-xs font-mono text-[#6B7280]">
                    {pt.icon}
                  </span>
                ) : null}
                {pt.description ? (
                  <span className="ml-2 text-xs text-[#99A1AF]">{pt.description}</span>
                ) : null}
                <span className="ml-2 text-xs text-[#99A1AF]">
                  {pt.property_count} {pt.property_count === 1 ? "property" : "properties"}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  pt.is_active
                    ? "bg-[#F0FDF4] text-[#00A63E]"
                    : "bg-[#F9FAFB] text-[#6B7280]"
                }`}
              >
                {pt.is_active ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => openEdit(pt)}
                className="shrink-0 text-xs font-semibold text-[#003A8C] hover:underline"
              >
                Edit
              </button>
              {deleteId === pt.id ? (
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => void handleDelete(pt.id)}
                    disabled={deleteMutation.isPending}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(null)}
                    className="text-xs font-semibold text-[#6B7280] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteId(pt.id)}
                  className="shrink-0 text-xs font-semibold text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
