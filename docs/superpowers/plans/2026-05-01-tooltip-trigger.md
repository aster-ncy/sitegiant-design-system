# TooltipTrigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `<TooltipTrigger>`, a portaled hover-/focus-driven tooltip wrapper, by extracting the existing `<Tooltip>`'s bubble markup into an internal `<TooltipBox>` and composing both atop it.

**Architecture:** Three-component split inside the existing `src/components/Tooltip/` folder. `TooltipBox` (new, internal) renders the bubble + arrow markup with no listeners or wrapper. `Tooltip` (existing, public — refactored to compose `TooltipBox`) keeps its byte-identical render. `TooltipTrigger` (new, public) wraps a single React-element child in a `<span class="inline-flex">`, owns hover/focus listeners, portals a `TooltipBox` to `document.body` with hand-rolled position math + auto-flip, and injects `aria-describedby` + composed event handlers + a merged ref into the cloned child.

**Tech Stack:** React 19 + TypeScript 5.9 (strict), Tailwind CSS v4, Storybook 10. Zero new dependencies. `createPortal` from `react-dom` (already used in `TimeRange.tsx:447`). No external positioning library — viewport math is hand-rolled, mirroring the `TimeRange` precedent.

**Source spec:** `docs/superpowers/specs/2026-05-01-tooltip-trigger-design.md` (commit `76f07ae`).

---

## Conventions for this plan

- **Verification = Storybook stories + a11y addon + manual hover/focus check + Codex review.** This codebase does not run component-level Jest/Vitest unit tests; per AGENTS.md and project memory, stories are the test surface. Each story isolates one decision so it can be visually verified.
- **Lint and build commands** are `npm run lint` and `npm run build` (`tsc -b && vite build`), run from `sitegiant-storybook/`.
- **Storybook dev server** is `npm run storybook` (port 6006). Already running in the user's terminal.
- **Git author check:** `git config user.email` must be `aster.sitegiant@gmail.com` before any commit (per project memory). Do **not** amend commits — always create new ones.
- **Cross-terminal hygiene:** when staging, use explicit pathspecs (`git add <path>`) and prefer `git commit -- <path>` to avoid pulling in another terminal's staged work. The other terminal works on TableCell/TableHeaderCell/TableSelectionBar/TableExpandToggle and `src/stories/Table/` — leave those alone.

## File structure

```
src/components/Tooltip/
├── Tooltip.tsx                    [MODIFY] refactor to compose <TooltipBox>; preserve public API
├── TooltipBox.tsx                 [CREATE] internal — bubble + arrow markup; sibling-import-only
├── TooltipTrigger.tsx             [CREATE] wrapper + listeners + portal + positioning
├── Tooltip.stories.tsx            [UNCHANGED] legacy stories must continue rendering identically
├── TooltipTrigger.stories.tsx     [CREATE] 11 stories
└── index.ts                       [MODIFY] append TooltipTrigger + TooltipPlacement exports

src/components/index.ts            [MODIFY] append TooltipTrigger + TooltipPlacement exports
```

**Token additions: zero.** All TooltipBox styles reuse tokens the existing `Tooltip` already references (`--color-overlay-80`, `--color-text-ondark`, `--text-12`, `--leading-16`, `--spacing-4`, `--font-sans`, `--font-weight-regular`).

---

### Task 1: Extract `<TooltipBox>` (internal)

**Why first:** Both `<Tooltip>` (refactor target) and `<TooltipTrigger>` (new) compose `<TooltipBox>`. Defining it first lets us refactor and consume it without circular work.

**Files:**
- Create: `src/components/Tooltip/TooltipBox.tsx`

- [ ] **Step 1: Create `TooltipBox.tsx` with bubble + arrow markup, no outer flex wrapper**

```tsx
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
```

This is a 1:1 lift of the existing `Tooltip.tsx` markup body — same JSX, same tokens, same arrow geometry. Only added: an exported `ARROW_HEIGHT` constant for `TooltipTrigger` to reuse.

