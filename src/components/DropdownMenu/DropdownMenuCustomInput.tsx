import { useState } from 'react';
import { TextLink } from '../TextLink';
import { Icon } from '../Icon';

export interface DropdownMenuCustomInputProps {
  placeholder?: string;
  /** Initial value (uncontrolled). For controlled use, pass value + onChange */
  value?: string;
  onChange?: (value: string) => void;
  addLabel?: string;
  onAdd?: (value: string) => void;
  /** Hide the trailing "+ Add" button (search-only mode). Default false. */
  hideAdd?: boolean;
  /** Render the inner input flush (no border / radius / fill). Use when this
   *  component is embedded inside a larger bordered container (e.g.
   *  TagSelect popover). Default false (keeps the legacy boxed look). */
  flush?: boolean;
  className?: string;
}

export const DropdownMenuCustomInput = ({
  placeholder = 'Option',
  value: valueProp,
  onChange,
  addLabel = 'Add Item',
  onAdd,
  hideAdd = false,
  flush = false,
  className = '',
}: DropdownMenuCustomInputProps) => {
  const [internalValue, setInternalValue] = useState('');
  const value = valueProp ?? internalValue;

  const handleChange = (v: string) => {
    if (valueProp === undefined) setInternalValue(v);
    onChange?.(v);
  };

  const handleAdd = () => {
    if (!value) return;
    onAdd?.(value);
    if (valueProp === undefined) setInternalValue('');
  };

  return (
    <div
      className={[
        'flex items-center gap-[var(--spacing-12)]',
        'px-[var(--spacing-14)] py-[var(--spacing-6)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'flex-1 min-w-0 flex items-center',
          flush ? 'px-0 py-0' : 'px-[var(--spacing-8)] py-[var(--spacing-4)]',
          flush ? '' : 'bg-[var(--form-input-default-fill)]',
          flush ? '' : 'border border-[var(--form-input-default-border)]',
          flush ? '' : 'rounded-[var(--radius-4)]',
        ].filter(Boolean).join(' ')}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-[length:var(--text-14)] leading-[var(--leading-20)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--dropdown-value-text)]',
            'placeholder:text-[color:var(--form-input-placeholder-text)]',
          ].join(' ')}
        />
      </div>
      {!hideAdd && (
        <TextLink
          className="shrink-0"
          variant="basic"
          label={addLabel}
          iconPosition="left"
          icon={<Icon name="plus" size={17} />}
          onClick={handleAdd}
        />
      )}
    </div>
  );
};
