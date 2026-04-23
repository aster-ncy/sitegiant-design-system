import React from 'react';
import { Icon } from '../Icon';

export type StatusCardStatus =
  | 'basic'
  | 'subtle'
  | 'default'
  | 'warning'
  | 'success'
  | 'alert'
  | 'danger';

export type StatusCardSize = 'default' | 'large';

export interface StatusCardProps {
  /** Status variant — controls icon circle color and icon color */
  status?: StatusCardStatus;
  /** Size — default is horizontal, large is stacked/vertical */
  size?: StatusCardSize;
  /** Count/number to display */
  count?: string | number;
  /** Label text below the count */
  label?: string;
  /** Custom icon — receives a color prop for the icon fill */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Extra classes on the root wrapper */
  className?: string;
}

/* ── Icon circle background per status ───────────────── */
const iconBgClasses: Record<StatusCardStatus, string> = {
  basic:   'bg-[var(--status-info-fill)]',
  subtle:  'bg-[var(--status-muted-fill)]',
  default: 'bg-[var(--status-muted-fill)]',
  warning: 'bg-[var(--status-warning-fill)]',
  success: 'bg-[var(--status-success-dark-fill)]',
  alert:   'bg-[var(--status-alert-fill)]',
  danger:  'bg-[var(--status-danger-fill)]',
};

/* ── Icon color token per status ─────────────────────── */
const iconColorTokens: Record<StatusCardStatus, string> = {
  basic:   'var(--color-icon-primary)',
  subtle:  'var(--color-icon-secondary)',
  default: 'var(--color-icon-default)',
  warning: 'var(--color-icon-warning)',
  success: 'var(--color-icon-success-dark)',
  alert:   'var(--color-icon-alert)',
  danger:  'var(--color-icon-danger)',
};

const DefaultIcon = ({ color }: { color: string }) => (
  <Icon name="alert-circle" size={32} color={color} />
);

export const StatusCard = ({
  status = 'basic',
  size = 'default',
  count = '00',
  label = 'Status Card',
  icon,
  onClick,
  className = '',
}: StatusCardProps) => {
  const isLarge = size === 'large';
  const iconColor = iconColorTokens[status];

  return (
    <div
      onClick={onClick}
      className={[
        'inline-flex w-[176px]',
        'px-[var(--spacing-24)] py-[var(--spacing-20)]',
        'bg-[var(--color-surface-card)]',
        'rounded-[var(--radius-12)]',
        'border border-solid border-[var(--color-surface-card-border)]',
        'gap-[var(--spacing-12)]',
        isLarge ? 'flex-col items-start justify-center' : 'flex-row items-center',
        onClick ? 'cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Icon circle */}
      <div
        className={[
          'w-[48px] h-[48px] shrink-0',
          'rounded-[var(--radius-120)]',
          'flex items-center justify-center',
          iconBgClasses[status],
        ].join(' ')}
      >
        {icon || <DefaultIcon color={iconColor} />}
      </div>

      {/* Text container */}
      <div className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
        {/* Count */}
        <span className={[
          'text-[length:var(--text-20)] leading-[var(--leading-24)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-bold)]',
          'text-[color:var(--color-text-primary)]',
        ].join(' ')}>
          {count}
        </span>
        {/* Label */}
        <span className={[
          'text-[length:var(--text-14)] leading-[var(--leading-20)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
          'text-[color:var(--color-text-primary)]',
        ].join(' ')}>
          {label}
        </span>
      </div>
    </div>
  );
};
