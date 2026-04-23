import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Icon } from '../../components/Icon';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Logo */}
      <div className="flex items-center gap-[var(--spacing-8)] mb-[var(--spacing-12)]">
        <Icon name="apps" size="xl" color="var(--color-brand-green-DEFAULT)" />
        <span
          className={[
            'text-[length:var(--text-22)] leading-[var(--leading-28)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-bold)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}
        >
          SiteGiant
        </span>
      </div>

      {/* ERP badge */}
      <div className="mb-[var(--spacing-32)]">
        <Badge variant="primary-subtle" label="Enterprise Resource Planning" />
      </div>

      {/* Heading */}
      <h1
        className={[
          'text-[length:var(--text-32)] leading-[var(--leading-37)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-bold)]',
          'text-[color:var(--color-text-primary)]',
          'mb-[var(--spacing-12)]',
        ].join(' ')}
      >
        Welcome to SiteGiant
      </h1>

      {/* Subtitle */}
      <p
        className={[
          'text-[length:var(--text-16)] leading-[var(--leading-24)]',
          'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
          'text-[color:var(--color-text-secondary)]',
          'mb-[var(--spacing-40)]',
        ].join(' ')}
      >
        Let's get your account set up in just a few steps.
      </p>

      <Button
        variant="primary"
        size="lg"
        label="Get Started"
        onClick={onNext}
        className="w-full"
      />
    </div>
  );
};
