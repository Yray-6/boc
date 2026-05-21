/** Dev-friendly logging for admin property video uploads (client + server). */

export function summarizeVideoFiles(
  files: File[] | Iterable<File>,
): { name: string; type: string; size: number }[] {
  return [...files].map((f) => ({
    name: f.name,
    type: f.type,
    size: f.size,
  }));
}

export function summarizeMultipartFormData(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      const entry = { name: value.name, type: value.type, size: value.size };
      const existing = out[key];
      if (existing === undefined) out[key] = entry;
      else if (Array.isArray(existing)) existing.push(entry);
      else out[key] = [existing, entry];
    } else {
      out[key] = value;
    }
  }
  return out;
}

function safeJsonPreview(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") {
    return data.length > 2_000 ? `${data.slice(0, 2_000)}…[truncated]` : data;
  }
  try {
    const json = JSON.stringify(data);
    if (json.length <= 2_000) return data;
    return `${json.slice(0, 2_000)}…[truncated]`;
  } catch {
    return "[unserializable]";
  }
}

/** Browser: logs before/after direct POST to Django `.../videos/`. */
export function logAdminVideoUploadClient(
  phase: "request" | "response" | "error",
  payload: Record<string, unknown>,
) {
  console.log(`[admin:video-upload] client ${phase}`, payload);
}

export function summarizeImageFiles(
  files: File[] | Iterable<File>,
): { name: string; type: string; size: number }[] {
  return summarizeVideoFiles(files);
}

/** Browser: logs before/after direct POST to Django `.../images/`. */
export function logAdminImageUploadClient(
  phase: "request" | "response" | "error",
  payload: Record<string, unknown>,
) {
  console.log(`[admin:image-upload] client ${phase}`, payload);
}

/** Next.js route handler (terminal). */
export function logAdminVideoUploadRoute(
  phase: "request" | "upstream-response" | "error",
  payload: Record<string, unknown>,
) {
  console.log(`[admin:video-upload] route ${phase}`, payload);
}

/** Upstream axios to BOC API (terminal). */
export function logAdminVideoUploadUpstream(
  phase: "request" | "response",
  payload: Record<string, unknown>,
) {
  const data =
    "data" in payload ? { ...payload, data: safeJsonPreview(payload.data) } : payload;
  console.log(`[admin:video-upload] upstream ${phase}`, data);
}
