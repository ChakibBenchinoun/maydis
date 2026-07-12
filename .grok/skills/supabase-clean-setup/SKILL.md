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
2. Expect verify rows: `menu_items = 48` (full seed), functions `create_reservation, get_menu_items`
3. Existing DB with short seed: also run `002_seed_full_menu.sql`
4. Keys → **`apps/website/.env.local` only**:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## App contract

- `POST /api/reserve` → `rpc('create_reservation', { payload })`
- Menu: `rpc('get_menu_items')` with static `src/data/menu.ts` fallback
- Dense seed: 16 dishes × 3 rows in migrations (OK to duplicate for grid density)

## When the user wants a clean start

1. Delete old Supabase project (or abandon keys)
2. Create new project with settings above
3. Run **`001_init.sql`** (includes full 48-row menu seed)
4. Fresh keys in `apps/website/.env.local`
5. Verify reserve insert + `get_menu_items` returns ~48 rows

## Do not

- Add partial grant-fix migrations without rewriting bootstrap on a fresh DB
- Put `postgresql://` in `NEXT_PUBLIC_SUPABASE_URL`
- Commit `.env.local`
- Rely on root-only `.env.local` for Next
- **Create or edit `supabase/migrations/*` without explicit user approval** (see below)

## Migrations require approval

Never add/edit/delete migration files on disk unless the user clearly approves in the current conversation.

1. Propose the SQL (or plan) in chat first.
2. Wait for approval (“yes”, “add the migration”, “go ahead”).
3. Only then write under `supabase/migrations/`.

Always-on rule: `.grok/rules/database.md`.

## Future schema changes

After approval: add `supabase/migrations/002_*.sql` etc. Keep `001_init.sql` as empty-project bootstrap; prefer new files over rewriting applied production `001`.
