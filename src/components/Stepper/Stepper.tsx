import { Fragment } from 'react';
import { StepCircle } from '../StepCircle';

export interface StepperStep {
  /** Step label */
  label: string;
}

export interface StepperProps {
  /** Array of steps */
  steps: StepperStep[];
  /** Current active step (1-based) */
  currentStep?: number;
  /** Accessible label for the step list (e.g., "Checkout steps") */
  'aria-label'?: string;
  /** Extra Tailwind classes */
  className?: string;
}

/**
 * Horizontal stepper with accessible labeling.
 * - The list is marked up as `role="list"` with one item per step.
 * - The active step carries `aria-current="step"`.
 * - Layout uses grid rows so connector lines align to the StepCircle center
 *   without magic negative margins.
 */
export const Stepper = ({
  steps,
  currentStep = 1,
  className = '',
  'aria-label': ariaLabel = 'Progress',
}: StepperProps) => {
  return (
    <ol
      role="list"
      aria-label={ariaLabel}
      className={['flex items-start w-full', className].filter(Boolean).join(' ')}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const status = isCompleted ? 'completed' : isActive ? 'active' : 'pending';
        const isLast = index === steps.length - 1;

        return (
          <Fragment key={index}>
            {/* Step item */}
            <li
              aria-current={isActive ? 'step' : undefined}
              className="flex flex-col items-center gap-[var(--spacing-6)] shrink-0"
            >
              <StepCircle step={stepNumber} status={status} size="md" />
              <span className={[
                'text-[length:var(--text-13)] leading-[var(--leading-16)]',
                'font-[family-name:var(--font-sans)]',
                'whitespace-nowrap',
                isCompleted || isActive
                  ? 'font-[var(--font-weight-medium)] text-[color:var(--color-text-primary)]'
                  : 'font-[var(--font-weight-regular)] text-[color:var(--color-text-info)]',
              ].join(' ')}>
                {step.label}
              </span>
            </li>

            {/* Connector line — wrapped in a flex container sized to the
                StepCircle (size="md" = 32px) so the line sits vertically
                centered against the circle row, not the full step column. */}
            {!isLast && (
              <li role="presentation" aria-hidden="true" className="flex-1 flex items-center h-[var(--spacing-32)] mx-[var(--spacing-8)]">
                <div className={[
                  'flex-1 h-[var(--spacing-2)]',
                  isCompleted
                    ? 'bg-[var(--color-brand-green-DEFAULT)]'
                    : 'bg-[var(--color-space-DEFAULT)]',
                ].join(' ')} />
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
};
