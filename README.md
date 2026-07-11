# Maydi's

Turborepo monorepo for **Maydi's** café website (Oran).

## Structure

```
apps/website                 Next.js 16 App Router
supabase/migrations/         Database (single bootstrap: 001_init.sql)
docs/SUPABASE.md             Clean Supabase setup guide
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
```

Fill Supabase keys after setup. See **[docs/SUPABASE.md](docs/SUPABASE.md)** (create project → run `001_init.sql` → paste keys).

Without Supabase, the site still works: menu is static; reservations are accepted and logged locally.

## Vercel

See **[docs/VERCEL.md](docs/VERCEL.md)** — Root Directory `apps/website`, env from `.env.example`.

## Stack

- Next.js 16 · React 19 · Tailwind CSS v4  
- Motion · Lucide · QRCode  
- Optional: Supabase  
- pnpm + Turborepo  

## Site config

`apps/website/src/lib/constants.ts` — phone, socials, maps, hours.
