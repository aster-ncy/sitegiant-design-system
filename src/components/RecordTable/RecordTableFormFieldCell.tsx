import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox';
import { PrefixInput } from '../PrefixInput';
import type { TableColumnPosition } from '../TableHeaderCell';

export interface RecordTableFormFieldCellProps {
  column?: TableColumnPosition;
  hovered?: boolean;
  checkbox?: ReactNode;
  prefix?: string;
  value?: string;
  placeholder?: string;
  className?: string;
}

const paddingByColumn: Record<TableColumnPosition, string> = {
  first: 'pl-[var(--spacing-12)] pr-[var(--spacing-6)]',
  center: 'px-[var(--spacing-6)]',
  last: 'pl-[var(--spacing-6)] pr-[var(--spacing-12)]',
};

/**
 * RecordTableFormFieldCell - Figma: Record Table Row - Form field (3042:9890).
 */
export const RecordTableFormFieldCell = ({
  column = 'first',
  hovered = false,
  checkbox,
  prefix = '+',
  value = '',
  placeholder = '0',
  className = '',
}: RecordTableFormFieldCellProps) => {
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
      <span className="shrink-0 inline-flex items-center py-[var(--spacing-2)] leading-none">
        {resolvedCheckbox}
      </span>
      <PrefixInput
        prefix={prefix}
        value={value}
        placeholder={placeholder}
        size="default"
        prefixOptions={[
          { value: '+', label: '+' },
          { value: '-', label: '-' },
        ]}
        className="!w-[124px] min-w-0 shrink-0 [&_input]:!min-w-0"
      />
    </div>
  );
};
