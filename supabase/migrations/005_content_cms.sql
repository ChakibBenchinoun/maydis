-- =============================================================================
-- Maydi's — Content CMS foundation (gallery, multi QR, event_name, storage)
-- Safe to re-run pieces carefully; prefer run once on production after 001–004.
-- =============================================================================

-- ─── Reservations: event_name ────────────────────────────────────────────────

alter table public.reservations
  add column if not exists event_name text;

comment on column public.reservations.event_name is
  'Who / occasion for the event (was previously prefixed into notes as Event: …)';

-- Recreate create_reservation with event_name
create or replace function public.create_reservation(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  v_name text := trim(coalesce(payload->>'name', ''));
  v_phone text := trim(coalesce(payload->>'phone', ''));
  v_email text := nullif(trim(coalesce(payload->>'email', '')), '');
  v_date date;
  v_time text := trim(coalesce(payload->>'time', ''));
  v_guests text := trim(coalesce(payload->>'guests', ''));
  v_notes text := nullif(trim(coalesce(payload->>'notes', '')), '');
  v_event_name text := nullif(trim(coalesce(payload->>'event_name', payload->>'eventName', '')), '');
begin
  begin
    v_date := (payload->>'date')::date;
  exception when others then
    raise exception 'invalid date';
  end;

  if v_name = '' then raise exception 'name is required'; end if;
  if v_phone = '' then raise exception 'phone is required'; end if;
  if v_date is null then raise exception 'date is required'; end if;
  if v_time = '' then raise exception 'time is required'; end if;
  if v_guests = '' then raise exception 'guests is required'; end if;

  insert into public.reservations (name, phone, email, date, time, guests, notes, event_name, status)
  values (v_name, v_phone, v_email, v_date, v_time, v_guests, v_notes, v_event_name, 'pending')
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.create_reservation(jsonb) from public;
grant execute on function public.create_reservation(jsonb) to anon, authenticated, service_role;

-- ─── Gallery items ───────────────────────────────────────────────────────────

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('photo', 'video')),
  image_url text not null default '',
  video_url text,
  alt text not null default '',
  title text,
  description text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_published_sort_idx
  on public.gallery_items (published, sort_order);

grant select on table public.gallery_items to anon, authenticated, service_role;
grant all on table public.gallery_items to service_role;

alter table public.gallery_items enable row level security;

drop policy if exists "anon_read_gallery" on public.gallery_items;
create policy "anon_read_gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (published = true);

drop policy if exists "service_all_gallery" on public.gallery_items;
create policy "service_all_gallery"
  on public.gallery_items for all
  to service_role
  using (true) with check (true);

create or replace function public.get_gallery_items()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', g.id,
        'type', g.type,
        'image_url', g.image_url,
        'video_url', g.video_url,
        'alt', g.alt,
        'title', g.title,
        'description', g.description,
        'sort_order', g.sort_order
      )
      order by g.sort_order asc, g.created_at asc
    ),
    '[]'::jsonb
  )
  from public.gallery_items g
  where coalesce(g.published, true) = true;
$$;

revoke all on function public.get_gallery_items() from public;
grant execute on function public.get_gallery_items() to anon, authenticated, service_role;

