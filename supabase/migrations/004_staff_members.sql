-- =============================================================================
-- Maydi's — Staff members (owner manages team in /admin/staff)
-- Bootstrap: set OWNER_EMAIL in env; first owner login seeds this table.
-- =============================================================================

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null default 'staff'
    check (role in ('owner', 'staff')),
  active boolean not null default true,
  user_id uuid,
  created_at timestamptz not null default now(),
  created_by text
);

create unique index if not exists staff_members_email_lower_idx
  on public.staff_members (lower(email));

create index if not exists staff_members_active_idx
  on public.staff_members (active);

alter table public.staff_members enable row level security;

-- No anon access — only service role from the Next.js admin API
drop policy if exists "service_all_staff" on public.staff_members;
create policy "service_all_staff"
  on public.staff_members for all
  to service_role
  using (true) with check (true);

grant all on table public.staff_members to service_role;
revoke all on table public.staff_members from anon, authenticated;

comment on table public.staff_members is
  'Café staff allowed into /admin. Owner adds/removes rows via admin UI.';
