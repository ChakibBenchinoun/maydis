# Forms & multi-step UX (always on)

When building or editing forms in `apps/website`:

## Stack

1. **TanStack Form** (`@tanstack/react-form`) for client form state — all public and admin CRUDs going forward.
2. **Zod** schemas in `lib/**/schema.ts` (or feature `lib/…`) as the single source of truth.
3. Server routes re-validate with the **same** schema (`safeParse`) before side effects.
4. Prefer **shadcn/ui** for primitives when they fit (dialog, select, etc.); keep Maydi theme tokens. Project MCP: `.cursor/mcp.json` (`npx shadcn@latest mcp`).
5. **TanStack Query** for admin list/filter/mutate caching — adopt when touching admin data fetches (not required for one-shot public POST).

## Validation UX (simple, low complexity)

1. **Do not** show field errors on first keystroke.
2. Show errors only after **Continue / submit** (or explicit validate).
3. Once an error is shown, **clear it when the value becomes valid** while typing.
4. Hard limits (e.g. phone max 10 digits) via input clamp — no error spam for “too long”.
5. Prefer shared helpers: step validators + `fieldErrorAfterChange` patterns in reservation schemas.

## Multi-step forms

1. Keep step definitions + Zod partials in schema modules (`RESERVE_STEPS`, `validateReserveStep`).
2. Progress UI: portable component in the feature folder; animate with CSS; respect `prefers-reduced-motion`.
3. Intro steps can hide progress until “Start”.
4. Soft floor height on step body when short (`min-h` ok); do not force a rigid full-viewport card.
5. On step change (Back / Continue / Start / success / validation errors): scroll to the **absolute top of the page** (`y = 0`) via `useScrollAnchor` + `scrollToPageTop` (`components/effects/scroll-anchor.tsx`, `lib/scroll.ts`). Do **not** use nav-offset `scrollToElement` / `scrollIntoView` for step transitions.
6. Never morph a Continue `type="button"` into `type="submit"` mid-click — both actions stay `type="button"` with explicit handlers.

## Control surfaces (reserve)

1. Shared white control look: `controlSurfaceClass` / `fieldClass` in `components/reserve/reserve-field-styles.ts` (pure white, soft border/shadow; **16px** inputs to avoid iOS zoom).
2. Calendar, time slots, guest stepper, progress track, and review summary use that surface — keep them consistent.
3. Confirm/review step: put the field list **inside** a `controlSurfaceClass` card (`rounded-xl`), not plain dividers on cream.

## Success / confirmation views

1. Hide the page “Events / Reserve…” header while success is showing (`ReservePageContent` + `onSuccessChange`).
2. Center the success report in the viewport; on mobile use a **fixed full-viewport panel** + **body/html overflow lock** so browser chrome / `min-h-screen` does not add a second scroll band.
3. Keep success spacing compact on small screens; slightly roomier from `sm:`.
4. Guest-facing success copy only — never surface Baileys/setup URLs or raw WhatsApp provider errors in the UI (dev: `console` only).

## Reserve domain

- UI: `components/reserve/*` (form, step components, stepper, calendar, time slots, success).
- Schema/options: `lib/reservations/schema.ts`, `options.ts`, `service.ts`.
- Public page: thin `app/(public)/reserve/page.tsx` → `ReservePageContent` (no heavy shell card; open cream).
- Footer hidden on `/reserve` (and `/menu`) via `PublicShell`.
- WhatsApp notify: `lib/whatsapp/messages.ts` + `send.ts` after save — warm guest/owner copy; owner deep-link = production admin list only (see `admin.md` / WhatsApp notes).
