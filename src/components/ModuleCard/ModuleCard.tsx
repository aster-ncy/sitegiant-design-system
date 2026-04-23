import { Icon, type IconName } from '../Icon';

export interface ModuleCardProps {
  /** Icon name from the SiteGiant icon library, rendered in the circular container */
  icon: IconName;
  /** Module title (e.g., "General", "Payment", "Shipping") */
  title: string;
  /** Supporting description — clamps to 2 lines */
  description: string;
  /** Click handler — the whole card is a clickable navigation target */
  onClick?: () => void;
  /** Disables the clickable state while keeping the card visible */
  disabled?: boolean;
  /** Extra classes on the outer card */
  className?: string;
}

/**
 * Horizontal navigation card for an app/settings module.
 *
 * Used on settings index pages where each module (General, Payment, Shipping…)
 * is entered by tapping the card. The whole card is a clickable target with
 * a circular icon on the left and title + description stacked on the right.
 *
 * The icon container background is fixed to
 * `--button-basic-clicked-fill` per Figma spec (the pressed-state blue from
 * the Button/basic variant). The icon itself renders in white.
 */
export const ModuleCard = ({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  className = '',
}: ModuleCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        // Layout
        'w-[320px] flex items-start gap-[var(--spacing-12)]',
        'px-[var(--spacing-24)] py-[var(--spacing-20)]',
        // Surface
        'bg-[var(--color-surface-bg)]',
        'rounded-[var(--radius-8)]',
        'text-left',
        // Interaction — the whole card is the clickable surface
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:brightness-95 active:brightness-90 transition-[filter] duration-150',
        // Keyboard focus — readable against the light surface
        'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--button-primary-default-fill)]',
        // Reset default button chrome so the card behaves like a surface
        'border-0 font-[family-name:var(--font-sans)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Circular icon container — size is driven by icon (28) + padding (16×2) = 60px square, then rounded-full */}
      <div
        className={[
          'shrink-0 flex items-center justify-center',
          'p-[var(--spacing-16)]',
          'rounded-full',
          'bg-[var(--button-basic-clicked-fill)]',
        ].join(' ')}
      >
        <Icon name={icon} size={28} color="var(--color-white)" />
      </div>

      {/* Text stack */}
      <div className="flex-1 flex flex-col items-start gap-[var(--spacing-4)] min-w-0">
        <p
          className={[
            'text-[length:var(--text-16)] leading-[var(--leading-20)]',
            'font-[var(--font-weight-medium)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}
        >
          {title}
        </p>
        <p
          className={[
            'self-stretch',
            'text-[length:var(--text-12)] leading-[var(--leading-16)]',
            'font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-info)]',
            'line-clamp-2',
          ].join(' ')}
        >
          {description}
        </p>
      </div>
    </button>
  );
};
