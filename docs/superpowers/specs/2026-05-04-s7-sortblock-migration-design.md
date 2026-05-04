# s7 Add Trip — SortBlock Migration

**Status:** Draft (revised v3 — corrected after live-ERP screenshot reread)
**Date:** 2026-05-04
**Scope:** `src/stories/Table/InsetTableScreens.stories.tsx` — `S7AddTrip` story only.

## Goal

Replace the placeholder `<table>`-based composition in `S7AddTrip` with the real Figma "Sort Block — MainSub" pattern, now that `SortBlock` has shipped. Remove the `TODO(SortBlock)` JSDoc block once done.

## Why now

The placeholder was written before SortBlock existed. The SortBlock atom landed in the previous session along with its `SortableRowComposition` story. The migration is unblocked and the placeholder TODO is now actionable.

## Live-ERP reading (source of truth)

The s7 reference screenshot lives at `references/inset_table_s7.png` relative to the workspace root one level above `sitegiant-storybook/` (the git root). It is gitignored per `feedback_reference_folder_local_only.md` and is not accessible from inside the repo via a relative path. Implementers viewing this spec from the repo will need to open the screenshot from the workspace folder. The screenshot shows:

- **Header row** with small grey 12px labels: "Tracking No. / Delivery Date / Customer / Shipping Address". Sits on a continuous grey strip above the body rows. No drag handle, no close icon — it's a labels-only header, not a sortable row.
- **Body rows** (2 visible) — each row is one continuous grey strip with a drag handle on the far left, a close icon on the far right, and value cells in the middle.
- **Body cells carry values only**, no inline labels. The header row carries the labels.
- **Tracking No.** ("MY123554G85899") is bold; everything else is regular weight.
- **Customer** is a vertical 2-line stack: "Wei Kheng" (14px regular) over "60 12-456 6556" (12px caption). No labels.
- **Shipping Address** wraps onto 3 lines naturally inside its cell ("123, Jalan Mayang Pasir," / "11200 Bayan Baru," / "Pulau Pinang, Malaysia.").

This means: each row IS a SortBlock instance (the SortBlock atom provides the grey-strip row chrome — drag handle and close icon are caller-supplied children), and the *cells* inside are plain divs. The header is its own non-SortBlock strip.

## Out of scope

- Any change to the `SortBlock` component itself (no new prop, no edits to `SortBlock.tsx`).
- Any change to other stories (s1–s6, s8–s10) or to TableCell / TableHeaderCell / their sortable internals.
- Drag-and-drop interaction wiring. The drag handle stays decorative, same as today.
- Implementing the `<SortBlock variant="mainSub" ...>` API the leftover TODO comment references — that prop does not exist on the shipped component, and this migration deletes the TODO rather than implementing it.

## Constraints from the shipped SortBlock

The shipped SortBlock has two behaviors that constrain what the `rows` prop can do:

1. **Values use `whitespace-nowrap`.** `VALUE_BASE_CLASSES` in `SortBlock.tsx:48` forces every value span to a single line. The `rows` API cannot render a wrapping multi-line value.
2. **Labels always render, even when empty.** The renderer at `SortBlock.tsx:114-117` always emits `<span className={LABEL_CLASSES}>{row.label}</span>`. An empty-string label still occupies a 12/17 line.

Implication for s7: since body cells have no labels at all (header carries them) and the address must wrap, body cells **cannot use the `rows` API**. Instead, each row is one SortBlock using the `children` API, and the row's content (cells, drag, close) are all plain divs inside that one SortBlock.

## Design

### Structure

Drop the `<table>`/`<thead>`/`<tbody>` wrapper entirely. Inside the existing card wrapper:

