# Maydi's

Turborepo monorepo for the Maydi's café website (Oran).

## Structure

```
apps/website  → Next.js 16 App Router site
```

## Quick start

```bash
pnpm install
pnpm website:dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm website:dev` | Start website dev server |
| `pnpm website:build` | Production build |
| `pnpm build` | Build all apps via Turbo |
| `pnpm typecheck` | Type-check all packages |

## Stack

- Next.js 16 · React 19 · Tailwind CSS v4
- Motion · Lucide React
- pnpm + Turborepo
