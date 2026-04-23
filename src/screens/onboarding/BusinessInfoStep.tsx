import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Dropdown } from '../../components/Dropdown';

const BUSINESS_TYPE_OPTIONS = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

interface BusinessInfoStepProps {
  businessName: string;
  businessType: string;
  onBusinessNameChange: (value: string) => void;
  onBusinessTypeChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BusinessInfoStep = ({
  businessName,
  businessType,
  onBusinessNameChange,
  onBusinessTypeChange,
  onNext,
  onBack,
}: BusinessInfoStepProps) => {
  const canContinue = businessName.trim().length > 0 && businessType.length > 0;

  return (
    <Card variant="default" padding="lg">
      {/* Header */}
      <div className="mb-[var(--spacing-24)]">
        <h2
          className={[
            'text-[length:var(--text-22)] leading-[var(--leading-28)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-semibold)]',
            'text-[color:var(--color-text-primary)]',
            'mb-[var(--spacing-4)]',
          ].join(' ')}
        >
          Business Information
        </h2>
        <p
          className={[
            'text-[length:var(--text-14)] leading-[var(--leading-17)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-secondary)]',
          ].join(' ')}
        >
          Tell us about your company.
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-[var(--spacing-20)] mb-[var(--spacing-32)]">
        <Input
          id="company-name"
          label="Company Name"
          placeholder="e.g. Acme Corporation"
          value={businessName}
          onChange={onBusinessNameChange}
        />
        <Dropdown
          id="business-type"
          label="Business Type"
          placeholder="Select your industry"
          value={businessType}
          options={BUSINESS_TYPE_OPTIONS}
          onChange={onBusinessTypeChange}
        />
      </div>

      {/* Footer nav */}
      <div className="flex justify-between gap-[var(--spacing-12)]">
        <Button variant="outline" size="md" label="Back" onClick={onBack} />
        <Button
          variant="primary"
          size="md"
          label="Continue"
          disabled={!canContinue}
          onClick={onNext}
        />
      </div>
    </Card>
  );
};
