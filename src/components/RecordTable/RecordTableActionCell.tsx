import { Icon } from '../Icon';

export type RecordTableActionCellType = 'text' | 'icon';
export type RecordTableActionCount = 1 | 2 | 3 | 4;

export interface RecordTableActionCellProps {
  type?: RecordTableActionCellType;
  actionCount?: RecordTableActionCount;
  hovered?: boolean;
  label?: string;
  className?: string;
}

const actionCountsByType: Record<RecordTableActionCellType, RecordTableActionCount[]> = {
  text: [1, 2, 3, 4],
  icon: [1, 2, 3],
};

const ActionTextButton = ({ label }: { label: string }) => (
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
    <Icon name="plus" size={17} />
    <span>{label}</span>
  </button>
);

const ActionIconButton = () => (
  <button
    type="button"
    aria-label="Button"
    className={[
      'inline-flex h-[17px] w-[17px] items-center justify-center',
      'rounded-[var(--radius-120)] bg-transparent border-0 p-0 cursor-pointer',
      'text-[color:var(--text-link-basic-default)]',
    ].join(' ')}
  >
    <Icon name="plus" size={17} />
  </button>
);

/**
 * RecordTableActionCell - Figma: Record Table Row - Action Button (3042:10640).
 */
export const RecordTableActionCell = ({
  type = 'text',
  actionCount = 1,
  hovered = false,
  label = 'Button',
  className = '',
}: RecordTableActionCellProps) => {
  const maxCount = type === 'icon' ? 3 : 4;
  const resolvedCount = Math.min(actionCount, maxCount) as RecordTableActionCount;
  const actions = actionCountsByType[type].slice(0, resolvedCount);

  return (
    <div
      className={[
        'relative box-border border border-solid border-[color:var(--table-divider-border)]',
        hovered ? 'bg-[var(--table-inset-body-hover-fill)]' : 'bg-[var(--table-inset-body-fill)]',
        type === 'icon'
          ? 'flex h-[57px] items-start gap-[var(--spacing-12)] pl-[var(--spacing-6)] pr-[var(--spacing-12)] py-[var(--spacing-12)]'
          : 'flex flex-col items-start gap-[var(--spacing-4)] pl-[var(--spacing-6)] pr-[var(--spacing-12)] py-[var(--spacing-12)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {actions.map((_, index) => (
        <span
          key={index}
          className="inline-flex shrink-0 items-center py-[var(--spacing-2)]"
        >
          {type === 'icon' ? <ActionIconButton /> : <ActionTextButton label={label} />}
        </span>
      ))}
    </div>
  );
};
