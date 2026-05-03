# TableCardCell — design spec

**Date:** 2026-05-03
**Status:** Approved (Aster, Codex)
**Companion code path:** `src/components/TableCardCell/`

## Context

Live ERP screens like `references/inset_table_s10.png` (Shocking Sale variant editor) use a card-style table where each product is rendered as an individually bordered card: one "Top Tier" header row (image + name + trash) followed by N "Bottom Tier" content rows (form fields, toggles). The cards are visually distinct rectangles with rounded corners, not continuous striped rows.

Figma authored two sections for this pattern:
- **Inset Table Row - Card - Top Tier** (`3453:7497`) — 6 Type variants
- **Inset Table Row - Card - Bottom Tier** (`3453:7727`) — 4 Type variants + 3 Row Sortings

These are visually different from regular `<TableCell inset>` rows — different fill defaults, different border strategy (per-cell perimeter for Top, continuous strip for Bottom), different corner radii. The existing TableCell can't express this without overloading its `inset` boolean into a 3-mode enum, which would clutter the API for a different visual paradigm.

This spec ships a new component `TableCardCell` parallel to `TableCell`, plus one reference story (`S10ShockingSale`) reproducing the live ERP screen.

## Architecture

### One component, cell-level abstraction

`TableCardCell` operates at the cell level (one component per `<td>`), parallel to the existing `TableCell`. Consumers own `<tr>` and `<td>` markup and compose cells inline. This matches:

- The existing TableCell's mental model (cell-level, caller owns row markup).
- The "compose primitives, don't mirror Figma's variant matrix" rule (`feedback_no_figma_variant_mirror.md`). Figma's `Type` axis (App Icon / User Icon / Status / Form Field / etc.) maps to the existing slot pattern (`leadingIcon`, `trailing`, `children`), not a fat `Type` prop.

Codex confirmed this choice over row-level alternatives. Row-level wrappers (`TableCardRow` etc.) enforce row shape too early; Bottom Tier cells host arbitrary form controls and toggles, which is inherently per-cell content.

### File layout

```
src/components/TableCardCell/
├── TableCardCell.tsx          # Component
├── TableCardCell.stories.tsx  # All variants + tier × column × row matrix
└── index.ts                   # Named exports
```

Plus barrel update in `src/components/index.ts`.

Reference story `S10ShockingSale` added to existing `src/stories/Table/InsetTableScreens.stories.tsx` (consistent with s1–s9 inset reference family).

## API

```ts
import type { ReactNode } from 'react';
import type { TableColumnPosition } from '../TableHeaderCell';

export type TableCardCellRow = 'first' | 'middle' | 'last';

interface TableCardCellBase {
  /** Cell content. */
  children?: ReactNode;
  /** Column position — drives border + corner-radius placement. */
  column: TableColumnPosition;
  /** Optional checkbox slot (row-select). */
  checkbox?: ReactNode;
  /** Optional leading icon/image slot (App Icon, User Icon, Product Image). */
  leadingIcon?: ReactNode;
  /** Optional trailing slot (Ellipsis Button, Action Button, Status Toggle). */
  trailing?: ReactNode;
  /** Visual hover state — for controlled / Storybook use. Row-hover wired
   *  via `<tr className="group/row">` + Tailwind. */
  hovered?: boolean;
  /** Selected state — pale-blue fill highlight. */
  selected?: boolean;
  /** Extra classes on the root cell. */
  className?: string;
}

export type TableCardCellProps =
  | (TableCardCellBase & {
      /** Top tier — header band of a card. Rounded top corners; full
       *  perimeter borders; hover-fill default per Figma 3453:7497. */
      tier: 'top';
      /** No `row` axis when tier='top' (only one Top Tier per card). */
      row?: never;
    })
  | (TableCardCellBase & {
      /** Bottom tier — content rows under the Top Tier header. White fill;
       *  borders coordinate to form a continuous card outline per Figma
       *  3453:7727. */
      tier: 'bottom';
      /** Bottom-row position within the card. 'first' = directly under top
       *  tier; 'middle' = inner row (no rounded corners); 'last' = bottom
       *  of card (rounded bottom corners). */
      row: TableCardCellRow;
      /** Set to `true` when the cell hosts a form control (NumberInput,
       *  Toggle, Button etc.). Switches the inner flex from items-start to
       *  items-center per Figma 3453:7841 (Type=Form Field). Default
       *  text-cell behaviour is items-start. */
      formField?: boolean;
    });
```

The discriminated union prevents `<TableCardCell tier="top" row="first">` (TS error) and ensures `tier="bottom"` always specifies `row`.

## Visual rendering rules

### Top Tier (Figma 3453:7497)

