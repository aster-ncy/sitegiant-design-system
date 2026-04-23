import type { ReactNode } from 'react';
import { EllipsisButton } from '../Button/EllipsisButton';
import { Icon } from '../Icon/Icon';
import { TextLink } from '../TextLink/TextLink';
import { AppTagGroup, type AppTagGroupItem } from '../AppTagGroup';

export type AppImageCardType = 'default' | 'subscribed';

export interface AppImageCardProps {
  /** Feature image URL rendered at the top of the card */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Caption text — rendered with a fixed 3-line clamp */
  caption: string;
  /**
   * Card state. Changes the primary CTA:
   *  - 'default' → "Subscribe" (basic TextLink, primary action)
   *  - 'subscribed' → "Manage" (subtle TextLink with settings icon)
   */
  type?: AppImageCardType;
  /**
   * Tags rendered in the top-right overlay. Two ways to provide them:
   *  - Pass `tags` array for the common case (matches AppTagGroup's API)
   *  - Pass `tagGroup` React node for full flexibility (custom tag composition)
   * If both are provided, `tagGroup` wins.
   */
  tags?: AppTagGroupItem[];
  /** Custom tag group node — takes precedence over `tags` */
  tagGroup?: ReactNode;
  /** Override the CTA label. Defaults: "Subscribe" / "Manage" */
  ctaLabel?: string;
  /** Called when the CTA (Subscribe / Manage) is clicked */
  onCtaClick?: () => void;
  /** Called when the ellipsis menu icon is clicked */
  onMenuClick?: () => void;
  /** Extra classes on the outer card */
  className?: string;
}

/**
 * App/feature marketplace card.
 *
 * Used on discovery/listing surfaces where the user can subscribe to or manage
 * an app. Image sits on top; caption + action row below. Optional tags overlay
 * the top-right corner of the image.
 *
 * Composition:
 * - `EllipsisButton` on the left of the action row for secondary actions
 * - `TextLink` on the right for the primary CTA (Subscribe / Manage)
 * - `AppTagGroup` absolutely positioned at top-right of the card
 */
export const AppImageCard = ({
  imageSrc,
  imageAlt = '',
  caption,
  type = 'default',
  tags,
  tagGroup,
  ctaLabel,
  onCtaClick,
  onMenuClick,
  className = '',
}: AppImageCardProps) => {
  const isSubscribed = type === 'subscribed';
  const resolvedCtaLabel = ctaLabel ?? (isSubscribed ? 'Manage' : 'Subscribe');

  const overlay = tagGroup ?? (tags && tags.length > 0 ? <AppTagGroup tags={tags} /> : null);

  return (
    <div
      className={[
        'relative',
        'w-[288px] min-w-[288px] max-w-[288px]',
        'pb-[var(--spacing-20)]',
        'bg-[var(--color-surface-card)]',
        'rounded-[var(--radius-12)]',
        'border border-[var(--color-surface-card-border)]',
        'inline-flex flex-col items-center gap-[var(--spacing-12)]',
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Feature image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="self-stretch h-[96px] object-cover"
      />

      {/* Top-right tag overlay. Positioned inside the card chrome, at the top edge. */}
      {overlay && (
        <div className="absolute top-[6px] right-[5px] inline-flex items-start justify-end gap-[var(--spacing-4)]">
          {overlay}
        </div>
      )}

      {/* Info block: caption + action row */}
      <div className="self-stretch px-[var(--spacing-12)] flex flex-col items-end gap-[var(--spacing-12)]">
        {/* Caption — fixed 3-line clamp with truncation via line-clamp-3 */}
        <p
          className={[
            'self-stretch',
            'text-[length:var(--text-12)] leading-[var(--leading-16)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-info)]',
            'line-clamp-3',
            // Reserve the full 3-line height so cards with short captions stay
            // visually consistent with cards whose captions fill the space.
            'min-h-[calc(var(--leading-16)*3)]',
          ].join(' ')}
        >
          {caption}
        </p>

        {/* Action row */}
        <div className="inline-flex items-center gap-[var(--spacing-16)]">
          <EllipsisButton variant="default" onClick={onMenuClick} />
          <TextLink
            variant={isSubscribed ? 'subtle' : 'basic'}
            label={resolvedCtaLabel}
            iconPosition={isSubscribed ? 'left' : 'none'}
            icon={isSubscribed ? <Icon name="settings" size={17} /> : undefined}
            onClick={onCtaClick}
          />
        </div>
      </div>
    </div>
  );
};
