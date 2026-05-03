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
  'border-[color:var(--table-divider-border)] border-solid',
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
  'border-[color:var(--table-divider-border)] border-solid',
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
};