- [ ] **Step 2: Lint and typecheck**

Run: `npm run lint`
Expected: No new errors (the pre-existing PrefixInput lint error is tolerated per project memory).

Run: `npm run build`
Expected: Exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Tooltip/TooltipBox.tsx
git commit -m "feat(tooltip-box): extract internal bubble+arrow markup atom

TooltipBox is the bubble itself — no outer flex wrapper, no listeners,
no state. Sibling-import only; not re-exported from Tooltip/index.ts
or components/index.ts. Both <Tooltip> (legacy compound) and the new
<TooltipTrigger> compose it.

Also exports ARROW_HEIGHT (= 6) so <TooltipTrigger> can compute the
trigger-to-bubble offset without duplicating the constant."
```

---

### Task 2: Refactor `<Tooltip>` to compose `<TooltipBox>`

**Why:** Spec promises the legacy `<Tooltip>` keeps its byte-identical render. This task collapses the bubble+arrow markup into a `<TooltipBox>` call while preserving the outer `inline-flex flex-col items-center` wrapper that callers depend on.

**Files:**
- Modify: `src/components/Tooltip/Tooltip.tsx`

- [ ] **Step 1: Replace the body of `Tooltip.tsx`**

Replace the entire file with:

```tsx
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
```

Note that `<TooltipBox>` already produces its own outer `inline-flex` wrapper. Wrapping it in `<Tooltip>`'s legacy outer `<div>` produces a slightly nested structure (`<div class="inline-flex flex-col items-center"><div class="inline-flex flex-col items-center">…</div></div>`) but that's intentional — the outer wrapper is what existing `Tooltip.stories.tsx` expects, and the inner `TooltipBox` wrapper is what `<TooltipTrigger>` will use directly. Both wrappers are visually identical, so the legacy render is preserved.

- [ ] **Step 2: Verify legacy stories still render byte-identically**

Open Storybook: navigate to `Feedback/Tooltip → ArrowDown`, `ArrowUp`, `ArrowLeft`, `ArrowRight`, `NoArrow`, `LongMessage`, `AllArrows`.

For each story, verify:
- The bubble renders.
- The arrow direction matches the story name.
- Message text + width + token colors look identical to before (compare against current production Storybook at https://aster-ncy.github.io/sitegiant-design-system/ if needed).

If any story regresses, halt and investigate before continuing.

- [ ] **Step 3: Lint + build**

Run: `npm run lint`
Expected: No new errors.

Run: `npm run build`
Expected: Exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/Tooltip/Tooltip.tsx
git commit -m "refactor(tooltip): compose <TooltipBox> instead of inlining markup

Public API and visual output are unchanged. The bubble + arrow markup
now lives in TooltipBox; <Tooltip> keeps its outer
\`inline-flex flex-col items-center\` wrapper so existing stories and
any future callsites render byte-identical.

Re-exports TooltipArrow from TooltipBox to preserve the legacy
re-export chain through Tooltip/index.ts."
```

---

### Task 3: Build `<TooltipTrigger>` core (state machine + listeners + portal)

**Why:** This is the bulk of the new component — open/close lifecycle, hover/focus listeners, portal mounting, Escape handling, scroll/resize reposition. Positioning math comes in Task 4 to keep this task in the 2-5 minute range per step.

**Files:**
- Create: `src/components/Tooltip/TooltipTrigger.tsx`

- [ ] **Step 1: Scaffold the file with imports, types, and the `useMergedRef` helper**

Create `src/components/Tooltip/TooltipTrigger.tsx`:

```tsx
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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
) => (e: E) => {
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

// Body of the component lands in Step 2.
export const TooltipTrigger = (_props: TooltipTriggerProps): React.ReactElement => {
  throw new Error('TooltipTrigger: not yet implemented (filled in Step 2)');
};
```

