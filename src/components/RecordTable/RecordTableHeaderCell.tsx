import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import type { TableColumnPosition, TableTextAlignment } from '../TableHeaderCell';

export interface RecordTableHeaderCellProps {
  column?: TableColumnPosition;
  align?: TableTextAlignment;
  label?: ReactNode;
  sortable?: boolean;
  checkbox?: ReactNode;
  hint?: { count?: number | string; label: string };
  className?: string;
}

const paddingByColumn: Record<TableColumnPosition, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
  last: 'pl-[var(--spacing-6)] pr-[var(--spacing-12)]',
};

const alignClasses: Record<TableTextAlignment, string> = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
};

/**
 * RecordTableHeaderCell - Figma: Record Table Header (3038:8728).
 *
 * Record tables use the inset table header tokens, but each cell owns a full
 * 1px border instead of the default table header's bottom divider only.
 */
export const RecordTableHeaderCell = ({
  column = 'center',
  align = 'left',
  label = 'Table Header Title',
  sortable = true,
  checkbox,
  hint,
  className = '',
}: RecordTableHeaderCellProps) => {
  const resolvedCheckbox = checkbox ?? (column === 'first' ? <Checkbox size="sm" /> : null);

  return (
    <div
      className={[
        'relative flex box-border w-full min-w-[44px] items-center',
        'gap-[var(--spacing-12)] py-[var(--spacing-8)]',
        paddingByColumn[column],
        'bg-[var(--table-inset-header-fill)]',
        'border border-solid border-[color:var(--table-divider-border)]',
        column === 'first' ? 'rounded-tl-[var(--radius-4)]' : '',
        column === 'last' ? 'rounded-tr-[var(--radius-4)]' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {resolvedCheckbox && (
        <span className="shrink-0 inline-flex items-center self-center leading-none">
          {resolvedCheckbox}
        </span>
      )}

      <div
        className={[
          'flex min-w-0 flex-1 items-center gap-[var(--spacing-4)]',
          alignClasses[align],
        ].join(' ')}
      >
        <span
          className={[
            'inline-flex min-w-0 items-center gap-[var(--spacing-2)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[length:var(--table-header-size)] leading-[var(--table-header-lineheight)]',
            'text-[color:var(--table-inset-header-text)]',
            alignClasses[align],
          ].join(' ')}
        >
          <span className="truncate">{label}</span>
          {sortable && (
            <Icon
              name="menu-swap"
              size={17}
              className="shrink-0 text-[color:var(--table-inset-header-icon)]"
            />
          )}
        </span>

        {hint && (
          <span className="inline-flex shrink-0 items-center gap-[var(--spacing-2)] py-[var(--spacing-1)]">
            <Icon
              name="alert-triangle"
              size={15}
              className="shrink-0 text-[color:var(--color-sys-red-DEFAULT)]"
            />
            {hint.count !== undefined && (
              <span className="text-[length:var(--general-caption-size)] leading-[var(--leading-15)] font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)] text-[color:var(--color-sys-red-DEFAULT)]">
                {hint.count}
              </span>
            )}
            <span className="whitespace-nowrap text-[length:var(--general-caption-size)] leading-[var(--leading-15)] font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)] text-[color:var(--color-sys-red-DEFAULT)]">
              {hint.label}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
