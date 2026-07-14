-- =============================================================================
-- Maydi's — Admin: reservation status constraint (safe to re-run)
-- Does not drop tables. Run in Supabase SQL Editor after 001/002.
-- =============================================================================

-- Normalize legacy free-text statuses before constraining
update public.reservations
set status = 'pending'
where status is null
   or trim(status) = ''
   or lower(trim(status)) not in ('pending', 'confirmed', 'cancelled', 'completed');

update public.reservations
set status = lower(trim(status));

alter table public.reservations
  drop constraint if exists reservations_status_check;

alter table public.reservations
  add constraint reservations_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'completed'));

comment on column public.reservations.status is
  'pending | confirmed | cancelled | completed — managed in /admin';
