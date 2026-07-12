---
name: extract-when-repeated
description: >
  Extract React/UI into components only when markup or behavior is repeated (2+ call sites),
  is a shared design-system primitive, or is a non-trivial interactive unit. Prefer inlining
  one-off static JSX. Use when refactoring structure, cleaning dead wrappers, reviewing
  over-extraction, or the user says "don't extract unless repeated", "scan for components",
  or /extract-when-repeated.
---

# Extract when repeated

## Rule of thumb

```
repeated (2+) or design-system or non-trivial interactive  →  component
one-off static / tiny local markup                        →  leave inline
unused / thin re-export / placeholder                     →  delete
```

## When to extract

1. **Repeated** — same structure or props-driven block in 2+ places (e.g. `PageHeader` on `/menu` + `/reserve`, `ScrollLineRegion` on home + menu).
2. **Design system** — site-wide primitives: `Button`, `Link`, `Container`, `Section`, `SectionLabel`, `SectionDivider`.
3. **Non-trivial interactive** — own state, effects, Motion, or would push a parent past ~200 lines (modals, marquees, forms, carousels).
4. **Home sections** — one section component per home band is intentional composition; pages stay thin.
5. **Reusable capability** — extract once as a **configurable** primitive (`PageScrollLine` + props), not once per call site.

## Name by capability, not by place

| Good | Bad |
|------|-----|
| `ScrollLineRegion` | `HomeBelowHero` + `MenuPageShell` (same wrapper, two names) |
| `PageHeader` | `MenuPageHeader` only used on one page forever |
| Props: `color`, `path`, `as`, `className` | Hardcoded “for the menu page” with no props |

- Domain folders (`menu/`, `gallery/`) = domain UI (cards, catalogs).
- Shared chrome / motion = `ui/` or `effects/` with **what-it-is** names.
- Pages compose shared primitives; **do not** add a thin feature-folder shell that only re-exports a shared component.

## When NOT to extract

1. Static JSX used in a single parent (inline stars, a one-line label, a local SVG).
2. A second name for an existing module (`use-menu-marquee` re-exporting `useMarquee`).
3. Dead files nothing imports (old placeholders, replaced QR SVG, etc.).
4. “Maybe we’ll reuse it” — extract on the second real use.
5. Place-named wrappers that only wrap a shared primitive once (`HomeX` / `MenuY` shells).

## Workflow (scan + clean)

1. List `components/**` and count import call sites (grep).
2. **Delete** unused exports/files.
3. **Inline** single-use static helpers into their parent.
4. **Keep** multi-use and design-system pieces; **extract** only newly duplicated blocks.
5. Run `pnpm website:lint` + `pnpm typecheck`.
6. Update structure notes if domains changed.

## Maydis examples

| Keep / extract | Why |
|----------------|-----|
| `PageHeader` | Shared interior page chrome (props, not Menu/Reserve-specific files) |
| `PageScrollLine` + `ScrollLineRegion` | Shared scroll line; pages compose it |
| `SectionLabel` / `SectionDivider` | Many sections |
| `MenuCard` | Domain catalog card |
| `ReserveForm` | Domain form module |

| Inline / delete | Why |
|-----------------|-----|
| One-off star row only in reviews | Single parent, static |
| `HomeBelowHero` / `MenuPageShell` | Place-tied wrappers of the same primitive |
| Unused `qr-code-svg` after real QR | Dead |
| Deprecated `use-menu-marquee` alias | Thin re-export |

## Anti-patterns

- New file for every paragraph of static marketing copy
- Duplicate primitives (`Eyebrow` + `SectionLabel` doing the same thing)
- Keeping shims “for stability” with zero remaining importers
- Extracting first, then only ever importing once
- Naming shared UI after the first page that used it (`MenuScrollVine` for a generic line)
- One shell component per feature folder that only adds `className` around a shared effect

## Related

- Project rule: `.grok/rules/structure.md` → “Extract only when repeated”
- Skill: `component-structure` for domain folders and thin pages
