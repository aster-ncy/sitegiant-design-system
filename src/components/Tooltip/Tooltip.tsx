import type { CSSProperties } from 'react';
import { TooltipBox } from './TooltipBox';
import type { TooltipArrow } from './TooltipBox';

export type { TooltipArrow };

export interface TooltipProps {
  /** Tooltip message (string or custom node) */
  message: React.ReactNode;
  /** Which side the arrow points — 'down' = message sits above target, arrow on bottom pointing down */
  arrow?: TooltipArrow;
  /** Fixed width in px. Omit for auto. */
  width?: number;
  /**
   * HTML id for the tooltip's message box. Pair with `aria-describedby` on the
   * trigger element to expose this tooltip to assistive technology, e.g.:
   *   <button aria-describedby="save-hint">Save</button>
   *   <Tooltip id="save-hint" message="Saves to the cloud" />
   */
  id?: string;
  className?: string;
}

/**
 * Static styled tooltip bubble. Renders inline; does not own hover or focus
 * listeners. For hover-/focus-driven tooltips that wrap a trigger, use
 * <TooltipTrigger>.
 *
 * The outer `inline-flex flex-col items-center` wrapper is preserved from the
 * pre-refactor implementation so existing callsites and stories render
 * byte-identical.
 */
export const Tooltip = ({
  message,
  arrow = 'none',
  width,
  id,
  className = '',
}: TooltipProps) => {
  const wrapperStyle: CSSProperties | undefined = width ? { width } : undefined;

  if (arrow === 'left' || arrow === 'right') {
    return (
      <div
        className={['inline-flex items-center', className].filter(Boolean).join(' ')}
        style={wrapperStyle}
      >
        <TooltipBox message={message} arrow={arrow} id={id} />
      </div>
    );
  }

  return (
    <div
      className={['inline-flex flex-col items-center', className].filter(Boolean).join(' ')}
      style={wrapperStyle}
    >
      <TooltipBox message={message} arrow={arrow} id={id} />
    </div>
  );
};
