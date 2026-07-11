# Maydi's

Turborepo monorepo for **Maydi's** café website (Oran).

## Structure

```
apps/website     Next.js 16 App Router
supabase/        SQL migrations (run in Supabase dashboard)
```

## Quick start

```bash
pnpm install
pnpm website:dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Description |
|-------|-------------|
| `/` | Home (sections + QR) |
| `/menu` | Full digital menu (QR target) |
| `/reserve` | Table reservation form |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm website:dev` | Dev server |
| `pnpm website:build` | Production build |
| `pnpm build` | Turbo build all |
| `pnpm typecheck` | Type-check |

## Environment

```bash
cp .env.example apps/website/.env.local
# fill Supabase keys + NEXT_PUBLIC_SITE_URL
```

See `.env.example`.

### Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. SQL Editor → paste `supabase/migrations/001_init.sql` → Run.
3. Project Settings → API → copy URL + anon key (+ service role for server inserts).
4. Put values in `apps/website/.env.local`.

Without Supabase, the site still works: menu uses static data; reservations are accepted and logged in the server console.

## Vercel deploy

1. Push this repo to GitHub.
2. [vercel.com](https://vercel.com) → Import project.
3. **Root Directory:** `apps/website`  
   (or monorepo root with install `pnpm install` and build `pnpm --filter @maydis/website build`).
4. Framework: Next.js · Install: `pnpm install`.
5. Add env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your production domain).
6. Deploy → confirm `/`, `/menu`, `/reserve`.

## Stack

- Next.js 16 · React 19 · Tailwind CSS v4
- Motion · Lucide · QRCode
- Optional: Supabase
- pnpm + Turborepo

## Contact (site config)

Edit `apps/website/src/lib/constants.ts` for phone, socials, maps, hours.
