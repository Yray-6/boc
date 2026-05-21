# BOC API call architecture

This document explains how HTTP calls are structured in the BOC Next.js app, why many backend requests **do not appear in the browser Network tab**, and which helper functions participate at each layer.

## Overview: three hops

```text
┌─────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│ Browser (client)│     │ Next.js server           │     │ BOC API (Django)    │
│                 │     │                          │     │                     │
│ React + axios   │────▶│ app/api/**/route.ts      │────▶│ BOC_API_BASE_URL    │
│ /api/admin/...  │     │ server/*-api.ts          │     │ /api/v1/...         │
│                 │     │ server/upstream.ts       │     │                     │
│                 │     │                          │     │                     │
│ (optional)      │     │ Server Components/pages  │────▶│ (direct upstream)   │
│ no /api call    │     │ public-properties-api    │     │                     │
└─────────────────┘     └──────────────────────────┘     └─────────────────────┘
```

| Hop | Runs on | URL you see | Logs |
|-----|---------|-------------|------|
| **A** | Browser | `http://localhost:3000/api/...` | DevTools → Network |
| **B** | Next.js route handler | Internal | Terminal (route + upstream) |
| **C** | `upstream.ts` | `{BOC_API_BASE_URL}/api/v1/...` | Terminal → `[upstream] response` |

**Rule of thumb**

- Code in **`"use client"`** components or **`lib/*-client.ts`** → browser calls **`/api/...`** (visible in DevTools).
- Code in **Server Components** / **`app/**/page.tsx`** (no `"use client"`) → calls **`server/*-api.ts`** on the server only (not visible in browser Network).

---

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `BOC_API_BASE_URL` | Yes | Base URL for Django API (no trailing slash). Used only on the **server** by `upstream.ts`. |
| `NEXT_PUBLIC_BOC_API_BASE_URL` | Yes on Vercel | Same host as `BOC_API_BASE_URL`, exposed to the browser for **direct** admin image/video multipart uploads. |

Example `.env.local` (copy from `.env.example`):

```env
BOC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_BOC_API_BASE_URL=https://api.example.com
```

If `BOC_API_BASE_URL` is unset, any upstream call throws: `BOC_API_BASE_URL is not configured`.

If `NEXT_PUBLIC_BOC_API_BASE_URL` is unset on production, `GET /api/admin/upload-auth` returns **503** and direct uploads cannot start.

---

## Vercel body limit and direct admin media uploads

| Layer | Limit |
|-------|--------|
| App (images) | 5 MB per file, up to 20 per property (`uploadAdminPropertyImages`) |
| App (videos) | 100 MB per file, up to 5, MP4/WebM (`uploadAdminPropertyVideos`) |
| **Vercel Serverless Functions** | **~4.5 MB** incoming request body (hard cap; `413 FUNCTION_PAYLOAD_TOO_LARGE`) |

Increasing `serverActions.bodySizeLimit` in `next.config.ts` does **not** remove Vercel’s platform limit. Proxying multipart through `/api/admin/properties/{slug}/images` or `.../videos` fails for any file above ~4.5 MB.

### Direct upload flow (images + videos)

```text
Browser                          Next.js (Vercel)              Django API
   │                                    │                          │
   │  GET /api/admin/upload-auth        │                          │
   │───────────────────────────────────▶│  resolveAdminAccessToken │
   │◀───────────────────────────────────│  { apiBaseUrl, token }   │
   │                                    │                          │
   │  POST multipart .../images/ or .../videos/                    │
   │───────────────────────────────────────────────────────────────▶│
   │  Authorization: Bearer <token>     │         (CORS + size limits)
```

| Step | Endpoint | Size |
|------|----------|------|
| Auth bridge | `GET /api/admin/upload-auth` | JSON only (~KB) |
| Image upload | `{apiBaseUrl}/api/v1/admin/properties/{slug}/images/` | Up to 20 × 5 MB per request |
| Video upload | `{apiBaseUrl}/api/v1/admin/properties/{slug}/videos/` | Up to 5 × 100 MB per request |

**Still via Next proxy** (small bodies): property JSON CRUD, `DELETE` saved image/video, list/detail, form-data.

Legacy Next `POST` handlers under `app/api/admin/properties/[slug]/images` and `.../videos` remain for local debugging; the production client uses the direct path only.

### API host configuration (required)

Without **CORS** on the Django/nginx host allowing the Vercel admin origin, browser direct uploads fail at preflight.

