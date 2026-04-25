import type { ReactNode } from 'react';

export interface UnderlinedTextFieldProps {
  /** The value/text to display. */
  children: ReactNode;
  className?: string;
}

/**
 * UnderlinedTextField — Figma: General/Underlined Text Field.
 *
 * A read-only display element that shows a value sitting on a thin
 * 1px bottom underline. Used in inline editable previews and detail
 * lists where the underline hints "this is editable / has a value
 * underneath".
 *
 *   <UnderlinedTextField>{user.name}</UnderlinedTextField>
 */
export const UnderlinedTextField = ({
  children,
  className = '',
}: UnderlinedTextFieldProps) => {
  return (
    <span
      className={[
        'inline-flex items-center py-[var(--spacing-4)]',
        'bg-[var(--color-white)]',
        'shadow-[inset_0_-1px_0_0_rgb(0_0_0_/_0.25)]',
        'font-[family-name:var(--general-font-family)]',
        'text-[length:var(--general-form-label-size)]',
        'leading-[var(--general-form-label-lineheight)]',
        'font-[var(--font-weight-regular)]',
        'text-[color:var(--form-label-text)]',
        'whitespace-nowrap',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
};
