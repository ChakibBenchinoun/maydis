# Supabase setup (clean — from zero)

One migration. One env file. Follow in order.

---

## 0. Delete the old project

1. [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open the old **maydis** project → **Project Settings → General**
3. **Delete project** → confirm

(Or ignore it and create a new one with a different name — just don’t reuse old keys.)

---

## 1. Create a new project

**New project** with these settings:

| Setting | Value |
|---------|--------|
| **Name** | `maydis` |
| **Database password** | **Generate** → save offline |
| **Region** | **Europe** |
| **Enable Data API** | **ON** |
| **Automatically expose new tables** | **ON** |
| **Enable automatic RLS** | **ON** |

Wait until status is **Healthy**.

---

## 2. Run the only migration

1. **SQL Editor → New query**
2. Open: **`supabase/migrations/001_init.sql`**
3. Select all → copy → paste → **Run**

### Expected result

| object | value |
|--------|--------|
| menu_items | 9 |
| functions | create_reservation, get_menu_items |

Creates: tables, grants, RLS, RPCs, menu seed.

---

## 3. Copy API keys

**Project Settings → API**

| Dashboard | Env var |
|-----------|---------|
| Project URL (`https://….supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` secret | `SUPABASE_SERVICE_ROLE_KEY` |

---

## 4. Env file

**Only** `apps/website/.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Rules:

- URL must be **`https://`** (never `postgresql://`)
- Next.js reads **`apps/website/.env.local`** (not only repo root)
- No `DATABASE_URL` needed for the website

---

## 5. Verify

```bash
pnpm website:dev
```

1. [http://localhost:3000/reserve](http://localhost:3000/reserve) → submit a booking  
2. Supabase **Table Editor → reservations** → new row  

---

## 6. Vercel

Same env vars; root directory **`apps/website`**.

---

## App ↔ database

| Feature | Uses |
|---------|------|
| `/api/reserve` | RPC `create_reservation(payload jsonb)` |
| Menu UI today | Static `src/data/menu.ts` |
| Menu from DB later | RPC `get_menu_items()` |

---

## Future schema changes

Add `002_….sql`, `003_….sql`, … — do not rewrite `001_init.sql` after production use.
