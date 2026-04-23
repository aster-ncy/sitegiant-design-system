import React from 'react';
import { Icon } from '../Icon';

export type StepCircleStatus = 'pending' | 'active' | 'completed';
export type StepCircleSize = 'sm' | 'md' | 'lg';

export interface StepCircleProps {
  /** Step number displayed when pending/active */
  step?: number;
  /** Visual status */
  status?: StepCircleStatus;
  /** Size preset */
  size?: StepCircleSize;
  /** Extra Tailwind classes */
  className?: string;
}

const sizeMap: Record<StepCircleSize, { container: string; text: string; iconSize: number }> = {
  sm: {
    container: 'size-[24px]',
    text: 'text-[length:var(--text-12)] leading-[var(--leading-15)]',
    iconSize: 12,
  },
  md: {
    container: 'size-[32px]',
    text: 'text-[length:var(--text-14)] leading-[var(--leading-17)]',
    iconSize: 16,
  },
  lg: {
    container: 'size-[40px]',
    text: 'text-[length:var(--text-16)] leading-[var(--leading-20)]',
    iconSize: 20,
  },
};

const statusClasses: Record<StepCircleStatus, string> = {
  pending: [
    'border-[length:var(--border-2)] border-solid border-[var(--color-space-DEFAULT)]',
    'bg-white',
    'text-[color:var(--color-set-lightest)]',
  ].join(' '),
  active: [
    'border-[length:var(--border-2)] border-solid border-[var(--color-brand-green-DEFAULT)]',
    'bg-white',
    'text-[color:var(--color-brand-green-DEFAULT)]',
  ].join(' '),
  completed: [
    'bg-[var(--color-brand-green-DEFAULT)]',
    'text-white',
  ].join(' '),
};

export const StepCircle = ({
  step = 1,
  status = 'pending',
  size = 'md',
  className = '',
}: StepCircleProps) => {
  const { container, text, iconSize } = sizeMap[size];

  return (
    <div
      className={[
        'inline-flex items-center justify-center shrink-0',
        'rounded-[var(--radius-120)]',
        'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
        container,
        statusClasses[status],
        text,
        className,
      ].filter(Boolean).join(' ')}
    >
      {status === 'completed' ? (
        <Icon name="check" size={iconSize} color="white" />
      ) : (
        <span>{step}</span>
      )}
    </div>
  );
};
