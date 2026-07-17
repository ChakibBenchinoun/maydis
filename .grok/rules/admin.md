# Admin panel (always on)

Staff admin lives under `/admin` in `apps/website` (same Next app).

## Access model

1. **Bootstrap owner:** `OWNER_EMAIL` env (local + Vercel). First successful login seeds `staff_members` as `owner`.
2. **Extra staff:** owner adds them in **Admin → Staff** (creates Auth user + row). Do **not** list every staff email in env.
3. Legacy: first entry of `ADMIN_EMAILS` / `ADMIN_EMAIL` acts like `OWNER_EMAIL` if unset.
4. Login is **email + password** (Supabase Auth). Phone SMS OTP is optional later (needs provider).
5. Middleware requires a session for `/admin/*` except login; `requireAdmin()` enforces staff membership.

## Data access

1. After `requireAdmin()`, use **service role** client for CRUD (`getServiceRoleClient`).
2. Never expose service role to the browser.
3. Public site writes stay on SECURITY DEFINER RPCs (`create_reservation`); admin uses authenticated server paths.
4. Migrations: numbered files only (`003_…`, `004_…`); approval required (see `database.md`).

## Structure

- Pages: `app/admin/**` (dashboard, reservations, staff, login).
- APIs: `app/api/admin/**`.
- Helpers: `lib/admin/auth.ts`, `lib/admin/staff.ts`.
- UI: `components/admin/*`.
- Public chrome (`Navbar`/`Footer`) must **not** wrap admin — use `(public)` layout vs admin layout.

## Deep links (WhatsApp / external)

1. Owner booking alerts link to **all reservations**: `https://maydis-website.vercel.app/admin/reservations` (`ADMIN_RESERVATIONS_URL` in `lib/whatsapp/messages.ts`).
2. Never build that URL from `VERCEL_URL` or a preview host (`maydis-website-xxxxx-….vercel.app`).
3. Prefer `site.productionOrigin` in `lib/constants.ts` for any new production-only absolute links.
4. Set Vercel Production `NEXT_PUBLIC_SITE_URL` to the same production alias (QR and public absolute URLs).

## Content foundation (ready for CRUD UIs)

Public loaders + admin service helpers exist; **admin pages not built yet**.

| Domain | Public loader | Admin services | Notes |
|--------|---------------|----------------|-------|
| Menu | `lib/menu.ts` `getMenuItems` | `lib/menu/service.ts` + `schema.ts` | Storage for images |
| Gallery | `lib/gallery.ts` `getGalleryItems` | `lib/gallery/service.ts` | Field **description** (not episode) |
| QR | `lib/qr.ts` `getQrTargets` | `lib/qr/service.ts` | Max **5 active**; logo fixed; **color only** |
| Reservations | create via RPC | `lib/reservations/service.ts` (list/update/delete) | `event_name` column |
| Media | — | `lib/media/storage.ts` | Bucket `media` |

QR activate over limit returns `QR_ACTIVE_LIMIT_MESSAGE` (“Contact a developer to add more”).

## Product backlog (when extending admin)

- Prefer **TanStack Query** for list/filter/mutate (reservations, staff, menu/gallery/qr CRUD).
- Keep English UI; reuse Maydi tokens + existing admin shell patterns.
- Migrations still require explicit user approval (`database.md`).

## Docs

- `docs/ADMIN.md` — setup checklist for owner + staff.
- `docs/WHATSAPP.md` — bot + env for booking notify.
