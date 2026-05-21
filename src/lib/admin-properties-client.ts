import axios from "axios";
import {
  normalizePropertyFormData,
  type NormalizedPropertyFormData,
} from "@/lib/property-form-dropdowns";
import {
  logAdminImageUploadClient,
  logAdminVideoUploadClient,
  summarizeImageFiles,
  summarizeVideoFiles,
} from "@/lib/admin-video-upload-log";
import type {
  AdminPropertyDetail,
  AdminPropertyListResponse,
  AdminPropertyWritePayload,
  AdminPropertyImage,
  AdminPropertyVideo,
} from "@/types/admin-property";

const api = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: () => true,
});

export async function fetchPropertyFormData(): Promise<NormalizedPropertyFormData> {
  const res = await api.get<unknown>("/api/admin/properties/form-data");
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return normalizePropertyFormData(res.data);
}

function detailFromUnknown(data: unknown): string {
  if (data && typeof data === "object" && "detail" in data) {
    const d = (data as { detail: unknown }).detail;
    if (typeof d === "string") return d;
  }
  return "Request failed";
}

type AdminUploadAuth = {
  apiBaseUrl: string;
  accessToken: string;
};

/** Small JSON bridge — used before direct multipart POST to Django (avoids Vercel ~4.5 MB body limit). */
async function getAdminUploadAuth(): Promise<AdminUploadAuth> {
  const res = await api.get<AdminUploadAuth | { detail?: string }>("/api/admin/upload-auth");
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  const body = res.data as AdminUploadAuth;
  if (!body?.apiBaseUrl || !body?.accessToken) {
    throw new Error("Upload auth response is missing apiBaseUrl or accessToken.");
  }
  return {
    apiBaseUrl: body.apiBaseUrl.replace(/\/+$/, ""),
    accessToken: body.accessToken,
  };
}

/** POST multipart directly to `{apiBaseUrl}{apiPath}` with Bearer auth (cross-origin). */
async function directMultipartPost<T>(
  apiPath: string,
  formData: FormData,
  auth: AdminUploadAuth,
): Promise<{ status: number; data: T }> {
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const url = `${auth.apiBaseUrl}${path}`;
  const res = await axios.post<T | { detail?: string }>(url, formData, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
    },
    validateStatus: () => true,
  });
  return { status: res.status, data: res.data as T };
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES_PER_PROPERTY = 20;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_VIDEOS_PER_PROPERTY = 5;
const VIDEO_ACCEPT = new Set(["video/mp4", "video/webm"]);

function assertValidImageFiles(files: File[]) {
  if (files.length === 0) {
    throw new Error("Select at least one image file.");
  }
  if (files.length > MAX_IMAGES_PER_PROPERTY) {
    throw new Error(`You can upload at most ${MAX_IMAGES_PER_PROPERTY} images per property.`);
  }
  for (const f of files) {
    if (!f.type.startsWith("image/")) {
      throw new Error(`"${f.name}" must be an image file.`);
    }
    if (f.size > MAX_IMAGE_BYTES) {
      throw new Error(`"${f.name}" exceeds the 5 MB limit.`);
    }
  }
}

function assertValidVideoFiles(files: File[]) {
  if (files.length === 0) {
    throw new Error("Select at least one video file.");
  }
  if (files.length > MAX_VIDEOS_PER_PROPERTY) {
    throw new Error(`You can upload at most ${MAX_VIDEOS_PER_PROPERTY} videos per property.`);
  }
  for (const f of files) {
    if (!VIDEO_ACCEPT.has(f.type)) {
      throw new Error(`"${f.name}" must be MP4 or WebM.`);
    }
    if (f.size > MAX_VIDEO_BYTES) {
      throw new Error(`"${f.name}" exceeds the 100 MB limit.`);
    }
  }
}

