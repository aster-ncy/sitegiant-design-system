# s7 Add Trip — SortBlock Migration

**Status:** Draft
**Date:** 2026-05-04
**Scope:** `src/stories/Table/InsetTableScreens.stories.tsx` — `S7AddTrip` story only.

## Goal

Replace the placeholder `<table>`-based composition in `S7AddTrip` with the real Figma "Sort Block — MainSub" pattern, now that `SortBlock` has shipped. Remove the `TODO(SortBlock)` block once done.

## Why now

The placeholder was written before SortBlock existed. The SortBlock atom landed in the previous session along with its `SortableRowComposition` story, which is the canonical layout for s7-style draggable list rows. The migration is unblocked and the placeholder TODO is now actionable.

## Out of scope

- Any change to the `SortBlock` component itself.
- Any change to other stories (s1–s6, s8–s10) or to TableCell / TableHeaderCell / their sortable internals.
- Any new variant prop on SortBlock (the shipped API stays as-is — `rows`, `children`, `orientation`, `className`).
- Drag-and-drop interaction wiring. The drag handle stays decorative, same as today.

## Reference

- Figma: "Sort Block — MainSub" (component_set `b59d4f9522e1d0ef16c22b7eee9ed78c831fe36b`).
- Existing pattern in code: `SortBlock.stories.tsx` → `SortableRowComposition` story.
- Source data: still the same fictional fixture rows (2 entries) used by the current `S7AddTrip`.

## Design

### Structure

Drop the `<table>`/`<thead>`/`<tbody>` wrapper entirely. Each row becomes a single horizontal flex strip:

```
[card]
  [row strip]   ← bg: --sorting-block-sorting-fill, items-stretch flex
    [drag-handle cell]   auto width, items-center
    [Tracking No. SortBlock cell]
    [Delivery Date SortBlock cell]
    [Customer SortBlock cell — MainSub vertical]
    [Shipping Address SortBlock cell]
    [close-button cell]   auto width, items-center
  [row strip]
    ...
[/card]
```

The card wrapper (`cardClasses` — white surface + border + radius) is preserved. Rows stack vertically inside it with `--spacing-8` between them (matching the visual gap between sortable rows in the live ERP).

There is no separate header row. Each labeled cell carries its own label via SortBlock's `rows` prop, which is the Figma-native way the pattern self-describes.

### Row chrome

The whole row is one continuous grey strip painted by the parent `<div>`, not by individual SortBlocks. Per-cell SortBlocks drop their built-in chrome (`bg` + `px`/`py`) via `className` override and contribute only the label/value typography.

This matches `SortableRowComposition` exactly. Two helpers from that story carry over:

```tsx
// Cells inside the row drop SortBlock's bg + outer padding, keep typography.
const cellOverride =
  'inline-flex items-start gap-[var(--spacing-8)] px-[var(--spacing-12)] py-[var(--spacing-12)]';
```

### Column widths

Fixed widths matching the original visual hierarchy:

| Cell             | Width                       | Rationale                            |
| ---------------- | --------------------------- | ------------------------------------ |
| Drag handle      | auto (`px-[--spacing-8]`)   | Just an icon, no label.              |
| Tracking No.     | `w-[180px]`                 | Single-line ID; needs ~12 mono chars.|
| Delivery Date    | `w-[180px]`                 | "08 May 2025 4:00PM" + label.        |
| Customer         | `w-[180px]`                 | Name + caption phone fits.           |
| Shipping Address | `flex-1` (absorbs slack)    | Multi-line value wraps inside.       |
| Close button     | auto (`px-[--spacing-12]`)  | IconButton, items-center.            |

Widths use raw px values — token scale doesn't reach 180. This is consistent with how `SortableRowComposition` already mixes raw values for fixed cells.

### Per-cell content

**Drag handle cell** — unchanged from today: `<Icon name="drag" size={17} color="var(--color-set-lightest)" />`, wrapped in a flex container that centers vertically against the row.

**Tracking No.** — `<SortBlock className={cellOverride} rows={[{ label: 'Tracking No.', value: 'MY123554G85899', bold: true }]} />`. Bold matches the current `weight="bold"` on the TableCell.

**Delivery Date** — `<SortBlock className={cellOverride} rows={[{ label: 'Delivery Date', value: '08 May 2025 4:00PM' }]} />`.

