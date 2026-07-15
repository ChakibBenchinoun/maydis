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

## Docs

- `docs/ADMIN.md` — setup checklist for owner + staff.