```
[card]
  [header strip]   ← plain <div>, bg --sorting-block-sorting-fill, NOT a SortBlock
    [empty drag-slot spacer]
    [Tracking No. label]   w-[180px]
    [Delivery Date label]  w-[180px]
    [Customer label]       w-[180px]
    [Shipping Address label]  flex-1
    [empty close-slot spacer]

  [SortBlock row 1]   ← <SortBlock className={ROW_OVERRIDE}>{children}</SortBlock> — flex w-full + grey chrome (override required; default is inline-flex)
    [drag handle div]
    [Tracking No. value]   w-[180px], bold
    [Delivery Date value]  w-[180px]
    [Customer stack div]   w-[180px], 2-line: "Wei Kheng" / "60 12-456 6556" caption
    [Address value div]    flex-1, wraps
    [close button div]

  [SortBlock row 2]   ← same pattern
    ...
[/card]
```

The card wrapper (`cardClasses`) is preserved. Header and body rows stack vertically inside it with `--spacing-8` between rows (matches the visual gap in the live ERP screenshot).

### Why each row is one SortBlock with children, not many SortBlocks

The Figma "Sort Block — MainSub" atom is the row-level grey-strip chrome, not the per-cell chrome. Wrapping each row in `<SortBlock>...</SortBlock>` paints the grey background (`bg-[var(--sorting-block-sorting-fill)]`), applies the `px-[var(--spacing-6)] py-[var(--spacing-12)]` outer padding, and gives us `items-start` alignment (matches the screenshot — the drag handle aligns top-of-row when Customer/Address are multi-line).

The drag handle and close icon are caller-supplied — they sit inside the SortBlock as `<div>` cells. SortBlock the atom itself does not render the drag affordance; the row composition does.

The body cells inside use plain divs: they don't need SortBlock's chrome (already painted by the parent SortBlock) and don't need its label/value typography helpers (no inline labels, and the address must wrap which the value typography forbids).

### `className` override required for full-width row

`SortBlock`'s default root is `inline-flex` (sizes to content), and its `className` prop **replaces** the built-in classes (per `SortBlock.tsx:24`). For the row to span the card width — so `flex-1` on the address cell can absorb container slack — each row must pass an override that swaps `inline-flex` for `flex w-full` while keeping the rest of the chrome:

```tsx
const ROW_OVERRIDE =
  'flex items-start w-full ' +
  'bg-[color:var(--sorting-block-sorting-fill)] ' +
  'px-[var(--spacing-6)] py-[var(--spacing-12)] ' +
  'gap-[var(--spacing-8)]';
```

Adding `gap-[var(--spacing-8)]` here gives consistent inter-cell spacing inside the row (SortBlock's default horizontal layout uses gap-8 too, but only between its built-in label/value columns — children mode doesn't apply it, so we re-add it).

### Header strip (NOT a SortBlock)

```tsx
<div className="flex items-center w-full bg-[color:var(--sorting-block-sorting-fill)]
                 px-[var(--spacing-6)] py-[var(--spacing-12)] gap-[var(--spacing-8)]">
  <div className="w-[24px] flex-none" aria-hidden />              {/* drag-slot spacer */}
  <span className={HEADER_LABEL} style={{ width: 180 }}>Tracking No.</span>
  <span className={HEADER_LABEL} style={{ width: 180 }}>Delivery Date</span>
  <span className={HEADER_LABEL} style={{ width: 180 }}>Customer</span>
  <span className={`${HEADER_LABEL} flex-1`}>Shipping Address</span>
  <div className="w-[24px] flex-none" aria-hidden />              {/* close-slot spacer */}
</div>
```

Where `HEADER_LABEL` is a story-local constant carrying the small-grey label typography:

```tsx
const HEADER_LABEL =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-info)]';
```

The drag-slot and close-slot are 24px-wide spacers (the approximate width of a 17px icon + its padding) so the header labels align horizontally with the body values below.

### Body row

