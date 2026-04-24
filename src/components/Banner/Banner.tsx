import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export type BannerVariant = 'success' | 'info' | 'warning' | 'danger';

export interface BannerProps {
  /** Visual variant controlling colors */
  variant?: BannerVariant;
  /** Main title text */
  title?: string;
  /** Description/body text */
  description?: string;
  /** Optional icon name from Icon component */
  icon?: IconName;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Children for custom content */
  children?: ReactNode;
  /** Extra Tailwind classes */
  className?: string;
}

const variantClasses: Record<BannerVariant, { bg: string; border: string; iconColor: string; titleColor: string; descColor: string }> = {
  success: {
    bg: 'bg-[var(--color-sys-green-lighter)]',
    border: 'border-l-[var(--border-4)] border-l-[var(--color-sys-green-DEFAULT)]',
    iconColor: 'var(--color-sys-green-dark)',
    titleColor: 'text-[color:var(--color-sys-green-darker)]',
    descColor: 'text-[color:var(--color-sys-green-text)]',
  },
  info: {
    bg: 'bg-[var(--color-sys-blue-lighter)]',
    border: 'border-l-[var(--border-4)] border-l-[var(--color-sys-blue-DEFAULT)]',
    iconColor: 'var(--color-sys-blue-dark)',
    titleColor: 'text-[color:var(--color-sys-blue-darker)]',
    descColor: 'text-[color:var(--color-sys-blue-text)]',
  },
  warning: {
    bg: 'bg-[var(--color-sys-yellow-lighter)]',
    border: 'border-l-[var(--border-4)] border-l-[var(--color-sys-yellow-DEFAULT)]',
    iconColor: 'var(--color-sys-yellow-dark)',
    titleColor: 'text-[color:var(--color-sys-yellow-darker)]',
    descColor: 'text-[color:var(--color-sys-yellow-text)]',
  },
  danger: {
    bg: 'bg-[var(--color-sys-red-lighter)]',
    border: 'border-l-[var(--border-4)] border-l-[var(--color-sys-red-DEFAULT)]',
    iconColor: 'var(--color-sys-red-dark)',
    titleColor: 'text-[color:var(--color-sys-red-darker)]',
    descColor: 'text-[color:var(--color-sys-red-text)]',
  },
};

const defaultIcons: Record<BannerVariant, IconName> = {
  success: 'check-circle',
  info: 'info',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

export const Banner = ({
  variant = 'info',
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  children,
  className = '',
}: BannerProps) => {
  const styles = variantClasses[variant];
  const iconName = icon ?? defaultIcons[variant];

  return (
    <div
      className={[
        'relative flex items-start',
        'gap-[var(--spacing-12)]',
        'p-[var(--spacing-16)]',
        'rounded-[var(--radius-8)]',
        styles.bg,
        styles.border,
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="shrink-0 mt-[var(--spacing-1)]">
        <Icon name={iconName} size="md" color={styles.iconColor} />
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <div className={[
            'text-[length:var(--text-16)] leading-[var(--leading-20)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-semibold)]',
            styles.titleColor,
          ].join(' ')}>
            {title}
          </div>
        )}
        {description && (
          <div className={[
            title ? 'mt-[var(--spacing-4)]' : '',
            'text-[length:var(--text-14)] leading-[var(--leading-20)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            styles.descColor,
          ].filter(Boolean).join(' ')}>
            {description}
          </div>
        )}
        {children}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={[
            'shrink-0 p-[var(--spacing-2)]',
            'rounded-[var(--radius-4)]',
            'hover:bg-[var(--banner-dismiss-hover-fill)]',
            'transition-colors',
            'cursor-pointer',
          ].join(' ')}
        >
          <Icon name="close" size="sm" color={styles.iconColor} />
        </button>
      )}
    </div>
  );
};
