import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { IconLink } from '../IconLink';
import type { TableColumnPosition } from '../TableHeaderCell';
import shopeeIcon from '../../assets/channel-icons/shopee.png';

export interface RecordTableRowCellProps {
  column?: TableColumnPosition;
  hovered?: boolean;
  checkbox?: ReactNode;
  icon?: ReactNode;
  value?: ReactNode;
  hint?: ReactNode;
  showActionIcon?: boolean;
  className?: string;
}

const paddingByColumn: Record<TableColumnPosition, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
  last: 'pl-[var(--spacing-6)] pr-[var(--spacing-12)]',
};

/**
 * RecordTableRowCell - Figma: Record Table Row (3042:11088).
 */
export const RecordTableRowCell = ({
  column = 'first',
  hovered = false,
  checkbox,
  icon,
  value = 'Table Body Data',
  hint,
  showActionIcon = false,
  className = '',
}: RecordTableRowCellProps): JSX.Element => {
  const resolvedCheckbox = checkbox ?? <Checkbox size="sm" />;
  const resolvedIcon = icon ?? (
    <img src={shopeeIcon} alt="" aria-hidden="true" className="size-[21px] shrink-0 rounded-[var(--radius-2)] object-cover" />
  );

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
        <span className="shrink-0 inline-flex items-center self-start py-[var(--spacing-2)] leading-none">
          {resolvedCheckbox}
        </span>
      )}
      {/* Outer column: value row on top, hint below */}
      <div className="flex shrink-0 flex-col items-start gap-[var(--spacing-2)]">
        {/* Value row: icon + text + optional action icon — all centred on the single value line */}
        <div className="flex items-center gap-[var(--spacing-8)]">
          {resolvedIcon}
          <span
            className={[
              'whitespace-nowrap text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              'text-[color:var(--table-inset-body-text)]',
            ].join(' ')}
          >
            {value}
          </span>
          {showActionIcon && (
            <IconLink
              icon="plus"
              aria-label="Action"
              showTooltip={false}
              className="inline-flex h-[21px] w-[17px] shrink-0 items-center justify-center rounded-[var(--radius-120)] text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--button-primary-default-fill)]"
            />
          )}
        </div>
        {/* Hint caption — indented to sit under value text, not under icon */}
        {hint && (
          <span
            className={[
              'whitespace-nowrap text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
              'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
              'text-[color:var(--color-text-info)]',
              'pl-[calc(21px+var(--spacing-8))]',
            ].join(' ')}
          >
            {hint}
          </span>
        )}
      </div>
    </div>
  );
};
