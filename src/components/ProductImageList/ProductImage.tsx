export type ProductImageSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProductImageProps {
  /** Image URL. Omit to render the empty-state placeholder background only. */
  src?: string;
  alt?: string;
  /** sm=40 · md=44 · lg=56 · xl=112 (px) */
  size?: ProductImageSize;
  /** Rendered over the image (e.g. the +N overflow badge from ProductImageList). */
  overlay?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ProductImageSize, string> = {
  sm: 'w-[40px] h-[40px]',
  md: 'w-[44px] h-[44px]',
  lg: 'w-[56px] h-[56px]',
  xl: 'w-[112px] h-[112px]',
};

/**
 * Single product thumbnail tile: placeholder-fill background with a 1px border
 * and 4px corner radius. Image fills the tile; when omitted, the placeholder
 * background shows through.
 */
export const ProductImage = ({
  src,
  alt = '',
  size = 'md',
  overlay,
  className = '',
}: ProductImageProps) => {
  return (
    <div
      className={[
        'relative shrink-0 box-border overflow-hidden',
        'rounded-[var(--radius-4)]',
        'border border-[color:var(--color-product-image-border)]',
        'bg-[var(--color-surface-empty-state-placeholder-fill)]',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
      {overlay}
    </div>
  );
};
