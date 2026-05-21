# BOC Real Estate

Next.js frontend for the BOC public site and admin CPS (property management). The app proxies all backend traffic through Next.js API routes and server-side upstream calls to a Django API.

## Requirements

- Node.js 20+
- npm

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set your Django API host (no trailing slash):

```env
BOC_API_BASE_URL=https://your-django-api-host
NEXT_PUBLIC_BOC_API_BASE_URL=https://your-django-api-host
```

`NEXT_PUBLIC_BOC_API_BASE_URL` must match `BOC_API_BASE_URL`. It is required in production on Vercel so the admin UI can upload images and videos **directly** to Django (see [Large media uploads on Vercel](#large-media-uploads-on-vercel) below).

3. Start the dev server:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin-login](http://localhost:3000/admin-login)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) (requires login)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## Project structure

```text
src/
├── app/              # Next.js App Router (pages + API routes)
├── components/       # UI (home, properties, admin, contact)
├── lib/              # Browser clients, mappers, hooks, utilities
├── server/           # Upstream API wrappers (server-only)
└── types/            # TypeScript types aligned with backend
public/               # Static assets
docs/                 # Project documentation
```

## API architecture (important)

This app uses a **three-layer** HTTP model:

1. **Browser** → `GET/POST /api/...` on the Next.js origin (visible in DevTools).
2. **Next.js route handlers** → `src/app/api/**/route.ts`.
3. **Upstream** → `{BOC_API_BASE_URL}/api/v1/...` via `src/server/upstream.ts` (logged in the **terminal**, not the browser).

Many public features (footer contact info, featured properties on the home page, property detail SSR) call the backend **only on the server**. Those requests will **not** appear in the browser Network tab.

For full detail (helpers, auth, media upload/delete, debugging), see:

**[docs/API-ARCHITECTURE.md](./docs/API-ARCHITECTURE.md)**

## Admin features (high level)

- **Properties** — list, create, edit, publish, images (upload/delete), videos (upload/delete)
- **Agents** — CRUD
- **Enquiries** — list and manage
- **Settings** — site name, phone, email, social links, logo
- **Dashboard** — overview stats

## Public features (high level)

- Home, property listing with filters, property detail (photos/videos), contact form, enquiries

## Large media uploads on Vercel

Vercel Serverless Functions cap incoming request bodies at **~4.5 MB**. Admin image uploads (up to 5 MB each) and video uploads (up to 100 MB each) cannot pass through Next.js proxy routes on production.

The admin client bypasses that limit:

1. `GET /api/admin/upload-auth` — small JSON with `apiBaseUrl` + Bearer `accessToken` (from the httpOnly session cookie).
2. Browser `POST` multipart **directly** to `{NEXT_PUBLIC_BOC_API_BASE_URL}/api/v1/admin/properties/{slug}/images/` or `.../videos/`.

**Deploy checklist**

| Item | Notes |
|------|--------|
| `NEXT_PUBLIC_BOC_API_BASE_URL` | Set on Vercel to the same host as `BOC_API_BASE_URL` |
| Django **CORS** | Allow your Vercel admin origin; preflight must permit `Authorization` |
| **nginx / Django** | `client_max_body_size` and upload limits ≥ 100 MB for videos; ≥ 5 MB per image (see [docs/API-ARCHITECTURE.md](./docs/API-ARCHITECTURE.md)) |

JSON CRUD and image/video **deletes** still use `/api/admin/...` on the Next origin (small payloads).

## Debugging API calls

| Where to look | What you see |
|---------------|--------------|
| Browser DevTools → Network | Calls to `/api/admin/...`, `/api/properties`, `/api/enquiries`; image/video **uploads** go to the **API host** (`.../images/`, `.../videos/`) |
| Terminal running `npm run dev` | `[upstream] response` for every BOC API call |
| Browser console | `[admin:image-upload] client`, `[admin:video-upload] client` for direct media uploads |

## License

Private — BOC Real Estate.
