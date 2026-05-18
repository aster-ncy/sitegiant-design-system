import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Pip } from '../Pip';
import { ProductImage } from '../ProductImageList';
import { TextLink } from '../TextLink';
import type { TableColumnPosition } from '../TableHeaderCell';
import productImage from '../../assets/product-images/product-1.png';
import sitegiantWebstore from '../../assets/channel-icons/sitegiant-webstore.png';

export interface RecordTableListingCellProps {
  column?: Extract<TableColumnPosition, 'first' | 'center'>;
  hovered?: boolean;
  checkbox?: ReactNode;
  productName?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  iSku?: string;
  sku?: string;
  className?: string;
}

const paddingByColumn: Record<RecordTableListingCellProps['column'] & string, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
};

const captionBase = [
  'text-[length:var(--general-caption-size)] leading-[var(--leading-15)]',
  'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
].join(' ');

const InfoRow = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <span className="flex min-w-0 items-start gap-[var(--spacing-4)]">
    <span className={`${captionBase} shrink-0 text-[color:var(--color-text-info)]`}>{label}</span>
    <span className={`${captionBase} min-w-0 flex-1 truncate text-[color:var(--color-text-primary)]`}>
      {value}
    </span>
  </span>
);

const SmallTextLink = ({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) => (
  <TextLink
    label={label}
    iconPosition="left"
    icon={icon}
    className="gap-[var(--spacing-2)] [&_span]:!text-[length:var(--general-caption-size)] [&_span]:!leading-[var(--leading-15)]"
  />
);

/**
 * RecordTableListingCell - Figma: Record Table Row - Listing (3042:9588).
 */
export const RecordTableListingCell = ({
  column = 'first',
  hovered = false,
  checkbox,
  productName = 'DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs',
  imageSrc = productImage,
  imageAlt = '',
  iSku = 'ISKU-LDC-240321-MY-0001',
  sku = 'DYN-4IN1-FRESH-10ML52',
  className = '',
}: RecordTableListingCellProps): JSX.Element => {
  const resolvedCheckbox = checkbox ?? <Checkbox size="sm" />;

  return (
    <div
      className={[
        'relative flex box-border w-full items-start gap-[var(--spacing-12)]',
        'py-[var(--spacing-12)]',
        paddingByColumn[column],
        hovered ? 'bg-[var(--table-inset-body-hover-fill)]' : 'bg-[var(--table-inset-body-fill)]',
        'border border-solid border-[color:var(--table-divider-border)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {resolvedCheckbox && (
        <span className="shrink-0 inline-flex items-start py-[var(--spacing-2)] leading-none">
          {resolvedCheckbox}
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-8)]">
        <div className="flex w-full items-start gap-[var(--spacing-12)]">
          <ProductImage src={imageSrc} alt={imageAlt} size="lg" />

          <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-4)]">
            <Pip type="success" label="Published" />
            <span
              className={[
                'block w-full max-h-[34px] overflow-hidden',
                'text-[length:var(--table-body-size)] leading-[var(--leading-17)]',
                'font-[family-name:var(--font-sans)] font-[var(--font-weight-bold)]',
                'text-[color:var(--color-text-primary)]',
              ].join(' ')}
            >
              {productName}
            </span>
            <InfoRow label="iSKU" value={iSku} />
            <InfoRow label="SKU" value={sku} />
            <div className="flex items-start gap-[var(--spacing-20)]">
              <span className="inline-flex items-center gap-[var(--spacing-4)]">
                <img src={sitegiantWebstore} alt="" aria-hidden="true" className="size-[15px] shrink-0" />
                <span className={`${captionBase} text-[color:var(--color-text-primary)]`}>WEBSTORE</span>
              </span>
              <SmallTextLink
                icon={<Icon name="plus-square" size={15} />}
                label="5 more SKUs"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[var(--spacing-4)]">
          <TextLink
            label="Edit"
            iconPosition="left"
            icon={<Icon name="edit-pen" size={17} />}
            className="h-[17px]"
          />

          <div className="flex flex-col items-start gap-[var(--spacing-2)] pl-[21px]">
            <InfoRow label="Info 1:" value="2" />
            <InfoRow label="Info 2:" value="2" />
          </div>
        </div>
      </div>
    </div>
  );
};
