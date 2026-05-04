import { Icon } from '../Icon';

export interface TagProps {
  /** Main tag label */
  label: string;
  /** Optional subtle prefix text (rendered before the label) */
  subtleText?: string;
  /** Show the close (x) icon at the end */
  dismissible?: boolean;
  /** Called when the close icon is clicked */
  onDismiss?: () => void;
  className?: string;
}

const containerClasses = [
  'inline-flex items-center justify-start',
  'gap-[var(--spacing-4)]',
  'pl-[var(--spacing-8)] pr-[var(--spacing-4)]',
  'py-[var(--spacing-1)]',
  'bg-[var(--tag-fill)]',
  'rounded-[var(--radius-4)]',
  'font-[family-name:var(--general-font-family)]',
].join(' ');

/* Typography per Figma node 1038:2130 — Tag and Pip share General/Pip/* */
const tagTextClasses =
  'text-[length:var(--general-pip-size)] leading-[var(--general-pip-lineheight)] ' +
  'font-[weight:var(--general-pip-weight)]';

const subtleTextClasses = [
  tagTextClasses,
  'text-[color:var(--tag-subtle-text)]',
].join(' ');

const labelClasses = [
  tagTextClasses,
  'text-[color:var(--tag-text)]',
  'pr-[var(--spacing-4)]',
].join(' ');

export const Tag = ({
  label,
  subtleText,
  dismissible = false,
  onDismiss,
  className = '',
}: TagProps) => {
  return (
    <span className={[containerClasses, className].filter(Boolean).join(' ')}>
      {subtleText && <span className={subtleTextClasses}>{subtleText}</span>}
      <span className="inline-flex items-center">
        <span className={labelClasses}>{label}</span>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Remove tag"
            className="inline-flex items-center justify-center cursor-pointer"
            style={{ color: 'var(--tag-icon)' }}
          >
            <Icon name="close" size={15} />
          </button>
        )}
      </span>
    </span>
  );
};
