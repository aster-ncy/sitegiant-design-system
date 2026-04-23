import type { ReactNode } from 'react';

export interface DropdownMenuProps {
  children: ReactNode;
  /** Fixed width in px. Defaults to auto */
  width?: number;
  className?: string;
}

export const DropdownMenu = ({
  children,
  width,
  className = '',
}: DropdownMenuProps) => {
  return (
    <div
      role="listbox"
      style={width ? { width } : undefined}
      className={[
        'flex flex-col',
        'bg-[var(--color-surface-card)]',
        'border border-[var(--color-surface-card-border)]',
        'rounded-[var(--radius-8)]',
        'shadow-[var(--shadow-md)]',
        'py-[var(--spacing-4)]',
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};
