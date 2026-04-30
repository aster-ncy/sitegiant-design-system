# Session 2026-05-01 — TooltipTrigger Shipped

**Resume keyword:** `tooltip-trigger-shipped`
**Branch:** `main` (pushed to `origin` at `9c1227e`)
**Outcome:** TooltipTrigger atom built end-to-end and live in Storybook at `Feedback/TooltipTrigger`.

## What we built

A new `<TooltipTrigger>` component that wraps any single React element with hover/focus-driven tooltip behavior. Portals the bubble to `document.body`, computes position with viewport-aware auto-flip, and wires `aria-describedby` correctly. Reuses the existing static `<Tooltip>`'s visuals via a shared internal `<TooltipBox>` atom.

This was the **TooltipTrigger** of the 3-atom dependency stack the previous session paused on:

```
TooltipTrigger  ← shipped today
   ↓
IconLink        ← unblocked, ready for next session
   ↓ + DashedButton + TextLink-extension
SortBlock       ← original target
```

## Final architecture

| Component | Role | Public? |
|---|---|---|
| `TooltipBox` | Bubble + arrow markup; owns the `inline-flex` layout wrapper | Internal — sibling-import only |
| `Tooltip` | Static styled bubble for inline use; thin pass-through to TooltipBox | Public (legacy) |
| `TooltipTrigger` | Wrapper component: state machine, listeners, portal, position math | Public (new) |

Three components co-located in `src/components/Tooltip/`. Both barrels export `Tooltip`, `TooltipTrigger`, and the supporting types. `TooltipBox` is intentionally NOT re-exported.

## Process

Followed superpowers' Subagent-Driven Development flow:

1. **Brainstorm** the design (9 multi-choice clarifying questions covering trigger types, portal placement, hover delay, disabled-button handling, dismissal triggers, placement strategy, ARIA wiring, API shape, markup composition).
2. **Codex review** the spec (caught 7 majors + 2 minors); applied fixes inline.
3. **Codex re-review** the fixed spec (caught 1 new major + 2 minors); applied fixes inline.
4. **Write plan** with task-by-task code listings.
5. **Execute plan via subagents** — per task: implementer subagent → spec compliance reviewer → code quality reviewer → fix loop → mark task done.
6. **Final Codex SHIP review** of the assembled implementation.
7. **DevTools MCP visual verification** of all four placements.

## Behavioral choices

- **Triggers:** hover + focus only (no touch-tap-to-toggle). Focus gated by `:focus-visible` so iOS tap doesn't pop the bubble.
- **Delays:** 150ms open delay for hover, 0ms for focus, 0ms close.
- **Placement:** consumer-specified preferred direction with single-pass viewport-collision auto-flip.
- **Cross-axis overflow:** accepted as v1 non-goal (centered bubble can clip).
- **Dismissal:** un-hover, blur, or Escape key. Escape doesn't move focus.
- **Disabled trigger:** wrapper-owned hover listeners so disabled buttons still get tooltips.
- **ARIA:** `aria-describedby` on the cloned child, appended (not replaced) when consumer set their own.
- **Consumer event handlers:** composed via `composeHandler<E>(consumer, ours)` — never overwritten.
- **Trigger child contract:** must be a single React element that forwards `aria-describedby`, `onFocus`, `onBlur`, `ref` to its DOM root. `forwardRef` components work; components that swallow these props silently fail.

## Bugs caught and fixed during the build

In execution order. Each was caught by a different reviewer or by direct visual feedback — none would have shipped clean without the review loop.

### 1. Doubled flex wrapper (T2 plan-level error)

**Caught by:** code-quality reviewer on T2.

**Bug:** My plan had `<Tooltip>` wrap `<TooltipBox>` in *another* `inline-flex flex-col items-center` div. But TooltipBox already owns that wrapper for arrow + message layout. Result: doubly-nested DOM, regression risk on the `width` prop and direct-child CSS selectors.

**Fix:** Made `Tooltip` a thin pass-through. Forwards every prop to TooltipBox. DOM is now byte-identical to pre-refactor.

**Spec amendment:** Spec line 70 originally said "TooltipBox has no outer flex wrapper," which was self-contradictory (TooltipBox needs a wrapper to lay out arrow + message as siblings). Amended to acknowledge TooltipBox owns the wrapper.

### 2. Three spurious `void` suppressors (T3)

**Caught by:** spec compliance reviewer on T3.

**Bug:** Implementer added `void setCoords; void triggerRef; void bubbleRef;` to suppress unused-variable warnings — but those symbols were already used elsewhere in the file. Just dead noise.

**Fix:** Removed.

### 3. Hooks-stable validation (T3)

**Caught by:** code-quality reviewer on T3.

**Bug:** Dev-only validation was a `throw new Error(...)` placed before any hooks. If `children` was transiently invalid on one render and valid on the next, React would see different hook counts → "Rendered fewer hooks than expected" error.

**Fix:** Changed to `console.error`. Hook calls below the validation now run on every render.

### 4. `handleMouseLeave` missed `enabled` gate (T3)

**Caught by:** code-quality reviewer on T3.

**Bug:** `handleMouseEnter` early-returned when `!enabled`, but `handleMouseLeave` did not. Asymmetric.

**Fix:** Added the gate to `handleMouseLeave`.

### 5. Switch exhaustiveness (T4)

**Caught by:** code-quality reviewer on T4.

