import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { TextLink } from '../TextLink';

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
}: RecordTableMoreInfoCellProps): JSX.Element => {
  const resolvedCheckbox = checkbox ?? <Checkbox size="sm" />;

  return (
    <div
      className={[
        'relative flex box-border w-full items-start',
        'py-[var(--spacing-12)]',
        paddingByColumn[column],
        hovered ? 'bg-[var(--table-inset-body-hover-fill)]' : 'bg-[var(--table-inset-body-fill)]',
        'border border-solid border-[color:var(--table-divider-border)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-8)]">
        {/* First row: checkbox + info stack.
            Single row (showExtraInfo off): items-center centres checkbox on the InfoPair line.
            Multi-row (showExtraInfo on): items-start pins checkbox to the top of the stack. */}
        <div className={showExtraInfo ? 'flex w-full items-start gap-[var(--spacing-8)]' : 'flex w-full items-center gap-[var(--spacing-8)]'}>
          {resolvedCheckbox && (
            <span className="shrink-0 inline-flex items-center leading-none">
              {resolvedCheckbox}
            </span>
          )}
          <div className="flex flex-col items-start gap-[var(--spacing-2)]">
            <InfoPair label={label} value={value} />
            {showExtraInfo && (
              // pl-[21px]: structural indent — no --spacing-21 token exists;
              // matches icon/avatar slot width used across RecordTable cells.
              <div className="flex flex-col items-start gap-[var(--spacing-2)] pl-[21px]">
                <InfoPair label="Info 1:" value="2" />
                <InfoPair label="Info 2:" value="2" />
              </div>
            )}
          </div>
        </div>

        {showTextLink && (
          // Indent to align with the content column when checkbox is visible:
          // checkbox(17px, no token) + gap(8px) = 25px. No indent when checkbox is hidden.
          <div className={resolvedCheckbox ? 'pl-[calc(17px+var(--spacing-8))]' : ''}>
            <TextLink
              label="Edit"
              iconPosition="left"
              icon={<Icon name="edit-pen" size={17} />}
              className="h-[17px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
