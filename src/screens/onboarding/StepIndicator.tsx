interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const StepIndicator = ({ totalSteps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-[var(--spacing-8)] mb-[var(--spacing-24)]">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div
            key={i}
            className={[
              'rounded-full transition-all duration-300',
              isActive
                ? 'h-[var(--spacing-8)] bg-[var(--color-brand-green-DEFAULT)]'
                : isDone
                ? 'w-[var(--spacing-8)] h-[var(--spacing-8)] bg-[var(--color-brand-green-DEFAULT)] opacity-60'
                : 'w-[var(--spacing-8)] h-[var(--spacing-8)] bg-[var(--color-space-DEFAULT)]',
            ].join(' ')}
            style={isActive ? { width: 'var(--spacing-24)' } : undefined}
          />
        );
      })}
    </div>
  );
};