| Setting | Images | Videos |
|---------|--------|--------|
| Per-file | ≥ 5 MB (10 MB buffer sensible) | ≥ 100 MB |
| Per-request | Up to ~100 MB if many images in one POST | Up to 500 MB if all five in one POST (sequential uploads reduce load) |
| nginx | `client_max_body_size 100m;` or higher | Same |
| Django | `DATA_UPLOAD_MAX_MEMORY_SIZE` / file upload limits accordingly | Same |

### Security

- `accessToken` is returned only from authenticated `GET /api/admin/upload-auth`; upload log helpers must not log the token.
- Use HTTPS on Vercel and the API in production.

---

## Layer 1: `server/upstream.ts`

Single axios client for all server → BOC API traffic.

### `UpstreamResult<T>`

```ts
{
  ok: boolean;    // true when HTTP status is 200–299
  status: number;
  data: T;
}
```

Axios uses `validateStatus: () => true`, so **4xx/5xx do not throw**. Callers must check `result.ok`.

### Exported functions

| Function | Method | Body |
|----------|--------|------|
| `upstreamGet(path, config?)` | GET | — |
| `upstreamPost(path, body?, config?)` | POST | JSON (`Content-Type: application/json`) |
| `upstreamPut(path, body?, config?)` | PUT | JSON |
| `upstreamPatch(path, body?, config?)` | PATCH | JSON |
| `upstreamDelete(path, config?)` | DELETE | — |
| `upstreamPostFormData(path, formData, config?)` | POST | `multipart/form-data` (images, videos) |

### Internal helpers

| Helper | Role |
|--------|------|
| `getBaseUrl()` | Reads `BOC_API_BASE_URL` |
| `normalizePath(path)` | Ensures path starts with `/` |
| `getClient()` | Singleton axios instance |
| `safePreview(data)` | Truncates log output (~2k chars) |
| `upstreamRequest()` | Executes request, parses string JSON if needed, logs response |

### Logging (terminal only)

Every response:

```text
[upstream] response { method, path, status, ok, data }
```

Video uploads also log via `lib/admin-video-upload-log.ts` (`[admin:video-upload] upstream`).

---

## Layer 2: `server/*-api.ts`

Thin wrappers: build paths, attach `Authorization: Bearer {token}` where needed, call `upstream*`.

| Module | Base path | Auth |
|--------|-----------|------|
| `admin-properties-api.ts` | `/api/v1/admin/properties` | Bearer |
| `admin-settings-api.ts` | `/api/v1/admin/settings` | Bearer |
| `admin-agents-api.ts` | `/api/v1/admin/agents` | Bearer |
| `admin-auth-api.ts` | `/api/v1/admin/auth/...` | Varies |
| `admin-dashboard-api.ts` | Dashboard endpoints | Bearer |
| `admin-enquiries-api.ts` | Admin enquiries | Bearer |
| `admin-catalog-api.ts` | Amenities, property types | Bearer |
| `public-properties-api.ts` | `/api/v1/properties`, `/api/v1/site-settings/`, etc. | **None** (public) |

### Property media (admin)

| Server function | Upstream |
|-----------------|----------|
| `adminUploadPropertyImages` | `POST …/{slug}/images/` |
| `adminDeletePropertyImage` | `DELETE …/{slug}/images/{id}/` |
| `adminUploadPropertyVideos` | `POST …/{slug}/videos/` |
| `adminListPropertyVideos` | `GET …/{slug}/videos/` (fallback without trailing slash) |
| `adminGetPropertyVideo` | `GET …/{slug}/videos/{id}/` |
| `adminDeletePropertyVideo` | `DELETE …/{slug}/videos/{id}/` |

### Public site

| Function | Upstream |
|----------|----------|
| `publicListFeatured` | `GET /api/v1/properties/featured/` |
| `publicListProperties` | `GET /api/v1/properties/` |
| `publicGetPropertyDetail` | `GET /api/v1/properties/{slug}/` |
| `publicGetPropertyVideos` | `GET …/{slug}/videos/` or `…/videos` |
| `publicGetSiteSettings` | `GET /api/v1/site-settings/` |
| `publicListAmenities` | `GET /api/v1/amenities/` |

Helper: `withQuery(path, searchParams)` appends query strings.

---

## Layer 3: Next.js route handlers (`src/app/api/**/route.ts`)

Browser-facing BFF: same-origin `/api/...` proxies to BOC API.

