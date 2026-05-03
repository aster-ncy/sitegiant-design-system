# TableCardCell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a new `TableCardCell` primitive that renders the card-style inset-table pattern (Figma `Inset Table Row - Card - Top Tier` 3453:7497 + `Bottom Tier` 3453:7727), parallel to the existing `TableCell`. Add a per-component story file and an `S10ShockingSale` reference story reproducing `references/inset_table_s10.png`.

**Architecture:** Cell-level abstraction (one component per `<td>`), TypeScript discriminated union forces `tier='top'|'bottom'` to gate which props are valid. Border perimeter painted per-cell via `column` + `row` position rules to avoid double-paint on internal verticals. Top Tier hover bolds + greens text (built in unconditionally on `tier='top'`); Bottom Tier hover flips fill to grey. Form-control rows use `formField` flag (only valid on `tier='bottom'`) to switch inner alignment to `items-center`.

**Tech Stack:** React 19 + TypeScript 5.9 + Vite 8 + Tailwind v4 + Storybook 10. Tokens from `src/index.css`. Spec at `docs/superpowers/specs/2026-05-03-table-card-cell-design.md`.

---

## File Structure

**Create:**
- `src/components/TableCardCell/TableCardCell.tsx` — component
- `src/components/TableCardCell/TableCardCell.stories.tsx` — per-component variant matrix
- `src/components/TableCardCell/index.ts` — named exports

**Modify:**
- `src/components/index.ts` — barrel export
- `src/stories/Table/InsetTableScreens.stories.tsx` — append `S10ShockingSale` reference story

**Reference (do not edit):**
- `src/components/TableCell/TableCell.tsx` — mirror its conventions (column/row prop names, alignment helpers, hover-via-`<tr className="group/row">`)
- `src/components/TableHeaderCell/TableHeaderCell.tsx` — re-exports `TableColumnPosition` we depend on
- `references/inset_table_s10.png` — visual reference for `S10ShockingSale` story (private, gitignored)

---

### Task 1: Component scaffold (no rendering yet)

**Files:**
- Create: `src/components/TableCardCell/TableCardCell.tsx`
- Create: `src/components/TableCardCell/index.ts`
- Modify: `src/components/index.ts`

- [ ] **Step 1: Create the component file with API only (no JSX yet)**

`src/components/TableCardCell/TableCardCell.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { TableColumnPosition } from '../TableHeaderCell';

/** Vertical row position within a card (only meaningful for tier='bottom'). */
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
  /** Visual hover state — for controlled / Storybook use. Row-hover wired via
   *  <tr className="group/row"> + Tailwind. */
  hovered?: boolean;
  /** Selected state — pale-blue fill highlight. */
  selected?: boolean;
  /** Extra classes on the root cell. */
  className?: string;
}

export type TableCardCellProps =
  | (TableCardCellBase & {
      /** Top tier — header band of a card. Rounded top corners; full
       *  perimeter borders; constant fafafb fill (hover bolds + greens
       *  text instead of changing fill) per Figma 3453:7497. */
      tier: 'top';
      row?: never;
    })
  | (TableCardCellBase & {
      /** Bottom tier — content rows under the Top Tier header. White fill
       *  (flips to fafafb on hover); borders coordinate to form a
       *  continuous card outline per Figma 3453:7727. */
      tier: 'bottom';
      /** Bottom-row position. 'first' = directly under top tier;
       *  'middle' = inner row; 'last' = bottom of card (rounded bottom
       *  corners). */
      row: TableCardCellRow;
      /** When true, switches inner flex from items-start to items-center
       *  per Figma 3453:7841 — used when the cell hosts a form control
       *  (NumberInput, Toggle, Button etc.). */
      formField?: boolean;
    });

/**
 * TableCardCell — Figma: Inset Table Row - Card - Top Tier (3453:7497)
 * + Bottom Tier (3453:7727).
 *
 * Card-style inset-table cell. Stack one Top Tier row + N Bottom Tier
 * rows inside a `<tr>`/`<td>` matrix wrapped in a rounded outer div to
 * form a product card with header + variant rows. Reference: live ERP
 * "Shocking Sale" variant editor (references/inset_table_s10.png).
 *
 * Outer card recipe (caller's responsibility):
 * ```tsx
 * <div className="rounded-[var(--radius-4)] overflow-hidden">
 *   <table className="border-collapse w-full table-fixed">
 *     <tbody>
 *       <tr><TableCardCell tier="top" column="first">...</TableCardCell> ...</tr>
 *       <tr><TableCardCell tier="bottom" row="first" column="first">...</TableCardCell> ...</tr>
 *       <tr><TableCardCell tier="bottom" row="last" column="first">...</TableCardCell> ...</tr>
 *     </tbody>
 *   </table>
 * </div>
 * ```
 *
 * Each cell paints only its own border edges (column + row props
 * coordinate which sides are painted) so internal verticals don't
 * double-paint.
 */
export const TableCardCell = (props: TableCardCellProps) => {
  // Implementation in Task 2+.
  return null as unknown as JSX.Element;
};
```

