import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';

export type PopconfirmType = 'default' | 'header' | 'footer';
export type PopconfirmButtonCount = '2' | '1';

export interface PopconfirmProps {
  /** Heading text */
  heading?: string;
  /** Body text */
  body?: string;
  /** Component section to render */
  type?: PopconfirmType;
  /** Number of action buttons */
  buttonCount?: PopconfirmButtonCount;
  /** Show checkbox with label */
  showCheckbox?: boolean;
  /** Checkbox label text */
  checkboxLabel?: string;
  /** Whether checkbox is checked */
  checkboxChecked?: boolean;
  /** Checkbox change handler */
  onCheckboxChange?: (checked: boolean) => void;
  /** Show footer add-on (e.g. "Do not display again" checkbox) */
  showFooterAddOn?: boolean;
  /** Footer add-on checkbox label */
  footerAddOnLabel?: string;
  /** Footer add-on checked state */
  footerAddOnChecked?: boolean;
  /** Footer add-on change handler */
  onFooterAddOnChange?: (checked: boolean) => void;
  /** Primary button label */
  primaryLabel?: string;
  /** Secondary button label (only when buttonCount is '2') */
  secondaryLabel?: string;
  /** Primary button click handler */
  onPrimaryClick?: () => void;
  /** Secondary button click handler */
  onSecondaryClick?: () => void;
  /** Extra classes on the root wrapper */
  className?: string;
}

export const Popconfirm = ({
  heading = 'Popconfirm Heading',
  body = 'Popconfirm Body',
  type = 'default',
  buttonCount = '2',
  showCheckbox = true,
  checkboxLabel = 'Checkbox Value',
  checkboxChecked = false,
  onCheckboxChange,
  showFooterAddOn = false,
  footerAddOnLabel = 'Do not display again',
  footerAddOnChecked = false,
  onFooterAddOnChange,
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
  onPrimaryClick,
  onSecondaryClick,
  className = '',
}: PopconfirmProps) => {
  /* ── Type: Header (top section only) ─────────────── */
  if (type === 'header') {
    return (
      <div
        className={[
          'flex flex-col items-start w-[400px]',
          'bg-[var(--color-surface-card)]',
          'px-[var(--spacing-24)] pt-[var(--spacing-20)] pb-[var(--spacing-12)]',
          'rounded-t-[var(--radius-12)]',
          className,
        ].filter(Boolean).join(' ')}
      >
        {/* Heading */}
        <div className="flex items-center w-full">
          <p className={[
            'flex-1 min-w-px',
            'text-[length:var(--text-16)] leading-[var(--leading-22)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}>
            {heading}
          </p>
        </div>
      </div>
    );
  }

  /* ── Type: Footer (bottom section only) ──────────── */
  if (type === 'footer') {
    return (
      <div
        className={[
          'flex items-center justify-between w-[400px]',
          'bg-[var(--color-surface-card)]',
          'px-[var(--spacing-24)] py-[var(--spacing-20)]',
          'rounded-b-[var(--radius-12)]',
          className,
        ].filter(Boolean).join(' ')}
      >
        {/* Footer add-on area */}
        <div className="flex flex-col items-start w-[156px]">
          {showFooterAddOn && (
            <Checkbox
              checked={footerAddOnChecked}
              label={footerAddOnLabel}
              onChange={onFooterAddOnChange}
            />
          )}
        </div>

        {/* Buttons */}
        <div className={[
          'flex items-end justify-end',
          buttonCount === '2' ? 'gap-[var(--spacing-16)]' : '',
        ].filter(Boolean).join(' ')}>
          {buttonCount === '2' && (
            <Button
              variant="outline"
              label={secondaryLabel}
              onClick={onSecondaryClick}
            />
          )}
          <Button
            variant="primary"
            label={primaryLabel}
            onClick={onPrimaryClick}
          />
        </div>
      </div>
    );
  }

  /* ── Type: Default (full modal) ──────────────────── */
  return (
    <div
      className={[
        'flex flex-col items-start w-[400px]',
        'bg-[var(--color-surface-card)]',
        'px-[var(--spacing-24)] py-[var(--spacing-20)]',
        'rounded-[var(--radius-12)]',
        'shadow-[var(--shadow-lg)]',
        'gap-[var(--spacing-20)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Message section */}
      <div className="flex flex-col items-start gap-[var(--spacing-12)] w-full">
        {/* Heading */}
        <div className="flex items-center w-full">
          <p className={[
            'flex-1 min-w-px',
            'text-[length:var(--text-16)] leading-[var(--leading-22)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-medium)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}>
            {heading}
          </p>
        </div>

        {/* Body */}
        <div className="flex items-center w-full">
          <p className={[
            'flex-1 min-w-px',
            'text-[length:var(--text-14)] leading-[var(--leading-21)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-primary)]',
          ].join(' ')}>
            {body}
          </p>
        </div>
      </div>

      {/* Checkbox */}
      {showCheckbox && (
        <Checkbox
          checked={checkboxChecked}
          label={checkboxLabel}
          onChange={onCheckboxChange}
        />
      )}

      {/* Buttons */}
      <div className={[
        'flex items-end justify-end w-full',
        buttonCount === '2' ? 'gap-[var(--spacing-16)]' : '',
      ].filter(Boolean).join(' ')}>
        {buttonCount === '2' && (
          <Button
            variant="outline"
            label={secondaryLabel}
            onClick={onSecondaryClick}
          />
        )}
        <Button
          variant="primary"
          label={primaryLabel}
          onClick={onPrimaryClick}
        />
      </div>
    </div>
  );
};
