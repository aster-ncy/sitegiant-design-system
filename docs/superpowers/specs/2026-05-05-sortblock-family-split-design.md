# SortBlock Family Split — Design Doc

Date: 2026-05-05
Status: Drafted, pending Aster review

## Problem

The current `SortBlock` component (`src/components/SortBlock/SortBlock.tsx`) collapses what Figma models as **7 distinct components** into one fat component:

- `Sort Block - Default` (text rows, horizontal/vertical, 1info/2info)
- `Sort Block - MainSub` (14/17 main + 12/17 sub stack, gap-4)
- `Sort Block - Long Content` (multi-line value, 2pa/3pa)
- `Sort Block - Icon` (drag/close/chevron icon button)
- `Sort Block - Tag` (Pip inside)
- `Sort Block - Button` (TextLink or DashedButton inside)
- `Sort Block - Image` (image tile, dark/light)

This shipped 2026-05-04 with three additive features (`row.wrap`, `mainSub`, skip-empty-label) so that the s7 Add Trip composition could be expressed via the rows API. The features work, but they exposed a **load-bearing footgun**: the component's `className` prop **replaces** the entire root class string. As a result:

- `mainSub`'s gap-4 silently becomes a no-op when the consumer passes any `className`.
- Consumers that need only `self-stretch` + `w-[N]` on the root (every cell in the inset-header composition) must re-specify fill, padding, gap, layout from scratch. The s7 cells and `InsetHeaderWithSortBlockRows` story currently do this manually.
- Future variant flags will hit the same trap.

The footgun was documented in JSDoc rather than fixed because it wasn't clear at the time how to fix without breaking the few existing call sites.

Pulling Figma's library directly (file `oJHxwesmlNeeVHrITxDdZ3`, sections 2411:39 / 2411:40 / 2411:41 / 2411:42 / 2918:10689 / 3127:10385 / 3715:3682) revealed that **the source of truth already models these as separate components**, not variants. The padding split is not cosmetic: text-content components use `px-6 py-12`; embedded-atom components (Icon, Tag, Button, Image) use `pl-12 pr-16` with variable `py` to fit a 17px atom snugly.

## Decision

Split `SortBlock` into a **family of 7 named exports** in the same module folder, mirroring Figma 1:1. Flip `className` semantics from **replace** to **append** across the entire family. Drop the `mainSub` and `wrap` flags from the existing `SortBlock` (now `SortBlockDefault`); their behaviour moves to dedicated `SortBlockMainSub` and `SortBlockLongContent` components.

This was chosen over the lighter alternative ("keep one component, fix className via a `appendClassName` prop or `unstyled` escape hatch") because:
- Figma genuinely models 7 components, so consumers pattern-match the import name to the Figma node (`SortBlockTag` → `Sort Block - Tag`).
- Each split component has its padding baked in, eliminating the all-or-nothing `className` problem **by construction** rather than papering over it.
- Future variants (Image, Button, anything Figma adds) ship as their own files without bloating one mega-component.
- Codex agreed with this direction in the second-opinion round.

## Component family

All components live under `src/components/SortBlock/`. All share `--sorting-block-sorting-fill` background, the `--general-font-family` family, and append-style `className`. All accept a `state?: 'Readonly' | 'Readonly Bold'` prop where Figma exposes that axis (Default, LongContent, MainSub, Icon, Tag) — `state` controls the default weight for every value in the component.

**Note on `state`:** Figma's library exposes Default/Hover/Filled/Disabled/Readonly/Readonly Bold across most components, but per the 2026-05-03 build scope only the readonly subset ships. `state` is typed as the readonly subset to leave the door open for adding interactive states later without breaking callers, but the implementation only handles `Readonly` and `Readonly Bold`.

| Component | Padding | Body |
|---|---|---|
| `SortBlockDefault` | `px-6 py-12` (gap-8 horizontal) | `rows: SortBlockRow[]` (1 or 2 rows) |
| `SortBlockMainSub` | `px-6 py-12` (flex-col gap-4) | `rows: [SortBlockRow, SortBlockRow]` — row[0] body, row[1] caption |
| `SortBlockLongContent` | `px-6 py-12` (gap-8 horizontal) | `rows[]` with `wrap` baked in |
| `SortBlockIcon` | `pl-12 pr-16 py-12` | `children` (an Icon, IconLink, or button) |
| `SortBlockTag` | `pl-12 pr-16 py-12` | `children` (a Pip or Tag) |
| `SortBlockButton` | `pl-12 pr-16` + `py-12` (textlink) or `py-4` (dashed) | `children` (a TextLink or DashedButton); a `kind: 'textlink' \| 'dashed'` prop selects vertical padding |
| `SortBlockImage` | (image only — no padding around the tile) | `children` (image element) |