- [ ] **Step 2: Implement the component body — state, listeners, portal mount (no positioning yet)**

Replace the placeholder `TooltipTrigger` export at the bottom of the file with:

```tsx
export const TooltipTrigger = ({
  content,
  placement = 'top',
  width,
  openDelay = 150,
  enabled = true,
  wrapperClassName,
  children,
}: TooltipTriggerProps) => {
  if (process.env.NODE_ENV !== 'production' && !isValidElement(children)) {
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

  // Force-close when `enabled` flips false mid-flight.
  useEffect(() => {
    if (!enabled && isOpen) close();
  }, [enabled, isOpen, close]);

  // Document-level Escape listener — only attached while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  // Cleanup pending open timer on unmount.
  useEffect(() => () => {
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
  }, []);

  // Build the cloned child with ref + aria-describedby + composed focus/blur.
  const childProps = children.props as TriggerChildProps;
  const childRef = (children as { ref?: Ref<HTMLElement> }).ref;
  const mergedRef = useMergedRef(triggerRef, childRef);

  const trigger = cloneElement(children, {
    ref: mergedRef,
    'aria-describedby': isOpen
      ? appendId(childProps['aria-describedby'], tooltipId)
      : childProps['aria-describedby'],
    onFocus: composeHandler<ReactFocusEvent<HTMLElement>>(childProps.onFocus, handleFocus),
    onBlur: composeHandler<ReactFocusEvent<HTMLElement>>(childProps.onBlur, handleBlur),
  } as Partial<TriggerChildProps> & { ref: Ref<HTMLElement> });

  const wrapperClass = ['inline-flex', wrapperClassName].filter(Boolean).join(' ');

  const portal =
    isOpen && typeof document !== 'undefined'
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
```

Note that `coords` and `resolvedPlacement` are used here but the layout effect that *sets* them is added in Task 4 — until then, the bubble portal renders with `visibility: hidden` and stays invisible. That's fine for this checkpoint: state machine + listeners + ARIA wiring + DOM shape can all be verified before positioning lands.

- [ ] **Step 3: Lint + build**

Run: `npm run lint`
Expected: No new errors.

Run: `npm run build`
Expected: Exits 0.

If TS complains about `cloneElement`'s prop types, the `as Partial<TriggerChildProps> & { ref: Ref<HTMLElement> }` cast at the end of the cloneElement call is the documented escape hatch — verify it's there and the cast doesn't leak `any`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Tooltip/TooltipTrigger.tsx
git commit -m "feat(tooltip-trigger): scaffold component with state machine + listeners

Open/close state machine (hover with openDelay, focus gated by
:focus-visible, blur, Escape). Wrapper-owned mouseenter/mouseleave so
disabled triggers still get tooltips. cloneElement injects ref,
aria-describedby, and composed onFocus/onBlur on the single child.
Portal is wired but bubble stays visibility:hidden until positioning
lands in the next commit."
```

---

### Task 4: Positioning math + auto-flip

**Why:** This is what makes the bubble actually land on screen. Separated from Task 3 to keep diffs reviewable.

**Files:**
- Modify: `src/components/Tooltip/TooltipTrigger.tsx`

- [ ] **Step 1: Add the positioning helper above the component**

Insert this block in `TooltipTrigger.tsx`, immediately after the `composeHandler` definition and before `useMergedRef`:

```tsx
interface PositionResult {
  top: number;
  left: number;
  placement: TooltipPlacement;
}

