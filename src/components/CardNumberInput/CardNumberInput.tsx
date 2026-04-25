import type { ReactNode } from 'react';
import type { InputProps } from '../Input';
import { Input } from '../Input';

export interface CardNumberInputProps
  extends Omit<InputProps, 'type' | 'leadingNode' | 'addonButton' | 'showCount' | 'maxLength'> {
  /**
   * The card-issuer brand badge (Visa / Mastercard / Amex / JCB / etc.)
   * shown to the LEFT of the input value, inside a small white-bg pill.
   * Pass any ReactNode — typically an `<img>` of the brand asset, or an
   * SVG component you control. Pass `null` (or omit) to render no badge.
   */
  brand?: ReactNode;
}

/**
 * CardNumberInput — Figma: Form Value / Type=Card No.
 *
 * Wraps the standard Input with a small leading badge for the card-issuer
 * logo. The brand asset is consumer-supplied — the design system does not
 * ship Visa / Mastercard / Amex / etc. brand artwork (those are licensed
 * trademarks; consumer apps own them).
 *
 *   <CardNumberInput
 *     placeholder="•••• •••• •••• ••••"
 *     brand={<img src={visaLogo} alt="Visa" className="h-[13px]" />}
 *     value={cardNumber}
 *     onChange={setCardNumber}
 *   />
 *
 * Inherits all standard Input behavior: validation, state, helperText,
 * inputRef. The input type is locked to `'text'` because card numbers
 * are typically masked/formatted (`xxxx xxxx xxxx xxxx`) and consumers
 * should handle formatting before passing to onChange.
 */
export const CardNumberInput = ({
  brand,
  className,
  ...inputProps
}: CardNumberInputProps) => {
  return (
    <Input
      {...inputProps}
      type="text"
      className={className}
      leadingNode={
        brand ? (
          <span
            className={[
              'inline-flex items-center justify-center',
              'px-[var(--spacing-2)] py-[var(--spacing-4)]',
              'bg-[var(--color-white)]',
              'border border-solid border-[color:var(--color-divider-light)]',
              'rounded-[var(--radius-2)]',
            ].join(' ')}
          >
            {brand}
          </span>
        ) : undefined
      }
    />
  );
};
