
export type BadgeVariant =
  | 'attention'
  | 'primary'
  | 'success'
  | 'alert'
  | 'default'
  | 'subtle'
  | 'primary-subtle';

export type BadgeSize = 'default' | 'smaller';

export interface BadgeProps {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Badge label text */
  label?: string;
  /** If true, renders the generic dot (small attention) */
  dotOnly?: boolean;
  /** Extra Tailwind classes */
  className?: string;
}

const variantClasses: Record<BadgeVariant, { bg: string; border?: string; text: string }> = {
  'attention':      { bg: 'bg-[var(--badge-attention-fill)]', border: 'border border-solid border-[var(--badge-border)]', text: 'text-[color:var(--badge-text)]' },
  'primary':        { bg: 'bg-[var(--badge-primary-fill)]', text: 'text-[color:var(--badge-text)]' },
  'success':        { bg: 'bg-[var(--badge-success-fill)]', text: 'text-[color:var(--badge-text)]' },
  'alert':          { bg: 'bg-[var(--badge-alert-fill)]',   text: 'text-[color:var(--badge-text)]' },
  'default':        { bg: 'bg-[var(--badge-default-fill)]', text: 'text-[color:var(--badge-text)]' },
  'subtle':         { bg: 'bg-[var(--badge-subtle-fill)]',  text: 'text-[color:var(--badge-onlight-text)]' },
  'primary-subtle': { bg: 'bg-[var(--badge-primary-light-fill)]', text: 'text-[color:var(--badge-onlight-text)]' }
};

const sizeClasses: Record<BadgeSize, string> = {
  default: 'px-[var(--spacing-6)] py-[var(--spacing-2)] text-[length:var(--general-badge-size)] leading-[var(--general-badge-lineheight)]',
  smaller: 'px-[4.5px] py-[var(--spacing-1)] text-[length:var(--general-badge-size)] leading-[var(--general-badge-smaller-lineheight)]',
};

export const Badge = ({
  variant = 'attention',
  size = 'default',
  label = '1',
  dotOnly = false,
  className = '',
}: BadgeProps) => {
  const base = [
    'inline-flex items-center justify-center shrink-0 text-center whitespace-nowrap',
    'rounded-[var(--radius-20)]',
    'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)]',
  ].join(' ');

  if (dotOnly) {
    return (
      <div 
        className={[
          'size-[var(--spacing-6)] shrink-0',
          'bg-[var(--badge-attention-fill)]',
          'border border-solid border-[var(--badge-border)]',
          'rounded-[var(--radius-20)]',
          className
        ].filter(Boolean).join(' ')}
      />
    );
  }

  const { bg, border, text } = variantClasses[variant];

  return (
    <div className={[base, bg, border, text, sizeClasses[size], className].filter(Boolean).join(' ')}>
      {label}
    </div>
  );
};
