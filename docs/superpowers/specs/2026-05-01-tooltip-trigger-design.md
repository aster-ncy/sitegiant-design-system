# TooltipTrigger — Design Spec

**Date:** 2026-05-01
**Resume keyword:** `tooltip-trigger-detour`
**Blocks:** `<IconLink>` (spec at `docs/superpowers/specs/2026-04-30-iconlink-design.md`), and through it `<SortBlock>`.

## Context

The DS has a `<Tooltip>` component (`src/components/Tooltip/Tooltip.tsx`) that renders a static styled bubble — pure markup, no listeners, no portal, no positioning. The IconLink atom requires auto-tooltip-on-hover from `aria-label`, which means we need a wrapper primitive that owns hover/focus listeners, portals the bubble out of clipping ancestors, and positions it against the trigger.

Zero in-product consumers of `<Tooltip>` exist today (only its own story uses it), so introducing a new sibling component carries no migration cost.

The codebase has no Floating UI / Radix / Popper dependency. `TimeRange.tsx:447` is the existing precedent for hand-rolled `createPortal` + viewport-rect positioning.

## Goals

- Hover-/focus-driven tooltip primitive that wraps any single React element.
- Portal-rendered bubble that escapes `overflow:hidden`, transforms, and stacking-context bugs.
- Preferred placement with viewport-collision auto-flip (single flip pass).
- WAI-ARIA-compliant `aria-describedby` wiring — tooltip text is announced as a description, not a name.
- Reuse the existing tooltip visual treatment (bubble + arrow + tokens) without duplicating markup.

## Non-goals

- Click-to-toggle, long-press, tap, or any touch-specific trigger gesture.
- Inline (non-portaled) rendering mode.
- Interactive bubble (pointer events / hoverable content inside the bubble).
- Animations or transitions.
- Controlled `open` prop, `defaultOpen`, `closeDelay`.
- "Smart fallback chain" — single auto-flip pass only.
- Cross-axis viewport shift (centered on trigger; off-screen overflow is allowed in v1).
- "Only one tooltip open globally" coordination.

## Architecture

One folder, three components — two new, one refactored:

```
src/components/Tooltip/
├── Tooltip.tsx                    # Existing — refactored to compose <TooltipBox>
├── TooltipBox.tsx                 # NEW — internal, bubble + arrow markup only
├── TooltipTrigger.tsx             # NEW — wrapper, listeners + portal + positioning
├── Tooltip.stories.tsx            # Existing — unchanged
├── TooltipTrigger.stories.tsx     # NEW
└── index.ts                       # Append TooltipTrigger export only (TooltipBox stays internal)

src/components/index.ts            # Append TooltipTrigger export
```

**Token additions: zero.** `TooltipBox` reuses the tokens the existing `Tooltip` already uses (`--color-overlay-80`, `--color-text-ondark`, `--text-12`, `--leading-16`, `--spacing-4`, `--font-sans`, `--font-weight-regular`).

**Public API of existing `<Tooltip>` is unchanged** — its props (`message`, `arrow`, `width`, `id`, `className`) and visual output are preserved. Internally it now renders `<TooltipBox>` inside its existing `inline-flex flex-col items-center` wrapper. Existing stories should render byte-identical.

## Component APIs

### `<TooltipBox>` (internal — used only via sibling import; not re-exported from `Tooltip/index.ts` or `components/index.ts`)

```tsx
export type TooltipArrow = 'none' | 'up' | 'down' | 'left' | 'right';

export interface TooltipBoxProps {
  message: React.ReactNode;
  arrow?: TooltipArrow;       // default 'none'
  width?: number;
  id?: string;                // required when used inside TooltipTrigger
  className?: string;
}
```

Self-contained box with `role="tooltip"`. No outer flex wrapper, no listeners, no state. Pure presentational.

### `<Tooltip>` (existing, public — signature unchanged)

Wraps `<TooltipBox>` in the current `inline-flex flex-col items-center` outer container. Re-exports `TooltipArrow`. Existing `Tooltip.stories.tsx` does not need edits.

### `<TooltipTrigger>` (new, public)

