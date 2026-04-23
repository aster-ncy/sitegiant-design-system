import React from 'react';

export type ProgressBarSize = 'sm' | 'md';

export interface ProgressBarProps {
  /** Number of completed items */
  completed?: number;
  /** Total number of items */
  total?: number;
  /** Show label text (e.g., "2 of 6 completed") */
  showLabel?: boolean;
  /** Custom label override */
  label?: string;
  /** Height variant */
  size?: ProgressBarSize;
  /** Extra Tailwind classes */
  className?: string;
}

const heightClasses: Record<ProgressBarSize, string> = {
  sm: 'h-[var(--spacing-6)]',
  md: 'h-[var(--spacing-8)]',
};

export const ProgressBar = ({
  completed = 0,
  total = 1,
  showLabel = true,
  label,
  size = 'md',
  className = '',
}: ProgressBarProps) => {
  const safeTotal = Math.max(total, 1);
  const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);
  const percentage = (safeCompleted / safeTotal) * 100;

  const displayLabel = label ?? `${safeCompleted} of ${safeTotal} completed`;

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {showLabel && (
        <div className={[
          'flex items-center justify-between',
          'mb-[var(--spacing-8)]',
        ].join(' ')}>
          <span className={[
            'text-[length:var(--text-14)] leading-[var(--leading-17)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
            'text-[color:var(--color-text-secondary)]',
          ].join(' ')}>
            {displayLabel}
          </span>
        </div>
      )}
      <div className={[
        'w-full',
        'bg-[var(--color-space-mid)]',
        'rounded-[var(--radius-120)]',
        'overflow-hidden',
        heightClasses[size],
      ].join(' ')}>
        <div
          className={[
            'h-full',
            'bg-[var(--color-brand-green-DEFAULT)]',
            'rounded-[var(--radius-120)]',
            'transition-all duration-500 ease-out',
          ].join(' ')}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