function computePosition(
  triggerRect: DOMRect,
  bubbleRect: DOMRect,
  preferred: TooltipPlacement,
): PositionResult {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offset = ARROW_HEIGHT + ANCHOR_GAP;

  const candidate = (p: TooltipPlacement) => {
    switch (p) {
      case 'top':
        return {
          top: triggerRect.top - bubbleRect.height - offset,
          left: triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2,
        };
      case 'bottom':
        return {
          top: triggerRect.bottom + offset,
          left: triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2,
        };
      case 'left':
        return {
          top: triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2,
          left: triggerRect.left - bubbleRect.width - offset,
        };
      case 'right':
        return {
          top: triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2,
          left: triggerRect.right + offset,
        };
    }
  };

  // Available space along the placement axis (positive = fits without clipping).
  const axisSpace = (p: TooltipPlacement) => {
    switch (p) {
      case 'top':
        return triggerRect.top - bubbleRect.height - offset - VIEWPORT_MARGIN;
      case 'bottom':
        return vh - triggerRect.bottom - bubbleRect.height - offset - VIEWPORT_MARGIN;
      case 'left':
        return triggerRect.left - bubbleRect.width - offset - VIEWPORT_MARGIN;
      case 'right':
        return vw - triggerRect.right - bubbleRect.width - offset - VIEWPORT_MARGIN;
    }
  };

  const opposite: Record<TooltipPlacement, TooltipPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  const preferredSpace = axisSpace(preferred);
  if (preferredSpace >= 0) {
    return { ...candidate(preferred), placement: preferred };
  }

  // Preferred clips. Pick the larger of preferred vs opposite — even if both clip.
  const opp = opposite[preferred];
  const oppSpace = axisSpace(opp);
  const winner = oppSpace > preferredSpace ? opp : preferred;
  return { ...candidate(winner), placement: winner };
}
```

- [ ] **Step 2: Add the `useLayoutEffect` that drives positioning**

Inside the component body, immediately after the existing `useEffect(() => () => { if (openTimer.current !== null) … }, [])` cleanup effect, add:

```tsx
  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    if (!triggerRef.current || !bubbleRef.current) return undefined;

    const recompute = () => {
      if (!triggerRef.current || !bubbleRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const bubbleRect = bubbleRef.current.getBoundingClientRect();
      const next = computePosition(triggerRect, bubbleRect, placement);
      setCoords({ top: next.top, left: next.left });
      setResolvedPlacement(next.placement);
    };

    recompute();

    const onScroll = () => recompute();
    const onResize = () => recompute();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen, placement, content, width]);
```

`content` and `width` are deps so a content/width change while open recomputes (per spec edge-cases table).

- [ ] **Step 3: Lint + build**

Run: `npm run lint`
Expected: No new errors.

Run: `npm run build`
Expected: Exits 0.

- [ ] **Step 4: Manual smoke test before stories**

Temporarily add this snippet to `Tooltip.stories.tsx`'s `AllArrows` story file (or any existing story you can edit briefly):

```tsx
// Temporary smoke test — REMOVE before commit.
import { TooltipTrigger } from './TooltipTrigger';

export const _SmokeTooltipTrigger = {
  render: () => (
    <div style={{ padding: 80 }}>
      <TooltipTrigger content="Hello world" placement="top">
        <button aria-label="Smoke test">Hover me</button>
      </TooltipTrigger>
    </div>
  ),
};
```

In Storybook, navigate to `Feedback/Tooltip → Smoke Tooltip Trigger`. Hover the button. Verify:
- Bubble appears ~150ms after hover, centered above the button.
- Bubble disappears immediately on un-hover.
- Tab to focus the button → bubble appears with no delay.
- Press Escape → bubble closes.
- DevTools: confirm the `<div role="tooltip">` is a direct child of `<body>` (portal verification).

Remove the smoke story after verification — do not commit it.

- [ ] **Step 5: Commit**

```bash
git add src/components/Tooltip/TooltipTrigger.tsx
git commit -m "feat(tooltip-trigger): viewport-aware positioning with auto-flip

