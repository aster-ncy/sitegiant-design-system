# IconLink — Design Spec

**Date:** 2026-04-30
**Figma:** [Icon Button frame](https://www.figma.com/design/oJHxwesmlNeeVHrITxDdZ3/-Library--SiteGiant-ERP?node-id=394-168&m=dev) (node `394:168`)
**Status:** Ready to build. `<TooltipTrigger>` shipped 2026-05-01 at commit `9c1227e` and is exported from `src/components/Tooltip/index.ts`. This spec was revised 2026-05-03 to compose `<TooltipTrigger>` as the hover-trigger primitive (was previously written against the static `<Tooltip>` bubble).

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

Single component. `variant` prop drives icon color via a `Record<Variant, ColorClassChain>` map. Renders `<button>` (containing `<Icon>`) wrapped in `<TooltipTrigger>`.

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
import type { TooltipPlacement } from '../Tooltip';

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
  /** Default 'top' — bubble appears above the icon. Auto-flips on viewport collision. */
  tooltipPlacement?: TooltipPlacement;
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
<TooltipTrigger
  content={tooltip ?? ariaLabel}
  placement={tooltipPlacement ?? 'top'}
  enabled={showTooltip ?? true}
>
  <button
    type={type ?? 'button'}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={handleClick}
    className={className || builtInClasses}
  >
    <Icon name={icon} size={resolvedSize} className={variantColorClasses[variant]} />
  </button>
</TooltipTrigger>
```

`<TooltipTrigger>` (shipped 2026-05-01 at `9c1227e`) owns the hover/focus state machine, portal positioning, auto-flip on viewport collision, and 150ms open-delay. It accepts a single React element child and clones in `aria-describedby` + focus listeners. Hover listeners live on its wrapper `<span class="inline-flex">`, so a `disabled` `<button>` still triggers the tooltip.

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

## Migration plan (deferred — all candidates are bespoke-colored)

**No migrations land with the atom (revised 2026-05-03 after reading the candidate files).**

Every Phase 1 candidate that initially looked like an IconLink consumer turned out to use **variant-aware or component-specific icon coloring** that doesn't match IconLink's 7 fixed variants:

| File | Why deferred |
|---|---|
| `Banner.tsx` close-X | Icon color is `styles.iconColor` (varies by Banner variant: green-dark / blue-dark / yellow-dark / red-dark) and the button has a `--banner-dismiss-hover-fill` background hover — not a link icon. |
| `Tag.tsx` close-X | Icon color is `var(--tag-icon)` (a tag-specific token), not `--icon-link-close-*`. |
| `Pagination.tsx` prev/next | Color is `--color-text-primary` with disabled state `--color-surface-card-border` — pagination-specific. |
| `Input.tsx` / `SuffixInput.tsx` | No clear-X button exists; original spec listing was wrong. |
| `Dropdown.tsx` clear | Filled circular chip (`size-[17px]` with `bg-[var(--color-set-lightest)]`, white 11px icon), not a link-styled icon. Closer to TopBar's `IconButton`. |

The 21 inlined icon-button hits in the codebase are mostly **compound-internal pieces with bespoke colors**, not natural IconLink consumers. IconLink is the right atom for *new* product surfaces (toolbars, table-row actions, dialogs) where one of the 7 variants fits — migrations land organically when those surfaces are built.

## Accessibility

- **`aria-label` is required at the prop level.** TypeScript enforces it (no optional fallback). An icon-only button without a name fails WCAG 4.1.2.
- **`role="button"`** is implicit via `<button>`.
- **Tooltip default-on:** the `aria-label` text auto-renders as a visible tooltip on hover (via `<TooltipTrigger>`). Single source of truth — no drift between SR text and visible label.
  - `tooltip` prop overrides only the visible text (rare — for cases where SR description is longer/different).
  - `showTooltip={false}` suppresses (e.g., when wrapper already has a row-level tooltip).
- **Focus ring** — `focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]`, same pattern as Tab/SmallSegmentedButton.
- **Disabled** — native `disabled` attribute on `<button>`; browser handles focus suppression and SR announcement.
- **Tooltip when disabled** — `<TooltipTrigger>` mounts hover listeners on its outer wrapper `<span class="inline-flex">`, so disabled buttons still trip the tooltip on hover. Verified by design (no separate validation needed in stories).

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

- **Tooltip placement default** — picked `top` (bubble above icon) per user confirmation 2026-05-03. `<TooltipTrigger>` auto-flips on viewport collision, so the default holds for IconLinks both in toolbars and in tight bottom-of-screen placements.
- **Close-variant Hover/Clicked behavior** — Figma doesn't document; spec assumes mirror-of-subtle. Flag in commit message and PR description for designer review.
- **Migration scope creep** — Phase 1 is exactly 3 files (Banner, Tag, Pagination). Don't expand during initial commit.

## Critical files for implementation

- `src/components/Tooltip/TooltipTrigger.tsx` and `src/components/Tooltip/index.ts` (consume `<TooltipTrigger>` and the exported `TooltipPlacement` type)
- `src/components/Icon/Icon.tsx` and `Icon/iconPaths.ts` (pull `IconName` type; `close` is a 24×24 viewBox like every other icon — `Icon` accepts a numeric `size` and renders at that pixel size)
- `src/components/SmallSegmentedButton/SmallSegmentedButton.tsx:135` (`className || ROOT_BUILTIN_CLASSES` — the exact replace-semantics pattern to mirror)
- `src/components/SmallSegmentedButton/SmallSegmentedButton.stories.tsx` (meta-level `render` function for autodocs Primary preview)
- `src/index.css:493-502` (`--text-link-*` block — splice `--icon-link-*` block immediately after, before the FORM — FILTER COLORS section)
- `src/index.css:280-340` (existing `--text-link-*` tokens — append new `--icon-link-*` block adjacent)

## Open questions deferred to implementation

- The Figma `Type=Default` variant's exact use case (TopBar uses a different chip atom) — may end up unused in Phase 1. If unused, still add the tokens (they're cheap).
