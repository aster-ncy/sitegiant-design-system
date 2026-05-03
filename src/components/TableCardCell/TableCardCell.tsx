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
export const TableCardCell = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: TableCardCellProps
) => {
  // Implementation in Task 2+.
  return null as unknown as JSX.Element;
};
