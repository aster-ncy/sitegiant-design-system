import React from 'react';
import { Icon, type IconName } from '../Icon';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { StepCircle } from '../StepCircle';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'required' | 'optional';

export interface TaskCardProps {
  /** Task title */
  title: string;
  /** Task description */
  description?: string;
  /** Icon name for the illustration area */
  icon?: IconName;
  /** Step number (shown in StepCircle) */
  step?: number;
  /** Current task status */
  status?: TaskStatus;
  /** Required or optional tag */
  priority?: TaskPriority;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Extra Tailwind classes */
  className?: string;
}

const illustrationBg: Record<TaskStatus, string> = {
  'pending': 'bg-[var(--color-space-mid)]',
  'in-progress': 'bg-[var(--color-sys-blue-lighter)]',
  'completed': 'bg-[var(--color-sys-green-lighter)]',
};

const illustrationIconColor: Record<TaskStatus, string> = {
  'pending': 'var(--color-set-lighter)',
  'in-progress': 'var(--color-sys-blue-dark)',
  'completed': 'var(--color-sys-green-dark)',
};

const stepCircleStatus: Record<TaskStatus, 'pending' | 'active' | 'completed'> = {
  'pending': 'pending',
  'in-progress': 'active',
  'completed': 'completed',
};

export const TaskCard = ({
  title,
  description,
  icon = 'box',
  step = 1,
  status = 'pending',
  priority = 'required',
  ctaLabel = 'Get started',
  onCtaClick,
  className = '',
}: TaskCardProps) => {
  const isCompleted = status === 'completed';

  return (
    <div
      className={[
        'flex flex-col overflow-hidden',
        'bg-[var(--color-surface-card)]',
        'border border-[var(--color-surface-card-border)]',
        'rounded-[var(--radius-card)]',
        'shadow-[var(--shadow-sm)]',
        !isCompleted ? 'hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px]' : '',
        'transition-all duration-200',
        isCompleted ? 'opacity-80' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Illustration area */}
      <div className={[
        'flex items-center justify-center',
        'h-[120px]',
        illustrationBg[status],
      ].join(' ')}>
        <Icon name={icon} size={48} color={illustrationIconColor[status]} />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 p-[var(--spacing-16)]">
        {/* Status row */}
        <div className="flex items-center gap-[var(--spacing-8)]">
          <StepCircle step={step} status={stepCircleStatus[status]} size="sm" />
          <Badge
            variant={priority === 'required' ? 'attention' : 'subtle'}
            label={priority === 'required' ? 'Required' : 'Optional'}
            size="smaller"
          />
        </div>

        {/* Title */}
        <h4 className={[
          'mt-[var(--spacing-8)]',
          'text-[length:var(--text-16)] leading-[var(--leading-20)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-semibold)]',
          'text-[color:var(--color-text-primary)]',
        ].join(' ')}>
          {title}
        </h4>

        {/* Description */}
        {description && (
          <p className={[
            'mt-[var(--spacing-4)]',
            'text-[length:var(--text-13)] leading-[var(--leading-18)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-info)]',
            'line-clamp-2',
          ].join(' ')}>
            {description}
          </p>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1 min-h-[var(--spacing-12)]" />

        {/* CTA */}
        <Button
          variant={isCompleted ? 'outline' : 'primary'}
          size="md"
          label={isCompleted ? 'Completed' : ctaLabel}
          disabled={isCompleted}
          leftIcon={isCompleted ? <Icon name="check" size={14} /> : undefined}
          onClick={isCompleted ? undefined : onCtaClick}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
};
