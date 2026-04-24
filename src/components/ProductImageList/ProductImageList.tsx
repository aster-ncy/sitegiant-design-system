import { ProductImage, type ProductImageSize } from './ProductImage';

export interface ProductImageListItem {
  src?: string;
  alt?: string;
}

export interface ProductImageListProps {
  /** Images to render in order. */
  items: ProductImageListItem[];
  /** Size applied to every thumbnail. */
  size?: ProductImageSize;
  /** Max thumbnails to show before collapsing the remainder into a +N overlay on the last visible tile. */
  maxVisible?: number;
  /** Spacing between thumbnails. Defaults to spacing-8. */
  gap?: string;
  className?: string;
}

// Use leading-none on the overlay text so flex centering aligns the glyph box
// (not the line-box), keeping "+N" optically centred in the tile.
const overlayTextClass =
  'text-[length:var(--text-12)] leading-none';

export const ProductImageList = ({
  items,
  size = 'md',
  maxVisible,
  gap = 'var(--spacing-8)',
  className = '',
}: ProductImageListProps) => {
  const hasOverflow = typeof maxVisible === 'number' && items.length > maxVisible;
  const visible = hasOverflow ? items.slice(0, maxVisible) : items;
  const remainder = hasOverflow ? items.length - maxVisible : 0;

  return (
    <div
      className={[
        'inline-flex items-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gap }}
    >
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        const showOverlay = isLast && hasOverflow;
        return (
          <ProductImage
            key={i}
            src={item.src}
            alt={item.alt}
            size={size}
            overlay={
              showOverlay ? (
                <div
                  className={[
                    'absolute inset-0 flex items-center justify-center',
                    'bg-[var(--color-overlay-50)]',
                    'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
                    'text-[color:var(--color-text-ondark)]',
                    overlayTextClass,
                  ].join(' ')}
                >
                  +{remainder}
                </div>
              ) : undefined
            }
          />
        );
      })}
    </div>
  );
};
