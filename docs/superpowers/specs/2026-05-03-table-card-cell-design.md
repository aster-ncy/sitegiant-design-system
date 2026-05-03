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
    });
```

The discriminated union prevents `<TableCardCell tier="top" row="first">` (TS error) and ensures `tier="bottom"` always specifies `row`.

## Visual rendering rules

### Top Tier (Figma 3453:7497)

| Property | Value | Source |
|---|---|---|
| Default fill | `--table-body-hover-fill` (#fafafb) — always-on hover-fill in Figma | 3453:7574 |
| Hover fill | `--table-body-fill` (#ffffff) — flips to white on hover | symbol naming |
| Padding | `pl-12 pr-6 py-12` | 3453:7574 |
| Outer flex | `gap-12 items-start` | 3453:7571 |
| Inner content gap | `gap-8` between value + icon | 3453:7574 |
| Border (first column) | `top + bottom + left` | 3453:7574 |
| Border (center column) | `top + bottom + left` | Codex-recommended border-coordination |
| Border (last column) | `top + bottom + left + right` | 3453:7574 + closes right edge |
| Corner radius | `rounded-tl-4` if column='first'; `rounded-tr-4` if column='last' | 3453:7574 |
| Border colour | `--table-divider-border` (#e5e5e5) | 3453:7574 |

### Bottom Tier (Figma 3453:7727)

| Property | Value | Source |
|---|---|---|
| Default fill | `--table-body-fill` (#ffffff) | 3453:7822 |
| Hover fill | `--table-body-hover-fill` (#fafafb) | inferred |
| Padding | `pl-12 pr-6 py-12` (Default rows ~45px); Form Field rows tighter — caller adjusts via `className` if needed | 3453:7822 |
| Outer flex | `flex-col items-start justify-center gap-4` | 3453:7822 |
| Border (first column) | `left` always; `bottom` only on row='last' | 3453:7822 |
| Border (center column) | `left` always; `bottom` only on row='last` | 3453:7822 |
| Border (last column) | `left + right`; `bottom` only on row='last' | 3453:7822 |
| Corner radius | `rounded-bl-4` if column='first' && row='last'; `rounded-br-4` if column='last' && row='last' | inferred from card outer-shape |
| Border colour | `--table-divider-border` (#e5e5e5) | 3453:7822 |

### Border coordination contract

Each cell paints **only its own edges** — never a neighbour's. To avoid double-paint on internal verticals, **every cell paints `border-l`**. `column='last'` adds `border-r` to close the right edge. Top tier additionally paints `border-t + border-b` (full perimeter). Bottom tier paints `border-b` only when `row='last'` (so internal rows form a continuous strip with the row above).

Codex flagged this border bug during the API review; coordinating via `column` + `row` props is the documented fix.

### Hover behavior

Same pattern as default-mode TableCell:
- Whole-row hover: `<tr className="group/row hover:[&>td>div]:bg-...">`. The hover-fill direction is tier-specific (Top: hover-fill→white; Bottom: white→hover-fill).
- The cell exposes a controlled `hovered` prop for Storybook / forced-state stories.

`tone` and `boldOnRowHover` are **NOT** ported to TableCardCell. The card-tier pattern is form-heavy; per-cell semantic colour is rare here. If needed later, add as a prop addendum.

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
- `Type=Form Field` → `<TableCardCell><NumberInput /></TableCardCell>`
- `Type=Action Button` → `<TableCardCell trailing={<Button />}>...`
- `Type=Status Toggle` → `<TableCardCell trailing={<Toggle />}>...`

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
