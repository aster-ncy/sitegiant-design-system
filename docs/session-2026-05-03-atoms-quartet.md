# Session 2026-05-03 — Atoms Quartet

**Resume keyword:** `atoms-quartet`

## Summary

Four atoms shipped end-to-end on `main`, all Codex-reviewed, all pushed to origin. The original goal — clear the SortBlock dependency stack — is complete; Typography came as a follow-on.

| # | Atom | Figma | Commits | Outcome |
|---|---|---|---|---|
| 1 | **IconLink** | 363:307 (spec from 2026-04-30) | 7 | 7 variants × 4 states, composes `<TooltipTrigger>`, 19 new `--icon-link-*` tokens. Migrations deferred. |
| 2 | **DashedButton** | 2099:1295 | 5 | Dashed outline-button chrome, `children` API, `fullWidth?`, 2 new `--text-link-*` tokens. |
| 3 | **SortBlock** | 2411:39 + 6 sub-frames | 11 | Label/value cell, `rows`-prop with `children` fallback, Readonly + Readonly Bold variants only. 1 new token. |
| 4 | **Typography** | 2338:4549/4551/4553 | 6 | The "main atom" — 19 Type × 10 State × 3 lang. ~30 new `--general-*` typography tokens + 5 `--color-text-*` feedback tokens. |

**Total: 30 commits this session on this terminal.**

## Per-atom highlights

### 1. IconLink

**Spec:** `docs/superpowers/specs/2026-04-30-iconlink-design.md` (final at commit `da6ac97`).

**Architecture:**
- 7 variants (`basic` / `danger` / `danger-subtle` / `subtle` / `default` / `success` / `close`)
- Pure pseudo-class state styling — `:hover` / `:active` / `:disabled` browser-driven
- Composes `<TooltipTrigger>` (shipped 2026-05-01) for tooltip-on-hover sourced from `aria-label` (single source of truth for SR + visible label)
- 19 new `--icon-link-*` CSS vars linked to existing color primitives
- `aria-label` required at the type level (icon-only buttons need a name)

**Codex caught:**
- *(MAJOR)* Disabled buttons could still apply variant hover colors via Tailwind specificity tie. Fix: split `VARIANT_COLOR_CLASSES` so `disabled` flag drops the variant chain entirely; only `disabled:text-[color:var(--icon-link-disabled)]` from the root chain ever paints.
- *(MINOR)* Story coverage gap — only 3 variants in `States`. Fixed with disabled row across all 7 variants in `AllVariants`.

**Migrations deferred:** 6 candidates (Banner / Tag / Pagination / Input / SuffixInput / Dropdown) all turned out to have variant-aware or component-specific coloring that doesn't fit IconLink's 7 fixed variants. Migrations land organically when new surfaces fit one of the 7 variants.

### 2. DashedButton

**Architecture:**
- Outline-button chrome (1px dashed border, `--radius-4`, 12px/8px padding) wrapping arbitrary children
- Icons inherit color via `currentColor` so consumer can use any `<Icon>` directly
- `fullWidth?: boolean` toggles intrinsic vs 100%-of-parent
- Replace-semantics `className`

**Token additions:** `--text-link-basic-clicked` (→ `--color-sys-blue-darker`) and `--text-link-disabled` (→ `--color-space-dark`). Added to BOTH duplicate `--text-link-*` blocks in `src/index.css` — duplication is a pre-existing bug, fixing it was out of scope this round.

**Codex caught:**
- *(MAJOR)* `disabled:text-[...]` and `hover:text-[...]` both compile to specificity 0,2,0 — Tailwind v4 doesn't guarantee `disabled:` variants emit after `hover:` variants. Disabled hover text could leak through. Fix: split into `INTERACTIVE_STATE_CLASSES` vs `DISABLED_STATE_CLASSES` constants and pick by `disabled` flag (mirrors IconLink). The `disabled:hover:bg-...` was already safe at specificity 0,3,0.

