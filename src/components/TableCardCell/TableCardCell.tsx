import type { ReactNode } from 'react';
import type { TableColumnPosition } from '../TableHeaderCell';

/** Vertical row position within a card (only meaningful for tier='bottom'). */
export type TableCardCellRow = 'first' | 'middle' | 'last';

/** Default mode: Figma 1432:2527 + 1438:4957. Inset mode: Figma 3453:7497 (legacy baseline). */
export type TableCardCellMode = 'default' | 'inset';

/** Top-tier content variant — encodes spacing/layout around the leading-icon slot. */
export type TableCardCellTopVariant =
  | 'default'
  | 'app-icon'
  | 'user-icon'
  | 'status'
  | 'product-image';

/** Bottom-tier content variant — encodes layout/padding/alignment differences per variant. */
export type TableCardCellBottomVariant =
  | 'default'
  | 'data'
  | 'listing'
  | 'status'
  | 'star-rating'
  | 'status-toggle'
  | 'action-button'
  | 'form-field';

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
  /**
   * Padding mode. 'inset' (default) uses inset-table spacing (pl-12 pr-6).
   * 'default' uses standard-table spacing (pl-24 pr-12).
   */
  mode?: TableCardCellMode;
}

export type TableCardCellProps =
  | (TableCardCellBase & {
      /** Top tier — header band of a card. Rounded top corners; full
       *  perimeter borders; constant fafafb fill (hover bolds + greens
       *  text instead of changing fill) per Figma 3453:7497. */
      tier: 'top';
      row?: never;
      /** Top-tier content variant — adjusts gap/alignment around leadingIcon slot. */
      topVariant?: TableCardCellTopVariant;
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
      /** Bottom-tier content variant — encodes layout/padding/alignment per Figma 1438:4957.
       *  Set to 'form-field' to centre form controls (NumberInput / Toggle / Button)
       *  vertically per Figma 3453:7841. */
      bottomVariant?: TableCardCellBottomVariant;
    });

/**
 * TableCardCell — Figma: Inset Table Row - Card - Top Tier (3453:7497) /
 * Default Table - Card - Top Tier (1432:2527) + Bottom Tier (1438:4957).
 *
 * Card-style cell for inset or default tables. Stack one Top Tier row + N
 * Bottom Tier rows inside a `<tr>`/`<td>` matrix wrapped in a rounded outer
 * div to form a product card with header + variant rows.
 *
 * Set `mode="default"` for standard-table padding (pl-24 pr-12); omit for
 * inset-table padding (pl-12 pr-6, the legacy baseline).
 *
 * Outer card recipe (caller's responsibility):
 * ```tsx
 * <div className="rounded-[var(--radius-4)] overflow-hidden">
 *   <table className="border-collapse w-full table-fixed">
 *     <tbody>
 *       <tr><TableCardCell mode="default" tier="top" column="first">...</TableCardCell> ...</tr>
 *       <tr><TableCardCell mode="default" tier="bottom" row="first" column="first">...</TableCardCell> ...</tr>
 *       <tr><TableCardCell mode="default" tier="bottom" row="last" column="first">...</TableCardCell> ...</tr>
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

// Top Tier horizontal padding — mode-aware.
const topTierHPad: Record<TableCardCellMode, string> = {
  inset: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  default: 'pl-[var(--spacing-24)] pr-[var(--spacing-12)]',
};

// Top Tier base classes — Figma 3453:7574 (Default/Inset state) /
// 1432:2527 (Default mode).
// Constant fill --table-body-hover-fill (#fafafb) in BOTH default and
// hover; hover applies bold + green to the text span via the parent
// <tr className="group/row">. See spec §"Hover behavior".
const topTierBaseClasses = [
  // Outer flex layout per Figma. py-12 is shared across modes.
  'relative flex items-start w-full',
  'py-[var(--spacing-12)]',
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
  // Center cells do not draw internal vertical dividers.
  center: 'border-l-0',
  // Last column rounds top-right and paints right border to close the
  // box, without an internal left divider.
  last: 'rounded-tr-[var(--radius-4)] border-l-0 border-r',
};

/**
 * Gap between leading-icon and text content, keyed by topVariant.
 * App Icon / User Icon → 4px (tighter fit per Figma 1432:2527).
 * Everything else retains the 12px default.
 */
const topTierGapClass = (variant: TableCardCellTopVariant): string => {
  if (variant === 'app-icon' || variant === 'user-icon') return 'gap-[var(--spacing-4)]';
  return 'gap-[var(--spacing-12)]';
};

