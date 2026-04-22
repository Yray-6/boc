import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";

/** Result of calling the backend API (HTTP status is always present; errors do not throw on 4xx/5xx). */
export type UpstreamResult<T = unknown> = {
  ok: boolean;
  status: number;
  data: T;
};

type UpstreamRequestConfig = Omit<
  AxiosRequestConfig,
  "baseURL" | "url" | "method" | "validateStatus"
>;

let client: AxiosInstance | null = null;

function safePreview(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > 2_000 ? `${value.slice(0, 2_000)}…[truncated]` : value;
  }
  if (value instanceof ArrayBuffer) {
    return `[ArrayBuffer byteLength=${value.byteLength}]`;
  }
  if (typeof value !== "object") return value;
  try {
    const json = JSON.stringify(value);
    if (json.length <= 2_000) return value;
    return `${json.slice(0, 2_000)}…[truncated]`;
  } catch {
    return "[unserializable]";
  }
}

function getBaseUrl(): string {
  const base = process.env.BOC_API_BASE_URL?.replace(/\/+$/, "") ?? "";
  if (!base) {
    throw new Error("BOC_API_BASE_URL is not configured");
  }
  return base;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function getClient(): AxiosInstance {
  if (!client) {
    client = axios.create({
      baseURL: getBaseUrl(),
      headers: { Accept: "application/json" },
      validateStatus: () => true,
    });
  }
  return client;
}

async function upstreamRequest<T>(
  method: Method,
  path: string,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  const normalizedPath = normalizePath(path);
  const res = await getClient().request<T>({
    method,
    url: normalizedPath,
    ...config,
    validateStatus: () => true,
  });

  // Normalize: axios may return JSON as a raw string when the server omits
  // Content-Type: application/json. Try to parse it so callers always receive
  // a real object/array.
  let normalized: unknown = res.data;
  if (typeof normalized === "string" && normalized.trim().length > 0) {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      // not JSON — keep as-is
    }
  }

  // Centralized upstream logging for every backend response.
  console.log("[upstream] response", {
    method,
    path: normalizedPath,
    status: res.status,
    ok: res.status >= 200 && res.status < 300,
    data: safePreview(normalized),
  });

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data: normalized as T,
  };
}

/** GET `{BOC_API_BASE_URL}{path}` (e.g. path `"/api/v1/admin/auth/me/"`). */
export function upstreamGet<T = unknown>(
  path: string,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("GET", path, config);
}

/**
 * POST JSON to `{BOC_API_BASE_URL}{path}`.
 * Sets `Content-Type: application/json` unless overridden in `config.headers`.
 */
export function upstreamPost<T = unknown, B = unknown>(
  path: string,
  body?: B,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("POST", path, {
    ...config,
    data: body,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  });
}

/** PUT JSON (axios sets `Content-Type: application/json`). */
export function upstreamPut<T = unknown, B = unknown>(
  path: string,
  body?: B,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("PUT", path, {
    ...config,
    data: body,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  });
}

/** PATCH JSON (partial update). */
export function upstreamPatch<T = unknown, B = unknown>(
  path: string,
  body?: B,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("PATCH", path, {
    ...config,
    data: body,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  });
}

export function upstreamDelete<T = unknown>(
  path: string,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("DELETE", path, config);
}

/** POST `multipart/form-data` (do not set `Content-Type` manually). */
export function upstreamPostFormData<T = unknown>(
  path: string,
  formData: FormData,
  config?: UpstreamRequestConfig,
): Promise<UpstreamResult<T>> {
  return upstreamRequest<T>("POST", path, {
    ...config,
    data: formData,
  });
}