Hand-rolled position math mirrors TimeRange.tsx. Single-pass auto-flip:
if preferred placement clips, fall back to opposite if it has more
axis-space, else stay on preferred. Cross-axis is centered with no
shift — best-effort, may overflow in tight viewports (per spec
non-goal). Reposition listeners use {capture:true} for scrolls in any
ancestor, {passive:true} to avoid jank."
```

---

### Task 5: Wire exports and write the 11 stories

**Why:** Make `<TooltipTrigger>` reachable from consumers and each design decision visible in Storybook.

**Files:**
- Modify: `src/components/Tooltip/index.ts`
- Modify: `src/components/index.ts`
- Create: `src/components/Tooltip/TooltipTrigger.stories.tsx`

- [ ] **Step 1: Append `TooltipTrigger` exports to `Tooltip/index.ts`**

Replace the contents of `src/components/Tooltip/index.ts` with:

```ts
export { Tooltip } from './Tooltip';
export type { TooltipProps, TooltipArrow } from './Tooltip';

export { TooltipTrigger } from './TooltipTrigger';
export type { TooltipTriggerProps, TooltipPlacement } from './TooltipTrigger';
```

`TooltipBox` is intentionally NOT exported here — it stays sibling-import-only.

- [ ] **Step 2: Append `TooltipTrigger` exports to the package barrel**

Modify `src/components/index.ts`. Find the `// Tooltip` block (currently lines 332-334):

```ts
// Tooltip
export { Tooltip } from './Tooltip';
export type { TooltipProps, TooltipArrow } from './Tooltip';
```

Replace with:

```ts
// Tooltip
export { Tooltip, TooltipTrigger } from './Tooltip';
export type {
  TooltipProps,
  TooltipArrow,
  TooltipTriggerProps,
  TooltipPlacement,
} from './Tooltip';
```

- [ ] **Step 3: Create `TooltipTrigger.stories.tsx` with all 11 stories**

Create `src/components/Tooltip/TooltipTrigger.stories.tsx`:

```tsx
import { forwardRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipTrigger } from './TooltipTrigger';
import { Icon } from '../Icon';

const meta = {
  title: 'Feedback/TooltipTrigger',
  component: TooltipTrigger,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    openDelay: { control: 'number' },
    enabled: { control: 'boolean' },
    width: { control: 'number' },
    content: { control: 'text' },
  },
  args: {
    content: 'Tooltip text',
    placement: 'top',
    openDelay: 150,
    enabled: true,
  },
  render: (args) => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger {...args}>
        <button
          aria-label="Trigger"
          className="px-[var(--spacing-12)] py-[var(--spacing-8)] rounded-[var(--radius-120)] border border-solid border-[var(--button-outline-default-border)] cursor-pointer"
        >
          Hover me
        </button>
      </TooltipTrigger>
    </div>
  ),
} satisfies Meta<typeof TooltipTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 80 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <TooltipTrigger key={p} content={`Placement: ${p}`} placement={p}>
          <button
            aria-label={`Placement ${p}`}
            className="px-[var(--spacing-12)] py-[var(--spacing-8)] rounded-[var(--radius-120)] border border-solid border-[var(--button-outline-default-border)] cursor-pointer"
          >
            {p}
          </button>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const AutoFlipNearViewportEdge: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)' }}>
        <TooltipTrigger content="Should flip to bottom" placement="top">
          <button aria-label="Top edge" className="px-3 py-2 border border-solid">
            top edge (preferred top → flips)
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
        <TooltipTrigger content="Should flip to top" placement="bottom">
          <button aria-label="Bottom edge" className="px-3 py-2 border border-solid">
            bottom edge (preferred bottom → flips)
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)' }}>
        <TooltipTrigger content="Should flip to right" placement="left">
          <button aria-label="Left edge" className="px-3 py-2 border border-solid">
            left edge
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}>
        <TooltipTrigger content="Should flip to left" placement="right">
          <button aria-label="Right edge" className="px-3 py-2 border border-solid">
            right edge
          </button>
        </TooltipTrigger>
      </div>
    </div>
  ),
};

export const OnDisabledButton: Story = {
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Disabled tooltip — wrapper-listener proof">
        <button
          disabled
          aria-label="Disabled action"
          className="px-3 py-2 border border-solid opacity-50 cursor-not-allowed"
        >
          Disabled button
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const EscapeDismisses: Story = {
  parameters: {
    docs: {
      description: { story: 'Tab to focus the button, then press Escape. The bubble closes; focus stays on the button.' },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <p style={{ marginBottom: 16, fontSize: 12 }}>
        Tab to focus, then press <kbd>Esc</kbd>.
      </p>
      <TooltipTrigger content="Press Esc to dismiss without losing focus">
        <button
          aria-label="Focus me with tab"
          className="px-3 py-2 border border-solid"
        >
          Focus target
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const WithCustomDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 64 }}>
      {[0, 150, 500].map((d) => (
        <TooltipTrigger key={d} content={`openDelay: ${d}ms`} openDelay={d}>
          <button aria-label={`Delay ${d}`} className="px-3 py-2 border border-solid">
            {d}ms
          </button>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const DisabledViaEnabledProp: Story = {
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="You should never see this" enabled={false}>
        <button aria-label="Suppressed tooltip" className="px-3 py-2 border border-solid">
          Hover (no tooltip)
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const WithIconButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Once <IconLink> ships, this is what every IconLink does internally — hand-rolled here for now.',
      },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Close">
        <button
          aria-label="Close"
          className="inline-flex items-center justify-center w-[24px] h-[24px] rounded-[var(--radius-120)] cursor-pointer"
        >
          <Icon name="close" size={17} />
        </button>
      </TooltipTrigger>
    </div>
  ),
};

const ForwardRefButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button ref={ref} {...props} className="px-3 py-2 border border-solid" />
  ),
);
ForwardRefButton.displayName = 'ForwardRefButton';

export const WithForwardRefChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Trigger child is a forwardRef component that spreads its props onto its DOM root. Components that swallow `aria-describedby` / `onFocus` / `onBlur` / `ref` will not work — the failure mode is silent.',
      },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Wrapped via forwardRef">
        <ForwardRefButton aria-label="Forward ref">forwardRef child</ForwardRefButton>
      </TooltipTrigger>
    </div>
  ),
};

export const WithComposedHandlers: Story = {
  render: () => {
    const Inner = () => {
      const [log, setLog] = useState<string[]>([]);
      return (
        <div style={{ padding: 64 }}>
          <TooltipTrigger content="Consumer handlers run alongside ours">
            <button
              aria-label="Composed handlers"
              className="px-3 py-2 border border-solid"
              onFocus={() => setLog((l) => [...l, 'consumer onFocus'])}
              onBlur={() => setLog((l) => [...l, 'consumer onBlur'])}
            >
              Tab in / out
            </button>
          </TooltipTrigger>
          <pre style={{ marginTop: 16, fontSize: 12 }}>{log.join('\n')}</pre>
        </div>
      );
    };
    return <Inner />;
  },
};

export const WithWrapperClassName: Story = {
  render: () => (
    <div style={{ display: 'flex', width: 400, padding: 64, border: '1px dashed #ccc' }}>
      <TooltipTrigger content="Wrapper got flex-1" wrapperClassName="flex-1">
        <button aria-label="Stretched" className="w-full px-3 py-2 border border-solid">
          Stretches to flex-1
        </button>
      </TooltipTrigger>
    </div>
  ),
};
```

- [ ] **Step 4: Verify all 11 stories**

Open Storybook → `Feedback/TooltipTrigger`. For each story, hover/focus/Esc/scroll as appropriate:

| Story | Manual check |
|---|---|
| Default | Bubble appears above the button after 150ms hover. Default placement = top. |
| Placements | All four sides render correctly; arrows point toward each trigger. |
| AutoFlipNearViewportEdge | Top-edge button's tooltip flips to bottom; bottom flips to top; etc. Resize the Storybook iframe to see the flip happen live. |
| OnDisabledButton | Hover the disabled button → tooltip still shows. Tab cannot focus it (browser refuses). |
| EscapeDismisses | Tab to focus → bubble shows. Press Esc → bubble closes; the button still has focus (focus ring still visible). |
| WithCustomDelay | 0ms feels instant, 150ms is the default, 500ms is sluggish — confirm the difference. |
| DisabledViaEnabledProp | Hovering produces nothing. |
| WithIconButton | Close icon button shows "Close" tooltip. |
| WithForwardRefChild | Tooltip works with the forwardRef wrapper. |
| WithComposedHandlers | Tabbing into the button logs `consumer onFocus`; bubble also opens. Tabbing out logs `consumer onBlur`; bubble closes. |
| WithWrapperClassName | The button stretches to fill the dashed container — wrapper got `flex-1`. |

If any check fails, halt and investigate.

- [ ] **Step 5: Run Storybook a11y addon on each story**

In Storybook, click the "Accessibility" tab (a11y addon) on each of the 11 stories. Expected: zero violations on every story. If any story fails, the most likely culprit is a missing `aria-label` on the trigger button — fix the story, not the component.

- [ ] **Step 6: Lint + build**

Run: `npm run lint`
Expected: No new errors. Note: stories file may produce `react-refresh/only-export-components` if helper components (like `ForwardRefButton`) are co-defined — extract them out of the story file if so, or accept the warning as a story-level convention (the codebase allows this in story files).

Run: `npm run build`
Expected: Exits 0.

- [ ] **Step 7: Token-discipline grep**

Run: `grep -E '#[0-9a-fA-F]{3,6}|rgba\(' src/components/Tooltip/TooltipTrigger.tsx src/components/Tooltip/TooltipBox.tsx`
Expected: Zero matches. All colors come from CSS variables.

Run: `grep -E 'text-\[var\(' src/components/Tooltip/TooltipTrigger.tsx src/components/Tooltip/TooltipBox.tsx`
Expected: Zero matches (every `text-[var(...)]` should carry a `color:` or `length:` prefix).

- [ ] **Step 8: Commit**

```bash
git add src/components/Tooltip/index.ts src/components/index.ts src/components/Tooltip/TooltipTrigger.stories.tsx
git commit -m "feat(tooltip-trigger): export from barrels and ship 11 stories

11 stories under Feedback/TooltipTrigger, each isolating one decision
from the spec: default placement, all four placements, auto-flip near
viewport edges, disabled button, Escape dismissal, openDelay variants,
enabled=false, icon-button preview, forwardRef child, composed
handlers, and wrapperClassName for flex-item callsites."
```

---

### Task 6: Storybook portal verification + final validation pass

**Why:** Spec verification step 6 explicitly requires DevTools confirmation that the bubble is portaled to `<body>`. Worth a separate task so it's an explicit checkpoint, not buried in Task 5.

**Files:** None (manual verification only).

- [ ] **Step 1: DOM portal verification**

Open Storybook → `Feedback/TooltipTrigger → Default`. Hover the trigger button so the tooltip appears.

Open browser DevTools → Elements panel. Find the `<div role="tooltip" id="tooltip-…">`. Expand the parent path. Expected: the div's parent is `<body>` (or Storybook's root iframe body), NOT a descendant of the story's wrapper div. If it's nested under the story wrapper, `createPortal` is misconfigured — investigate.

Also verify on `AutoFlipNearViewportEdge` (where parent containers have `overflow:hidden`-equivalent constraints from `position:absolute`): the tooltip still escapes the parent and renders at the body level.

- [ ] **Step 2: a11y describedby wiring check**

Still on `Default`, hover the trigger. In DevTools, inspect the `<button>`. Expected: `aria-describedby="tooltip-r…"` is present and matches the portaled `<div>`'s `id`. Hover off — confirm `aria-describedby` is removed entirely (not left as a stale reference).