```tsx
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipTriggerProps {
  /** Tooltip text or node — what appears in the bubble. */
  content: React.ReactNode;
  /** Preferred side of the trigger. Auto-flips on viewport collision. Default 'top'. */
  placement?: TooltipPlacement;
  /** Fixed bubble width in px. Omit for auto. */
  width?: number;
  /** Hover-open delay in ms. Default 150. */
  openDelay?: number;
  /** Set false to suppress the tooltip without unmounting the wrapper. Default true. */
  enabled?: boolean;
  /**
   * Optional class string **appended** (space-joined) to the wrapper
   * `<span>`'s built-in `inline-flex` class. Append, not replace —
   * `inline-flex` always stays so the wrapper preserves event-receiving
   * layout behavior.
   *
   * Needed when the trigger is itself a flex/grid item — the wrapper
   * (not the cloned child) becomes the layout participant, so classes
   * like `flex-1`, `order-*`, or `col-span-*` must live on the wrapper
   * to keep working. Without this, callsites that previously placed
   * such classes on the icon button would silently lose them.
   *
   * Note: callsites that need to override the `inline-flex` default
   * (e.g. `block`) are out of scope in v1 — `inline-flex` is part of
   * the wrapper's contract for receiving hover events. If a real
   * callsite emerges, revisit.
   */
  wrapperClassName?: string;
  /**
   * The trigger element. MUST be a single React element with a name
   * (aria-label, aria-labelledby, or visible text), and MUST forward
   * `aria-describedby`, `onFocus`, `onBlur`, and `ref` to its DOM root.
   * TooltipTrigger composes — never replaces — any consumer-supplied
   * `aria-describedby`, `onFocus`, `onBlur`, or `ref` on the child.
   */
  children: React.ReactElement;
}
```

**Internal arrow mapping** (resolved placement → `TooltipBox.arrow`):

| Resolved placement | Bubble position | `arrow` on TooltipBox |
|---|---|---|
| `top` | above trigger | `down` |
| `bottom` | below trigger | `up` |
| `left` | left of trigger | `right` |
| `right` | right of trigger | `left` |

The arrow points *toward* the trigger.

**Dev-only validation (skipped in production):**
- Child is not a single React element → throw with a guidance message.
- Child has no `aria-label` / `aria-labelledby` and `enabled !== false` → `console.warn` once per mount. Visible text content is not auto-detected (would require synchronous DOM access); the warning is best-effort, not exhaustive.

## Behavior

### Open / close state machine

Single `isOpen` boolean and a single `openTimerId` ref.

```
mouseenter (wrapper)  →  openTimerId = setTimeout(() => setOpen(true), openDelay)
mouseleave (wrapper)  →  clearTimeout(openTimerId); if (isOpen) setOpen(false) immediately
focus      (child)    →  if (event.target.matches(':focus-visible')) setOpen(true) immediately
blur       (child)    →  setOpen(false)
keydown    (document) →  if (isOpen && key === 'Escape') { e.preventDefault(); setOpen(false) }
unmount               →  clearTimeout(openTimerId)
```

Notes:
- **Focus opens only when `:focus-visible` matches.** This gates out iOS Safari's tap-then-fires-`focus` behavior (touch is a non-goal per Q1; we don't want a tap on a button to flash a tooltip). Keyboard tab still triggers `:focus-visible`, so keyboard users get instant tooltips. Mouse-click focus on a button does not match `:focus-visible` in modern browsers (since the click already conveys intent), so we don't double-show after a click — which is also correct.
- Focus opens with no `openDelay` — keyboard-tab signals unambiguous intent.
- `mouseleave` cancels a pending open. Cursor sweeps faster than `openDelay` produce no flash.
- Escape doesn't move focus (per WAI-ARIA APG); `preventDefault` is called only when a tooltip is actually open, so enclosing modal Escape behavior is preserved.
- Document-level keydown listener is attached only while `isOpen === true` (a `useEffect` keyed on `isOpen`), to avoid one always-on global listener per mounted trigger.

### Positioning lifecycle

When `isOpen` flips to `true`:

1. `useLayoutEffect`: read `triggerRef.current!.getBoundingClientRect()`. Portal mounts the bubble at `position:fixed; top:0; left:0; visibility:hidden`.
2. Read `bubbleRef.current!.getBoundingClientRect()` for the bubble's own size.
3. Compute candidate top/left for the *preferred* placement. The trigger-edge-to-arrow-tip gap is `ANCHOR_GAP = 0` (the arrow visually touches the trigger); the trigger-edge-to-bubble-body offset is therefore `ARROW_HEIGHT` (= 6, from `Tooltip.tsx:23`). See "Anchor offset" below.
4. **Auto-flip check.** A candidate is "clipped" if any edge crosses the viewport rect by more than `VIEWPORT_MARGIN = 8` (a non-tokenized constant defined at the top of `TooltipTrigger.tsx`; not user-configurable in v1). If the preferred placement is clipped, compare the available space on the preferred side vs the opposite side along the placement axis; pick the larger one — even if both clip. Single pass: we don't try the perpendicular axis after flipping. **Positioning is best-effort: in tight viewports (e.g. trigger near a corner with a wide bubble), the bubble can still overflow.** This is acceptable for v1; if a callsite reports a real clip, revisit.
5. Apply `position: fixed; top: <Y>px; left: <X>px; visibility: visible` to the portal node.
6. Pick the resolved arrow direction from the table above.

`getBoundingClientRect()` returns viewport-relative coordinates, so `position: fixed` is correct (no scroll-offset math needed for initial placement).

### Anchor offset (geometry)

The arrow is rendered *inside* the `TooltipBox`'s bounding box (it sits at the box's edge as part of the same DOM subtree). When we position the portal, we're positioning the bubble's *bounding rect*, which already includes the arrow on the trigger-facing side.