// Bottom Tier base classes — Figma 3453:7822 (Default state) +
// 3453:8104 (Hover). Default fill white; hover flips to --table-body-
// hover-fill via parent <tr className="group/row">.
const bottomTierBaseClasses = [
  // Outer flex layout per Figma.
  'relative flex w-full',
  // Default fill — flips to hover-fill on parent-row hover.
  'bg-[var(--table-body-fill)]',
  'group-hover/row:bg-[var(--table-body-hover-fill)]',
  // Border colour.
  'border-[color:var(--table-divider-border)] border-solid',
  // Left always painted (every cell paints its own left edge).
  'border-l',
  'transition-colors duration-150',
].join(' ');

// Bottom Tier horizontal padding — mode-aware.
// action-button / status-toggle on the last column swap padding regardless of
// mode (trailing-action padding flip per Figma 1438:4957).
const bottomTierHPad = (
  mode: TableCardCellMode,
  variant: TableCardCellBottomVariant,
  column: TableColumnPosition,
): string => {
  const isTrailingAction = (variant === 'action-button' || variant === 'status-toggle') && column === 'last';
  if (isTrailingAction) {
    // Last column of action/toggle variants always uses reversed padding so the
    // control sits flush with the card's right edge.
    return 'pl-[var(--spacing-12)] pr-[var(--spacing-24)]';
  }
  if (mode === 'default') return 'pl-[var(--spacing-24)] pr-[var(--spacing-12)]';
  return 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]';
};

// Column-specific borders + corner radii.
const bottomTierColumnClasses: Record<TableColumnPosition, string> = {
  first: '',
  center: '',
  last: 'border-r',
};

// Row-specific vertical padding + bottom border.
// Inset mode: first pt-12 pb-6 / middle py-6 / last pt-6 pb-12.
// Default mode: first py-12 / middle py-6 / last pt-6 pb-24.
const bottomTierRowClasses = (mode: TableCardCellMode, row: TableCardCellRow): string => {
  if (mode === 'default') {
    return {
      first: 'pt-[var(--spacing-12)] pb-[var(--spacing-12)]',
      middle: 'py-[var(--spacing-6)]',
      last: 'pt-[var(--spacing-12)] pb-[var(--spacing-24)] border-b',
    }[row];
  }
  return {
    first: 'pt-[var(--spacing-12)] pb-[var(--spacing-6)]',
    middle: 'py-[var(--spacing-6)]',
    last: 'pt-[var(--spacing-6)] pb-[var(--spacing-12)] border-b',
  }[row];
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
const topTierHoverTextClass = 'sg-table-card-top-primary';

// Top Tier text span — body 14/21 in --table-body-text. Hover-state
// classes layered on top via group-hover/row.
const topTierTextSpanClasses = [
  'flex items-center gap-[var(--spacing-4)] min-w-0 flex-1',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
  'font-[var(--font-weight-regular)]',
  'text-[color:var(--table-body-text)]',
  'transition-colors duration-150',
].join(' ');

export const TableCardCell = (props: TableCardCellProps) => {
  const { children, column, checkbox, leadingIcon, trailing, hovered, selected, className = '', mode = 'inset' } = props;

  if (props.tier === 'top') {
    const topVariant = props.topVariant ?? 'default';
    // Selection wins over everything (matches TableCell behaviour).
    const fillOverride = selected ? '!bg-[var(--color-sys-blue-lighter)]' : '';
    // Forced-hover for Storybook / controlled state — apply bold + green
    // directly without waiting for :hover.
    const primaryColumnHoverText = column === 'first' ? topTierHoverTextClass : '';
    const forcedHoverText = hovered && column === 'first'
      ? 'sg-table-card-top-primary-hover'
      : '';

    return (
      <div
        className={[
          topTierBaseClasses,
          topTierHPad[mode],
          topTierGapClass(topVariant),
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
            primaryColumnHoverText,
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
  const { row } = props;
  const bottomVariant = props.bottomVariant ?? 'default';
  const isFormField = bottomVariant === 'form-field';
  const fillOverride = selected ? '!bg-[var(--color-sys-blue-lighter)]' : '';
  const forcedHoverFill = hovered
    ? '!bg-[var(--table-body-hover-fill)]'
    : '';
  const innerAlignment = isFormField ? 'items-center' : 'items-start';

  return (
    <div
      className={[
        bottomTierBaseClasses,
        bottomTierHPad(mode, bottomVariant, column),
        bottomTierColumnClasses[column],
        bottomTierRowClasses(mode, row),
        bottomTierCornerClasses(column, row),
        innerAlignment,
        'gap-[var(--spacing-12)]',
        forcedHoverFill,
        // emitted last so the `!important` from fillOverride wins the source-order tie against forcedHoverFill
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
          bottomTierTextSpanClasses,
          isFormField ? 'items-center' : 'items-start',
          textAlignmentClass[column],
        ].join(' ')}
      >
        {children}
      </span>
      {trailing && <span className="shrink-0 inline-flex items-center">{trailing}</span>}
    </div>
  );
};