### Admin auth

| Route | Method | Upstream | Notes |
|-------|--------|----------|-------|
| `/api/admin/auth/token` | POST | Admin login | Sets httpOnly access + refresh cookies |
| `/api/admin/auth/me` | GET | Current user | Reads cookie / Bearer |

Token resolution: `server/resolve-admin-access-token.ts`

- `bearerFromRequest(request)` — `Authorization: Bearer …`
- `resolveAdminAccessToken(request)` — header first, else cookie `ADMIN_ACCESS_COOKIE`

### Admin routes (authenticated)

| Area | Routes |
|------|--------|
| Properties | `/api/admin/properties`, `[slug]`, `images`, `videos`, `form-data`, `export/csv` |
| Settings | `/api/admin/settings`, `settings/logo` |
| Agents | `/api/admin/agents`, `[id]`, `[id]/properties` |
| Enquiries | `/api/admin/enquiries`, `[id]` |
| Dashboard | `/api/admin/dashboard` |
| Catalog | `/api/admin/amenities`, `property-types` |

Typical handler pattern:

```ts
const token = await resolveAdminAccessToken(request);
if (!token) return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });

const upstream = await adminGetProperty(token, slug);
return NextResponse.json(upstream.data, { status: upstream.status });
```

### Public proxy routes

| Route | Upstream |
|-------|----------|
| `GET /api/properties` | `publicListProperties` |
| `GET /api/properties/featured` | `publicListFeatured` |
| `GET /api/properties/[slug]/similar` | `publicListSimilar` |
| `POST /api/enquiries` | `POST /api/v1/enquiries/` |

---

## Layer 4: Browser clients (`lib/*-client.ts`)

Used by client components and React Query. Axios instances use:

- `withCredentials: true` (admin cookies)
- `validateStatus: () => true`
- Throw on non-2xx using `detailFromUnknown` or similar

| File | Purpose |
|------|---------|
| `admin-properties-client.ts` | Properties CRUD, images, videos, CSV |
| `admin-settings-client.ts` | Site settings, logo |
| `admin-agents-client.ts` | Agents |
| `admin-auth-client.ts` | Login, `me` |
| `admin-dashboard-client.ts` | Dashboard |
| `admin-enquiries-client.ts` | Enquiries |
| `admin-catalog-client.ts` | Amenities, property types |

### Notable property helpers

| Function | Behavior |
|----------|----------|
| `fetchAdminPropertyDetailMerged(slug)` | GET detail; if no `videos`, GET list and merge |
| `getAdminUploadAuth()` (internal) | `GET /api/admin/upload-auth` → `{ apiBaseUrl, accessToken }` |
| `directMultipartPost()` (internal) | Cross-origin `POST` to `{apiBaseUrl}/api/v1/...` with Bearer auth |
| `uploadAdminPropertyImages(slug, files)` | Direct POST to `.../images/`; validates 5 MB × 20; logs `[admin:image-upload] client` |
| `uploadAdminPropertyVideos(slug, files, opts?)` | Direct POST to `.../videos/`; logs `[admin:video-upload] client` |
| `deleteAdminPropertyVideo(slug, videoId)` | DELETE via Next `/api/admin/...` |
| `deleteAdminPropertyImage(slug, imageId)` | DELETE via Next `/api/admin/...` |

---

## Layer 5: React Query (`lib/hooks/use-admin-*-queries.ts`)

| Hook | Client call | Browser Network |
|------|-------------|-----------------|
| `useAdminPropertyListQuery` | `fetchAdminPropertyList` | Yes |
| `useAdminPropertyDetailQuery` | `fetchAdminPropertyDetailMerged` | Yes |
| `useAdminPropertyFormDataQuery` | `fetchPropertyFormData` | Yes |
| `useAdminSiteSettingsQuery` | `fetchAdminSiteSettings` | Yes |

Admin `QueryClient` default: `staleTime: 60s` (settings query uses `staleTime: 0`).

---

## Layer 6: Server Components & public pages

| Location | Helper | Upstream (terminal only) |
|----------|--------|---------------------------|
| `SiteFooter` | `loadPublicSiteSettings()` | `GET /api/v1/site-settings/` |
| `app/page.tsx` | `publicListFeatured()` | `GET /api/v1/properties/featured/` |
| `app/contact/page.tsx` | `loadPublicSiteSettings()` | site settings |
| `app/properties/[id]/page.tsx` | `publicGetPropertyDetail`, `publicGetPropertyVideos` | property + videos |