export async function fetchAdminPropertyList(
  params: Record<string, string>,
): Promise<AdminPropertyListResponse> {
  const res = await api.get<AdminPropertyListResponse>("/api/admin/properties", {
    params,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data;
}

export async function createAdminProperty(
  body: AdminPropertyWritePayload,
): Promise<AdminPropertyDetail> {
  const res = await api.post<AdminPropertyDetail | { detail?: string }>(
    "/api/admin/properties",
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

export async function fetchAdminPropertyDetail(
  slug: string,
): Promise<AdminPropertyDetail> {
  const res = await api.get<AdminPropertyDetail | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

function parseAdminVideoListPayload(data: unknown): AdminPropertyVideo[] {
  if (Array.isArray(data)) return data as AdminPropertyVideo[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.results)) return o.results as AdminPropertyVideo[];
    if (Array.isArray(o.data)) return o.data as AdminPropertyVideo[];
  }
  return [];
}

/** GET listing videos (used when property detail omits `videos`). */
export async function listAdminPropertyVideos(slug: string): Promise<AdminPropertyVideo[]> {
  const res = await api.get<unknown>(
    `/api/admin/properties/${encodeURIComponent(slug)}/videos`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return parseAdminVideoListPayload(res.data);
}

/** Property detail plus videos from `GET …/videos` when detail has none. */
export async function fetchAdminPropertyDetailMerged(
  slug: string,
): Promise<AdminPropertyDetail> {
  const d = await fetchAdminPropertyDetail(slug);
  if (Array.isArray(d.videos) && d.videos.length > 0) return d;
  try {
    const list = await listAdminPropertyVideos(slug);
    if (list.length > 0) return { ...d, videos: list };
  } catch {
    /* optional upstream route */
  }
  return d;
}

export async function updateAdminProperty(
  slug: string,
  body: AdminPropertyWritePayload,
): Promise<AdminPropertyDetail> {
  const res = await api.put<AdminPropertyDetail | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}`,
    body,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyDetail;
}

export async function deleteAdminProperty(slug: string): Promise<void> {
  const res = await api.delete(`/api/admin/properties/${encodeURIComponent(slug)}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}

export async function downloadAdminPropertiesCsv(): Promise<void> {
  const res = await fetch("/api/admin/properties/export/csv", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    let msg = "Export failed";
    try {
      const j = (await res.json()) as { detail?: string };
      if (typeof j.detail === "string") msg = j.detail;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "properties.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadAdminPropertyImages(
  slug: string,
  files: File[],
  fieldName = "images",
): Promise<AdminPropertyImage[]> {
  assertValidImageFiles(files);
  const fd = new FormData();
  for (const f of files) {
    fd.append(fieldName, f);
  }
  const apiPath = `/api/v1/admin/properties/${encodeURIComponent(slug)}/images/`;
  logAdminImageUploadClient("request", {
    mode: "direct",
    apiPath,
    slug,
    files: summarizeImageFiles(files),
  });
  try {
    const auth = await getAdminUploadAuth();
    const { status, data } = await directMultipartPost<AdminPropertyImage[]>(
      apiPath,
      fd,
      auth,
    );
    logAdminImageUploadClient("response", {
      mode: "direct",
      url: `${auth.apiBaseUrl}${apiPath}`,
      slug,
      status,
      ok: status >= 200 && status < 300,
      data,
    });
    if (status < 200 || status >= 300) {
      throw new Error(detailFromUnknown(data));
    }
    return data;
  } catch (e) {
    logAdminImageUploadClient("error", {
      mode: "direct",
      apiPath,
      slug,
      message: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }
}

export async function fetchAdminPropertyImage(
  slug: string,
  imageId: number,
): Promise<AdminPropertyImage> {
  const res = await api.get<AdminPropertyImage | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}/images/${imageId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyImage;
}

export async function deleteAdminPropertyImage(
  slug: string,
  imageId: number,
): Promise<void> {
  const res = await api.delete(
    `/api/admin/properties/${encodeURIComponent(slug)}/images/${imageId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}

/** Multipart POST: field `videos` (repeat per file), optional `thumbnail`, optional `title`. */
export async function uploadAdminPropertyVideos(
  slug: string,
  files: File[],
  options?: { thumbnail?: File; title?: string },
): Promise<AdminPropertyVideo[]> {
  assertValidVideoFiles(files);
  const fd = new FormData();
  for (const f of files) {
    fd.append("videos", f);
  }
  if (options?.thumbnail) {
    fd.append("thumbnail", options.thumbnail);
  }
  if (options?.title?.trim()) {
    fd.append("title", options.title.trim());
  }
  const apiPath = `/api/v1/admin/properties/${encodeURIComponent(slug)}/videos/`;
  logAdminVideoUploadClient("request", {
    mode: "direct",
    apiPath,
    slug,
    files: summarizeVideoFiles(files),
    title: options?.title?.trim() || null,
    thumbnail: options?.thumbnail
      ? { name: options.thumbnail.name, type: options.thumbnail.type, size: options.thumbnail.size }
      : null,
  });
  try {
    const auth = await getAdminUploadAuth();
    const { status, data } = await directMultipartPost<AdminPropertyVideo[]>(
      apiPath,
      fd,
      auth,
    );
    logAdminVideoUploadClient("response", {
      mode: "direct",
      url: `${auth.apiBaseUrl}${apiPath}`,
      slug,
      status,
      ok: status >= 200 && status < 300,
      data,
    });
    if (status < 200 || status >= 300) {
      throw new Error(detailFromUnknown(data));
    }
    return data;
  } catch (e) {
    logAdminVideoUploadClient("error", {
      mode: "direct",
      apiPath,
      slug,
      message: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }
}

export async function fetchAdminPropertyVideo(
  slug: string,
  videoId: number,
): Promise<AdminPropertyVideo> {
  const res = await api.get<AdminPropertyVideo | { detail?: string }>(
    `/api/admin/properties/${encodeURIComponent(slug)}/videos/${videoId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
  return res.data as AdminPropertyVideo;
}

export async function deleteAdminPropertyVideo(
  slug: string,
  videoId: number,
): Promise<void> {
  const res = await api.delete(
    `/api/admin/properties/${encodeURIComponent(slug)}/videos/${videoId}`,
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(detailFromUnknown(res.data));
  }
}
