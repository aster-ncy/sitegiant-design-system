import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type {
  FocusEvent as ReactFocusEvent,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { TooltipBox, ARROW_HEIGHT } from './TooltipBox';
import type { TooltipArrow } from './TooltipBox';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TriggerChildProps = HTMLAttributes<HTMLElement> & {
  'aria-describedby'?: string;
};

export interface TooltipTriggerProps {
  /** Tooltip text or node — what appears in the bubble. */
  content: ReactNode;
  /** Preferred side of the trigger. Auto-flips on viewport collision. Default 'top'. */
  placement?: TooltipPlacement;
  /** Fixed bubble width in px. Omit for auto. */
  width?: number;
  /** Hover-open delay in ms. Default 150. */
  openDelay?: number;
  /** Set false to suppress the tooltip without unmounting the wrapper. Default true. */
  enabled?: boolean;
  /**
   * Class string appended (space-joined) to the wrapper `<span>`'s built-in
   * `inline-flex` class. Append, not replace — `inline-flex` always stays
   * so the wrapper preserves event-receiving layout behavior.
   */
  wrapperClassName?: string;
  /**
   * The trigger element. MUST be a single React element with a name
   * (aria-label, aria-labelledby, or visible text), and MUST forward
   * `aria-describedby`, `onFocus`, `onBlur`, and `ref` to its DOM root.
   */
  children: ReactElement;
}

const VIEWPORT_MARGIN = 8;
const ANCHOR_GAP = 0;

// Suppress unused-variable warnings for Task 4 placeholders.
void VIEWPORT_MARGIN;
void ANCHOR_GAP;
// ARROW_HEIGHT is imported for Task 4's positioning offset.
void ARROW_HEIGHT;

const PLACEMENT_TO_ARROW: Record<TooltipPlacement, TooltipArrow> = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left',
};

const appendId = (existing: string | undefined, newId: string) =>
  existing ? `${existing} ${newId}` : newId;

const composeHandler = <E,>(
  consumer: ((e: E) => void) | undefined,
  ours: (e: E) => void,
) =>
  (e: E) => {
    consumer?.(e);
    ours(e);
  };

function useMergedRef<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === 'function') ref(value);
        else (ref as MutableRefObject<T | null>).current = value;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}

export const TooltipTrigger = ({
  content,
  placement = 'top',
  width,
  openDelay = 150,
  enabled = true,
  wrapperClassName,
  children,
}: TooltipTriggerProps) => {
  if (!import.meta.env.PROD && !isValidElement(children)) {
    throw new Error(
      '<TooltipTrigger>: `children` must be a single React element. Got: ' + typeof children,
    );
  }

  const reactId = useId();
  const tooltipId = `tooltip-${reactId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [resolvedPlacement, setResolvedPlacement] = useState<TooltipPlacement>(placement);

  const triggerRef = useRef<HTMLElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<number | null>(null);

  // Suppress unused-variable warning for Task 4 state setter.
  void setResolvedPlacement;

  const close = useCallback(() => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    setIsOpen(false);
    setCoords(null);
  }, []);

  // mouseenter / mouseleave on the wrapper
  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setIsOpen(true), openDelay);
  }, [enabled, openDelay]);

  const handleMouseLeave = useCallback(() => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    setIsOpen(false);
  }, []);

  // focus / blur on the cloned child
  const handleFocus = useCallback(
    (e: ReactFocusEvent<HTMLElement>) => {
      if (!enabled) return;
      try {
        if (e.target.matches(':focus-visible')) setIsOpen(true);
      } catch {
        // matches(':focus-visible') threw — older browser. Treat as no-match.
      }
    },
    [enabled],
  );

  const handleBlur = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Cancel pending open timer if `enabled` flips false mid-flight.
  // We do NOT call setState here to avoid cascading renders — instead we
  // derive `effectivelyOpen` from `isOpen && enabled` below so the portal
  // disappears immediately without a secondary render cycle.
  useEffect(() => {
    if (!enabled && openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, [enabled]);

  // Document-level Escape listener — only attached while effectively open.
  const effectivelyOpen = isOpen && enabled;
  useEffect(() => {
    if (!effectivelyOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [effectivelyOpen, close]);

  // Cleanup pending open timer on unmount.
  useEffect(
    () => () => {
      if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    },
    [],
  );

  // Build the cloned child with ref + aria-describedby + composed focus/blur.
  const childProps = children.props as TriggerChildProps;
  const childRef = (children as { ref?: Ref<HTMLElement> }).ref;
  const mergedRef = useMergedRef(triggerRef, childRef);

  const trigger = cloneElement(children, {
    ref: mergedRef,
    'aria-describedby': effectivelyOpen
      ? appendId(childProps['aria-describedby'], tooltipId)
      : childProps['aria-describedby'],
    onFocus: composeHandler<ReactFocusEvent<HTMLElement>>(childProps.onFocus, handleFocus),
    onBlur: composeHandler<ReactFocusEvent<HTMLElement>>(childProps.onBlur, handleBlur),
  } as Partial<TriggerChildProps> & { ref: Ref<HTMLElement> });

  const wrapperClass = ['inline-flex', wrapperClassName].filter(Boolean).join(' ');

  const portal =
    effectivelyOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={bubbleRef}
            className="z-50"
            style={{
              position: 'fixed',
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              visibility: coords ? 'visible' : 'hidden',
            }}
          >
            <TooltipBox
              id={tooltipId}
              message={content}
              arrow={PLACEMENT_TO_ARROW[resolvedPlacement]}
              width={width}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <span
        className={wrapperClass}
        data-tooltip-trigger=""
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </span>
      {portal}
    </>
  );
};
