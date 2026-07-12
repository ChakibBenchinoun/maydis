# Deploy Maydi's to Vercel

## 1. Push the repo

```bash
cd /Users/chakibbenchinoun/Code/clients/maydis
git status
git push
```

(Create a GitHub repo first if `origin` is missing: GitHub → New repository → `git remote add origin …` → `git push -u origin main`.)

## 2. Import on Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo  
2. **Root Directory:** `apps/website`  
3. Framework: Next.js (auto)  
4. Install / Build: leave defaults (or `pnpm install` / `pnpm build`)  
5. **Environment variables** (Production + Preview):

| Name | Example |
|------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` (update after first deploy if needed) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase API settings (secret) |
| `WHATSAPP_OWNER_PHONE` | `213540580738` |
| `WHATSAPP_PROVIDER` | `baileys` |
| `WHATSAPP_BOT_URL` | `https://your-whatsapp-bot.up.railway.app` (not localhost) |
| `WHATSAPP_BOT_SECRET` | same secret as the bot service |

6. Deploy  

## 3. After first deploy

1. Copy the production URL  
2. Set `NEXT_PUBLIC_SITE_URL` to that URL → Redeploy (QR codes need the real origin)  
3. Smoke test: `/`, `/menu`, `/reserve`  
4. Submit a reservation → check Supabase **Table Editor → reservations**  
5. **WhatsApp:** deploy the free bot first (see **[docs/WHATSAPP.md](WHATSAPP.md)**), then set `WHATSAPP_BOT_URL` + secret and redeploy  

## Notes

- Do **not** set `DATABASE_URL` on Vercel for this app.  
- WhatsApp **cannot** run on Vercel — only the website does. The Baileys bot needs a small always-on host.  
- Monorepo: if import is at repo root instead of `apps/website`, set Root Directory correctly or the build will fail.  
- Package manager: Vercel detects `pnpm-lock.yaml` at monorepo root — with Root Directory `apps/website`, ensure install can reach the lockfile (Vercel usually handles monorepos; if not, set Root to monorepo root and Build Command: `pnpm --filter @maydis/website build`, Output: `apps/website/.next`).
