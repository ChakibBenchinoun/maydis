---
name: forms-tanstack
description: Build or refactor forms with TanStack Form + Zod, multi-step wizards, and Maydi validation UX
---

# Forms — TanStack Form + Zod (Maydis)

## When to use

- New public or admin form
- Multi-step wizards (e.g. `/reserve`)
- Aligning validation client + server

## Rules

1. Add/extend Zod schema in `lib/<domain>/schema.ts` (or feature lib).
2. Use `@tanstack/react-form` for values and submit — not ad-hoc `useState` bags for full CRUDs.
3. API route: `schema.safeParse(body)` before DB/WhatsApp/side effects.
4. Error UX: show after Continue/submit only; clear when value becomes valid; clamp hard limits on input.
5. Multi-step: step list + `validateReserveStep`-style helpers; progress component separate; scroll card top on step change.
6. Prefer existing `components/ui` + Maydi tokens; add shadcn only when a primitive clearly fits.
7. Keep pages thin; form lives under `components/<domain>/`.

## Reference

- Public reserve: `components/reserve/reserve-form.tsx`, `lib/reservations/*`
- Always-on: `.grok/rules/forms.md`
- Stack notes: root `AGENTS.md`

## Checklist

- [ ] Shared Zod schema used on client and server
- [ ] No instant errors on first keystroke
- [ ] Buttons for multi-step are `type="button"` except intentional submit handling
- [ ] Reduced-motion considered for confetti/progress animation
