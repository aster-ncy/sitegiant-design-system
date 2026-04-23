import type { ReactNode } from 'react';
import { Icon } from '../Icon';

export type DropdownMenuItemState = 'default' | 'hover' | 'selected';

export interface DropdownMenuItemProps {
  label: string;
  /** Bold highlighted portion shown after the label */
  highlight?: string;
  /** Leading visual (country flag, app icon, etc.) rendered at 18×18 */
  leading?: ReactNode;
  /** Forces a visual state. Omit to use native hover/click */
  state?: DropdownMenuItemState;
  /** Show the check icon at the end (true for selected items) */
  selected?: boolean;
  /** Called when the row is clicked */
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const stateBackground: Record<DropdownMenuItemState, string> = {
  default: 'bg-[var(--dropdown-default-fill)]',
  hover: 'bg-[var(--dropdown-hover-fill)]',
  selected: 'bg-[var(--dropdown-selected-fill)]',
};

export const DropdownMenuItem = ({
  label,
  highlight,
  leading,
  state,
  selected = false,
  onClick,
  disabled = false,
  className = '',
}: DropdownMenuItemProps) => {
  const forcedBg = state ? stateBackground[state] : '';
  const autoHover = state ? '' : 'hover:bg-[var(--dropdown-hover-fill)]';

  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={disabled ? undefined : onClick}
      className={[
        'flex items-center gap-[var(--spacing-8)]',
        'px-[var(--spacing-14)] py-[var(--spacing-6)]',
        'font-[family-name:var(--font-sans)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        forcedBg || 'bg-[var(--dropdown-default-fill)]',
        autoHover,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leading && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {leading}
        </span>
      )}
      <div className="flex-1 flex items-center gap-[var(--spacing-4)] overflow-hidden">
        <span
          className={[
            'text-[length:var(--text-14)] leading-[var(--leading-16)]',
            'font-[var(--font-weight-regular)]',
            'text-[color:var(--dropdown-value-text)]',
            'truncate',
          ].join(' ')}
        >
          {label}
        </span>
        {highlight && (
          <span
            className={[
              'text-[length:var(--text-14)] leading-[var(--leading-16)]',
              'font-[var(--font-weight-bold)]',
              'text-[color:var(--dropdown-value-text)]',
            ].join(' ')}
          >
            {highlight}
          </span>
        )}
      </div>
      {selected && (
        <Icon name="check-stroke" size={18} color="var(--color-icon-primary)" />
      )}
    </div>
  );
};