### 3. SortBlock

**Architecture:**
- Label/value cell with `--sorting-block-sorting-fill` (#F6F6F6) bg, `px-6 py-12`, `items-start`
- **Option A API** (Codex agreed): `rows: { label, value, bold?, caption? }[]` for the dominant labeled-row case; `children` falls through for body variants (icon, tag, button, image, image-thumbnail)
- Layout matrix:
  - Horizontal (any rowCount): outer flex `gap-8`, label-stack and value-stack each `flex-col gap-8`
  - Vertical 1 row: outer `flex-col gap-2`
  - Vertical 2 rows: outer `flex-col gap-8`, each pair `flex-col gap-2`
- Per scope decision, only Readonly + Readonly Bold variants ship. Default/Hover/Filled/Disabled (with editable inputs) deferred.

**Codex caught (Q1):** added `color:` type hint to `bg-[color:var(--sorting-block-sorting-fill)]`; story used nonexistent `--color-surface-card-default` token + raw `#ffffff` fallback → swapped to `--color-surface-card`.

**User feedback rounds on the SortableRowComposition story** (4 fix commits):
1. Should be one continuous grey strip, not discrete chips on white
2. Drop the inter-cell vertical dividers
3. Drag + calendar icons should paint `--color-set-lightest` (#90999d), not the inherited near-black
4. Use Icon's existing `color` prop, not wrapper `<span class="text-...">` — Codex follow-up

The user spotted the discrete-chip bug visually before any reviewer caught it.

### 4. Typography

**Figma source:** Three matrices (`[EN]` 2338:4549, `[繁中]` 2338:4551, `[简中]` 2338:4553) all structurally identical — 19 Types × 10 States — only the font-family differs by language.

**Architecture:**
```ts
type TypographyType =
  | 'section-title' | 'section-small-title'
  | 'display' | 'display-small'
  | 'heading'
  | 'body-large' | 'body' | 'body-medium' | 'body-bold'
  | 'body-slim' | 'body-medium-slim' | 'body-bold-slim'
  | 'caption' | 'caption-slim'
  | 'caption-small' | 'caption-medium-small'
  | 'caption-medium-slim'
  | 'caption-large' | 'caption-larger';

type TypographyState =
  | 'primary' | 'secondary' | 'info' | 'muted'
  | 'basic' | 'success' | 'danger' | 'alert' | 'warning'
  | 'on-dark';

type TypographyLang = 'en' | 'tc' | 'sc';

interface TypographyProps {
  type?: TypographyType;          // default 'body'
  state?: TypographyState;        // default 'primary'
  italic?: boolean;               // collapses Figma's "Body Italic" + "Body Italic Slim"
  lang?: TypographyLang;          // default 'en' → font-family swap
  as?: ElementType;               // default 'span'
  children: ReactNode;
  className?: string;             // REPLACES built-in classes
}
```

**Token additions:**
- 5 new `--color-text-*` feedback tokens (basic / success / danger / alert / warning) → `--color-sys-*-DEFAULT` primitives. Deliberately NOT the muted `--color-sys-*-text` variants (those are for filled-banner readability, not inline text). Codex confirmed.
- ~30 new `--general-*` typography tokens — full Figma scale. Each token aliases the underlying `--text-*` / `--leading-*` / `--font-weight-*` primitive. Naming byte-exact with Figma.

**Codex caught:**
- *(MAJOR)* `font-[var(--general-X-weight)]` is ambiguous in Tailwind v4 — could parse as `font-family`. Fix: `font-[weight:var(...)]` everywhere (mirrors the existing `font-[family-name:...]` pattern). Codex confirmed Q4 that the resolved font-weight tokens are numeric (400/500/700) so the resolved CSS is valid.
- *(MAJOR)* Story coverage — `on-dark` state was excluded from the main matrices (correctly; it disappears on white) but had no dark-bg matrix of its own. Added `OnDarkMatrix` (full 19×3 grid on a dark stripe) and an italic-across-states row.

## Process meta-lessons

1. **Re-using Icon's `color` prop** — Codex caught the wrapper-span pattern. Memory entry filed: prefer existing component props before adding wrapper elements for color/size overrides.
2. **Async Codex tasks need explicit waiting.** Background dispatch + delayed completion notification is unreliable through MCP; foreground is safer for non-trivial reviews.
3. **Migration claims are expensive promises.** When IconLink shipped, all 6 "obvious migrations" turned out to need bespoke coloring. Read each candidate file before committing to a migration list — grep-match is not enough.
4. **The user spotted a visual bug Codex missed.** Reinforces existing memory entries: visual-diff before declaring done.
5. **Two terminals on `main` interleaving cleanly.** TableCardCell work from the other terminal interleaved with my atoms work all session. No conflicts because file scopes were disjoint and we both committed atomically with explicit `git add <path>`.

## Commit log (this terminal, chronological)

### IconLink (7 commits)

```
e99b858 docs(iconlink): amend spec to compose TooltipTrigger
b8de8c6 feat(tokens): add --icon-link-* tokens for upcoming IconLink atom
f494ef5 feat(icon-link): add IconLink atom
6294da1 feat(icon-link): add 5 stories under Actions/IconLink
54dac19 feat(icon-link): wire barrel exports
da6ac97 docs(iconlink): defer all Phase 1 migrations after candidate review
a556c0a fix(icon-link): drop variant chain when disabled (Codex review)
```

### DashedButton (5 commits)

```
e87b854 feat(tokens): add --text-link-basic-clicked and --text-link-disabled
5b449e6 feat(dashed-button): add DashedButton atom
decac3d feat(dashed-button): add 5 stories under Actions/DashedButton
ab8a933 feat(dashed-button): wire barrel exports
c1ff0f1 fix(dashed-button): split state classes by disabled (Codex review)
```

### SortBlock (11 commits)

```
67f131d feat(tokens): add --sorting-block-sorting-fill
5afbca5 feat(sort-block): add SortBlock atom (readonly variants)
b931f92 feat(sort-block): add 5 stories under Information/SortBlock
946af28 feat(sort-block): wire barrel exports
94ce737 fix(sort-block): Tailwind v4 color: hints + valid story tokens (Codex)
daedfca fix(sort-block): SortableRowComposition matches sb6 (continuous grey)
7acf3b4 fix(sort-block): drop dividers from SortableRowComposition
9d662f6 fix(sort-block): drag + calendar icons use --color-set-lightest
00be708 refactor(sort-block story): use Icon color prop, drop wrapper spans
a3da98d fix(sort-block story): BodyVariants icons use --color-set-lightest
```

### Typography (6 commits)

```
0744cd7 feat(tokens): add typography scale + feedback text colors
f27ec17 feat(typography): add Typography atom
ef3a10b feat(typography): add 8 stories under Foundation/Typography
319354c feat(typography): wire barrel exports
67e51dc fix(typography): font-[weight:var(...)] type hints (Codex review)
fae0552 feat(typography stories): add OnDarkMatrix + italic-across-states
```

## What's next

1. **Typography migration sweep** — user agreed to Level A (ship Typography first) but expressed Level C intent (eventually migrate every hardcoded typography in the DS). Migrate consumers one at a time with Codex review at each step. Best first candidates:
   - `TextLink` (mechanical swap)
   - `Button`
   - `Banner` title/description spans
   - `Tag` label span
   - `SortBlock` label and value spans (closes the loop)
2. **Other missing atoms** — FileUpload/Dropzone, Modal/Dialog, Toast/Notification, Drawer, Skeleton.
3. **SortBlock interactive states** — Default/Hover/Filled/Disabled with editable inputs. Deferred this session per scope.
