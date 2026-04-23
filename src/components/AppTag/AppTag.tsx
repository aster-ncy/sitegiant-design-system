export type AppTagType =
  | 'beta'
  | 'basic'
  | 'new'
  | 'add-on'
  | 'free-trial'
  | 'premium'
  | 'hot';

export type AppTagSize = 'default' | 'sidebar';

export interface AppTagProps {
  type?: AppTagType;
  size?: AppTagSize;
  /** Custom label. Falls back to the default label for the type. */
  label?: string;
  className?: string;
}

const defaultLabels: Record<AppTagType, string> = {
  beta: 'Beta',
  basic: 'Basic',
  new: 'New',
  'add-on': 'Add-On',
  'free-trial': 'Free Trial',
  premium: 'Premium',
  hot: 'Hot',
};

const sizeClasses: Record<AppTagSize, string> = {
  default: [
    'px-[var(--spacing-6)] py-[var(--spacing-1)]',
    'text-[length:var(--text-14)] leading-[var(--leading-16)]',
    'font-[var(--font-weight-medium)]',
  ].join(' '),
  sidebar: [
    'px-[var(--spacing-4)]',
    'py-[1.5px]',
    'text-[length:var(--text-12)] leading-[var(--leading-12)]',
    'font-[var(--font-weight-regular)]',
  ].join(' '),
};

type TypeStyle = {
  background: string;
  border: string;
  color: string;
};

const typeStyles: Record<AppTagType, TypeStyle> = {
  beta: {
    background: 'var(--app-tag-beta-fill)',
    border: '1px solid var(--app-tag-beta-border)',
    color: 'var(--app-tag-beta-text)',
  },
  basic: {
    background: 'var(--app-tag-basic-fill)',
    border: '1px solid var(--app-tag-basic-border)',
    color: 'var(--app-tag-basic-text)',
  },
  new: {
    background:
      'linear-gradient(to right, var(--app-tag-new-fill-start), var(--app-tag-new-fill-end))',
    border: '1px solid var(--app-tag-new-border)',
    color: 'var(--app-tag-new-text)',
  },
  'add-on': {
    background: 'var(--app-tag-addon-fill)',
    border: '1px solid var(--app-tag-addon-border)',
    color: 'var(--app-tag-addon-text)',
  },
  'free-trial': {
    background: 'var(--app-tag-freetrial-fill)',
    border: 'none',
    color: 'var(--app-tag-freetrial-text)',
  },
  premium: {
    background:
      'linear-gradient(to right, var(--app-tag-premium-fill-start), var(--app-tag-premium-fill-end))',
    border: '1px solid var(--app-tag-premium-border)',
    color: 'var(--app-tag-premium-text)',
  },
  hot: {
    background:
      'linear-gradient(to right, var(--app-tag-hot-fill-start), var(--app-tag-hot-fill-end))',
    border: '1px solid var(--app-tag-hot-border)',
    color: 'var(--app-tag-hot-text)',
  },
};

const shapeClasses = [
  'inline-flex items-center justify-start',
  'font-[family-name:var(--font-sans)]',
  'rounded-tl-[var(--radius-8)]',
  'rounded-tr-[var(--radius-12)]',
  'rounded-br-[var(--radius-12)]',
  'rounded-bl-[var(--radius-0)]',
  'shadow-[var(--app-tag-shadow)]',
].join(' ');

export const AppTag = ({
  type = 'beta',
  size = 'default',
  label,
  className = '',
}: AppTagProps) => {
  const style = typeStyles[type];
  return (
    <span
      className={[shapeClasses, sizeClasses[size], className].filter(Boolean).join(' ')}
      style={{
        background: style.background,
        border: style.border,
        color: style.color,
      }}
    >
      {label ?? defaultLabels[type]}
    </span>
  );
};
