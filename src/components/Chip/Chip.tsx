import type { ReactNode } from 'react';

export interface ChipProps {
  /** Label text or node. */
  children: ReactNode;
  /** Click handler. */
  onClick?: () => void;
  /** Disabled state. */
  disabled?: boolean;
  /** Extra classes. */
  className?: string;
}

const baseClasses = [
  'inline-flex items-center justify-center',
  'rounded-[var(--radius-2)]',
  'px-[var(--spacing-8)] py-[var(--spacing-2)]',
  'text-[length:var(--text-12)] leading-[var(--leading-15)]',
  'font-[var(--font-weight-regular)] font-[family-name:var(--general-font-family)]',
  'bg-[var(--color-surface-card)]',
  'text-[color:var(--button-basic-text)]',
  'border border-[var(--color-sys-blue-lighter)]',
  'hover:bg-[var(--color-sys-blue-lighter)]',
  'active:bg-[var(--button-basic-clicked-fill)]',
  'transition-colors duration-150 select-none',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  'focus-visible:ring-[var(--button-primary-default-fill)]',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  'cursor-pointer',
].join(' ');

export const Chip = ({
  children,
  onClick,
  disabled = false,
  className = '',
}: ChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[baseClasses, className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
};
