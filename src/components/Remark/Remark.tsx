import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import { TextLink } from '../TextLink';
import { Typography } from '../Typography/Typography';

export type RemarkState = 'info' | 'success' | 'tips' | 'danger' | 'alert';

export interface RemarkProps {
  /** Visual state controlling icon, text, background, and border colors. */
  state?: RemarkState;
  /** Main remark content. */
  remark?: ReactNode;
  /** Whether the leading status icon is shown. */
  showIcon?: boolean;
  /** Whether the trailing text-link action is shown. */
  showButton?: boolean;
  /** Trailing action label. */
  buttonLabel?: string;
  /** Trailing action callback. */
  onButtonClick?: () => void;
  /** Optional icon override from the Icon component. */
  icon?: IconName;
  /** Extra Tailwind classes. */
  className?: string;
}

type RemarkStateConfig = {
  fill: string;
  border: string;
  text: string;
  iconColor: string;
  iconName?: IconName;
};

const stateConfig: Record<RemarkState, RemarkStateConfig> = {
  info: {
    fill: 'bg-[var(--status-info-fill)]',
    border: 'border-[var(--status-info-border)]',
    text: 'text-[color:var(--status-info-text)]',
    iconColor: 'var(--status-info-solid-fill)',
    iconName: 'message-info',
  },
  success: {
    fill: 'bg-[var(--status-success-fill)]',
    border: 'border-[var(--status-success-border)]',
    text: 'text-[color:var(--status-success-text)]',
    iconColor: 'var(--status-success-solid-fill)',
    iconName: 'message-success',
  },
  tips: {
    fill: 'bg-[var(--status-muted-fill)]',
    border: 'border-[var(--status-muted-border)]',
    text: 'text-[color:var(--status-muted-text)]',
    iconColor: 'var(--status-warning-solid-fill)',
    iconName: 'message-tips',
  },
  danger: {
    fill: 'bg-[var(--status-danger-fill)]',
    border: 'border-[var(--status-danger-border)]',
    text: 'text-[color:var(--status-danger-text)]',
    iconColor: 'var(--status-danger-solid-fill)',
    iconName: 'message-error',
  },
  alert: {
    fill: 'bg-[var(--status-alert-fill)]',
    border: 'border-[var(--status-alert-border)]',
    text: 'text-[color:var(--status-alert-text)]',
    iconColor: 'var(--status-alert-solid-fill)',
    iconName: 'message-alert',
  },
};

export const Remark = ({
  state = 'info',
  remark = 'Remark content.',
  showIcon = true,
  showButton = true,
  buttonLabel = 'Button',
  onButtonClick,
  icon,
  className = '',
}: RemarkProps) => {
  const config = stateConfig[state];
  const iconName = icon ?? config.iconName;

  return (
    <div
      className={[
        'flex items-start',
        'gap-[var(--spacing-8)]',
        'border border-solid',
        'px-[var(--spacing-12)] py-[var(--spacing-6)]',
        config.fill,
        config.border,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showIcon && (
        <span className="flex h-[21px] w-[21px] shrink-0 items-center justify-center">
          {iconName && <Icon name={iconName} size={21} color={config.iconColor} />}
        </span>
      )}

      <Typography
        as="span"
        className={[
          'min-w-0 shrink-0 whitespace-nowrap',
          'font-[family-name:var(--font-sans)]',
          'text-[length:var(--general-body-size)]',
          'leading-[var(--general-body-lineheight)]',
          'font-[weight:var(--general-body-weight)]',
          config.text,
        ].join(' ')}
      >
        {remark}
      </Typography>

      {showButton && (
        <span className="flex shrink-0 items-start py-[var(--spacing-2)]">
          <TextLink label={buttonLabel} onClick={onButtonClick} variant="basic" />
        </span>
      )}
    </div>
  );
};
