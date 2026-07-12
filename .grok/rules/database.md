# Database rules (always on)

When touching Supabase / backend data for Maydi's:

1. Follow **supabase-clean-setup** skill and `docs/SUPABASE.md`.
2. Schema source of truth for empty projects: `supabase/migrations/001_init.sql`.
3. New changes = new numbered migration files (`002_…`), not ad-hoc dashboard edits without SQL in repo — **only after user approval** (see below).
4. Env lives in `apps/website/.env.local`; URL must be `https://…supabase.co`.
5. Prefer SECURITY DEFINER RPCs for public form writes (`create_reservation`).
6. If setup is broken, prefer **clean project + re-run 001** over stacking grant fixes.

## Migrations require approval (mandatory)

**Do not** create, edit, rename, or delete files under `supabase/migrations/` unless the user has **explicitly approved** that migration work in the current conversation.

| Allowed without asking | Requires explicit user approval first |
|------------------------|----------------------------------------|
| Read / explain existing migrations | Add `002_*.sql`, `003_*.sql`, … |
| Propose SQL in chat for review | Rewrite or amend applied bootstrap `001` |
| Run seed/SQL the user already approved | Truncate/reseed tables via new migration files |
| Use REST/API with existing schema (if env allows) | Any new migration file on disk |

Workflow when a schema/seed change is needed:

1. Describe the change and show the proposed SQL in chat (or a draft path).
2. Wait for clear approval (e.g. “yes”, “add the migration”, “go ahead”).
3. Only then write/update files under `supabase/migrations/`.