**Bug:** `candidate()` and `axisSpace()` switches lacked default cases. They compiled today only because `noImplicitReturns` is off. If `TooltipPlacement` ever gained a value (e.g. `'top-start'`), both functions would silently return `undefined` and bubble would position at NaN.

**Fix:** Added `default: { const _exhaustive: never = p; throw new Error(...); }` pattern. TS now flags missing cases at compile time.

### 6. Tailwind v4 bare classes in stories (T5)

**Caught by:** code-quality reviewer on T5.

**Bug:** 11 occurrences of `px-3 py-2` in the stories file. Per project memory (`feedback_tailwind_spacing_shadow.md`), bare numeric Tailwind classes are silently broken in this Tailwind v4 setup — the `--spacing-*` Figma tokens collide with Tailwind's numeric scale. Result: 9 of 11 stories would have rendered with no padding.

**Fix:** Extracted shared `triggerButtonClass` constant using `--spacing-12` / `--spacing-8` arbitrary-value syntax. All stories now reference it.

### 7. Anchor offset double-counted ARROW_HEIGHT (T6 — Codex SHIP review)

**Caught by:** Codex SHIP review.

**Bug:** Position math used `triggerRect.top - bubbleRect.height - (ARROW_HEIGHT + ANCHOR_GAP)`. But `bubbleRect.height` already included the arrow span (the arrow lives inside TooltipBox's wrapper as a sibling of the message div). The offset was pushing the bubble 6px further from the trigger than intended.

**Fix:** Simplified offset to just `ANCHOR_GAP` (= 0). Arrow tip now touches the trigger edge as the spec mandates.

### 8. 12px line-height strut on `placement='bottom'` (post-Codex)

**Caught by:** **Aster's eyes** (visual review of the Placements story).

**Bug:** Even after the ARROW_HEIGHT fix, the `bottom`-placement tooltip still had a visible gap between the trigger and the arrow tip. DevTools forensics: portal `<div>` was placed at exactly `triggerRect.bottom` (correct), but the TooltipBox flex wrapper inside it sat 12px below the portal div's top edge. Cause: portal was `display: block` with inherited `line-height: 24px` from the page. The `inline-flex` TooltipBox child got `vertical-align: baseline` by default — classic CSS inline-formatting strut.

**Fix:** Portal div now uses `className="z-50 flex"`. Block formatting context replaces inline; baseline strut disappears; child sits at top edge.

**Why it was invisible on `placement='top'`:** The wrapper hugs its bottom edge, and a strut at the top of an above-the-trigger bubble is hidden behind the trigger. Only `bottom` placement exposed it. Pure visual review caught what numerical reasoning didn't.

## Process meta-lessons

- **Subagent-driven development paid off.** Each task had three review gates (spec compliance + code quality + final-pass Codex). Eight bugs caught total. Mechanical lint+build green is necessary but not sufficient — real reviewers find structural issues.
- **Visual verification beats numerical reasoning.** The 12px line-height strut was statistically equal to half the inherited line-height — invisible from reading position math, instantly visible on screen. Always DevTools-MCP the result, don't just trust the green-build.
- **Codex catching plan bugs is the highest-leverage feedback.** The doubled wrapper and the ARROW_HEIGHT double-count were both *plan-level* errors I'd written. Reviewer subagents executing the plan dutifully reproduced my errors; only Codex (with full spec + visual context) caught them.
- **Cross-terminal hygiene held.** The other terminal (`imperative-stardust`) was working concurrently on TableCell/HeaderCell on `main`. Explicit `git add <path>` + `git commit -- <path>` everywhere. No accidental bundling, even when `git rebase` from the other terminal once lost a commit (recovered cleanly via reflog/checkout the file).

## Commits

13 commits on `main`, all by `aster.sitegiant@gmail.com`:

| SHA | Subject |
|---|---|
| `dc84936` | feat(tooltip-box): extract internal bubble+arrow markup atom |
| `2851551` | refactor(tooltip): compose `<TooltipBox>` instead of inlining markup |
| `4e5e928` | fix(tooltip): pass-through to TooltipBox; remove duplicated outer wrapper |
| `5fd4014` | docs(tooltip-trigger): amend spec+plan to match pass-through Tooltip |
| `74518b6` | feat(tooltip-trigger): scaffold component with state machine + listeners |
| `7519345` | fix(tooltip-trigger): trim spurious void suppressors |
| `ab195db` | fix(tooltip-trigger): code-review polish — hooks-stable validation, mouseLeave symmetry |
| `9b02b13` | feat(tooltip-trigger): viewport-aware positioning with auto-flip |
| `1abe683` | fix(tooltip-trigger): exhaustiveness guards on placement switches |
| `001b3d4` | feat(tooltip-trigger): export from barrels and ship 11 stories |
| `f1bbcca` | fix(tooltip-trigger stories): use --spacing tokens; merge ForwardRefButton className |
| `2e7ba12` | fix(tooltip-trigger): close 6px arrow gap; warn on missing accessible name |
| `9c1227e` | fix(tooltip-trigger): close 12px line-height strut on bottom placement |

## What's next

1. **IconLink** — its spec at `docs/superpowers/specs/2026-04-30-iconlink-design.md` already exists but is marked blocked. Now that TooltipTrigger is built, the spec needs revisiting to wire concrete TooltipTrigger composition into IconLink's render path. Then write a plan, execute it.
2. **DashedButton** + **TextLink-extension** — the remaining SortBlock dependencies.
3. **SortBlock** — the original target from yesterday's brainstorm.