-- Seed gallery (idempotent only if empty)
insert into public.gallery_items (type, image_url, video_url, alt, title, description, sort_order)
select * from (values
  ('photo'::text, '/images/gallery-01.jpg', null::text, 'Maydi''s café moment', null::text, null::text, 1),
  ('video', '/images/gallery-05.jpg', '/videos/maydis-01.mp4', 'A morning at Maydi''s', 'A Morning at Maydi''s', 'Soft light, coffee, and the start of the day.', 2),
  ('photo', '/images/gallery-02.jpg', null, 'Maydi''s food and space', null, null, 3),
  ('photo', '/images/gallery-03.jpg', null, 'Maydi''s interior', null, null, 4),
  ('video', '/images/gallery-06.jpg', '/videos/maydis-02.mp4', 'The space we love', 'The Space We Love', 'Corners of the café we never tire of.', 5),
  ('photo', '/images/gallery-04.jpg', null, 'Maydi''s specialty', null, null, 6),
  ('photo', '/images/gallery-07.jpg', null, 'Maydi''s plating', null, null, 7),
  ('video', '/images/video-poster-extra.jpg', '/videos/maydis-03.mp4', 'Moments at Maydi''s', 'Café Moments', 'Guests, plates, and little pauses.', 8),
  ('photo', '/images/gallery-08.jpg', null, 'Maydi''s kitchen life', null, null, 9),
  ('photo', '/images/gallery-09.jpg', null, 'Maydi''s warm corner', null, null, 10),
  ('video', '/images/gallery-04.jpg', '/videos/maydis-04.mp4', 'Life at Maydi''s', 'Life at Maydi''s', 'Everyday rhythm in Oran.', 11),
  ('photo', '/images/gallery-10.jpg', null, 'Maydi''s guests favorite', null, null, 12),
  ('photo', '/images/unnamed.webp', null, 'Maydi''s selection', null, null, 13),
  ('photo', '/images/unnamed-1.webp', null, 'Maydi''s signature look', null, null, 14),
  ('photo', '/images/unnamed-2.webp', null, 'Maydi''s craft', null, null, 15),
  ('photo', '/images/unnamed-3.webp', null, 'Maydi''s vibe', null, null, 16),
  ('photo', '/images/sealing.webp', null, 'Maydi''s seal', null, null, 17)
) as v(type, image_url, video_url, alt, title, description, sort_order)
where not exists (select 1 from public.gallery_items limit 1);

-- ─── QR targets (max 5 active enforced in app; logo is brand-fixed) ───────────

create table if not exists public.qr_targets (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  target_url text not null,
  /** QR dark module color (hex). Logo is always site brand logo — not stored. */
  dark_color text not null default '#2C2318',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists qr_targets_active_sort_idx
  on public.qr_targets (active, sort_order);

grant select on table public.qr_targets to anon, authenticated, service_role;
grant all on table public.qr_targets to service_role;

alter table public.qr_targets enable row level security;

drop policy if exists "anon_read_qr" on public.qr_targets;
create policy "anon_read_qr"
  on public.qr_targets for select
  to anon, authenticated
  using (active = true);

drop policy if exists "service_all_qr" on public.qr_targets;
create policy "service_all_qr"
  on public.qr_targets for all
  to service_role
  using (true) with check (true);

create or replace function public.get_qr_targets()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', q.id,
        'label', q.label,
        'target_url', q.target_url,
        'dark_color', q.dark_color,
        'sort_order', q.sort_order
      )
      order by q.sort_order asc, q.created_at asc
    ),
    '[]'::jsonb
  )
  from public.qr_targets q
  where coalesce(q.active, true) = true;
$$;

revoke all on function public.get_qr_targets() from public;
grant execute on function public.get_qr_targets() to anon, authenticated, service_role;

insert into public.qr_targets (label, target_url, dark_color, sort_order, active)
select * from (values
  ('Menu'::text, '/menu'::text, '#2C2318'::text, 1, true),
  ('Reserve', '/reserve', '#2C2318', 2, true),
  ('Instagram', 'https://www.instagram.com/maydiscakeshop/', '#2C2318', 3, true)
) as v(label, target_url, dark_color, sort_order, active)
where not exists (select 1 from public.qr_targets limit 1);

-- ─── Storage bucket `media` (public read; writes via service role) ───────────
-- Requires storage schema (default on Supabase). Safe if bucket already exists.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  104857600, -- 100 MB (videos)
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'media');

-- Service role full access (admin API uses service key)
drop policy if exists "media_service_all" on storage.objects;
create policy "media_service_all"
  on storage.objects for all
  to service_role
  using (bucket_id = 'media')
  with check (bucket_id = 'media');
