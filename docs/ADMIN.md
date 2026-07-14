# Staff admin (`/admin`)

English UI. **Email + password** login.

## How access works

| Who | How they get in |
|-----|------------------|
| **Owner** | One bootstrap email in env: `OWNER_EMAIL` + Auth user in Supabase |
| **Other staff** | Owner adds them in **Admin → Staff** (no env edits) |

There is **no** need to list every colleague in env.

## Setup (once)

### 1. Env

```bash
OWNER_EMAIL=you@yourdomain.com
```

Optional legacy: `ADMIN_EMAILS` first entry is treated like `OWNER_EMAIL` if `OWNER_EMAIL` is unset.

Also: Supabase URL, anon key, **service role**.

### 2. Create the owner Auth user

Supabase → **Authentication → Users → Add user**

- Email = same as `OWNER_EMAIL`
- Password you choose
- Confirm email if required (or disable confirm for staff)

### 3. SQL migrations

Run if not already:

- `003_admin_reservation_status.sql` — reservation statuses  
- **`004_staff_members.sql`** — staff table (required for team UI)

### 4. First login

Open `/admin/login` with the owner email/password.  
First successful login **seeds** `staff_members` with role `owner`.

### 5. Add staff in the UI

**Admin → Staff → Add staff**

- Email + temporary password + role (`staff` or `owner`)  
- Creates Supabase Auth user + staff row  
- Share credentials securely; they sign in at `/admin/login`

Only **owners** can add/remove staff. Last owner cannot be removed.

## Features

| Area | Status |
|------|--------|
| Owner bootstrap (`OWNER_EMAIL`) | Done |
| Staff CRUD in UI | Done |
| Reservations | Done |
| Menu / Gallery | Later |

## Phone login?

Not in v1 (needs SMS provider). Login is email for everyone.

## Security

- Public site has no admin chrome  
- Session required for `/admin`  
- Staff membership from `staff_members` (+ bootstrap owner)  
- Service role only on the server after `requireAdmin()`  
