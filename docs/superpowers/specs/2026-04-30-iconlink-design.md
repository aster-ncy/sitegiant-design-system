# IconLink — Design Spec

**Date:** 2026-04-30
**Figma:** [Icon Button frame](https://www.figma.com/design/oJHxwesmlNeeVHrITxDdZ3/-Library--SiteGiant-ERP?node-id=394-168&m=dev) (node `394:168`)
**Status:** ⚠ Blocked on `<TooltipTrigger>` atom (does not exist yet). The auto-tooltip-on-hover feature in this spec assumes a hover-trigger primitive that wraps the existing static `<Tooltip>`. Existing `<Tooltip>` is a static styled bubble — no hover/focus listeners. Decision (2026-04-30): build a separate `<TooltipTrigger>` shared atom first, then revise this spec to compose it. Resume keyword for tomorrow: **tooltip-trigger-detour**.

## Context

The DS lacks a general-purpose icon-only button atom. 21 existing components inline a `<button>`-wrapping-`<Icon>` pattern, which causes drift in icon color, hover behavior, and accessibility. The Figma `Icon Button` frame defines a 7-variant × 4-state matrix that maps to existing `text-link` tokens — Figma itself names the underlying tokens `icon-link-*` (e.g. `Text/link/basic/icon-link-basic-default`), making clear this is a link-style icon, not a button-with-chrome.

The existing `src/components/TopBar/IconButton.tsx` is a different visual atom: 32×32 chip with background fill, padding, hover-bg shift, using `--button-ellipsis-*` tokens. It stays as-is and keeps its name. The new general atom is named **`<IconLink>`** to match the Figma token vocabulary and avoid colliding with the TopBar one.

## Goals

- Single canonical icon-only press target with consistent variant tokens.
- Default tooltip-on-hover from `aria-label` so consumers don't double-source labels.
- Atom-managed: existing components migrate to `<IconLink>` rather than re-implementing.
- Pure pseudo-class state styling — no `state` prop, browser drives hover/clicked/disabled.

## Non-goals

- Replacing TopBar's `IconButton` (different visual atom; out of scope).
- Replacing `EllipsisButton` (locked-icon chip; different chrome).
- Adding a `loading` state (no Figma evidence; outside scope).
- Adding tooltip placement logic beyond `arrow` direction (consumer can compose `<Tooltip>` manually for unusual cases).

## Architecture

Single component. `variant` prop drives icon color via a `Record<Variant, ColorClassChain>` map. Renders `<button>` wrapping `<Icon>` wrapped in `<Tooltip>`.

### Files

```
src/components/IconLink/
├── IconLink.tsx           # Component
├── IconLink.stories.tsx   # 5 stories — Actions/IconLink
└── index.ts               # Barrel export

src/index.css                # Add 19 new --icon-link-* tokens
src/components/index.ts      # Append IconLink export
```

### Component shape

```tsx
import type { IconName } from '../Icon';
import type { TooltipArrow } from '../Tooltip';

export type IconLinkVariant =
  | 'basic'           // sys-blue, default
  | 'danger'          // sys-red
  | 'danger-subtle'   // grey → red on hover
  | 'subtle'          // grey
  | 'default'         // dark neutral (e.g. navigator-style)
  | 'success'         // sys-green
  | 'close';          // light grey, defaults to 21px size

export interface IconLinkProps {
  icon: IconName;
  variant?: IconLinkVariant;        // default 'basic'
  size?: number;                     // default 17, 21 when variant='close'
  /** Required. Drives both screen-reader text and visible tooltip. */
  'aria-label': string;
  /** Optional override for visible tooltip text only. SR still uses aria-label. */
  tooltip?: string;
  /** Default true. Set false to suppress tooltip (e.g., when parent already has one). */
  showTooltip?: boolean;
  /** Default 'down'. */
  tooltipArrow?: TooltipArrow;
  disabled?: boolean;
  /** Forwarded to <button type=...>. Default 'button'. */
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Replaces (not appends) the built-in classes. */
  className?: string;
}
```

### Render structure

```
<Tooltip content={tooltip ?? ariaLabel} arrow={tooltipArrow ?? 'down'} disabled={!showTooltip}>
  <button
    type={type ?? 'button'}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={handleClick}
    className={className || builtInClasses}
  >
    <Icon name={icon} size={resolvedSize} className={variantColorClasses[variant]} />
  </button>
</Tooltip>
```

`resolvedSize`: `size ?? (variant === 'close' ? 21 : 17)`.

`builtInClasses`: `'inline-flex items-center justify-center shrink-0 rounded-[var(--radius-120)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)] disabled:cursor-not-allowed disabled:text-[color:var(--icon-link-disabled)] cursor-pointer transition-colors duration-150'` plus the per-variant color chain.

`variantColorClasses[variant]`: per-variant text-color chain (default + hover + clicked) — see token mapping below.

### State mechanics

Pure pseudo-classes. No `state` prop. The browser drives:
- `:hover` → swap to `--icon-link-{variant}-hover`
- `:active` → swap to `--icon-link-{variant}-clicked`
- `:disabled` → swap to `--icon-link-disabled`, set `cursor-not-allowed`, `pointer-events-none` (via `disabled` attribute behavior)

### Replace-semantics override

Per `feedback_tailwind_class_order.md`: `className` REPLACES the built-in class string when set. Don't append. Same pattern as `<SmallSegmentedButton>` and `<TabSegment iconClassName>`.

## Token additions to `src/index.css`

19 new tokens, all linked to existing color primitives:

```css
/* IconLink + TextLink shared color tokens — drives <IconLink> and future
   extended <TextLink> variants. Names match Figma exactly. */
--icon-link-basic-default: var(--color-sys-blue-DEFAULT);     /* #007ce0 */
--icon-link-basic-hover: var(--color-sys-blue-dark);          /* #0058b6 */
--icon-link-basic-clicked: var(--color-sys-blue-darker);      /* #002c83 */

--icon-link-danger-default: var(--color-sys-red-DEFAULT);     /* #e0241a */
--icon-link-danger-hover: var(--color-sys-red-dark);          /* #99140a */
--icon-link-danger-clicked: var(--color-sys-red-darker);      /* #440505 */

--icon-link-danger-subtle-default: var(--color-set-lighter);  /* #647176 */
--icon-link-danger-subtle-hover: var(--color-sys-red-DEFAULT);
--icon-link-danger-subtle-clicked: var(--color-sys-red-dark);

--icon-link-subtle-default: var(--color-set-lighter);         /* #647176 */
--icon-link-subtle-hover: var(--color-set-light);             /* #38484f */
--icon-link-subtle-clicked: var(--color-set-DEFAULT);         /* #0c2028 */

--icon-link-success-default: var(--color-sys-green-DEFAULT);  /* #5acc5a */
--icon-link-success-hover: var(--color-sys-green-dark);       /* #11aa4f */
--icon-link-success-clicked: var(--color-sys-green-darker);   /* #005c34 */

--icon-link-disabled: var(--color-space-dark);                /* #d4d4d4 */

/* Default variant — neutral dark (for non-link uses like generic toolbars) */
--icon-link-default-default: var(--color-set-DEFAULT);        /* #0c2028 */
--icon-link-default-hover: var(--color-set-light);            /* #38484f */
--icon-link-default-clicked: var(--color-set-DEFAULT);        /* #0c2028 */

/* Close variant — light grey, mirrors subtle hover/clicked progression */
--icon-link-close-default: var(--color-set-lightest);         /* #90999d */
--icon-link-close-hover: var(--color-set-lighter);            /* #647176 */
--icon-link-close-clicked: var(--color-set-light);            /* #38484f */
```

All hex values derived from Figma `get_variable_defs` on node `363:307`. The Close variant Hover/Clicked colors are not documented in Figma (only Default is); they mirror the `subtle` progression as a sensible default — flag for designer review at first product use.

## Stories (`Actions/IconLink`)

1. **AllVariants** — gallery of all 7 variants in default state, side by side.
2. **States** — `basic` variant in Default / Hover / Clicked / Disabled, using Storybook `pseudo` parameter to force visual states.
3. **Sizes** — 17px default, 21px (close-default), 24px custom.
4. **Interactive** — `useState` wired to `onClick`, action logging.
5. **WithTooltip** — explicit demonstration of tooltip-on-hover, including the `tooltip` override and `showTooltip={false}` opt-out cases.

Meta `args.icon = 'trash'`, `variant = 'basic'`, `'aria-label' = 'Delete'`. Render at meta level so the autodocs Primary preview renders.

## Migration plan (Phase 1)

Six high-confidence migrations after the atom ships, each as its own follow-up commit:

| File | Pattern | New use |
|---|---|---|
| `src/components/Banner/Banner.tsx` | inline `<button><Icon name="close"/></button>` close-X | `<IconLink icon="close" variant="close" aria-label="Dismiss banner" />` |
| `src/components/Tag/Tag.tsx` | inline close-X (when removable) | `<IconLink icon="close" variant="close" aria-label="Remove tag" size={14} />` (verify size) |
| `src/components/Input/Input.tsx` | inline clear-X (when value present) | `<IconLink icon="close" variant="close" aria-label="Clear" />` |
| `src/components/Pagination/Pagination.tsx` | prev / next chevron buttons | `<IconLink icon="chevron-left" variant="default" aria-label="Previous page" />` |
| `src/components/Dropdown/Dropdown.tsx` | clear-X (when value present + clearable) | `<IconLink icon="close" variant="close" aria-label="Clear selection" />` |
| `src/components/SuffixInput/SuffixInput.tsx` | clear-X | `<IconLink icon="close" variant="close" aria-label="Clear" />` |

Other 15 grep hits (TabSegment icon-only, TableExpandToggle, Sidebar collapse, MultiTagSelect chips, NumberInput stepper, etc.) are deferred — they're either compound-internal pieces with different semantics or candidates for case-by-case review when those components are next touched. Migration list documented in this spec but those commits happen organically.

## Accessibility

- **`aria-label` is required at the prop level.** TypeScript enforces it (no optional fallback). An icon-only button without a name fails WCAG 4.1.2.
- **`role="button"`** is implicit via `<button>`.
- **Tooltip default-on:** the `aria-label` text auto-renders as a visible tooltip on hover (using existing `<Tooltip>`). Single source of truth — no drift between SR text and visible label.
  - `tooltip` prop overrides only the visible text (rare — for cases where SR description is longer/different).
  - `showTooltip={false}` suppresses (e.g., when wrapper already has a row-level tooltip).
- **Focus ring** — `focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]`, same pattern as Tab/SmallSegmentedButton.
- **Disabled** — native `disabled` attribute on `<button>`; browser handles focus suppression and SR announcement.
- **Tooltip when disabled** — should still show the tooltip (so users know what the button would do); `<Tooltip>` already supports this. Verify in stories.

## Verification

1. **Lint clean** — `npm run lint` (only the pre-existing PrefixInput error tolerated).
2. **Build clean** — `npm run build` (`tsc -b && vite build`) returns 0.
3. **Storybook visual** — open `Actions/IconLink → AllVariants` and `States`. Use `mcp__claude_ai_Figma__get_screenshot` on Figma node `363:307` (the full IconButton frame matrix) to render each variant × state cell, then DevTools-inspect each Storybook variant's computed `color` value and confirm hex match against the Figma cell. Pixel-position match is not required (the Figma frame is a documentation grid, not an in-product render).
4. **A11y addon** — every story passes Storybook a11y. `aria-label` always present. Tooltip role wired correctly.
5. **Token discipline grep** — zero raw hex in `IconLink.tsx`. Every color references `--icon-link-*` (which itself links to a primitive).
6. **Tailwind v4 type hints** — every `text-[var(...)]` carries a `color:` prefix. Grep-check: `grep -E 'text-\[var\(' src/components/IconLink/` returns nothing.
7. **Replace-semantics check** — `className` is `||`-replaced, never `' '.join(...)`-appended.
8. **Codex review** at end — full pass, expect no critical/major findings on what is essentially a slim atom.

## Risks / things to double-check at implement time

- **Tooltip arrow default direction** — picked `down` because most IconLinks live in toolbars at the top of cards/tables, and tooltip pops below. Verify against actual product placement in references.
- **Close-variant Hover/Clicked behavior** — Figma doesn't document; spec assumes mirror-of-subtle. Flag in commit message and PR description for designer review.
- **Disabled tooltip behavior** — verify `<Tooltip>` still triggers on hover when child `<button>` is disabled (some implementations swallow events; may need a wrapper span).
- **Migration scope creep** — Phase 1 is exactly 6 files. Don't expand during initial commit.

## Critical files for implementation

- `src/components/Tooltip/Tooltip.tsx` (mirror its `TooltipArrow` type and `disabled` prop semantics)
- `src/components/Icon/Icon.tsx` and `Icon/iconPaths.ts` (pull `IconName` type and the close icon's geometry — confirm `close` is a 21x21 viewBox or scales differently)
- `src/components/Tab/TabSegment.tsx:131` (mirror replace-semantics override pattern)
- `src/components/SmallSegmentedButton/SmallSegmentedButton.tsx` (mirror brief JSDoc + meta-render-for-autodocs pattern from session-handoff lesson)
- `src/index.css:280-340` (existing `--text-link-*` tokens — append new `--icon-link-*` block adjacent)

## Open questions deferred to implementation

- The Figma `Type=Default` variant's exact use case (TopBar uses a different chip atom) — may end up unused in Phase 1. If unused, still add the tokens (they're cheap).
