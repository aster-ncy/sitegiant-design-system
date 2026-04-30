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
 * Thin pass-through to <TooltipBox>. TooltipBox owns the flex wrapper that
 * lays out the arrow + message, so legacy callsites and stories render
 * byte-identical to the pre-refactor implementation (a single
 * `inline-flex flex-col items-center` outer div containing the bubble).
 */
export const Tooltip = ({
  message,
  arrow = 'none',
  width,
  id,
  className = '',
}: TooltipProps) => (
  <TooltipBox
    message={message}
    arrow={arrow}
    width={width}
    id={id}
    className={className}
  />
);