### `loadPublicSiteSettings()` (`server/load-public-site-settings.ts`)

- Calls `unstable_noStore()` to avoid stale cached HTML.
- Validates with `isSiteSettings()`.
- Returns `null` on failure → UI uses hardcoded fallbacks.

### Cache invalidation

After admin saves site settings, `revalidatePublicSiteContent()` (`server/revalidate-public-site.ts`) revalidates `/`, `/contact`, `/properties`.

---

## Mappers (not HTTP)

| Module | Role |
|--------|------|
| `lib/admin-property-mappers.ts` | Form values ↔ API payloads; `existingImages` / `existingVideos` from detail |
| `lib/public-property-mapper.ts` | Public list/detail shapes; video slide normalization |
| `lib/property-form-dropdowns.ts` | Normalizes property `form-data` response |

### Admin publish flow

1. `createAdminProperty` / `updateAdminProperty` — JSON body
2. `uploadAdminPropertyImages` — if new image files
3. `uploadAdminPropertyVideos` — if new video files

### Immediate deletes on edit

- Saved image: `deleteAdminPropertyImage` (form modal)
- Saved video: `deleteAdminPropertyVideo` (form modal)

---

## End-to-end examples

### Site settings on homepage (not in browser Network)

```text
GET /
  → SiteFooter (Server Component)
  → loadPublicSiteSettings()
  → publicGetSiteSettings()
  → upstreamGet("/api/v1/site-settings/")
  → [upstream] response in terminal
```

### Admin property list (visible in browser)

```text
AdminProperties
  → useAdminPropertyListQuery
  → GET /api/admin/properties?page=1&...
  → adminListProperties(token, query)
  → upstreamGet("/api/v1/admin/properties/?...")
```

### Image or video upload on publish (production / Vercel)

```text
Browser: [admin:image-upload] or [admin:video-upload] client request (mode: direct)
Browser Network: GET /api/admin/upload-auth  (Next origin)
Browser Network: POST https://<api-host>/api/v1/admin/properties/{slug}/images/ or .../videos/
Browser console: client response / error (no token in logs)
```

Local dev may still hit legacy Next `POST /api/admin/.../images|videos` if you call those routes manually; the admin client always uses the direct path when `uploadAdminPropertyImages` / `uploadAdminPropertyVideos` run.

### Delete saved video on edit

```text
Browser: DELETE /api/admin/properties/{slug}/videos/{id}
Terminal: adminDeletePropertyVideo → upstreamDelete
```

---

## Debugging checklist

| Symptom | What to check |
|---------|----------------|
| No request in browser Network | Likely Server Component path; watch terminal `[upstream]` |
| 401 on `/api/admin/*` | Login cookie; `resolveAdminAccessToken` |
| 503 from `/api/*` | `BOC_API_BASE_URL`, upstream availability |
| Stale footer phone/email | `noStore` in `loadPublicSiteSettings`; revalidate after settings save |
| Video upload not firing | Files selected + publish; console filter `[admin:video-upload]` |
| 413 on upload | Check **API host** nginx/Django limits, not Vercel; confirm Network shows POST to API host |
| CORS error on upload | Add Vercel admin origin to Django CORS; allow `Authorization` header |
| 503 on upload-auth | Set `NEXT_PUBLIC_BOC_API_BASE_URL` (and `BOC_API_BASE_URL`) on Vercel |

---

## File reference

```text
src/
├── server/
│   ├── upstream.ts                 # All BOC API HTTP (server-only)
│   ├── admin-properties-api.ts
│   ├── admin-settings-api.ts
│   ├── public-properties-api.ts
│   ├── resolve-admin-access-token.ts
│   ├── load-public-site-settings.ts
│   └── revalidate-public-site.ts
├── app/api/
│   └── admin/upload-auth/route.ts  # Bearer + apiBaseUrl for direct media uploads
│   # ... other /api/* routes
├── lib/
│   ├── admin-properties-client.ts
│   ├── admin-settings-client.ts
│   ├── hooks/use-admin-*-queries.ts
│   ├── admin-property-mappers.ts
│   ├── public-property-mapper.ts
│   └── admin-video-upload-log.ts
└── components/
    ├── admin/                      # CPS UI → *-client.ts
    └── home/site-footer.tsx        # Server → loadPublicSiteSettings
```
