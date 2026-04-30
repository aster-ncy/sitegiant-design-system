import type { ReactNode } from 'react';
import {
  glyphForName,
  isColorPickerGlyph,
  isDeviceGlyph,
  type SmallSegmentedGlyphName,
} from './glyphHelpers';

export type SmallSegmentedSegmentPosition = 'first' | 'center' | 'last' | 'single';

export type SmallSegmentedGlyph =
  | { kind: 'inline'; name: SmallSegmentedGlyphName }
  | { kind: 'custom'; node: ReactNode };

export interface SmallSegmentedButtonSegmentProps {
  value: string;
  glyph: SmallSegmentedGlyph;
  'aria-label': string;
  disabled?: boolean;
  className?: string;
  /**
   * Replaces (not appends) the segment's built-in glyph color class. Use when
   * a host context needs to override icon color — Tailwind v4 resolves utility
   * conflicts by stylesheet insertion order, not class-string order, so
   * append-style overrides are unreliable.
   */
  glyphClassName?: string;
  /** Injected by <SmallSegmentedButton>. Do not pass directly. */
  __position?: SmallSegmentedSegmentPosition;
  /** Injected by <SmallSegmentedButton>. Do not pass directly. */
  __isSelected?: boolean;
  /** Injected by <SmallSegmentedButton>. Do not pass directly. */
  __onClick?: () => void;
  /** Injected by <SmallSegmentedButton> for roving tabindex. Do not pass directly. */
  __tabIndex?: number;
}

const radiusByPosition: Record<SmallSegmentedSegmentPosition, string> = {
  first: 'rounded-l-[var(--radius-2)]',
  center: '',
  last: 'rounded-r-[var(--radius-2)]',
  single: 'rounded-[var(--radius-2)]',
};

export const SmallSegmentedButtonSegment = ({
  glyph,
  disabled = false,
  className = '',
  glyphClassName = '',
  'aria-label': ariaLabel,
  __position = 'single',
  __isSelected = false,
  __onClick,
  __tabIndex,
}: SmallSegmentedButtonSegmentProps) => {
  const isLast = __position === 'last' || __position === 'single';

  const fill = __isSelected
    ? 'bg-[var(--color-tab-small-selected-fill)]'
    : 'bg-[var(--color-tab-small-default-fill)]';

  const iconColor = 'text-[color:var(--color-tab-small-icon-default)]';

  const classes = [
    'inline-flex items-center justify-center shrink-0 relative',
    'w-[23px] h-full p-[var(--spacing-2)]',
    'border border-solid border-[color:var(--color-tab-small-border)]',
    radiusByPosition[__position],
    fill,
    isLast ? '' : 'mr-[-1px]',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-[var(--button-primary-default-fill)]',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (disabled) return;
    __onClick?.();
  };

  const renderGlyph = () => {
    if (glyph.kind === 'custom') {
      return (
        <span className="flex h-full w-full items-center justify-center">
          {glyph.node}
        </span>
      );
    }

    const colorClass = glyphClassName || iconColor;

    if (isColorPickerGlyph(glyph.name) || isDeviceGlyph(glyph.name)) {
      return (
        <span
          className={`flex h-full w-full items-center justify-center ${colorClass}`}
        >
          {glyphForName(glyph.name)}
        </span>
      );
    }

    return null;
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={__isSelected}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={__tabIndex}
      onClick={handleClick}
      className={classes}
    >
      {renderGlyph()}
    </button>
  );
};
