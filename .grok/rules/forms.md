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
4. Stable card height when steps change content (`min-h` on step body).
5. On step change (Back / Continue / Start): scroll the **card top** into view (`scroll-mt-*` for sticky nav).
6. Never morph a Continue `type="button"` into `type="submit"` mid-click — both actions stay `type="button"` with explicit handlers.

## Reserve domain

- UI: `components/reserve/*` (form, stepper, calendar, time slots, success).
- Schema/options: `lib/reservations/schema.ts`, `options.ts`, `service.ts`.
- Public page: thin `app/(public)/reserve/page.tsx` — `PageHeader` + form card.
- Event name can be stored in `notes` as `Event: …` until a dedicated column exists (no silent schema rewrites).