### Shared row shape

```ts
export interface SortBlockRow {
  /** Caption above the value. Empty string or omitted = no label for this
   *  row. **Mixed-label alignment:** for horizontal multi-row text layouts,
   *  if at least one row has a non-empty label, empty-label rows render an
   *  invisible placeholder so value rows stay column-aligned; if all labels
   *  are empty, omit the label column entirely. */
  label?: string;
  value: string;
  /** Per-row weight override. When set, wins over the component's `state`
   *  prop for this row only (including explicit `false` to force regular
   *  inside a `state="Readonly Bold"` component). Omit to inherit from
   *  `state` — regular when state is 'Readonly', bold when state is
   *  'Readonly Bold'. */
  bold?: boolean;
}
```

Three deliberate changes vs. today's `SortBlockRow`:
- `wrap` removed — moved to `SortBlockLongContent` where it's always on.
- `caption` removed — only used internally by the old `mainSub` path; no external consumer.
- `mainSub` flag removed from props — `SortBlockMainSub` is now its own component with the gap-4 layout baked in.

`SortBlockDefault` accepts `rows.length === 1 | 2` and an `orientation: 'horizontal' | 'vertical'` prop. `SortBlockLongContent` accepts 1 or 2 rows; values render with `whitespace-pre-line` so explicit `\n` breaks and natural CSS wrap both work.

**`SortBlockMainSub` row mapping:** accepts exactly 2 rows (typed as a TypeScript tuple `[SortBlockRow, SortBlockRow]`, not a runtime guard — the compile error is the contract). Renders `rows[0]` at body size (14/17) — the "main" line — and `rows[1]` at caption size (12/17) — the "sub" line. Row position determines size; there is no per-row size flag. Always vertical, gap-4.

### Shared module

`src/components/SortBlock/shared.ts` exports:
- `FILL_CLASS` — the `bg-[var(--sorting-block-sorting-fill)]` base.
- `LABEL_CLASSES` — caption typography for label spans.
- `valueClass(row, { wrap, defaultBold })` — body typography variant logic. Resolves the row's effective weight from `row.bold` (per-row override) falling back to `defaultBold` (derived from the component's `state` prop).
- `hasLabel(row)` — empty-label predicate.

These are shared across the four text-content components (Default, MainSub, LongContent — and any future variant). The atom-cell components (Icon, Tag, Button, Image) only need `FILL_CLASS` plus their padding.

### `className` semantics across the family

All components: `className` **appends** to the built-in classes. Internally each component composes its class string as:

```ts
const cls = `${BUILT_IN} ${className ?? ''}`.trim();
```

Tailwind's last-wins resolution means consumer overrides win for atomic conflicts (e.g. consumer `bg-red-500` beats built-in fill). For non-atomic overrides (e.g. swapping padding from `px-6` to `px-12`), consumers use the `!` prefix per the existing project convention (see `feedback_tailwind_class_order` memory).

There is **no** escape hatch for full root replacement. The only realistic case for that — different padding per cell role — is solved by picking the right family member.

## Files

```
src/components/SortBlock/
├── shared.ts                       (new)
├── SortBlockDefault.tsx            (renamed from SortBlock.tsx, trimmed)
├── SortBlockDefault.stories.tsx    (renamed from SortBlock.stories.tsx, trimmed)
├── SortBlockMainSub.tsx            (new)
├── SortBlockMainSub.stories.tsx    (new)
├── SortBlockLongContent.tsx        (new)
├── SortBlockLongContent.stories.tsx (new)
├── SortBlockIcon.tsx               (new)
├── SortBlockIcon.stories.tsx       (new)
├── SortBlockTag.tsx                (new)
├── SortBlockTag.stories.tsx        (new)
├── SortBlockButton.tsx             (new)
├── SortBlockButton.stories.tsx     (new)
├── SortBlockImage.tsx              (new)
├── SortBlockImage.stories.tsx      (new)
└── index.ts                        (re-export all)
```

`SortBlock` (the old name) is **dropped** — not aliased. Hard cut. The current call sites (s7 cells, `InsetHeaderWithSortBlockRows` story, `SortableRowComposition` story) are all inside this repo and updated in the same change.