`src/components/TableCardCell/index.ts`:

```ts
export { TableCardCell } from './TableCardCell';
export type {
  TableCardCellProps,
  TableCardCellRow,
} from './TableCardCell';
```

- [ ] **Step 2: Add to top-level barrel**

Modify `src/components/index.ts`. Find the alphabetical insertion point — between `TableCell` exports and `TableExpandToggle` exports. Add:

```ts
// TableCardCell
export { TableCardCell } from './TableCardCell';
export type { TableCardCellProps, TableCardCellRow } from './TableCardCell';
```

- [ ] **Step 3: Verify lint + typecheck pass on the scaffold**

Run from `sitegiant-storybook/`:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both clean (no output). The `null as unknown as JSX.Element` placeholder is intentional — TS accepts it; rendering comes in Task 2.

- [ ] **Step 4: Commit**

```bash
git add src/components/TableCardCell/ src/components/index.ts
git commit -m "feat(table-card-cell): scaffold TableCardCell with discriminated-union API"
```

---

### Task 2: Top Tier rendering

**Files:**
- Modify: `src/components/TableCardCell/TableCardCell.tsx`

Top Tier renders a single rectangular cell with full perimeter borders (top + bottom + left always; right only on `column='last'`), rounded `tl-4` on first / `tr-4` on last, fill `--table-body-hover-fill`, hover state applies bold + green text via `group-hover/row:`. Per Figma 3453:7574.

- [ ] **Step 1: Replace the placeholder with the full Top Tier render path**

In `src/components/TableCardCell/TableCardCell.tsx`, replace the placeholder body of `TableCardCell` with this implementation. Keep the existing types/exports above unchanged.