| Property | Default state | Hover state | Source |
|---|---|---|---|
| Fill | `--table-body-hover-fill` (#fafafb) | UNCHANGED — same fafafb | 3453:7574 (Default), 3453:7592 (Hover) |
| Text colour | `--table-body-text` (#0c2028) | `--table-body-hover-text` (#5acc5a) — green | 3453:7575, 3453:7593 |
| Text weight | regular | bold | 3453:7575, 3453:7593 |
| Padding | `pl-12 pr-6 py-12` | same | 3453:7574 |
| Outer flex | `gap-12 items-start` | same | 3453:7571 |
| Inner content gap | `gap-8` between value + icon | same | 3453:7574 |
| Border (first column) | `top + bottom + left` | same | 3453:7574 |
| Border (center column) | `top + bottom + left` | same | Codex-recommended border-coordination |
| Border (last column) | `top + bottom + left + right` | same | 3453:7574 + closes right edge |
| Corner radius | `rounded-tl-4` if column='first'; `rounded-tr-4` if column='last' | same | 3453:7574 |
| Border colour | `--table-divider-border` (#e5e5e5) | same | 3453:7574 |

**Hover takeaway for Top Tier:** the fill does NOT change. Hover applies bold + green text (`--table-body-hover-text` = #5acc5a). This is built-in on `tier='top'` (see Hover behavior section below) — consumers don't need to wire `boldOnRowHover` or any opt-out flag. The "active row" affordance from default-mode tables (whole row fills) is NOT how Top Tier works — Top Tier is always grey-fill, only its text changes on hover.

### Bottom Tier (Figma 3453:7727)

| Property | Default state | Hover state | Source |
|---|---|---|---|
| Fill | `--table-body-fill` (#ffffff) | `--table-body-hover-fill` (#fafafb) | 3453:7822 (Default), 3453:8104 (Hover) |
| Text colour | `--table-body-text` (#0c2028) | same | 3453:8108 |
| Text weight | regular | same | 3453:8106 |
| Padding (Type=Default) | `pt-12 pr-6 pb-6 pl-12` | same | 3453:7822 |
| Padding (Type=Form Field) | `pt-12 pr-6 pb-6 pl-12` (cell padding identical; the inner form control sets its own height) | same | 3453:7841 |
| Outer flex (Type=Default) | `flex-col items-start justify-center gap-4` | same | 3453:7822 |
| Outer flex (Type=Form Field) | `flex-col items-center justify-center gap-4` | same | 3453:7841 — note `items-center` for centred form controls |
| Border (first column) | `left` always; `bottom` only on row='last' | same | 3453:7822 |
| Border (center column) | `left` always; `bottom` only on row='last' | same | 3453:7822 |
| Border (last column) | `left + right`; `bottom` only on row='last' | same | 3453:7822 |
| Corner radius | `rounded-bl-4` if column='first' && row='last'; `rounded-br-4` if column='last' && row='last' | same | inferred from card outer-shape |
| Border colour | `--table-divider-border` (#e5e5e5) | same | 3453:7822 |

**Form Field row height takeaway:** the cell's own padding (`pt-12 pb-6`) does NOT change between Type=Default and Type=Form Field. The variant heights observed in Figma (~51 / 45 / 87 px first/middle/last as Codex flagged) are driven by the inner form control's intrinsic height (NumberInput is taller than a plain text node, last-row Form Field cells absorb a bit more bottom padding). Callers don't need to adjust `className` for this; passing a `<NumberInput>` / `<Toggle>` / `<Button>` as `children` produces the right cell height automatically.

**Note:** The outer flex's alignment differs by Type. The cell exposes a `formField` boolean prop (only valid on `tier='bottom'`); when `true`, the inner flex uses `items-center` per Figma 3453:7841 to centre form controls. Default behaviour (`formField` omitted/false) is `items-start` for text cells.

### Border coordination contract

Each cell paints **only its own edges** — never a neighbour's. To avoid double-paint on internal verticals, **every cell paints `border-l`**. `column='last'` adds `border-r` to close the right edge. Top tier additionally paints `border-t + border-b` (full perimeter). Bottom tier paints `border-b` only when `row='last'` (so internal rows form a continuous strip with the row above).

Codex flagged this border bug during the API review; coordinating via `column` + `row` props is the documented fix.

### Hover behavior

The two tiers behave differently on hover (verified against Figma):

- **Top Tier** — fill is constant (`--table-body-hover-fill` #fafafb in BOTH default and hover); hover changes the cell text to **bold + green** (`--table-body-hover-text` #5acc5a). Build this in unconditionally on `tier='top'`: every Top Tier symbol in Figma has the same hover effect; there's no opt-out variant. Wire via `<tr className="group/row">` + Tailwind `group-hover/row:font-bold group-hover/row:text-[color:var(--table-body-hover-text)]` on the cell's text span.
- **Bottom Tier** — fill flips white → grey (`--table-body-fill` → `--table-body-hover-fill`); text colour and weight unchanged. Wire via `<tr className="group/row hover:[&>td>div]:bg-[var(--table-body-hover-fill)]">`.

The cell additionally exposes a controlled `hovered` prop for Storybook / forced-state stories.

`tone` and `boldOnRowHover` props are **NOT** ported to TableCardCell. Top Tier's hover-bold-green is built in unconditionally on `tier='top'` — no opt-out flag, since Figma authors no opt-out variant. If a card-tier consumer ever needs per-value semantic tone, add `tone` as a prop addendum at that point.

## Slot composition (Figma Type axis → composition)

Each Figma `Type` variant maps to slot usage on `TableCardCell`:

**Top Tier:**
- `Type=Default` → `<TableCardCell tier="top" column="...">{value}</TableCardCell>`
- `Type=App Icon` → `<TableCardCell leadingIcon={<img src={shopeeMy} />}>...`
- `Type=User Icon` → `<TableCardCell leadingIcon={<Avatar />}>...`
- `Type=Status` → `<TableCardCell><Pip ... /></TableCardCell>`
- `Type=Product Image` → `<TableCardCell leadingIcon={<ProductImage size="lg" />}>...`
- `Type=Ellipsis Button` → `<TableCardCell trailing={<EllipsisButton />}>...`

**Bottom Tier:**
- `Type=Default` → `<TableCardCell tier="bottom" row="...">{value}</TableCardCell>`
- `Type=Form Field` → `<TableCardCell tier="bottom" row="..." formField><NumberInput /></TableCardCell>` (the `formField` flag flips inner alignment to `items-center`)
- `Type=Action Button` → `<TableCardCell tier="bottom" row="..." formField trailing={<Button />}>` (Button counts as a form control)
- `Type=Status Toggle` → `<TableCardCell tier="bottom" row="..." formField trailing={<Toggle />}>` (Toggle is centred per the same rule)

The `Info:` leading-label pattern (Figma `showInfo` toggle) is consumer-side composition: caller passes `<><span className="text-[color:var(--color-text-info)]">Info:</span> {value}</>` as children. No prop needed.

## Stories

### Per-component story file

`TableCardCell.stories.tsx`:

- Top Tier: 3 columns × {Default, Hover} = 6 cells in one row
- Top Tier with `leadingIcon` (App Icon, User Icon, Product Image)
- Top Tier with `trailing={<EllipsisButton />}`
- Top Tier with `<Pip>` as children
- Bottom Tier: 3 columns × 3 rows × {Default, Hover} matrix (proves continuous strip)
- Bottom Tier with `<NumberInput>` as children
- Bottom Tier with `<Toggle>` as children
- Bottom Tier with `<Button>` as children

### Reference story (S10 Shocking Sale)

Added to existing `InsetTableScreens.stories.tsx`:

`S10ShockingSale` reproduces `references/inset_table_s10.png`:
- 2 product cards stacked with vertical gap.
- Each card = 1 Top Tier row (image + product name + trash IconButton) + N Bottom Tier rows.
- Each Bottom Tier row = variant label + RM input + %off input + Campaign Stock + Stock + Purchase Limit + Status Toggle.
- Bulk-settings strip above the cards is plain JSX (NumberInput / SegmentedButton / Button cluster) — not a primitive.
- Outer card rectangle (rounded-4 + outer border) is a wrapping `<div>` per card group; the cell border-coordination handles the inner edges.

## Out of scope

- **`tone` / `boldOnRowHover` props.** Defer until a card-tier consumer needs them.
- **Inline form-validation states.** Bottom Tier form-field cells inherit error states from the contained `<NumberInput>` etc.
- **Card outer container component.** Wrapping `<div>` is a one-line story-side composition; not enough complexity to warrant a primitive.

  Documented recipe for the outer container (consumers must apply this themselves until/unless we ship a `TableCardContainer` primitive):

  ```tsx
  <div className="rounded-[var(--radius-4)] overflow-hidden">
    <table className="border-collapse w-full table-fixed">
      <tbody>
        <tr>{/* Top Tier cells */}</tr>
        <tr>{/* Bottom Tier row='first' cells */}</tr>
        <tr>{/* Bottom Tier row='middle' cells */}</tr>
        <tr>{/* Bottom Tier row='last' cells */}</tr>
      </tbody>
    </table>
  </div>
  ```

  The cells own their own borders (perimeter painted via column + row props). The wrapper just clips the outer corners so the card's rounded shape closes cleanly. No additional outer border on the wrapper — the cells' own borders close the box.
- **Animation between Top and Bottom tier rows on expand/collapse.** Out of scope — caller handles open/close state.

## Verification

End-to-end check via Storybook (`npm run storybook`):

1. Visit `Tables/TableCardCell` per-component stories.
2. Confirm Top Tier first/center/last columns paint correct corners + borders.
3. Confirm Bottom Tier 3-row stack forms a continuous bordered card; hover-fill direction matches Figma.
4. Visit `Tables/Reference Screens/S 10 Shocking Sale` and visually compare against `references/inset_table_s10.png`.
5. Run `npm run lint && npx tsc --noEmit`.
6. Codex adversarial review before commit (focus areas: border coordination, discriminated union enforcement, no regressions in s1–s9).

## Migration / regression risk

- **No existing consumer affected.** TableCardCell is new; s1–s9 stories continue using `<TableCell inset>`.
- **No barrel-export breakage.** Net-new exports only.