`InsetHeaderWithSortBlockRows.stories.tsx` becomes its own composition story (it's not really a SortBlock story — it shows a header strip + body rows pattern). The new home is `src/components/SortBlock/InsetHeaderWithSortBlockRows.stories.tsx` (kept in the SortBlock folder since it documents the canonical composition).

## Call site updates (all in this repo)

1. **s7 Add Trip story** (`src/screens/InsetTableScreens.stories.tsx` or wherever it lives — to be confirmed during implementation). Replace each cell:
   - drag/close cells → `<SortBlockIcon className="self-stretch" />`
   - tracking cell → `<SortBlockDefault className="self-stretch flex-1" rows={[{ value: tracking, bold: true }]} />`
   - delivery cell → `<SortBlockDefault className="self-stretch w-[166px]" rows={[{ value: deliveryDate }]} />`
   - customer cell → `<SortBlockMainSub className="self-stretch w-[130px]" rows={[{ value: name }, { value: phone }]} />`
   - address cell → `<SortBlockLongContent className="w-[203px]" rows={[{ value: addressLines.join('\n') }]} />`
2. **`InsetHeaderWithSortBlockRows` story** — same swap as above.
3. **`SortableRowComposition` story** (sb6 pattern) — uses raw divs with `cellOverride` className today; update to use `SortBlockDefault` / `SortBlockIcon` directly with `className="bg-transparent"` or similar to drop the per-cell grey fill (the parent paints one continuous strip). May need to revisit whether the family makes sense for this composition or if it stays as raw divs.

## What this does NOT change

- The `--sorting-block-sorting-fill` token itself.
- `TableHeaderCell` — left untouched per the prior discussion (Codex tiebreaker on whether to compose SortBlock; conclusion was no).
- The `InsetHeaderWithSortBlockRows` composition pattern — header is still a flex of `TableHeaderCell` (inset), body is still a flex of SortBlock-family cells. Only the body imports change.
- Any non-SortBlock component.

## Risk and rollback

- **Visual regression risk:** the s7 Add Trip composition is the highest-traffic consumer; any padding/gap mismatch would show up immediately in the InsetTableScreens story. Verify visually in Storybook (DevTools MCP if needed) after each component lands.
- **Type-safety risk:** because the old `SortBlock` is dropped, any miss in call-site updates is a TS compile error, not a silent runtime regression. `npm run build` will catch them.
- **Rollback:** the change ships as a stack of small commits (one per new component + one per call site update). If a bug ships, `git revert` the offending commit; the component family is independent so reverting one doesn't cascade.

## Out of scope

- Adding interactive states (Default/Hover/Filled/Disabled with editable inputs) to any family member. The `state` prop's type is forward-compatible but only `Readonly` and `Readonly Bold` are implemented. Documented in JSDoc.
- Migrating `TableHeaderCell` to use SortBlock internals. Decided against in the 2026-05-05 brainstorming round.
- Touching the `--sorting-block-sorting-fill` token or any other design token.

## Notes for implementation

- `SortBlockLongContent`'s wrap behaviour: Figma's `Sort Block - Long Content` component uses `text-ellipsis overflow-hidden` on a fixed-height `<p>`, but real call sites (s7 address cell) pass pre-broken text with `\n` and rely on `whitespace-pre-line`. Implement `whitespace-pre-line` (matches the working s7 behaviour) and document the divergence from the Figma library node in JSDoc — Figma's truncation behaviour is a library-fixture artefact, not the production pattern.
- `SortBlockButton.kind: 'textlink' | 'dashed'` is the chosen API shape — matches Figma's `buttonType?: 'Textlink' | 'Dashed Button'` axis 1:1 and avoids fragile child-type inference.
- s7 Add Trip story location to be confirmed during implementation (likely `src/screens/InsetTableScreens.stories.tsx` based on prior memory; verify with grep).
- **Figma library follow-up:** the `Sort Block - Long Content` library node (file `oJHxwesmlNeeVHrITxDdZ3`) renders with `text-ellipsis overflow-hidden` on a fixed-height `<p>` — a fixture artefact that doesn't match the production wrap-and-honour-`\n` behaviour. File a ticket with the Figma library owner to either correct the node or add a `Long Text - Wrap` variant. Until then, our implementation diverges intentionally; document in `SortBlockLongContent`'s JSDoc.