```tsx
const textAlignmentClass: Record<TableColumnPosition, string> = {
  first: 'justify-start text-left',
  center: 'justify-start text-left',
  last: 'justify-start text-left',
};

// Top Tier base classes — Figma 3453:7574 (Default state).
// Constant fill --table-body-hover-fill (#fafafb) in BOTH default and
// hover; hover applies bold + green to the text span via the parent
// <tr className="group/row">. See spec §"Hover behavior".
const topTierBaseClasses = [
  // Outer flex layout per Figma.
  'relative flex gap-[var(--spacing-12)] items-start w-full',
  // Padding per Figma 3453:7574.
  'pl-[var(--spacing-12)] pr-[var(--spacing-6)] py-[var(--spacing-12)]',
  // Constant fill — hover does NOT flip this.
  'bg-[var(--table-body-hover-fill)]',
  // Border colour shared by all card cells.
  'border-[var(--table-divider-border)] border-solid',
  // Top + bottom always painted on Top Tier.
  'border-t border-b',
  // Left always painted (every cell paints its own left edge — Codex
  // border-coordination rule from spec §"Border coordination contract").
  'border-l',
  'transition-colors duration-150',
].join(' ');

const topTierColumnClasses: Record<TableColumnPosition, string> = {
  // First column rounds top-left.
  first: 'rounded-tl-[var(--radius-4)]',
  // Center has no corner radius and no extra borders beyond the base.
  center: '',
  // Last column rounds top-right and paints right border to close the
  // box; without this the rightmost edge of the card would be open.
  last: 'rounded-tr-[var(--radius-4)] border-r',
};

// Hover text classes — built in unconditionally on tier='top' (Figma
// 3453:7593: Hover state bolds + greens text). Wired via group-hover/row
// so the cell triggers on the parent <tr> being hovered.
const topTierHoverTextClasses = [
  'group-hover/row:font-[var(--font-weight-bold)]',
  'group-hover/row:text-[color:var(--table-body-hover-text)]',
].join(' ');

// Top Tier text span — body 14/21 in --table-body-text. Hover-state
// classes layered on top via group-hover/row.
const topTierTextSpanClasses = [
  'flex items-center gap-[var(--spacing-4)] min-w-0 flex-1',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'font-[var(--font-weight-regular)]',
  'text-[color:var(--table-body-text)]',
  'transition-colors duration-150',
  topTierHoverTextClasses,
].join(' ');

export const TableCardCell = (props: TableCardCellProps) => {
  const { children, column, checkbox, leadingIcon, trailing, hovered, selected, className = '' } = props;

  if (props.tier === 'top') {
    // Selection wins over everything (matches TableCell behaviour).
    const fillOverride = selected ? '!bg-[var(--color-sys-blue-lighter)]' : '';
    // Forced-hover for Storybook / controlled state — apply bold + green
    // directly without waiting for :hover.
    const forcedHoverText = hovered
      ? 'font-[var(--font-weight-bold)] text-[color:var(--table-body-hover-text)]'
      : '';

    return (
      <div
        className={[
          topTierBaseClasses,
          topTierColumnClasses[column],
          fillOverride,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {checkbox && <span className="shrink-0 inline-flex items-center">{checkbox}</span>}
        {leadingIcon && <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>}
        <span
          className={[
            topTierTextSpanClasses,
            forcedHoverText,
            textAlignmentClass[column],
          ].join(' ')}
        >
          {children}
        </span>
        {trailing && <span className="shrink-0 inline-flex items-center">{trailing}</span>}
      </div>
    );
  }

  // Bottom Tier comes in Task 3.
  return null as unknown as JSX.Element;
};
```

- [ ] **Step 2: Lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/TableCardCell/TableCardCell.tsx
git commit -m "feat(table-card-cell): render Top Tier with hover bold+green text"
```

---

### Task 3: Bottom Tier rendering

**Files:**
- Modify: `src/components/TableCardCell/TableCardCell.tsx`

Bottom Tier renders white-fill cells with left border always; right only on `column='last'`; bottom only on `row='last'`. Hover flips fill to fafafb (text unchanged). `formField` flag switches inner flex to `items-center`. Rounded `bl-4`/`br-4` on the last-row first/last column. Per Figma 3453:7822.

- [ ] **Step 1: Replace the Bottom Tier `return null` with the implementation**

In `src/components/TableCardCell/TableCardCell.tsx`, ABOVE the `export const TableCardCell` line, add Bottom Tier base classes:

```tsx
// Bottom Tier base classes — Figma 3453:7822 (Default state) +
// 3453:8104 (Hover). Default fill white; hover flips to --table-body-
// hover-fill via parent <tr className="group/row">.
const bottomTierBaseClasses = [
  // Outer flex layout per Figma.
  'relative flex w-full',
  // Padding per Figma 3453:7822 (asymmetric: pt-12 pb-6).
  'pl-[var(--spacing-12)] pr-[var(--spacing-6)] pt-[var(--spacing-12)] pb-[var(--spacing-6)]',
  // Default fill — flips to hover-fill on parent-row hover.
  'bg-[var(--table-body-fill)]',
  'group-hover/row:bg-[var(--table-body-hover-fill)]',
  // Border colour.
  'border-[var(--table-divider-border)] border-solid',
  // Left always painted (every cell paints its own left edge).
  'border-l',
  'transition-colors duration-150',
].join(' ');

// Column-specific borders + corner radii.
const bottomTierColumnClasses: Record<TableColumnPosition, string> = {
  first: '',
  center: '',
  last: 'border-r',
};

// Row-specific bottom border + corner radii. Only the last row paints
// border-b (so middle rows form a continuous strip with the row above
// and below).
const bottomTierRowClasses: Record<TableCardCellRow, string> = {
  first: '',
  middle: '',
  last: 'border-b',
};

