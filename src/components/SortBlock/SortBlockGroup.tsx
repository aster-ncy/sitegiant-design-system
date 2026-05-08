import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { appendClass } from './shared';

export interface SortBlockGroupProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Row is currently being held by the user during drag. Flips every
   *  SortBlock child's fill one shade darker via the
   *  `--sorting-block-sorting-fill` CSS variable cascade.
   *  Mutually exclusive with `disabled` — `disabled` wins when both true. */
  dragging?: boolean;
  /** Row cannot be reordered. Flips every SortBlock child's fill one shade
   *  lighter, tints text and icons to the muted disabled tone via CSS
   *  variable cascade (`--color-text-primary`, `--color-text-info`,
   *  `--color-icon-secondary` → `--color-text-muted`), and applies
   *  `aria-disabled="true"` to the root. Wins over `dragging` when both
   *  are true. Does NOT apply `cursor-not-allowed` (descendants with their
   *  own cursor classes would override) and does NOT disable interactive
   *  descendants — consumers handle that.
   *  **`disabled` is the source of truth for `aria-disabled`:** any
   *  `aria-disabled` passed via `...rest` is overwritten. */
  disabled?: boolean;
  /** The strip of SortBlock cells. */
  children?: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = 'flex w-full';

/**
 * SortBlockGroup — wrapper for a flex strip of SortBlock cells that owns
 * row-level visual state (dragging / disabled) by overriding the
 * `--sorting-block-sorting-fill` CSS variable on its root. Every family
 * member already reads that variable through `FILL_CLASS`, so the fill flip
 * cascades to descendants without modifying any of the seven cell
 * components.
 *
 * Forwards `ref` and spreads arbitrary div props so `@dnd-kit/sortable`'s
 * `setNodeRef`, `transform`, `transition`, `attributes`, and `listeners` can
 * attach without re-wrapping when DnD wiring lands.
 */
export const SortBlockGroup = forwardRef<HTMLDivElement, SortBlockGroupProps>(
  ({ dragging = false, disabled = false, children, className, style, ...rest }, ref) => {
    // State styles override CSS variables consumed by descendants:
    //   --sorting-block-sorting-fill        — row background
    //   --color-text-primary / --color-text-info / --color-icon-secondary
    //                                       — content tinted muted when disabled
    // Disabled wins over dragging when both true.
    const stateStyle: CSSProperties | undefined = disabled
      ? ({
          '--sorting-block-sorting-fill': 'var(--color-space-lighter)',
          '--color-text-primary': 'var(--color-text-muted)',
          '--color-text-info': 'var(--color-text-muted)',
          '--color-icon-secondary': 'var(--color-text-muted)',
        } as CSSProperties)
      : dragging
      ? ({ '--sorting-block-sorting-fill': 'var(--color-space-DEFAULT)' } as CSSProperties)
      : undefined;

    // Built-in state vars first; consumer style spread after so consumer keys
    // win on conflict (intentional escape hatch — consumer can override the
    // row state if they truly need to).
    const mergedStyle: CSSProperties | undefined =
      stateStyle || style ? { ...stateStyle, ...style } : undefined;

    return (
      <div
        {...rest}
        ref={ref}
        className={appendClass(ROOT_BASE, className)}
        style={mergedStyle}
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    );
  },
);

SortBlockGroup.displayName = 'SortBlockGroup';
