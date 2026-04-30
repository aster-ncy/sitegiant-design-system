import type { CSSProperties } from 'react';

export type TooltipArrow = 'none' | 'up' | 'down' | 'left' | 'right';

export interface TooltipBoxProps {
  /** Tooltip message (string or custom node) */
  message: React.ReactNode;
  /** Which side the arrow points — 'down' = arrow on bottom edge pointing down */
  arrow?: TooltipArrow;
  /** Fixed width in px. Omit for auto. */
  width?: number;
  /** HTML id for the tooltip's message box. Required when used inside <TooltipTrigger>. */
  id?: string;
  className?: string;
}

const ARROW_BASE = 4;
export const ARROW_HEIGHT = 6;

const messageBoxClasses = [
  'p-[var(--spacing-4)]',
  'bg-[var(--color-overlay-80)]',
  'text-[color:var(--color-text-ondark)]',
  'text-[length:var(--text-12)]',
  'leading-[var(--leading-16)]',
  'font-[var(--font-weight-regular)]',
  'font-[family-name:var(--font-sans)]',
  'flex flex-col items-start',
].join(' ');

const arrowBase: CSSProperties = {
  display: 'block',
  width: 0,
  height: 0,
  borderStyle: 'solid',
};

const arrowStyles: Record<Exclude<TooltipArrow, 'none'>, CSSProperties> = {
  down: {
    ...arrowBase,
    borderWidth: `${ARROW_HEIGHT}px ${ARROW_BASE}px 0 ${ARROW_BASE}px`,
    borderColor: 'var(--color-overlay-80) transparent transparent transparent',
  },
  up: {
    ...arrowBase,
    borderWidth: `0 ${ARROW_BASE}px ${ARROW_HEIGHT}px ${ARROW_BASE}px`,
    borderColor: 'transparent transparent var(--color-overlay-80) transparent',
  },
  left: {
    ...arrowBase,
    borderWidth: `${ARROW_BASE}px ${ARROW_HEIGHT}px ${ARROW_BASE}px 0`,
    borderColor: 'transparent var(--color-overlay-80) transparent transparent',
  },
  right: {
    ...arrowBase,
    borderWidth: `${ARROW_BASE}px 0 ${ARROW_BASE}px ${ARROW_HEIGHT}px`,
    borderColor: 'transparent transparent transparent var(--color-overlay-80)',
  },
};

/**
 * Internal — sibling-import only. Not re-exported from Tooltip/index.ts or
 * components/index.ts. Used by <Tooltip> (the legacy compound) and by
 * <TooltipTrigger> (the new wrapper) to render the bubble itself.
 *
 * Pure presentational: no listeners, no portal, no state.
 */
export const TooltipBox = ({
  message,
  arrow = 'none',
  width,
  id,
  className = '',
}: TooltipBoxProps) => {
  const wrapperStyle: CSSProperties | undefined = width ? { width } : undefined;

  const renderBox = () => (
    <div role="tooltip" id={id} className={messageBoxClasses}>
      <span className="flex-1 self-stretch">{message}</span>
    </div>
  );

  const renderArrow = (dir: Exclude<TooltipArrow, 'none'>) => (
    <span aria-hidden="true" style={arrowStyles[dir]} />
  );

  if (arrow === 'left' || arrow === 'right') {
    return (
      <div
        className={['inline-flex items-center', className].filter(Boolean).join(' ')}
        style={wrapperStyle}
      >
        {arrow === 'left' && renderArrow('left')}
        {renderBox()}
        {arrow === 'right' && renderArrow('right')}
      </div>
    );
  }

  return (
    <div
      className={['inline-flex flex-col items-center', className].filter(Boolean).join(' ')}
      style={wrapperStyle}
    >
      {arrow === 'up' && <span className="self-center">{renderArrow('up')}</span>}
      {renderBox()}
      {arrow === 'down' && <span className="self-center">{renderArrow('down')}</span>}
    </div>
  );
};
