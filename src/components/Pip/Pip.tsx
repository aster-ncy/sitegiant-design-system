
export type PipType =
  | 'success'
  | 'info'
  | 'warning'
  | 'alert'
  | 'danger'
  | 'muted'
  | 'highlight'
  | 'blocked';

export type PipStyle = 'default' | 'solid';

export interface PipProps {
  /** Status type */
  type?: PipType;
  /** Visual style — default has border + light fill, solid has opaque fill */
  pipStyle?: PipStyle;
  /** Label text */
  label?: string;
  /** Extra classes on the root wrapper */
  className?: string;
}

/* ── Default style: light fill + border ─────────────── */
const defaultFillClasses: Record<PipType, string> = {
  success:   'bg-[var(--status-success-fill)]',
  info:      'bg-[var(--status-info-fill)]',
  warning:   'bg-[var(--status-warning-fill)]',
  alert:     'bg-[var(--status-alert-fill)]',
  danger:    'bg-[var(--status-danger-fill)]',
  muted:     'bg-[var(--status-muted-fill)]',
  highlight: 'bg-[var(--status-highlight-fill)]',
  blocked:   'bg-[var(--status-blocked-fill)]',
};

const defaultBorderClasses: Record<PipType, string> = {
  success:   'border-[var(--status-success-border)]',
  info:      'border-[var(--status-info-border)]',
  warning:   'border-[var(--status-warning-border)]',
  alert:     'border-[var(--status-alert-border)]',
  danger:    'border-[var(--status-danger-border)]',
  muted:     'border-[var(--status-muted-border)]',
  highlight: 'border-[var(--status-highlight-border)]',
  blocked:   'border-[var(--status-blocked-border)]',
};

const defaultTextClasses: Record<PipType, string> = {
  success:   'text-[color:var(--status-success-text)]',
  info:      'text-[color:var(--status-info-text)]',
  warning:   'text-[color:var(--status-warning-text)]',
  alert:     'text-[color:var(--status-alert-text)]',
  danger:    'text-[color:var(--status-danger-text)]',
  muted:     'text-[color:var(--status-muted-text)]',
  highlight: 'text-[color:var(--status-highlight-text)]',
  blocked:   'text-[color:var(--status-blocked-text)]',
};

/* ── Solid style: opaque fill, no border ────────────── */
const solidFillClasses: Record<PipType, string> = {
  success:   'bg-[var(--status-success-solid-fill)]',
  info:      'bg-[var(--status-info-solid-fill)]',
  warning:   'bg-[var(--status-warning-solid-fill)]',
  alert:     'bg-[var(--status-alert-solid-fill)]',
  danger:    'bg-[var(--status-danger-solid-fill)]',
  muted:     'bg-[var(--status-muted-solid-fill)]',
  highlight: 'bg-[var(--status-highlight-solid-fill)]',
  blocked:   'bg-[var(--status-blocked-solid-fill)]',
};

const solidTextClasses: Record<PipType, string> = {
  success:   'text-[color:var(--status-success-solid-text)]',
  info:      'text-[color:var(--status-info-solid-text)]',
  warning:   'text-[color:var(--status-warning-solid-text)]',
  alert:     'text-[color:var(--status-alert-solid-text)]',
  danger:    'text-[color:var(--status-danger-solid-text)]',
  muted:     'text-[color:var(--status-muted-solid-text)]',
  highlight: 'text-[color:var(--status-highlight-solid-text)]',
  blocked:   'text-[color:var(--status-blocked-solid-text)]',
};

export const Pip = ({
  type = 'success',
  pipStyle = 'default',
  label = 'Pip Text',
  className = '',
}: PipProps) => {
  const isSolid = pipStyle === 'solid';

  return (
    <span
      className={[
        'inline-flex items-center justify-start',
        'px-[var(--spacing-8)] py-[1px]',
        'rounded-[var(--radius-4)]',
        'text-[length:var(--text-12)] leading-[var(--leading-16)]',
        'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
        isSolid ? solidFillClasses[type] : defaultFillClasses[type],
        isSolid ? solidTextClasses[type] : defaultTextClasses[type],
        isSolid ? '' : `border border-solid ${defaultBorderClasses[type]}`,
        className,
      ].filter(Boolean).join(' ')}
    >
      {label}
    </span>
  );
};
