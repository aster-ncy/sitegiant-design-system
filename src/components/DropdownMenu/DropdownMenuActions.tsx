import { TextLink } from '../TextLink';

export interface DropdownMenuActionsProps {
  resetLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  onReset?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  /** Hide the reset link on the left */
  hideReset?: boolean;
  className?: string;
}

export const DropdownMenuActions = ({
  resetLabel = 'Reset to Default',
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
  onReset,
  onCancel,
  onSave,
  hideReset = false,
  className = '',
}: DropdownMenuActionsProps) => {
  return (
    <div
      className={[
        'flex items-center justify-between',
        'px-[var(--spacing-14)] py-[var(--spacing-6)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!hideReset ? (
        <TextLink variant="subtle" label={resetLabel} onClick={onReset} />
      ) : <span />}
      <div className="flex items-center gap-[var(--spacing-12)]">
        <TextLink variant="subtle" label={cancelLabel} onClick={onCancel} />
        <TextLink variant="basic" label={saveLabel} onClick={onSave} />
      </div>
    </div>
  );
};
