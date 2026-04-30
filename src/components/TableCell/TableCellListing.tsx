import type { ReactNode } from 'react';

export interface TableCellListingInfoRow {
  /** Caption label, e.g. "iSKU". Caption-slim 12/15 in --color-text-info. */
  label: ReactNode;
  /** Caption value, caption-slim 12/15 in --color-text-primary. */
  value: ReactNode;
}

export interface TableCellListingProps {
  /**
   * Leading product image. Caller passes a `<ProductImage size="lg">` (56×56)
   * or any other ReactNode that fits the slot. The slot itself is `shrink-0`
   * so the product info column flexes to fill remaining width.
   */
  image?: ReactNode;
  /**
   * Tag rendered above the product name — typically a `<Pip>` indicating
   * publish/sync status (e.g. "Published", "Out of stock").
   */
  tag?: ReactNode;
  /**
   * Product display name. Renders body-slim 14/17 bold; wraps to two
   * lines (clamped at max-h-[34px] for 2 × 17 per Figma 1248:8402).
   */
  productName: ReactNode;
  /**
   * Caption-slim label/value rows beneath the name (e.g. iSKU, SKU).
   * Each row is `flex gap-4 items-start`; rows separated by gap-4 in the
   * outer column.
   */
  infoRows?: TableCellListingInfoRow[];
  /**
   * Trailing extras row — typically channel pip + "N more SKUs" textlink.
   * Caller composes their own children (icon + text-link, etc.); this slot
   * just adds a final row to the column with the same gap-4 rhythm.
   */
  extras?: ReactNode;
}

const productNameClasses = [
  'block w-full max-h-[34px] overflow-hidden',
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--table-body-size)] leading-[var(--leading-17)]',
  'font-[var(--font-weight-bold)]',
  'text-[color:var(--color-text-primary)]',
].join(' ');

// Label stays shrink-0 + nowrap (short fixed strings like "iSKU", "SKU",
// "Variation"). Value flexes to fill remaining row width and truncates
// with an ellipsis when it doesn't fit; the native `title` attribute
// (added at render time when value is a plain string) gives a hover
// tooltip with the full text.
const captionSlimBase = [
  'font-[family-name:var(--font-sans)]',
  'text-[length:var(--general-caption-size)] leading-[var(--leading-15)]',
].join(' ');

const captionSlimLabelClasses = [
  captionSlimBase,
  'shrink-0 whitespace-nowrap',
  'text-[color:var(--color-text-info)]',
].join(' ');

const captionSlimValueClasses = [
  captionSlimBase,
  'min-w-0 flex-1 truncate',
  'text-[color:var(--color-text-primary)]',
].join(' ');

/**
 * TableCellListing — Figma: Inset Table Row - Listing (1262:9692, First
 * Column symbol 1248:8395, Center Column symbol 1248:8996).
 *
 * Product-row content: leading image + product-info column (tag, name,
 * info rows, extras). Slots inside `<TableCell inset>` as `children`.
 *
 * Padding override (s9 First Column): Figma authors `pl-12 pr-6 py-12`,
 * different from the base inset cell's `px-6 py-12`. The cell wrapper
 * still owns the padding — pass `className="!pl-[var(--spacing-12)]"`
 * to the surrounding `<TableCell column='first' inset>` to opt in.
 *
 * Tokens authoritative from Figma:
 * - outer flex: gap-12 items-start
 * - product info column: flex-col gap-4 items-start, flex-1 min-w-0
 * - product name: body-slim 14/17 bold (max-h 34px to clamp at two lines)
 * - info row label/value: caption-slim 12/15 (info / primary). Labels
 *   are shrink-0 + nowrap; values flex to fill row width and truncate
 *   with ellipsis when they exceed available width — long values get
 *   a native `title` tooltip so hovering reveals the full string
 *   (instead of cropping mid-glyph as Figma's static frames do).
 * - extras row: flex gap-20 items-start (caller composes children)
 */
export const TableCellListing = ({
  image,
  tag,
  productName,
  infoRows,
  extras,
}: TableCellListingProps) => {
  return (
    <div className="flex w-full gap-[var(--spacing-12)] items-start">
      {image && <span className="shrink-0 inline-flex">{image}</span>}
      <div className="flex flex-1 min-w-0 flex-col gap-[var(--spacing-4)] items-start">
        {tag && <div className="shrink-0">{tag}</div>}
        <span className={productNameClasses}>{productName}</span>
        {infoRows?.map((row, index) => (
          <div
            key={index}
            className="flex w-full min-w-0 gap-[var(--spacing-4)] items-start"
          >
            <span className={captionSlimLabelClasses}>{row.label}</span>
            <span
              className={captionSlimValueClasses}
              title={typeof row.value === 'string' ? row.value : undefined}
            >
              {row.value}
            </span>
          </div>
        ))}
        {extras && (
          <div className="flex gap-[var(--spacing-20)] items-start shrink-0">
            {extras}
          </div>
        )}
      </div>
    </div>
  );
};
