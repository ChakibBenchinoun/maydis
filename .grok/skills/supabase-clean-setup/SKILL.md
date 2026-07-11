---
name: supabase-clean-setup
description: >
  Clean Supabase setup for Maydi's (and same pattern elsewhere): one bootstrap SQL
  (supabase/migrations/001_init.sql), apps/website/.env.local keys, create_reservation RPC.
  Use when setting up or fixing Supabase, database schema, reservations, env keys, or
  /supabase-clean-setup.
---

# Supabase clean setup (Maydi's)

Project-specific paths for this monorepo. Principles match the global skill of the same name.

## Canonical docs & files

| What | Path |
|------|------|
| Human guide | `docs/SUPABASE.md` |
| Bootstrap SQL | `supabase/migrations/001_init.sql` |
| Env template | `.env.example` → `apps/website/.env.local` |
| Server client | `apps/website/src/lib/supabase/server.ts` |
| Browser client | `apps/website/src/lib/supabase/client.ts` |
| Reserve API | `apps/website/src/app/api/reserve/route.ts` |

## Create project settings

- Name: `maydis` (or new name if recreating)
- Region: Europe
- Data API: **ON**
- Automatically expose new tables: **ON**
- Automatic RLS: **ON**
- Password: generate + save offline

## Bootstrap

1. SQL Editor → paste **entire** `supabase/migrations/001_init.sql` → Run
2. Expect verify rows: `menu_items = 9`, functions `create_reservation, get_menu_items`
3. Keys → **`apps/website/.env.local` only**:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## App contract

- `POST /api/reserve` → `rpc('create_reservation', { payload })`
- Menu UI today: static `src/data/menu.ts`
- Later DB menu: `rpc('get_menu_items')`

## When the user wants a clean start

1. Delete old Supabase project (or abandon keys)
2. Create new project with settings above
3. Run **only** `001_init.sql` (do not reintroduce old 002–00x patch files)
4. Fresh keys in `apps/website/.env.local`
5. Verify reserve insert in Table Editor + API

## Do not

- Add partial grant-fix migrations without rewriting bootstrap on a fresh DB
- Put `postgresql://` in `NEXT_PUBLIC_SUPABASE_URL`
- Commit `.env.local`
- Rely on root-only `.env.local` for Next

## Future schema changes

Add `supabase/migrations/002_*.sql` etc. Keep `001_init.sql` as empty-project bootstrap only.
