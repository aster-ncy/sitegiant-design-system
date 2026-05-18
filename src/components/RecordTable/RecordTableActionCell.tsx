import { Icon } from '../Icon';
import { IconLink } from '../IconLink';
import { TextLink } from '../TextLink';

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
  <TextLink
    label={label}
    iconPosition="left"
    icon={<Icon name="plus" size={17} />}
    className="h-[17px]"
  />
);

const ActionIconButton = () => (
  <IconLink
    icon="plus"
    aria-label="Button"
    showTooltip={false}
    className="inline-flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[var(--radius-120)] text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[color:var(--button-primary-default-fill)]"
  />
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
}: RecordTableActionCellProps): JSX.Element => {
  const maxCount = type === 'icon' ? 3 : 4;
  const resolvedCount = Math.min(actionCount, maxCount) as RecordTableActionCount;
  const actions = actionCountsByType[type].slice(0, resolvedCount);

  return (
    <div
      className={[
        'relative box-border border border-solid border-[color:var(--table-divider-border)]',
        hovered ? 'bg-[var(--table-inset-body-hover-fill)]' : 'bg-[var(--table-inset-body-fill)]',
        type === 'icon'
          ? 'flex h-[57px] items-center gap-[var(--spacing-12)] pl-[var(--spacing-6)] pr-[var(--spacing-12)] py-[var(--spacing-12)]'
          : resolvedCount === 1
            ? 'flex items-center gap-[var(--spacing-4)] pl-[var(--spacing-6)] pr-[var(--spacing-12)] py-[var(--spacing-12)]'
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
