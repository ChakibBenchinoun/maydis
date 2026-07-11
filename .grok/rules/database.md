# Database rules (always on)

When touching Supabase / backend data for Maydi's:

1. Follow **supabase-clean-setup** skill and `docs/SUPABASE.md`.
2. Schema source of truth for empty projects: `supabase/migrations/001_init.sql`.
3. New changes = new numbered migration files (`002_…`), not ad-hoc dashboard edits without SQL in repo.
4. Env lives in `apps/website/.env.local`; URL must be `https://…supabase.co`.
5. Prefer SECURITY DEFINER RPCs for public form writes (`create_reservation`).
6. If setup is broken, prefer **clean project + re-run 001** over stacking grant fixes.