**Customer** — vertical MainSub: name as bold main row, phone as caption sub row.
```tsx
<SortBlock
  className={cellOverride.replace('items-start', 'items-start flex-col')}
  orientation="vertical"
  rows={[
    { label: 'Customer', value: 'Wei Kheng', bold: true },
    { label: '', value: '60 12-456 6556', caption: true },
  ]}
/>
```
The `flex-col` swap is necessary because `cellOverride` is `inline-flex items-start` (horizontal), but a vertical 2-row SortBlock needs `flex-col`. Alternatively pass a fully vertical override class — see Implementation Notes.

**Shipping Address** — single labeled value, the address comes from a form data collection as one string; line breaks here are visual wrapping, not author-controlled.
```tsx
<SortBlock
  className={`${cellOverride} flex-1`}
  rows={[{
    label: 'Shipping Address',
    value: '123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.',
  }]}
/>
```
The `flex-1` on the override lets this cell absorb extra row width.

**Close button cell** — `<IconButton name="close" label="Remove package" />`, wrapped in a flex container that centers vertically against the row.

### Row container

```tsx
<div className="flex items-stretch w-full bg-[color:var(--sorting-block-sorting-fill)]">
  …cells…
</div>
```

`w-full` forces the row to the card width (so `flex-1` on the address can absorb slack). `items-stretch` lets cells share row height — important when the Customer cell stacks 2 rows and the others are single-line, so the grey strip stays visually unified.

## Files affected

| File                                                     | Change                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/stories/Table/InsetTableScreens.stories.tsx`        | Rewrite the `S7AddTrip` export (~70 lines). Remove the `TODO(SortBlock)` JSDoc block. |
| `src/components/SortBlock/SortBlock.tsx`                 | None.                                                                                  |
| `src/components/TableHeaderCell/*`                        | None — TableHeaderCell `sortable` migration is a separate, future spec.                |

Imports added to the stories file: `SortBlock` from `../../components/SortBlock`. Imports possibly removable: none of the current ones — `TableCell`, `TableCellInfo`, `Icon`, `IconButton` are still used by other stories.

## Implementation notes

### `cellOverride` for vertical SortBlock

The `SortableRowComposition` reference defines one `cellOverride` constant for horizontal cells. Because s7's Customer cell uses `orientation="vertical"`, we either:

a. Define a second constant `cellOverrideVertical` that swaps `items-start` for `flex-col items-start`. Cleanest.
b. Inline the class string at the call site.

The plan picks (a) — one extra `const` colocated with `cellOverride`.

### Drag handle and close button cells

These cells are not SortBlocks (no label/value). They are plain `<div>`s sized like the SortableRowComposition story does it: `flex items-center px-[var(--spacing-8)]` for the drag handle (matches the reference) and `flex items-center px-[var(--spacing-12)]` for the close button. They contribute zero SortBlock chrome — the row's grey background flows through.

### Removed code

- The local `Cell` and `TH` helpers stay (used by all other stories).
- The `S7AddTrip` `<table>` boilerplate is gone, including the empty `TH inset column="first" align="left" label=""` placeholder header cells.
- The `TODO(SortBlock)` JSDoc block is replaced by a one-line comment pointing at the Figma node.

## Risks

- **Visual diff vs current s7.** The migration changes the rendering from a bordered table to a single grey strip per row. By design — the placeholder explicitly said "replace once SortBlock ships." Visual verification is part of the implementation plan, not a regression risk.
- **`flex-1` interaction with content widths.** If the address value is shorter than expected, the grey strip still spans `w-full` because of the row container. Validated by adjusting fixture data during implementation.
- **Vertical SortBlock + `cellOverride`.** The two-constant approach is the only place where this story diverges from the reference pattern. If a future cell needs both a vertical SortBlock and the row-cell behavior, the pattern is already in place.

## Acceptance

- `S7AddTrip` story renders without TypeScript / lint errors.
- The drag handle, two rows, and trailing close button are all visible.
- Each labeled cell shows its label above/beside its value with the SortBlock's grey label typography.
- Row heights are equal across cells (no stagger from the multi-line Customer/Address cells).
- The card wrapper is preserved; no `<table>` element remains in the story.
- The `TODO(SortBlock)` JSDoc block is removed.
