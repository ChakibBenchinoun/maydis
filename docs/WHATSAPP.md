# WhatsApp for production (free Baileys bot)

Vercel **cannot** run WhatsApp itself (serverless = no always-on socket).  
Production setup = **website on Vercel** + **small always-on bot** (Baileys, free OSS).

```
Guest books on Vercel site
        │
        ▼
  /api/reserve  ──POST /send──►  WhatsApp bot (Railway / Render / Fly / VPS)
        │                              │
        ▼                              ▼
   Supabase DB              WhatsApp to owner + guest
```

Owner (dev/prod default): **0540580738** → `213540580738`

---

## 1. Local (already working)

```bash
# Terminal A
pnpm whatsapp:bot
# Scan QR → ready:true

# Terminal B
pnpm website:dev
```

`apps/website/.env.local`:

```bash
WHATSAPP_OWNER_PHONE=213540580738
WHATSAPP_PROVIDER=baileys
WHATSAPP_BOT_URL=http://127.0.0.1:3100
# optional locally; required in production:
# WHATSAPP_BOT_SECRET=long-random-string
```

---

## 2. Production — deploy the bot (pick one host)

You need a host that stays **online 24/7** (not Vercel). Free tiers:

| Host | Notes |
|------|--------|
| [Railway](https://railway.app) | Easy Docker deploy |
| [Render](https://render.com) | Web service, may sleep on free → prefer paid always-on |
| [Fly.io](https://fly.io) | Good for small Node services |
| Any VPS (Hetzner, DigOcean, Oracle free) | `docker run` |

### Required bot env vars

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `3100` (or host default) |
| `WHATSAPP_BOT_SECRET` | Long random secret (same as on Vercel) |
| `WHATSAPP_AUTH_DIR` | `/data/auth` (Docker) — **use a persistent volume** |

### Docker (any VPS)

```bash
cd apps/whatsapp-bot
docker build -t maydis-whatsapp-bot .
docker run -d --name maydis-wa \
  -p 3100:3100 \
  -e NODE_ENV=production \
  -e WHATSAPP_BOT_SECRET='YOUR_LONG_SECRET' \
  -v maydis_wa_data:/data \
  maydis-whatsapp-bot
```

### Railway

1. New project → Deploy from GitHub  
2. **Root Directory:** `apps/whatsapp-bot`  
3. Uses `Dockerfile` + `railway.toml`  
4. Variables: `NODE_ENV=production`, `WHATSAPP_BOT_SECRET=...`  
5. Add a **volume** mounted at `/data` (keeps WhatsApp session)  
6. Deploy → open `https://YOUR-SERVICE.up.railway.app/health`  
7. If not linked: open `https://YOUR-SERVICE.up.railway.app/qr.png` and scan once  
8. Wait until `/health` shows `"ready": true`

### Link WhatsApp (once per environment)

1. Use a **dedicated phone** if possible (or owner phone as linked device)  
2. WhatsApp → **Linked devices** → scan `/qr.png`  
3. Session is stored on the volume — survives restarts  

---

## 3. Production — Vercel (website)

In Vercel → Project → Settings → Environment Variables (**Production**):

| Name | Example |
|------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://maydis.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://….supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | … |
| `SUPABASE_SERVICE_ROLE_KEY` | … |
| `WHATSAPP_OWNER_PHONE` | `213540580738` |
| `WHATSAPP_PROVIDER` | `baileys` |
| `WHATSAPP_BOT_URL` | `https://YOUR-BOT.up.railway.app` |
| `WHATSAPP_BOT_SECRET` | **same secret as the bot** |

Redeploy the website after setting env.

---

## 4. Smoke test production

```bash
# Bot linked?
curl https://YOUR-BOT.up.railway.app/health
# → {"ok":true,"ready":true,...}

# Manual send (replace secret)
curl -X POST https://YOUR-BOT.up.railway.app/send \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"phone":"213540580738","text":"Production bot test"}'
```

Then submit a real booking on `https://your-site/reserve`.

---

## 5. Checklist

- [ ] Bot deployed and **always on**  
- [ ] Persistent volume for `/data` (auth session)  
- [ ] QR scanned → `ready: true`  
- [ ] `WHATSAPP_BOT_SECRET` set on **bot + Vercel**  
- [ ] `WHATSAPP_BOT_URL` is public **https** URL of the bot  
- [ ] Owner phone `213540580738` receives test message  
- [ ] Guest phone receives confirmation  

---

## Security notes

- Never commit `.env.local` or `apps/whatsapp-bot/auth/`  
- `/send` requires `Authorization: Bearer <secret>` when secret is set  
- `/health` is public (no PII)  
- Prefer a dedicated WhatsApp number for the linked device in production  

---

## Why not only Vercel?

Baileys keeps a **live WhatsApp Web socket**. Vercel functions sleep and have no persistent disk. The bot must run on a small always-on service; the Next.js site only **calls** it over HTTPS.