```tsx
<SortBlock className={ROW_OVERRIDE}>
  <div className="flex items-center self-stretch">
    <Icon name="drag" size={17}
          className="text-[color:var(--color-icon-secondary)] cursor-grab" />
  </div>
  <span style={{ width: 180 }} className={VALUE_BOLD}>MY123554G85899</span>
  <span style={{ width: 180 }} className={VALUE_REG}>08 May 2025 4:00PM</span>
  <div style={{ width: 180 }} className="flex flex-col gap-[var(--spacing-2)]">
    <span className={VALUE_REG}>Wei Kheng</span>
    <span className={VALUE_CAPTION}>60 12-456 6556</span>
  </div>
  <div className="flex-1 min-w-0">
    <span className={VALUE_WRAP}>
      123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.
    </span>
  </div>
  <div className="flex items-start self-stretch">
    <IconButton name="close" label="Remove package" />
  </div>
</SortBlock>
```

The address cell is wrapped in a `flex-1 min-w-0 <div>` rather than putting `flex-1` directly on the span — `flex-1` on a `<span>` is unreliable across browsers; nesting under a flex-child div is safer.

Where the typography constants mirror SortBlock's internal styles:

```tsx
const VALUE_REG =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const VALUE_BOLD =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-bold)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const VALUE_CAPTION =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const VALUE_WRAP =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)]';   // intentionally NO whitespace-nowrap
```

### Notes on specific details

- **Bold Tracking No.** preserves today's `weight="bold"` treatment and matches the screenshot.
- **Customer is regular-weight, not bold.** This contradicts an earlier draft of this spec — the screenshot shows Wei Kheng in regular 14px, not bold.
- **Customer stack uses `gap-[var(--spacing-2)]`**, matching the SortBlock atom's vertical pair gap (`VERTICAL_PAIR_CLASSES` in `SortBlock.tsx:54`).
- **Address `min-w-0`** is required for `flex-1` to actually shrink below intrinsic content width when the address is long.
- **Drag handle uses today's classes** — `text-[color:var(--color-icon-secondary)] cursor-grab` — preserving the existing visual rather than swapping to the SortableRowComposition reference's `--color-set-lightest`.
- **`self-stretch`** on the drag/close cells lets them span the row height even when Customer/Address make the row taller than a single line, so the icons can stay top-anchored alongside the multi-line content (matches the screenshot).
- **Spacers in the header row are 24px** — derived from 17px icon + ~7px combined padding the body cells consume around the icons. May need a 1–2px tweak during visual verification.

### Column widths

Fixed widths on the value spans/divs themselves; address absorbs slack:

| Column           | Width     | Body cell             | Header span         |
| ---------------- | --------- | --------------------- | ------------------- |
| Drag             | 24px      | `Icon` in flex div    | spacer `<div>`      |
| Tracking No.     | 180px     | bold span             | label span          |
| Delivery Date    | 180px     | regular span          | label span          |
| Customer         | 180px     | flex-col 2-line div   | label span          |
| Shipping Address | `flex-1`  | wrapping span         | label span flex-1   |
| Close            | 24px      | `IconButton` flex div | spacer `<div>`      |

