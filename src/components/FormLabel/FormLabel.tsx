import type { ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export type FormLabelSize = 'sm' | 'md' | 'lg';
export type FormLabelWeight = 'regular' | 'medium' | 'bold';

export interface FormLabelProps {
  /** Label text. */
  label: string;
  /** Size — sm=12px, md=14px (default), lg=16px. */
  size?: FormLabelSize;
  /** Font weight. Figma: Default | Medium | Bold. */
  weight?: FormLabelWeight;
  /** Show the leading red `*` required indicator. */
  required?: boolean;
  /** Show the trailing icon. Defaults to `info` when true. */
  showIcon?: boolean;
  /** Override the trailing icon (defaults to 'info'). */
  icon?: IconName;
  /** Optional hint text rendered under the label. */
  hintText?: ReactNode;
  /** htmlFor — links the <label> to a form field by id. */
  htmlFor?: string;
  className?: string;
}

const labelTextSizeBySize: Record<FormLabelSize, string> = {
  sm: 'text-[length:var(--general-form-label-small-size)] leading-[var(--general-form-label-small-lineheight)]',
  md: 'text-[length:var(--general-form-label-size)] leading-[var(--general-form-label-lineheight)]',
  lg: 'text-[length:var(--general-form-label-large-size)] leading-[var(--general-form-label-large-lineheight)]',
};

const fontWeightClass: Record<FormLabelWeight, string> = {
  regular: 'font-[var(--font-weight-regular)]',
  medium: 'font-[var(--font-weight-medium)]',
  bold: 'font-[var(--font-weight-bold)]',
};

const hintTextSizeBySize: Record<FormLabelSize, string> = {
  sm: 'text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)]',
  md: 'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
  lg: 'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
};

/**
 * FormLabel — Figma: General/Form Label.
 *
 * Composable label block for form fields: optional `*` required indicator,
 * label text in 3 sizes × 3 weights, optional trailing icon (default `info`),
 * optional hint-text caption underneath. The small size dims the label text
 * to `--form-label-info-text` per Figma (used for compact dense forms);
 * default and large render in `--form-label-text`.
 *
 * Pair with the form fields via `htmlFor`:
 *
 *   <FormLabel label="Email" required htmlFor="email" />
 *   <Input id="email" type="email" />
 */
export const FormLabel = ({
  label,
  size = 'md',
  weight = 'regular',
  required = false,
  showIcon = false,
  icon = 'info',
  hintText,
  htmlFor,
  className = '',
}: FormLabelProps) => {
  const isSmall = size === 'sm';
  // Small size uses the muted info text color per Figma; md/lg use primary.
  const labelColor = isSmall
    ? 'text-[color:var(--form-label-info-text)]'
    : 'text-[color:var(--form-label-text)]';

  const iconSize = isSmall ? 13 : 17;

  return (
    <label
      htmlFor={htmlFor}
      className={[
        'inline-flex flex-col items-start gap-[var(--spacing-0)]',
        'font-[family-name:var(--general-font-family)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="inline-flex items-center gap-[var(--spacing-4)]">
        {required && (
          <span
            aria-hidden="true"
            className={[
              labelTextSizeBySize[size],
              'text-[color:var(--color-sys-red-DEFAULT)]',
              fontWeightClass[weight],
            ].join(' ')}
          >
            *
          </span>
        )}
        <span
          className={[
            labelTextSizeBySize[size],
            labelColor,
            fontWeightClass[weight],
            'whitespace-nowrap',
          ].join(' ')}
        >
          {label}
        </span>
        {showIcon && (
          <span className="inline-flex items-center p-[var(--spacing-4)]">
            <Icon
              name={icon}
              size={iconSize}
              className="text-[color:var(--form-label-info-text)]"
            />
          </span>
        )}
      </span>
      {hintText && (
        <span
          className={[
            hintTextSizeBySize[size],
            'text-[color:var(--color-text-info)]',
            'font-[var(--font-weight-regular)]',
          ].join(' ')}
        >
          {hintText}
        </span>
      )}
    </label>
  );
};
