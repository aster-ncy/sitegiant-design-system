import type { ReactNode } from 'react';

export interface TableCardCellListingProperty {
  label: string;
  value: string;
  modifier?: string;
}

export interface TableCardCellListingProps {
  /** Product image node (e.g. <ProductImage size="lg" .../>). */
  image: ReactNode;
  /** Badge overlaid on the image (e.g. quantity badge). */
  badge?: ReactNode;
  /** Pip node rendered above the product name (e.g. Published status). */
  pip?: ReactNode;
  /** Product name — bold, max 2 lines. */
  productName: string;
  /** Variant row — caption size. */
  variant?: { label: string; value: string };
  /** SKU row — caption size. */
  sku?: { label: string; value: string };
  /**
   * Extra property rows — caption-small size with medium weight value.
   * Hidden when mode='collapse'.
   */
  properties?: TableCardCellListingProperty[];
  /**
   * Trailing content rendered after the property rows — e.g. "RM299.00 x 1".
   * Visible in both modes.
   */
  extras?: ReactNode;
  /**
   * 'expand' (default) shows properties.
   * 'collapse' hides properties.
   */
  mode?: 'collapse' | 'expand';
}

const ListingInfoRow = ({
  label,
  value,
  medium = false,
}: {
  label: string;
  value: string;
  medium?: boolean;
}) => (
  <span className="inline-flex max-w-full items-start gap-[var(--spacing-4)]">
    <span className="shrink-0 whitespace-nowrap text-[color:var(--text-default-text-info)]">{label}</span>
    <span
      className={[
        'min-w-0 truncate text-[color:var(--text-default-text-primary)]',
        medium ? 'font-[var(--font-weight-medium)]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value}
    </span>
  </span>
);

/**
 * TableCardCellListing — inner content shape for a bottom-tier listing cell.
 *
 * Renders image (+ optional badge) + product info stack (pip / name /
 * variant+SKU rows / property rows). Compose inside a bottom-tier
 * TableCardCell with bottomVariant="listing":
 *
 * ```tsx
 * <TableCardCell mode="default" tier="bottom" row="last" column="first" bottomVariant="listing">
 *   <TableCardCellListing
 *     image={<ProductImage src={src} alt="…" size="lg" />}
 *     badge={<ProductBadge label="1" />}
 *     pip={<Pip type="success" label="Published" />}
 *     productName="DYNAMO 4in1 Laundry Capsules"
 *     variant={{ label: 'Variant:', value: 'Red' }}
 *     sku={{ label: 'SKU:', value: '1902839204' }}
 *     properties={[{ label: 'Product Property', value: 'Property (+RM0.00)' }]}
 *   />
 * </TableCardCell>
 * ```
 *
 * Figma: 1458:3174 (listing inner content).
 */
export const TableCardCellListing = ({
  image,
  badge,
  pip,
  productName,
  variant,
  sku,
  properties,
  extras,
  mode = 'expand',
}: TableCardCellListingProps) => {
  const showProperties = mode === 'expand' && properties && properties.length > 0;
  const hasCaptionRows = variant || sku;

  return (
    <span className="flex w-full items-start gap-[var(--spacing-12)]">
      <span className="relative inline-flex shrink-0 overflow-visible">
        {image}
        {badge && badge}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-4)]">
        {pip && pip}
        <span className="max-h-[34px] overflow-hidden font-[family-name:var(--font-sans)] text-[length:var(--table-body-size)] font-[var(--font-weight-bold)] leading-[var(--leading-17)] text-[color:var(--text-default-text-primary)]">
          {productName}
        </span>
        {(hasCaptionRows || showProperties) && (
          <span className="flex w-full min-w-0 flex-col gap-[var(--spacing-8)]">
            {hasCaptionRows && (
              <span className="flex flex-col gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)]">
                {variant && <ListingInfoRow label={variant.label} value={variant.value} />}
                {sku && <ListingInfoRow label={sku.label} value={sku.value} />}
              </span>
            )}
            {showProperties && (
              <span className="flex flex-col gap-[var(--spacing-4)] text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)]">
                {properties!.map((prop, index) => (
                  <ListingInfoRow
                    key={index}
                    label={prop.label}
                    value={prop.modifier ? `${prop.value} ${prop.modifier}` : prop.value}
                    medium
                  />
                ))}
              </span>
            )}
          </span>
        )}
        {extras && <span className="text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--text-default-text-primary)]">{extras}</span>}
      </span>
    </span>
  );
};