For `top` placement (bubble above trigger, arrow on the bubble's bottom edge pointing down):

```
bubbleTop = triggerRect.top - bubbleRect.height - ANCHOR_GAP
```

with `ANCHOR_GAP = 0` — meaning the arrow tip touches the trigger's top edge. If we set `ANCHOR_GAP = 6` instead, the arrow tip would float 6px from the trigger, which is the bug Codex flagged. v1 ships `ANCHOR_GAP = 0`; if the visual review wants breathing room, bump it to `2` and document.

This is symmetric across the four placements — the "bubble body" sits `ARROW_HEIGHT + ANCHOR_GAP` (= 6 + 0 = 6) from the trigger edge, and the arrow tip lives in that gap.

### Cross-axis alignment

Center on the trigger's cross axis:
- `top` / `bottom`: `bubbleLeft = triggerRect.left + triggerRect.width/2 - bubbleWidth/2`
- `left` / `right`: same on Y.

No cross-axis viewport shift in v1 — if a centered bubble overflows horizontally, it overflows. Adding shift would mean the arrow no longer points at the trigger center, which is a separate decision. Flagged for revisit.

### Reposition on scroll / resize

While `isOpen`:
- `window.addEventListener('scroll', recompute, { passive: true, capture: true })` — capture=true catches scrolls in any ancestor, not just window.
- `window.addEventListener('resize', recompute)`.

`recompute` runs steps 3–6 above. Re-flip is allowed on each recompute. Listeners are removed in the `useEffect` cleanup that runs when `isOpen` flips to `false` or the component unmounts.

### Concurrency / SSR

- `useLayoutEffect` runs synchronously after DOM mutation, before paint, so the bubble never appears at `top:0,left:0` before being repositioned. The `visibility:hidden → visible` flip in the same effect is belt-and-suspenders against any concurrent-rendering edge case.
- **SSR guard: explicit, matching `TimeRange.tsx:445`.** Before calling `createPortal`, return early if `typeof document === 'undefined'`. Don't rely solely on `isOpen` defaulting to false — a future Storybook story (or test harness) might seed `isOpen=true` on first render. This is one extra line and matches the established codebase pattern exactly.

### Stacking context

The portal node uses `z-50`, matching `TimeRange.tsx:454`. We do not introduce a new `--zindex-tooltip` token in v1 — the DS doesn't have a z-index token system yet, and inventing one as a side effect of this component is out of scope. If a future modal/sticky header needs to render above tooltips (or vice versa), we revisit then with a proper z-index ladder. For now, `z-50` is the highest "popover-class" value in active use, so tooltips correctly sit above everything else portaled today.

## Accessibility

- **`aria-describedby` only.** When `isOpen`, the cloned trigger child gets `aria-describedby="tooltip-<uid>"`; the portaled `<TooltipBox>` carries `id="tooltip-<uid>"` and `role="tooltip"`. When `isOpen` flips false, `aria-describedby` is removed entirely (not left as a dangling reference).
- **If the child already has `aria-describedby`,** TooltipTrigger's id is appended with a space separator (the attribute is space-separated, like `class`), preserving the consumer's existing reference.
- **`role="tooltip"`** is on the bubble. No `aria-live` — WAI-ARIA APG explicitly says tooltips should not announce dynamically; they're discovered via the trigger's relationship.
- **Focus is not trapped.** Tooltip never takes focus. Tabbing past the trigger fires the blur handler and closes the bubble.
- **Trigger must already have an accessible name.** Dev-only warn if missing (see validation above). Production builds skip the check.
- **Reduced motion:** no animations in v1, so nothing to gate.

## `cloneElement` mechanics

```tsx
type TriggerChildProps = React.HTMLAttributes<HTMLElement> & {
  'aria-describedby'?: string;
};

const id = useId();                                                      // React 19 stable id
const childProps = children.props as TriggerChildProps;
const childRef = (children as { ref?: React.Ref<HTMLElement> }).ref;
const mergedRef = useMergedRef(triggerRef, childRef);

const composeHandler = <E,>(
  consumer: ((e: E) => void) | undefined,
  ours: (e: E) => void,
) => (e: E) => { consumer?.(e); ours(e); };

const trigger = cloneElement(children, {
  ref: mergedRef,
  'aria-describedby': isOpen
    ? appendId(childProps['aria-describedby'], `tooltip-${id}`)
    : childProps['aria-describedby'],
  onFocus: composeHandler<React.FocusEvent<HTMLElement>>(childProps.onFocus, handleFocus),
  onBlur:  composeHandler<React.FocusEvent<HTMLElement>>(childProps.onBlur,  handleBlur),
});
```

Typing `childProps` as `React.HTMLAttributes<HTMLElement>` (with the `aria-describedby` extension that the React type misses) gives `onFocus` / `onBlur` proper `((e: React.FocusEvent<HTMLElement>) => void) | undefined` signatures. No `unknown` casts at the call sites, strict-clean.

- **Ref merge.** If the child already has a ref, attach both — six-line `useMergedRef` helper, no library.
- **Handler composition.** Consumer-supplied `onFocus` and `onBlur` are composed (consumer first, then ours) — never overwritten. A static utility (`composeHandler`) makes the intent explicit and avoids the easy-to-miss bug of dropping the consumer's handler.
- **Listeners stay on the wrapper for hover, on the cloned child for focus.** The wrapper `<span>` receives `mouseenter`/`mouseleave` even when the inner `<button>` is `disabled` (browsers swallow mouse events on disabled buttons themselves). Focus/blur are different — `disabled` buttons can't take focus anyway, so wiring focus on the child via `cloneElement` is correct and lets us read `event.target.matches(':focus-visible')` directly inside the focus handler.
- **`appendId(existing, newId)`** returns `existing ? `${existing} ${newId}` : newId`. Trivial helper.
- **`useMergedRef`** is a small private helper at the top of `TooltipTrigger.tsx`; not exported.

### Trigger-child contract

Because we lean on `cloneElement` for both `aria-describedby` and event handlers, the child must forward those props (and `ref`) to its DOM root. Three categories:

| Trigger child kind | Works? | Notes |
|---|---|---|
| Native `<button>`, `<a>`, `<input>` etc. | Yes | DOM elements forward all props by default. |
| `forwardRef` component that spreads its props onto its root | Yes | Standard pattern — `<IconLink>` will be this. |
| Component that swallows `aria-describedby` / `onFocus` / `onBlur` / `ref` | **No** | Tooltip silently fails — describedby never reaches the DOM, focus path doesn't open. Document the requirement; don't try to detect it at runtime. |

A story (`WithForwardRefChild`) demonstrates the supported pattern; the failure mode is called out in the prop docstring.

## DOM shape

```html
<span class="inline-flex flex-1" data-tooltip-trigger>     <!-- wrapper: hover listeners; "flex-1" came from wrapperClassName -->
  <button aria-label="Close" aria-describedby="tooltip-r2"   <!-- cloned child: focus + describedby -->
          ref={mergedRef}>
    <svg .../>
  </button>
</span>

<!-- portaled to document.body when open: -->
<div role="tooltip" id="tooltip-r2"
     style="position:fixed; top:..; left:..">
  <!-- TooltipBox markup: bubble + arrow -->
</div>
```

The wrapper class string is `['inline-flex', wrapperClassName].filter(Boolean).join(' ')` — `inline-flex` is constant, `wrapperClassName` appends. `display:contents` was rejected because it doesn't accept events; `inline-flex` shrink-wraps the child, so callsites where the trigger was previously a flex item behave identically.

## Edge cases

| Case | Behavior | Why |
|---|---|---|
| Child unmounts while tooltip open | Effect cleanup closes bubble; portal removed | Standard React unmount cleanup |
| `enabled` prop flips false while open | Force-close bubble | `useEffect([enabled])` watches the flip |
| `content` prop changes while open | Bubble updates; reposition runs | `content` is a `useLayoutEffect` dep |
| `placement` prop changes while open | Reposition runs; arrow flips | Same as above |
| Trigger uses `forwardRef` (e.g. future `<IconLink>`) | Works | `useMergedRef` handles it |
| Trigger is a fragment / array / string | Throws (dev-only) at mount | API contract |
| Trigger is `disabled` and unfocusable | Hover still works (wrapper listeners); focus path is naturally inert | Wrapper listeners |
| Trigger has CSS `pointer-events: none` | Hover still works | The wrapper sees the event before it reaches the child; `pointer-events: none` on the child only prevents the *child* from being the event target, not the wrapper. (Distinct from the native-`disabled` case above; both are covered.) |
| Server-rendered first paint | Nothing portal-rendered server-side | Explicit `typeof document === 'undefined'` guard before `createPortal`, plus the `isOpen` gate. See "Concurrency / SSR." |
| Two TooltipTriggers, both could open | Both can render concurrently | Out-of-scope per non-goals |

## Stories (`Tooltip/TooltipTrigger`)

Each story isolates one decision so it can be visually verified.

1. **Default** — bubble above a basic `<button>Hover me</button>`. Default `placement='top'`, default delay 150ms. The autodocs Primary preview.
2. **Placements** — four buttons in a row, one per placement. No flipping; each shows its preferred side.
3. **AutoFlipNearViewportEdge** — a 600×400 scrollable container with buttons positioned near each edge. Default `placement='top'`; the top-edge button flips to `bottom`, etc. Visual proof of flip math.
4. **OnDisabledButton** — `<button disabled>` wrapped in TooltipTrigger. Hover shows the tooltip (wrapper-listener proof). Tab cannot focus; focus path is inert as expected.
5. **EscapeDismisses** — instructional story with a focusable button + text: "Tab to focus, then press Esc." Documents Q5 dismissal behavior.
6. **WithCustomDelay** — three triggers side-by-side with `openDelay={0}`, `openDelay={150}` (default), `openDelay={500}`.
7. **DisabledViaEnabledProp** — `<TooltipTrigger enabled={false}>`. Hovering shows nothing.
8. **WithIconButton** — composes a hand-rolled icon-only `<button>` (mimicking what `<IconLink>` will be) with `aria-label="Close"` and `<TooltipTrigger content="Close this">`. Sanity check that the trigger composes naturally with the next-up atom. Story description: "Once `<IconLink>` ships, this is what every IconLink does internally."
9. **WithForwardRefChild** — trigger child is a small `forwardRef` component that spreads its props onto its DOM root. Demonstrates the supported pattern for composite triggers and verifies that `aria-describedby` + `onFocus`/`onBlur` + `ref` all reach the DOM. Story description calls out that components which *swallow* these props won't work — the failure mode is silent.
10. **WithComposedHandlers** — trigger child has its own `onFocus`/`onBlur` (e.g., logging). Verifies that consumer handlers run alongside (not instead of) the tooltip's. Action panel logs both.
11. **WithWrapperClassName** — trigger sits inside a flex row with `flex-1` on the wrapper (via `wrapperClassName="flex-1"`). Demonstrates the layout-item escape hatch.

Meta args: `content = 'Tooltip text'`, `placement = 'top'`, `openDelay = 150`. Render at meta level so autodocs Primary is non-empty (lesson from `SmallSegmentedButton`).

## Verification

1. **Lint** — `npm run lint` passes (only pre-existing PrefixInput error tolerated).
2. **Build** — `npm run build` (`tsc -b && vite build`) returns 0.
3. **Compile-time API contracts** — TS prevents calling `<TooltipTrigger>` without `content` or `children`.
4. **Storybook a11y addon** — every story passes. When bubble is open, the trigger's `aria-describedby` matches the bubble's `id`; bubble has `role="tooltip"`.
5. **Manual behavior check** — each of the 11 stories isolates one decision; verify each one matches.
6. **DOM portal verification** — open Storybook DevTools during an open tooltip; confirm the portaled `<div role="tooltip">` is a direct child of `<body>`, not nested under any ancestor.
7. **Token grep** — zero raw hex/rgba in `TooltipTrigger.tsx` and `TooltipBox.tsx`. `TooltipBox` colors all reference existing tokens.
8. **Tailwind v4 type hints** — every `text-[var(...)]` carries `color:` or `length:`.
9. **Existing Tooltip stories still pass** — visually identical render after the `<Tooltip>` refactor.
10. **Codex review** at end — full pass.

## Risks / things to double-check at implement time

- **`useId` collision in portal IDs.** React 19's `useId` gives stable cross-render ids; scope as `tooltip-${id}` to avoid collisions with consumer-supplied ids.
- **`cloneElement` typing.** `React.ReactElement<any>` infers loosely; will need a cast on the `ref` and prop injections to satisfy TS without leaking `any` to consumers. Document inline.
- **`:focus-visible` on the focus handler.** Verified pattern in modern browsers: `event.target.matches(':focus-visible')` returns true for keyboard-tab focus and false for mouse-click / touch-tap focus. Confirm at implement time on Chrome / Firefox / Safari (incl. iOS).
  - **Older Android WebView / Samsung Internet** had patchy `:focus-visible` support through 2024. On those browsers, `matches(':focus-visible')` may return `false` for keyboard focus, meaning the tooltip won't open on tab/keyboard. Accepted gap: SiteGiant ERP is desktop-first, those browsers are not in the support matrix, and the tooltip-on-tab is a *bonus* discoverability path — the underlying `aria-label` still drives screen readers regardless. If the support matrix changes, revisit with a feature-detect (`'focusVisible' in document.body`) fallback to plain `focus`.
- **Existing `<Tooltip>` consumers** — none today (verified via grep), so the refactor is safe. Re-confirm at implement time.
- **`TooltipBox`'s `id` prop is required** when used inside TooltipTrigger but optional in the legacy `<Tooltip>` API. Document the asymmetry — this is fine because TooltipBox is internal (sibling-import-only).
- **`ANCHOR_GAP = 0` visual review.** Spec ships with the bubble's arrow tip touching the trigger edge. If the visual review (Storybook side-by-side with the existing `<Tooltip>` story) wants breathing room, bump to `2` and document in commit. Don't go higher than that without a Figma reference.

## Critical files for implementation

- `src/components/Tooltip/Tooltip.tsx` — refactor target; preserve public API
- `src/components/TimeRange/TimeRange.tsx:447` — `createPortal` + viewport-rect positioning precedent
- `src/components/Icon/Icon.tsx` and `iconPaths.ts` — for `WithIconButton` story
- `src/index.css` — confirm token chain unchanged (no additions)
- `docs/superpowers/specs/2026-04-30-iconlink-design.md` — IconLink spec that this unblocks; revisit after build to wire `TooltipTrigger` in

## Open questions deferred to implementation

- Cross-axis viewport shift — flagged for revisit if a callsite shows visible overflow.
- "Only one tooltip open at a time" coordination — out of scope; revisit if real usage produces a multi-bubble bug.
- z-index token system — out of scope; `z-50` matches `TimeRange`. Revisit when the DS introduces a stacking ladder.
