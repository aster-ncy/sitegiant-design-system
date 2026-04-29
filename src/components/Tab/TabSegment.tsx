import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export type TabSize = 'sm' | 'lg';
export type TabSelectedVariant = 'default' | 'primary';
export type TabSegmentType = 'text' | 'icon';
export type SegmentPosition = 'first' | 'center' | 'last' | 'single';

export interface TabSegmentProps {
  value: string;
  type?: TabSegmentType;
  icon?: IconName;
  children?: ReactNode;
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
  /**
   * Extra classes applied to the inner <Icon> element (icon-type segments only).
   * Use this when the toolbar context needs to override icon color — the
   * segment's wrapper-level `className` cannot reach the icon, which sets
   * its own `text-[color:...]` directly.
   */
  iconClassName?: string;
  /** Injected by <Tab>. Do not pass directly. */
  __position?: SegmentPosition;
  /** Injected by <Tab>. Do not pass directly. */
  __isSelected?: boolean;
  /** Injected by <Tab>. Do not pass directly. */
  __selectedVariant?: TabSelectedVariant;
  /** Injected by <Tab>. Do not pass directly. */
  __size?: TabSize;
  /** Injected by <Tab>. Do not pass directly. */
  __onClick?: () => void;
}

const radiusByPosition: Record<SegmentPosition, string> = {
  first: 'rounded-l-[var(--radius-4)]',
  center: '',
  last: 'rounded-r-[var(--radius-4)]',
  single: 'rounded-[var(--radius-4)]',
};

const paddingBySizeAndType: Record<TabSize, Record<TabSegmentType, string>> = {
  sm: {
    text: 'h-[33px] px-[var(--spacing-16)] py-[var(--spacing-8)]',
    icon: 'h-[33px] p-[var(--spacing-8)]',
  },
  lg: {
    text: 'px-[var(--spacing-16)] py-[var(--spacing-12)]',
    icon: 'p-[var(--spacing-12)]',
  },
};

export const TabSegment = ({
  type = 'text',
  icon,
  children,
  disabled = false,
  className = '',
  iconClassName = '',
  'aria-label': ariaLabel,
  __position = 'single',
  __isSelected = false,
  __selectedVariant = 'default',
  __size = 'sm',
  __onClick,
}: TabSegmentProps) => {
  const fill = !__isSelected
    ? 'bg-[var(--color-tab-small-default-fill)]'
    : __selectedVariant === 'primary'
      ? 'bg-[var(--color-tab-small-selected-primary-fill)]'
      : 'bg-[var(--color-tab-small-selected-fill)]';

  const textColor =
    __isSelected && __selectedVariant === 'primary'
      ? 'text-[color:var(--color-tab-small-text-ondark)]'
      : 'text-[color:var(--color-tab-small-text)]';

  const iconColor =
    __isSelected && __selectedVariant === 'primary'
      ? 'text-[color:var(--color-tab-small-icon-ondark)]'
      : 'text-[color:var(--color-tab-small-icon-default)]';

  const isLast = __position === 'last' || __position === 'single';

  const classes = [
    'inline-flex items-center justify-center shrink-0 relative',
    paddingBySizeAndType[__size][type],
    'border border-solid border-[color:var(--color-tab-small-border)]',
    radiusByPosition[__position],
    fill,
    isLast ? '' : 'mr-[-1px]',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-[var(--button-primary-default-fill)]',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (disabled) return;
    __onClick?.();
  };

  const labelText = typeof children === 'string' ? children : undefined;
  const computedAriaLabel = ariaLabel ?? labelText;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={__isSelected}
      aria-label={type === 'icon' ? computedAriaLabel : undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={classes}
    >
      {type === 'icon' ? (
        icon ? (
          <Icon
            name={icon}
            size={17}
            className={[iconColor, iconClassName].filter(Boolean).join(' ')}
          />
        ) : null
      ) : (
        <span
          className={[
            "font-[family-name:var(--general-font-family)]",
            'whitespace-nowrap',
            'text-[length:var(--tab-small-size)]',
            'leading-[var(--tab-small-lineheight)]',
            'font-[number:var(--tab-small-weight)]',
            textColor,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </span>
      )}
    </button>
  );
};

