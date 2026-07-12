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

1. **Repeated** — same structure or props-driven block in 2+ places (e.g. `PageHeader` on `/menu` + `/reserve`, `SocialIcon` in visit + footer).
2. **Design system** — site-wide primitives: `Button`, `Link`, `Container`, `Section`, `SectionLabel`, `SectionDivider`.
3. **Non-trivial interactive** — own state, effects, Motion, or would push a parent past ~200 lines (modals, marquees, forms, carousels). Still prefer domain folders, not a new file for every 15-line static block.
4. **Home sections** — one section component per home band is intentional composition (not “extract static once”); pages stay thin.

## When NOT to extract

1. Static JSX used in a single parent (inline stars, a one-line label, a local SVG).
2. A second name for an existing module (`use-menu-marquee` re-exporting `useMarquee`).
3. Dead files nothing imports (old placeholders, replaced QR SVG, etc.).
4. “Maybe we’ll reuse it” — extract on the second real use.

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
| `PageHeader` | Used by menu + reserve |
| `SectionLabel` / `SectionDivider` | Many sections |
| `MenuCard` | Scroll row (+ pattern shared with menu UI) |
| `ReserveForm` | Interactive form module |

| Inline / delete | Why |
|-----------------|-----|
| One-off star row only in reviews | Single parent, static |
| Unused `qr-code-svg` after real QR | Dead |
| Deprecated `use-menu-marquee` alias | Thin re-export |

## Anti-patterns

- New file for every paragraph of static marketing copy
- Duplicate primitives (`Eyebrow` + `SectionLabel` doing the same thing)
- Keeping shims “for stability” with zero remaining importers
- Extracting first, then only ever importing once

## Related

- Project rule: `.grok/rules/structure.md` → “Extract only when repeated”
- Skill: `component-structure` for domain folders and thin pages