180px is a raw px value (not a token). The codebase already uses raw `w-[NNNpx]` widths in other story-scoped layout (acceptable; tokens don't reach this scale).

## Fixture shape change

Today's `S7AddTrip` passes the address as `body: ['line 1,', 'line 2,', 'line 3.']` to `TableCellInfo`, which renders one paragraph per array entry. The migration flattens that to a single string (joined with a space) since the new design relies on natural CSS wrapping rather than author-controlled line breaks. Called out so the implementer doesn't paste back the array.

## Files affected

| File                                                | Change                                                                                                                                                                                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/stories/Table/InsetTableScreens.stories.tsx`   | Rewrite `S7AddTrip` (~80 lines). Add 5 story-local typography constants (`HEADER_LABEL`, `VALUE_REG`, `VALUE_BOLD`, `VALUE_CAPTION`, `VALUE_WRAP`) plus the `ROW_OVERRIDE` className constant. Add `SortBlock` import. Flatten address fixture. Delete `TODO(SortBlock)` JSDoc block. |
| `src/components/SortBlock/SortBlock.tsx`            | None.                                                                                                                                                                                                                        |
| `src/components/TableHeaderCell/*`                  | None — TableHeaderCell `sortable` migration is a separate, future spec.                                                                                                                                                      |

Imports added: `SortBlock` from `../../components/SortBlock`. No imports become unused (`TableCell`, `TableCellInfo`, `Icon`, `IconButton` are still consumed by other stories in the same file).

## Implementation notes

### Typography constants live local to S7AddTrip

The 5 constants are story-local (top of `S7AddTrip`'s render closure or just above the export). They mirror SortBlock's internal `LABEL_CLASSES`, `VALUE_BASE_CLASSES`, and `VERTICAL_PAIR_CLASSES` but with one critical difference: `VALUE_WRAP` omits `whitespace-nowrap` so the address can wrap. Keeping them local avoids growing the SortBlock public API.

### Drag and close cells stay non-SortBlock

They are plain `<div>` flex containers inside the parent `<SortBlock>`. Putting them in their own SortBlocks would re-apply grey chrome we don't want.

### Drift risk

The constants repeat class strings that SortBlock's internals already define. Acceptable: SortBlock doesn't expose these as exports, the alternative (extending SortBlock's API) is out of scope, and the repetition is bounded to one story. If the same pattern recurs in a third location, extract.

### Removed code from S7AddTrip

- The `<table>`, `<thead>`, `<tbody>`, all `Cell` and `TH` invocations.
- The 6 `TH inset` calls and 6 `Cell alignTop inset` calls per row × 2 rows.
- The `TableCellInfo` calls for Customer and Shipping Address.
- The `TODO(SortBlock)` JSDoc block above `S7AddTrip` is replaced by a one-line comment pointing at the Figma node.

The local `Cell` and `TH` helpers in the file stay (used by all other stories).

## Risks

- **Visual diff vs current s7.** Intentional — the placeholder explicitly said "replace once SortBlock ships." Visual verification is part of implementation.
- **Header / body alignment.** The 24px spacer width is an estimate; the implementation may need a 1–2px tweak after visual diff against the s7 reference screenshot.
- **`min-w-0` on the address cell wrapper.** Required for `flex-1` to shrink. Easy to forget.
- **`ROW_OVERRIDE` reproduces SortBlock's chrome.** Because `className` replaces (not appends), the override must reproduce `bg`, `px`, `py`. If SortBlock's chrome changes upstream, this constant won't follow. Acceptable: the alternative (adding a "fullWidth" prop to SortBlock) is out of scope, and the override is bounded to one story.
- **SortBlock's outer padding (`px-6 py-12`).** Keeping the SortBlock wrapper means rows get the atom's exact outer padding. The header strip mirrors this padding. If Aster wants tighter rows later, it's a parallel decision (change both header and SortBlock atom).
- **No existing reference story for "one SortBlock per row with plain div cells".** The current `SortableRowComposition` story uses the inverse model (parent `<div>` + child SortBlocks). The implementer must add a brief Storybook story alongside `S7AddTrip` OR a `/* PATTERN: ... */` comment block at the top of the rewritten story (enforced via Acceptance below; choice of which form is left to the implementer).

## Acceptance

- `S7AddTrip` story renders without TypeScript / lint errors.
- Header strip with column labels is visible above the rows.
- 2 SortBlock rows render, each with drag handle, value cells, and close button.
- Customer cell shows "Wei Kheng" (regular 14px) above "60 12-456 6556" (caption 12px), with no inline labels.
- Address wraps onto multiple lines inside its `flex-1` cell.
- Tracking No. is bold; other body values are regular weight.
- Header labels align horizontally with the body values beneath them.
- The card wrapper is preserved; no `<table>` element remains in the story.
- The `TODO(SortBlock)` JSDoc block is removed.
- The new "one SortBlock per row with plain div cells" pattern is documented either as a brief Storybook story added alongside `S7AddTrip` OR as a `/* PATTERN: ... */` comment block at the top of the rewritten story, so future readers understand the composition without needing to reverse-engineer it.
