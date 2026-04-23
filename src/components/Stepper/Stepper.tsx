import React from 'react';
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
  /** Extra Tailwind classes */
  className?: string;
}

export const Stepper = ({
  steps,
  currentStep = 1,
  className = '',
}: StepperProps) => {
  return (
    <div className={['flex items-center w-full', className].filter(Boolean).join(' ')}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const status = isCompleted ? 'completed' : isActive ? 'active' : 'pending';
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Step */}
            <div className="flex flex-col items-center gap-[var(--spacing-6)]">
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
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={[
                'flex-1 h-[2px] mx-[var(--spacing-8)]',
                'mt-[-20px]', /* align with circle center, not label */
                isCompleted
                  ? 'bg-[var(--color-brand-green-DEFAULT)]'
                  : 'bg-[var(--color-space-DEFAULT)]',
              ].join(' ')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
