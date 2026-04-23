import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'inset';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps {
  /** Visual style variant */
  variant?: CardVariant;
  /** Inner padding size */
  padding?: CardPadding;
  /** Optional card title */
  title?: string;
  /** Card content */
  children?: ReactNode;
  /** Extra Tailwind classes */
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: [
    'bg-[var(--color-surface-card)]',
    'border border-[var(--color-surface-card-border)]',
    'rounded-[var(--radius-card)]',
    'shadow-[var(--shadow-sm)]',
  ].join(' '),
  inset: [
    'bg-[var(--color-surface-card-inset)]',
    'rounded-[var(--radius-card-inset)]',
  ].join(' '),
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-[var(--spacing-12)]',
  md: 'p-[var(--spacing-20)]',
  lg: 'p-[var(--spacing-32)]',
};

export const Card = ({
  variant = 'default',
  padding = 'md',
  title,
  children,
  className = '',
}: CardProps) => {
  return (
    <div className={[variantClasses[variant], paddingClasses[padding], className].filter(Boolean).join(' ')}>
      {title && (
        <h3 className={[
          'text-[length:var(--text-16)] leading-[var(--leading-20)]',
          'font-[var(--font-weight-semibold)]',
          'font-[family-name:var(--font-sans)]',
          'text-[color:var(--color-text-primary)]',
          'mb-[var(--spacing-12)]',
        ].join(' ')}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