- [ ] **Step 3: Composed-handler integrity**

On `WithComposedHandlers`, tab into the button. Expected: `consumer onFocus` shows in the log, AND the bubble opens. Tab out: `consumer onBlur` logs, AND the bubble closes. If only one of the two fires, `composeHandler` is broken.

- [ ] **Step 4: Legacy Tooltip stories regression check**

Open `Feedback/Tooltip` → cycle through all 7 stories (`ArrowDown`, `ArrowUp`, `ArrowLeft`, `ArrowRight`, `NoArrow`, `LongMessage`, `AllArrows`). Visually compare against any reference (the live deployed Storybook is at https://aster-ncy.github.io/sitegiant-design-system/ if available). Expected: byte-identical render to pre-refactor.

- [ ] **Step 5: Codex review**

Hand off to Codex for a SHIP-grade review of the implementation. The user invokes Codex via their established review loop; this plan does not run Codex itself. Address any majors/criticals; fold minors into a follow-up commit.

---

## Self-review

**1. Spec coverage:**

| Spec section | Implementing task |
|---|---|
| Architecture / file structure | Task 1 (TooltipBox.tsx), Task 2 (Tooltip.tsx refactor), Task 3 (TooltipTrigger.tsx scaffold), Task 5 (index.ts wires) |
| TooltipBox API | Task 1 |
| Tooltip API (unchanged) | Task 2 |
| TooltipTrigger API | Task 3 (props + state machine), Task 4 (positioning) |
| Open/close state machine | Task 3 step 2 |
| Positioning lifecycle + auto-flip | Task 4 |
| Anchor offset (ANCHOR_GAP=0) | Task 4 step 1 |
| Reposition on scroll/resize | Task 4 step 2 |
| Concurrency / SSR guard | Task 3 step 2 (`typeof document !== 'undefined'` in portal expression) |
| Stacking context (z-50) | Task 3 step 2 |
| Accessibility (aria-describedby append, role=tooltip, no aria-live) | Task 1 (role=tooltip on TooltipBox), Task 3 (describedby append-with-space) |
| cloneElement mechanics + composeHandler | Task 3 step 1 (helpers), Task 3 step 2 (call site) |
| Trigger-child contract | Task 3 step 2 (dev-only validation), Task 5 (`WithForwardRefChild` story) |
| DOM shape (wrapper class) | Task 3 step 2 (`wrapperClass` join) |
| Edge cases (`enabled` flips false, content/placement changes, disabled trigger, pointer-events:none, SSR, two triggers) | Task 3 step 2 (`useEffect([enabled])`), Task 4 step 2 (`content`/`placement`/`width` deps), no extra code needed for the rest |
| 11 stories | Task 5 step 3 |
| Verification (lint, build, a11y, tokens, type hints, portal verification, legacy stories pass, Codex) | Tasks 1-6 each include lint+build; Task 5 step 5 a11y; Task 5 step 7 token grep; Task 6 portal + describedby + handler + legacy regression + Codex |
| Older Android WebView `:focus-visible` | Task 3 step 2 (`try/catch` around `matches(':focus-visible')`) |

No spec section is uncovered.

**2. Placeholder scan:** No "TBD", "TODO", "implement later", "similar to Task N", or undefined-symbol references. Every code step shows the actual code; every command shows the exact invocation and expected outcome.

**3. Type consistency:** `TooltipArrow` is exported from `TooltipBox.tsx` and re-exported from `Tooltip.tsx` (Task 2). `TooltipPlacement`, `TooltipTriggerProps` originate in `TooltipTrigger.tsx` (Task 3). `ARROW_HEIGHT` originates in `TooltipBox.tsx` (Task 1) and is imported by `TooltipTrigger.tsx` (Task 3 step 1). `TriggerChildProps` is local to `TooltipTrigger.tsx`. No naming drift across tasks.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-01-tooltip-trigger.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
