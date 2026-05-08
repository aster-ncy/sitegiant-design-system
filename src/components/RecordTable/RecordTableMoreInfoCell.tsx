import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';

export type RecordTableMoreInfoColumn = 'first' | 'center';

export interface RecordTableMoreInfoCellProps {
  column?: RecordTableMoreInfoColumn;
  hovered?: boolean;
  checkbox?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  showExtraInfo?: boolean;
  showTextLink?: boolean;
  className?: string;
}

const paddingByColumn: Record<RecordTableMoreInfoColumn, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
};

const bodyTextClasses = [
  'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)]',
  'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
].join(' ');

const InfoPair = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <span className="flex items-start gap-[var(--spacing-4)]">
    <span className={`${bodyTextClasses} shrink-0 whitespace-nowrap text-[color:var(--color-text-info)]`}>
      {label}
    </span>
    <span className={`${bodyTextClasses} shrink-0 whitespace-nowrap text-[color:var(--color-text-primary)]`}>
      {value}
    </span>
  </span>
);

/**
 * RecordTableMoreInfoCell - Figma: Record Table Row - More Info (3043:9164).
 */
export const RecordTableMoreInfoCell = ({
  column = 'first',
  hovered = false,
  checkbox,
  label = 'Label:',
  value = 'Value',
  showExtraInfo = true,
  showTextLink = true,
  className = '',
}: RecordTableMoreInfoCellProps) => {
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
      <span className="shrink-0 inline-flex items-start py-[var(--spacing-2)] leading-none">
        {resolvedCheckbox}
      </span>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-8)]">
        <div className="flex w-full flex-col items-start gap-[var(--spacing-2)]">
          <InfoPair label={label} value={value} />
          {showExtraInfo && (
            <div className="flex flex-col items-start gap-[var(--spacing-2)] pl-[21px]">
              <InfoPair label="Info 1:" value="2" />
              <InfoPair label="Info 2:" value="2" />
            </div>
          )}
        </div>

        {showTextLink && (
          <button
            type="button"
            className={[
              'inline-flex h-[17px] items-center justify-center gap-[var(--spacing-4)]',
              'rounded-[var(--radius-120)] bg-transparent border-0 p-0 cursor-pointer',
              'text-[length:var(--general-button-text-link-size)] leading-[var(--general-button-text-link-lineheight)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              'text-[color:var(--text-link-basic-default)]',
            ].join(' ')}
          >
            <Icon name="edit-pen" size={17} />
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
};
