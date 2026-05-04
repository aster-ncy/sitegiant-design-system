import type { ReactNode } from 'react';
import { Typography } from '../Typography/Typography';

export type TextLinkVariant = 'basic' | 'subtle';
export type TextLinkIconPosition = 'none' | 'left' | 'right';

export interface TextLinkProps {
  label: string;
  variant?: TextLinkVariant;
  iconPosition?: TextLinkIconPosition;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const textClasses: Record<TextLinkVariant, string> = {
  basic: 'text-[color:var(--text-link-basic-default)] hover:text-[color:var(--text-link-basic-hover)]',
  subtle: 'text-[color:var(--text-link-subtle-default)] hover:text-[color:var(--text-link-subtle-hover)]',
};

export const TextLink = ({
  label,
  variant = 'basic',
  iconPosition = 'none',
  icon,
  disabled = false,
  onClick,
  className = '',
}: TextLinkProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-[var(--spacing-4)] whitespace-nowrap',
        'rounded-[var(--radius-120)]',
        'transition-colors',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        textClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {iconPosition === 'left' && icon}
      <Typography type="body-slim" state="inherit">
        {label}
      </Typography>
      {iconPosition === 'right' && icon}
    </button>
  );
};