// Combined column × row corner radii — only the last row gets rounded
// bottom corners on the edge columns (closes the card's bottom).
const bottomTierCornerClasses = (column: TableColumnPosition, row: TableCardCellRow): string => {
  if (row !== 'last') return '';
  if (column === 'first') return 'rounded-bl-[var(--radius-4)]';
  if (column === 'last') return 'rounded-br-[var(--radius-4)]';
  return '';
};

// Bottom Tier text span — body 14/21 in --table-body-text. No hover
// text-colour change (Figma 3453:8108: text colour unchanged on hover).
const bottomTierTextSpanClasses = [
  'flex w-full min-w-0',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'font-[var(--font-weight-regular)]',
  'text-[color:var(--table-body-text)]',
].join(' ');
```

- [ ] **Step 2: Replace the `return null as unknown as JSX.Element;` for Bottom Tier**

Inside the `TableCardCell` function, replace the trailing `return null as unknown as JSX.Element;` with the full Bottom Tier render:

```tsx
  // tier === 'bottom'
  const { row, formField } = props;
  const fillOverride = selected ? '!bg-[var(--color-sys-blue-lighter)]' : '';
  const forcedHoverFill = hovered
    ? '!bg-[var(--table-body-hover-fill)]'
    : '';
  // Form-field cells centre their content vertically (NumberInput,
  // Toggle, Button etc.); plain text cells anchor to top.
  const innerAlignment = formField ? 'items-center' : 'items-start';

  return (
    <div
      className={[
        bottomTierBaseClasses,
        bottomTierColumnClasses[column],
        bottomTierRowClasses[row],
        bottomTierCornerClasses(column, row),
        innerAlignment,
        'gap-[var(--spacing-12)]',
        fillOverride,
        forcedHoverFill,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {checkbox && <span className="shrink-0 inline-flex items-center">{checkbox}</span>}
      {leadingIcon && <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>}
      <span
        className={[
          bottomTierTextSpanClasses,
          formField ? 'items-center' : 'items-start',
          textAlignmentClass[column],
        ].join(' ')}
      >
        {children}
      </span>
      {trailing && <span className="shrink-0 inline-flex items-center">{trailing}</span>}
    </div>
  );
```

- [ ] **Step 3: Lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/TableCardCell/TableCardCell.tsx
git commit -m "feat(table-card-cell): render Bottom Tier with formField alignment + hover fill flip"
```

---

### Task 4: Per-component story matrix

**Files:**
- Create: `src/components/TableCardCell/TableCardCell.stories.tsx`

Stories prove every meaningful prop combination renders correctly. Read these in Storybook at `Tables/TableCardCell` to visually verify against Figma.

- [ ] **Step 1: Write the stories file**

`src/components/TableCardCell/TableCardCell.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCardCell } from './TableCardCell';
import { Checkbox } from '../Checkbox';
import { Pip } from '../Pip';
import { Toggle } from '../Toggle';
import { Button } from '../Button';
import { EllipsisButton } from '../Button';
import { NumberInput } from '../NumberInput';

const meta = {
  title: 'Tables/TableCardCell',
  component: TableCardCell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TableCardCell>;

export default meta;
type Story = StoryObj<typeof TableCardCell>;

// Outer card recipe — every story wraps cells in this shell so the
// rounded corners visually close the box.
const cardShell = 'rounded-[var(--radius-4)] overflow-hidden inline-block';

/* ── Top Tier ────────────────────────────────────────── */

/** Top Tier 3-column row — Default state. Hover the row to see bold
 *  + green text on every cell (parent-driven via `group/row`). */
export const TopTierDefault: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell tier="top" column="first" checkbox={<Checkbox size="sm" />}>
                Product Name Here
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center">Center cell</TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" trailing={<EllipsisButton />}>
                Last cell
              </TableCardCell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/** Top Tier with `hovered` prop forced — proves the bold-green text
 *  state outside of mouse-hover (useful for visual regression). */
export const TopTierHovered: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr>
            <td className="p-0">
              <TableCardCell tier="top" column="first" hovered>
                Hovered first
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center" hovered>Hovered center</TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" hovered>
                Hovered last
              </TableCardCell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/** Top Tier with leadingIcon (App Icon / Product Image equivalents). */
export const TopTierWithLeadingIcon: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell
                tier="top"
                column="first"
                leadingIcon={<span className="size-[21px] rounded-[var(--radius-4)] bg-[var(--color-set-light)] inline-block" />}
              >
                Product with icon
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center">
                <Pip type="success" pipStyle="default" label="Active" />
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" trailing={<EllipsisButton />} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ── Bottom Tier ─────────────────────────────────────── */

/** Bottom Tier 3-row × 3-column matrix — proves continuous-strip
 *  borders + last-row rounded corners. Hover any row to see fill flip. */
export const BottomTierMatrix: Story = {
  render: () => {
    const rows: Array<'first' | 'middle' | 'last'> = ['first', 'middle', 'last'];
    return (
      <div className={cardShell}>
        <table className="border-collapse table-fixed w-[600px]">
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="group/row">
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="first">
                    {row} first
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="center">
                    {row} center
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="last">
                    {row} last
                  </TableCardCell>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** Bottom Tier hosting form controls — `formField` flips inner
 *  alignment to items-center so NumberInput / Toggle / Button sit
 *  vertically centred in the cell. */
export const BottomTierFormControls: Story = {
  render: () => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell tier="bottom" row="first" column="first" formField>
                <NumberInput value={1} onChange={() => undefined} />
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="first"
                column="center"
                formField
                trailing={<Toggle checked={true} onChange={() => undefined} />}
              />
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="last"
                column="last"
                formField
                trailing={<Button variant="primary" size="sm" label="Save" />}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
```

- [ ] **Step 2: Verify each story renders in Storybook**

Open http://localhost:6006/?path=/story/tables-tablecardcell--top-tier-default and visually compare against Figma 3453:7497 (Top Tier section). Then visit each remaining story:
- TopTierHovered (forced bold+green)
- TopTierWithLeadingIcon
- BottomTierMatrix (3×3 grid; last row has rounded bottom corners; middle rows form a continuous strip)
- BottomTierFormControls (form controls vertically centred)

If something looks wrong, fix Task 2 / Task 3 code, not the story.

- [ ] **Step 3: Lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/TableCardCell/TableCardCell.stories.tsx
git commit -m "feat(table-card-cell): per-component stories covering tier × column × row × hover × formField"
```

---

### Task 5: S10 reference story

**Files:**
- Modify: `src/stories/Table/InsetTableScreens.stories.tsx`

Reproduce `references/inset_table_s10.png` (Shocking Sale variant editor) using the new `TableCardCell`. One product = 1 Top Tier row + N Bottom Tier rows.

- [ ] **Step 1: Add the import**

In `src/stories/Table/InsetTableScreens.stories.tsx`, find the existing imports near the top and add:

```tsx
import { TableCardCell } from '../../components/TableCardCell';
import { NumberInput } from '../../components/NumberInput';
import { Toggle } from '../../components/Toggle';
```

(Keep the existing imports — these are additions only.)

- [ ] **Step 2: Append the S10 story at the end of the file**

After the last existing story (`S9OrderReturn`), add a new section:

```tsx
/* ── s10 Shocking Sale ─────────────────────────────────── */

/**
 * Create Shocking Sale — products listed as cards with editable variant
 * rows. Each card = 1 Top Tier row (image + product name + trash) +
 * N Bottom Tier rows (variant label + RM input + %off input + qty +
 * stock + purchase limit + status toggle). Composes
 * `<TableCardCell>` for the new card-style table primitive.
 */
export const S10ShockingSale: Story = {
  render: () => {
    type Variant = {
      key: string;
      label: string;
      price: number;
      offPercent: number;
      campaignStock: number;
      stock: number;
      purchaseLimit: number | null;
      enabled: boolean;
    };
    const variants: Variant[] = [
      { key: 'blue-s', label: 'Blue, S', price: 16, offPercent: 20, campaignStock: 10, stock: 44, purchaseLimit: 2, enabled: true },
      { key: 'blue-m', label: 'Blue, M', price: 16, offPercent: 20, campaignStock: 10, stock: 44, purchaseLimit: 2, enabled: true },
      { key: 'red-s', label: 'Red, S', price: 16, offPercent: 20, campaignStock: 10, stock: 44, purchaseLimit: 4, enabled: true },
      { key: 'red-m', label: 'Red, M', price: 0, offPercent: 20, campaignStock: 10, stock: 44, purchaseLimit: null, enabled: true },
    ];
    return (
      <div className={cardClasses}>
        <h2 className="font-[var(--font-weight-bold)] text-[length:var(--text-16)] mb-[var(--spacing-16)]">
          Shocking Sale Products
        </h2>
        <div className="rounded-[var(--radius-4)] overflow-hidden">
          <table className="border-collapse w-full table-fixed">
            <tbody>
              {/* Top Tier — product header */}
              <tr className="group/row">
                <td className="p-0" colSpan={7}>
                  <TableCardCell tier="top" column="first" checkbox={<Checkbox size="sm" />}>
                    <span className="inline-flex items-center gap-[var(--spacing-8)]">
                      <span
                        aria-hidden="true"
                        className="shrink-0 size-[40px] rounded-[var(--radius-4)] bg-[var(--color-set-light)]"
                      />
                      <span className="font-[var(--font-weight-bold)]">
                        Women's Fashion Cat Print Plus Velvet Hooded Sweate Velvet Hooded Sweater
                      </span>
                    </span>
                  </TableCardCell>
                </td>
              </tr>
              {/* Bottom Tier — variant rows */}
              {variants.map((v, i) => {
                const row = i === variants.length - 1 ? 'last' : i === 0 ? 'first' : 'middle';
                return (
                  <tr key={v.key} className="group/row">
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="first">
                        {v.label}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center">
                        RM{v.price.toFixed(2)}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.price} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.offPercent} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" formField>
                        <NumberInput value={v.campaignStock} onChange={() => undefined} />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center">
                        {v.stock}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell
                        tier="bottom"
                        row={row}
                        column="last"
                        formField
                        trailing={<Toggle checked={v.enabled} onChange={() => undefined} />}
                      >
                        {v.purchaseLimit ?? 'No limit'}
                      </TableCardCell>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};
```

- [ ] **Step 3: Verify in Storybook against the reference**

Open http://localhost:6006/?path=/story/tables-reference-screens--s-10-shocking-sale and visually compare to `references/inset_table_s10.png`. Confirm:
- Top row has rounded top corners; product name in bold.
- 4 variant rows form a continuous bordered strip; last row has rounded bottom corners.
- Form fields (RM input, %off input, qty input) sit vertically centred in their cells.
- Toggle in the last column also vertically centred.
- Hover any row → that row's fill lights up grey (#fafafb) for Bottom Tier; Top Tier row hover bolds + greens text.

If the visual doesn't match, fix the underlying primitive (Tasks 2/3), not the story.

- [ ] **Step 4: Lint + typecheck**

```bash
npm run lint
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/stories/Table/InsetTableScreens.stories.tsx
git commit -m "feat(stories): add S10 Shocking Sale reference story for TableCardCell"
```

---

### Task 6: Codex adversarial review

**Files:** none (review-only)

- [ ] **Step 1: Send the diff to Codex via codex:rescue subagent**

Use the Agent tool with subagent_type=codex:codex-rescue. Prompt template:

```
Adversarial review of uncommitted TableCardCell work. Repo:
C:\Users\Aster\SiteGiant File\D\Aster\Aster Testing\sitegiant-design-system\sitegiant-storybook

Files changed across 5 commits:
- src/components/TableCardCell/TableCardCell.tsx (new)
- src/components/TableCardCell/TableCardCell.stories.tsx (new)
- src/components/TableCardCell/index.ts (new)
- src/components/index.ts (modified — barrel export)
- src/stories/Table/InsetTableScreens.stories.tsx (modified — S10 story added)

Spec at docs/superpowers/specs/2026-05-03-table-card-cell-design.md.

Look hard for:
- Border coordination bugs: do internal verticals double-paint? Does
  the rounded-bl-4 on row='last' column='first' visually close the
  card's bottom-left corner without the wrapper div clipping it?
- Discriminated union enforcement: does `<TableCardCell tier='top'
  formField>` produce a TypeScript error as expected?
- Hover-state bleed: does forcing `hovered` on a Top Tier cell
  interact correctly with the parent <tr className='group/row'>
  group-hover wiring?
- Selected state precedence: does `selected` override hover-fill
  on Bottom Tier?
- Form-control alignment: do NumberInput / Toggle / Button render
  vertically centred in formField cells? Does the cell size adapt
  to the control's intrinsic height?
- s1–s9 regressions: confirm no inset reference stories broke.
- Token fidelity vs spec.

Report HIGH/MED/LOW. Under 400 words.
```

- [ ] **Step 2: Apply Codex fixes inline before committing the merge**

If Codex flags HIGH or MED issues, fix them as additional steps in this task (not new tasks). Each fix gets its own commit:

```bash
git commit -m "fix(table-card-cell): <Codex finding short summary>

Reviewed-by: Codex (round N)"
```

LOW findings can be deferred or addressed inline.

- [ ] **Step 3: Document the verdict**

If Codex says APPROVE, write a one-line note to memory at end of session (handoff). If APPROVE WITH NOTES, ensure all MED+ findings have a fix commit OR an explicit deferral note.

---

### Task 7: Memory + handoff update

**Files:**
- Modify (write/append): `C:\Users\Aster\.claude\projects\C--Users-Aster\memory\project_session_handoff_2026_05_03_main.md`
- Modify: `C:\Users\Aster\.claude\projects\C--Users-Aster\memory\MEMORY.md` (one-line index entry update)

- [ ] **Step 1: Update the existing handoff with TableCardCell shipped**

Append a section to `project_session_handoff_2026_05_03_main.md` summarising:
- Commit shas (run `git log --oneline -10` to capture).
- TableCardCell now in barrel; net-new component, no s1–s9 regression.
- S10 reference story shipped.
- Codex review verdict.

- [ ] **Step 2: Update the MEMORY.md index pointer for the handoff**

Update the single line in MEMORY.md that points at `project_session_handoff_2026_05_03_main.md` to mention TableCardCell + S10 in the description, and update the resume keyword if helpful.

- [ ] **Step 3: Verify memory updates**

```bash
ls "C:\Users\Aster\.claude\projects\C--Users-Aster\memory\"
```

Confirm the handoff file timestamp is fresh.

---

## Self-Review

**Spec coverage:**
- ✅ Cell-level abstraction: Task 1 scaffolds the component at the correct level.
- ✅ Discriminated union: Task 1's API uses `tier='top'|'bottom'` with branch-specific props.
- ✅ Top Tier rendering: Task 2.
- ✅ Bottom Tier rendering: Task 3.
- ✅ Border coordination: Tasks 2 + 3 each cell paints `border-l`; only `column='last'` adds `border-r`; only Top Tier paints `border-t/b`; only Bottom Tier `row='last'` paints `border-b`.
- ✅ Hover behaviour (Top: bold+green text constant fill; Bottom: fill flip): Tasks 2 + 3.
- ✅ formField prop: Task 3.
- ✅ Outer card recipe: Documented in JSDoc on the component (Task 1).
- ✅ Per-component stories: Task 4.
- ✅ S10 reference story: Task 5.
- ✅ Codex review: Task 6.
- ✅ Memory handoff: Task 7.

**Placeholder scan:** No "TBD", "TODO", "implement later", "Add appropriate error handling" patterns. Each step has explicit code or commands.

**Type consistency:** `TableCardCellProps` discriminated union is defined once in Task 1; Tasks 2/3 destructure it. `TableColumnPosition` re-exported from `../TableHeaderCell` (existing export verified via grep). `TableCardCellRow` defined in Task 1; used in Task 3's `bottomTierRowClasses` and `bottomTierCornerClasses`. No naming drift.

**One ambiguity I'm aware of:** Task 5's S10 story uses 7 cells in a 4-variant table but the Top Tier uses `colSpan={7}` to span the full width. If the variant table uses 7 columns, the column position prop should still be `first` for the `colSpan=7` cell since it visually starts at the left. I've kept this as written; if it produces visible weirdness in Storybook, the implementer should split the Top Tier into 7 cells with `column="first"`, 5×`column="center"`, `column="last"` — but this is a story-side judgment call, not a primitive bug.
