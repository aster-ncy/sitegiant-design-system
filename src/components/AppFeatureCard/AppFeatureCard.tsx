import { Button } from '../Button';

export type AppFeatureCardTitleWeight = 'bold' | 'regular';

export interface AppFeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  titleWeight?: AppFeatureCardTitleWeight;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

const titleClasses: Record<AppFeatureCardTitleWeight, string> = {
  bold: [
    'text-[length:var(--text-16)]',
    'leading-[var(--leading-20)]',
    'font-[var(--font-weight-medium)]',
  ].join(' '),
  regular: [
    'text-[length:var(--text-14)]',
    'leading-[var(--leading-20)]',
    'font-[var(--font-weight-regular)]',
  ].join(' '),
};

const cardClasses = [
  'bg-[var(--color-surface-card)]',
  'border border-[var(--color-surface-card-border)]',
  'rounded-[var(--radius-12)]',
  'p-[var(--spacing-20)]',
  'flex flex-col items-center',
  'gap-[var(--spacing-12)]',
  'w-full max-w-[365px]',
].join(' ');

const imageClasses = [
  'self-stretch',
  'aspect-[325/175]',
  'object-cover',
].join(' ');

const infoClasses = [
  'self-stretch',
  'flex flex-col items-start',
  'gap-[var(--spacing-8)]',
].join(' ');

const titleBaseClasses = [
  'self-stretch text-center',
  'text-[color:var(--color-text-primary)]',
  'font-[family-name:var(--font-sans)]',
].join(' ');

const descriptionClasses = [
  'self-stretch min-h-[56px]',
  'text-[length:var(--text-12)]',
  'leading-[var(--leading-16)]',
  'font-[var(--font-weight-regular)]',
  'font-[family-name:var(--font-sans)]',
  'text-[color:var(--color-text-info)]',
].join(' ');

export const AppFeatureCard = ({
  title,
  description,
  imageSrc,
  imageAlt = '',
  titleWeight = 'bold',
  ctaLabel = 'Manage',
  onCtaClick,
  className = '',
}: AppFeatureCardProps) => {
  return (
    <div className={[cardClasses, className].filter(Boolean).join(' ')}>
      <img src={imageSrc} alt={imageAlt} className={imageClasses} />
      <div className={infoClasses}>
        <div className={[titleBaseClasses, titleClasses[titleWeight]].join(' ')}>
          {title}
        </div>
        <p className={descriptionClasses}>{description}</p>
      </div>
      <Button variant="primary" size="md" label={ctaLabel} onClick={onCtaClick} />
    </div>
  );
};
