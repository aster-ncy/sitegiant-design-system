import { EllipsisButton } from '../Button/EllipsisButton';

export interface AccountingCardProps {
  /** URL of the accounting software / account provider logo */
  logoSrc: string;
  /** Alt text for the logo — use the provider name */
  logoAlt?: string;
  /** Display label (account name, company, reference number, etc.) */
  label: string;
  /** Whole-card click handler (view details, open account) */
  onClick?: () => void;
  /** Ellipsis menu click handler (edit, disconnect, etc.) */
  onMenuClick?: () => void;
  /** Extra classes on the outer card */
  className?: string;
}

/**
 * Identifier card for a connected accounting / finance account.
 *
 * Left: 48×48 provider logo. Middle: label clamped to 3 lines. Right: ellipsis
 * menu. The whole card is clickable; the ellipsis dispatches its own handler
 * (stopPropagation so the card click doesn't also fire).
 *
 * Width is flexible — the card stretches to fill its container by default.
 * Consumers can pin it to a fixed width via className (e.g., "w-[280px]") if
 * rendering in a fixed grid.
 */
export const AccountingCard = ({
  logoSrc,
  logoAlt = '',
  label,
  onClick,
  onMenuClick,
  className = '',
}: AccountingCardProps) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={[
        'relative',
        'inline-flex items-start gap-[var(--spacing-12)]',
        // Asymmetric padding per Figma: extra right padding reserves space for
        // the absolutely-positioned ellipsis button.
        'pl-[var(--spacing-20)] pr-[var(--spacing-48)] py-[var(--spacing-20)]',
        'bg-[var(--color-surface-card)]',
        'rounded-[var(--radius-12)]',
        'border border-[var(--color-surface-card-border)]',
        onClick
          ? [
              'cursor-pointer',
              'transition-[filter,box-shadow] duration-150',
              'hover:brightness-[0.98] hover:shadow-[var(--shadow-sm)]',
              'active:brightness-[0.96]',
              'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--button-primary-default-fill)]',
            ].join(' ')
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Provider logo — consumer-supplied image */}
      <img
        src={logoSrc}
        alt={logoAlt}
        className="shrink-0 w-[var(--spacing-48)] h-[var(--spacing-48)] object-contain rounded-[var(--radius-4)]"
      />

      {/* Label — clamped to 3 lines, capped width for predictable wrapping */}
      <div className="flex flex-col justify-center gap-[var(--spacing-4)] min-w-0">
        <p
          className={[
            'max-w-[160px]',
            'text-[length:var(--text-14)] leading-[var(--leading-20)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
            'text-[color:var(--color-text-primary)]',
            'line-clamp-3',
          ].join(' ')}
        >
          {label}
        </p>
      </div>

      {/* Ellipsis menu — positioned top-right. Stops propagation so clicking
          the ellipsis doesn't also trigger the card's onClick. */}
      <div
        className="absolute top-[var(--spacing-8)] right-[var(--spacing-8)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <EllipsisButton variant="default" onClick={onMenuClick} />
      </div>
    </div>
  );
};
