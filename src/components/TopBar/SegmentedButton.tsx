import { Icon, type IconName } from '../Icon';

export interface SegmentedOption {
  /** Stable id — also passed back from onChange. */
  value: string;
  /** Icon shown inside the segment. */
  icon: IconName;
  /** Accessible label for the segment. */
  label: string;
}

export interface SegmentedButtonProps {
  options: SegmentedOption[];
  /** Selected value (controlled). */
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Compact icon-only segmented button used in the Webstore Builder
 * topbar (desktop / tablet / mobile preview switcher). Each segment is
 * 32×32; the selected segment paints with the primary fill and a white
 * icon, others use the default surface.
 */
export const SegmentedButton = ({
  options,
  value,
  onChange,
  className = '',
}: SegmentedButtonProps) => {
  return (
    <div
      role="tablist"
      className={['inline-flex', className].filter(Boolean).join(' ')}
    >
      {options.map((opt, i) => {
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        const isSelected = opt.value === value;
        // Rounded corners only on the outer edges of the group.
        const radius = [
          isFirst ? 'rounded-l-[var(--radius-4)]' : '',
          isLast ? 'rounded-r-[var(--radius-4)]' : '',
        ]
          .filter(Boolean)
          .join(' ');
        const fill = isSelected
          ? 'bg-[var(--color-tab-small-selected-primary-fill)]'
          : 'bg-[var(--color-tab-small-default-fill)]';
        const iconColor = isSelected
          ? 'text-[color:var(--color-tab-small-icon-ondark)]'
          : 'text-[color:var(--color-tab-small-icon-default)]';
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={opt.label}
            onClick={() => onChange?.(opt.value)}
            className={[
              'size-8 p-[var(--spacing-8)] inline-flex items-center justify-center',
              'border border-[color:var(--color-tab-small-border)]',
              // Collapse the shared inner border so neighbours don't double up.
              !isFirst ? '-ml-px' : '',
              radius,
              fill,
              'transition-colors duration-150',
              'focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-1',
              'focus-visible:ring-[var(--button-primary-default-fill)]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Icon name={opt.icon} size={16} className={iconColor} />
          </button>
        );
      })}
    </div>
  );
};
