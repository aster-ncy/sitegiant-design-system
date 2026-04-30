# Session 2026-04-30 — `tooltip-trigger-detour`

Resume keyword: **tooltip-trigger-detour**

## What shipped today

Full SmallSegmentedButton work (separate session, separate keyword `align-toolbar-rescue`):

- `049e650` feat(small-segmented-button): add Figma 3504:3253 — Color Picker + Devices
- `c063b23` fix(small-segmented-button): move story body to render fn; recategorize

Both pushed to `origin/main`. Codex review: SHIP, no findings.

## What was started but paused (this session)

User asked to build SortBlock (8 Figma frames, node 2411:39 etc.). Brainstorm went deep and surfaced THREE atom-dependency detours before SortBlock can be built. Stack discovered:

```
TooltipTrigger      ← need to build (BLOCKER for IconLink)
   ↓
IconLink            ← spec written, but blocked on TooltipTrigger
   ↓ + DashedButton + TextLink-extension
SortBlock           ← original target, still pending
```

### IconLink spec (committed `7856d23`)

Path: `docs/superpowers/specs/2026-04-30-iconlink-design.md`

Locked design decisions:
- Single `<IconLink>` component, `variant` prop with 7 values (basic, danger, danger-subtle, subtle, default, success, close).
- Pure pseudo-class state styling (no `state` prop). Just `disabled` exposed.
- `aria-label` REQUIRED at prop level. Auto-drives tooltip-on-hover (with `tooltip` text override + `showTooltip={false}` opt-out + `tooltipArrow` direction).
- 19 new `--icon-link-*` tokens, all linked to existing color primitives (no raw hex).
- TopBar's existing IconButton stays as-is (different visual atom — chip with chrome). New atom is named `<IconLink>` to match Figma's `icon-link-*` token vocabulary.
- Phase 1 migration: 6 high-confidence inline patterns (Banner close, Tag close, Input clear, Pagination chevrons, Dropdown clear, SuffixInput clear). Other 15 grep hits deferred.
- Stories: AllVariants, States, Sizes, Interactive, WithTooltip — meta-render pattern for autodocs Primary preview.

### TooltipTrigger gap discovered

The IconLink spec assumed `<Tooltip>` was a hover-triggered wrapper. It isn't — it's a static styled bubble (`src/components/Tooltip/Tooltip.tsx`, ~120 LOC, no listeners, no portal).

Decision (this session): build a shared `<TooltipTrigger>` atom first. Two-spec split — TooltipTrigger gets its own brainstorm + spec + plan + ship, then IconLink resumes.

No existing hover-tooltip implementation in DS — TooltipTrigger sets the pattern for every future component.

### SortBlock brainstorm decisions (paused)

Path: NO spec yet — pending dependencies. Decisions captured in chat history:

- Two-primitive split: `<SortBlockRow>` + `<SortBlock>`.
- Drag handle is a leading element of the row (visual flush; consumer-supplied `dragHandleProps` for dnd-kit; no @dnd-kit dependency baked in).
- Trailing slot accepts ReactNode.
- Orientation prop on SortBlockRow (not per-cell).
- 7 Figma sub-variants (Default / Icon / Image / Button / Tag / LongContent / MainSub) → story recipes, not React types. Children are existing DS atoms (Input, Pip, Image, TextLink, etc.).
- One new token: `--sorting-block-fill: #f6f6f6`.
- Codex (continuing the Codex thread `019ddc60-b2c3-7b91-a328-dad899c82e46`) confirmed Approach 1 is sound. Open items for the spec: width/density rules, a11y (drag handle naming, focus separation), exact tokens.
- Atoms still needed before SortBlock builds: TooltipTrigger → IconLink → DashedButton → TextLink-extension.

## Resume tomorrow

Keyword: `tooltip-trigger-detour`

Likely first move: brainstorm `<TooltipTrigger>` shared atom. Need to design:
- What triggers show: hover only? hover + focus? touch?
- Portal vs inline-positioned (the existing `<Tooltip>` is inline — would require parent overflow accommodation)
- Escape-key dismiss
- aria-describedby wiring (so screen readers announce the tooltip)
- Hover-in / hover-out delay (debounce)
- Position direction logic (auto-flip vs explicit `arrow` prop)
- Touch device behaviour

Then ship, then revise IconLink spec, then plan + build IconLink, then DashedButton + TextLink-extension, then SortBlock.

## Ongoing thread state

- **Codex thread:** `019ddc60-b2c3-7b91-a328-dad899c82e46` (still resumable). Has full SortBlock + IconLink architecture context.
- **Visual companion:** stopped (was at `.superpowers/brainstorm/50976-1777530269/`). Restart fresh per skill flow if needed.
- **Plan files:** `C:\Users\Aster\.claude\plans\toasty-stargazing-gosling.md` (yesterday's SmallSegmentedButton plan, now obsolete).
- **Other terminal (`imperative-stardust`):** working on inset-table follow-ups, has been committing TableSelectionBar fixes today. Avoid overlapping on TableCell/TableHeaderCell/TableSelectionBar/TableExpandToggle.
- **`.gitignore`:** updated to ignore `.superpowers/`.
