# SortBlock Family Split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the existing single `SortBlock` component into a family of 7 named exports (`SortBlockDefault`, `SortBlockMainSub`, `SortBlockLongContent`, `SortBlockIcon`, `SortBlockTag`, `SortBlockButton`, `SortBlockImage`) matching Figma's library 1:1, and flip `className` semantics from replace to append across the family.

**Architecture:** Each family member owns its own padding and root layout (the differentiating axis from Figma), and shares fill + typography helpers via `src/components/SortBlock/shared.ts`. Hard-cut migration: the old `SortBlock` export is removed in the same change as the call-site updates; a TypeScript compile error is the safety net for any miss. The s7 Add Trip story (`src/stories/Table/InsetTableScreens.stories.tsx`) and all SortBlock stories are updated atomically with the new family.

**Tech Stack:** React 19, TypeScript 5.9, Vite, Storybook 10, Tailwind v4 with CSS custom properties. **No test framework** — verification is via `npm run lint`, `npm run build` (TS check), and Storybook visual diff. Use Chrome DevTools MCP to verify rendered DOM/CSS where visual fidelity is in question.

**Spec:** `docs/superpowers/specs/2026-05-05-sortblock-family-split-design.md` (commit `43b05ca`).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/SortBlock/shared.ts` | Create | `FILL_CLASS`, `LABEL_CLASSES`, `valueBodyClass({ wrap, bold })`, `valueCaptionClass()`, `hasLabel(row)`, shared `SortBlockRow` type, `SortBlockState` type, `appendClass(builtIn, className?)` helper. |
| `src/components/SortBlock/SortBlockDefault.tsx` | Create | Renamed/extracted from current `SortBlock.tsx`. Rows API (1 or 2 rows × horizontal/vertical), `state` prop, append-style `className`. Drops `mainSub` / `wrap` / `children` paths. |
| `src/components/SortBlock/SortBlockDefault.stories.tsx` | Create | Renamed from `SortBlock.stories.tsx`. Keep stories that exercise Default behaviour: Playground, RowsHorizontal, RowsVertical, RowsBold, NoLabel, MixedLabel. Remove Children-based stories (move to atom-cell families). |
| `src/components/SortBlock/SortBlockMainSub.tsx` | Create | Tuple-typed `rows: [SortBlockRow, SortBlockRow]`. `rows[0]` body 14/17, `rows[1]` caption 12/17. Always vertical, gap-4. `state` prop (Readonly / Readonly Bold) drives main-row default weight. |
| `src/components/SortBlock/SortBlockMainSub.stories.tsx` | Create | Default, ReadonlyBoldMain, WithLabels, NoLabels stories. |
| `src/components/SortBlock/SortBlockLongContent.tsx` | Create | Rows API (1 or 2 rows). Values use `whitespace-pre-line`. `state` + `bold` semantics same as Default. |
| `src/components/SortBlock/SortBlockLongContent.stories.tsx` | Create | LongTextNatural (CSS wrap), LongTextWithBreaks (`\n`), LongText2pa, LongText3pa stories. |
| `src/components/SortBlock/SortBlockIcon.tsx` | Create | Children API. Padding `pl-12 pr-16 py-12`. Append-style className. |
| `src/components/SortBlock/SortBlockIcon.stories.tsx` | Create | DragIcon, CloseIcon, IconButton stories. |
| `src/components/SortBlock/SortBlockTag.tsx` | Create | Children API. Same padding as Icon. |
| `src/components/SortBlock/SortBlockTag.stories.tsx` | Create | WithPip story. |
| `src/components/SortBlock/SortBlockButton.tsx` | Create | Children API. `kind: 'textlink' \| 'dashed'` prop selects vertical padding (`py-12` for textlink, `py-4` for dashed). Horizontal padding `pl-12 pr-16` always. |
| `src/components/SortBlock/SortBlockButton.stories.tsx` | Create | TextLinkKind, DashedKind stories. |
| `src/components/SortBlock/SortBlockImage.tsx` | Create | Children API. No padding around the tile (per Figma); just fill + flex container. |
| `src/components/SortBlock/SortBlockImage.stories.tsx` | Create | LightImage, DarkImage stories (using existing project image assets). |
| `src/components/SortBlock/CompositionExamples.stories.tsx` | Create | Move `InsetHeaderWithSortBlockRows` and `SortableRowComposition` here. These are composition patterns, not single-component stories. |
| `src/components/SortBlock/index.ts` | Rewrite | Re-export all 7 components + shared types. Drop the old `SortBlock` export. |
| `src/components/SortBlock/SortBlock.tsx` | Delete | Replaced by `SortBlockDefault.tsx` + family. |
| `src/components/SortBlock/SortBlock.stories.tsx` | Delete | Stories moved to per-component story files + composition examples. |
| `src/components/index.ts` | Modify | Update lines 228–230: replace `SortBlock` re-export with the 7 family exports + shared types. |
| `src/stories/Table/InsetTableScreens.stories.tsx` | Modify | Update `S7AddTrip` story (lines ~640–745) to use the new family: drag/close → `SortBlockIcon`, tracking → `SortBlockDefault state="Readonly Bold"`, delivery → `SortBlockDefault`, customer → `SortBlockMainSub`, address → `SortBlockLongContent`. Remove the `sbIconCell`/`sbTextCell` className constants (the family bakes those in). |

**About `valueClass` in the spec (line 88):** the spec describes a single `valueClass(row, { wrap, defaultBold })` helper, but Codex flagged that MainSub's `rows[1]` needs caption sizing while `rows[0]` needs body sizing. Resolution: split into **two helpers** — `valueBodyClass({ wrap, bold })` for body-sized values (Default, LongContent, MainSub `rows[0]`) and `valueCaptionClass()` for caption-sized values (MainSub `rows[1]`). Body vs caption is a per-row-position choice in MainSub, not a generic option, so two helpers reads cleaner than one helper with a `size` parameter.

---

## Pre-flight

- [ ] **Step P1: Verify branch, clean tree, current tip**

```bash
cd "/c/Users/Aster/SiteGiant File/D/Aster/Aster Testing/sitegiant-design-system/sitegiant-storybook"
git rev-parse --abbrev-ref HEAD
git log --oneline -3
git status -s
```

Expected: branch `main`. Recent log includes commit `43b05ca docs(sort-block): address Codex review of family-split spec`. Working tree may have untracked other-terminal WIP (`.superpowers/`, `17px/`, `docs/session-2026-04-29-...`, `docs/session-2026-05-04-...`) — leave untouched. No tracked-file modifications.

If branch is not `main` or tracked files are dirty, stop and resolve before proceeding.

- [ ] **Step P2: Verify Storybook dev server is reachable**

If Storybook is not running:
```bash
npm run storybook
```
Visit `http://localhost:6006/?path=/story/information-sortblock--playground` and confirm the current single-`SortBlock` stories render. This is the baseline.

Also visit `http://localhost:6006/?path=/story/tables-reference-screens--s-7-add-trip` and confirm s7 Add Trip renders. This is the load-bearing call site.

- [ ] **Step P3: Snapshot the s7 visual baseline**

Take a screenshot of the s7 Add Trip story (or use Chrome DevTools MCP `take_snapshot`) so any regression after the migration is comparable pixel-for-pixel.

---

## Task 1: Add shared module

**Files:**
- Create: `src/components/SortBlock/shared.ts`

**Why first:** Every family member imports from `shared.ts`. Land it before any component file so subsequent tasks can import without touch-and-go.

- [ ] **Step 1.1: Create `src/components/SortBlock/shared.ts`**

```ts
/**
 * Shared helpers for the SortBlock component family — Figma:
 * Sort Block - Default (2411:39), MainSub (2411:41), Long Content (2411:40),
 * Icon (2411:42), Tag (3127:10385), Button (2918:10689), Image (3715:3682).
 *
 * The family shares the `--sorting-block-sorting-fill` background and a
 * common label/value typography system (caption 12/17 for labels, body
 * 14/17 for body values, caption 12/17 for sub-row values).
 */

/** Component-level state axis from Figma. Per the 2026-05-03 build scope,
 *  only the readonly subset ships. The type is forward-compatible: callers
 *  cannot pass 'Hover' / 'Default' / 'Filled' / 'Disabled' (TS error) until
 *  this union is widened. */
export type SortBlockState = 'Readonly' | 'Readonly Bold';

/** A single label/value row used by the text-content family members
 *  (Default, MainSub, LongContent). */
export interface SortBlockRow {
  /** Caption above the value. Empty string or omitted = no label for this
   *  row. **Mixed-label alignment:** for horizontal multi-row text layouts,
   *  if at least one row has a non-empty label, empty-label rows render an
   *  invisible placeholder so value rows stay column-aligned; if all labels
   *  are empty, omit the label column entirely. */
  label?: string;
  value: string;
  /** Per-row weight override. When set, wins over the component's `state`
   *  prop for this row only (including explicit `false` to force regular
   *  inside a `state="Readonly Bold"` component). Omit to inherit from
   *  `state`. */
  bold?: boolean;
}

/** Background fill class shared by every family member. */
export const FILL_CLASS = 'bg-[color:var(--sorting-block-sorting-fill)]';

/** Label typography — caption 12/17, info text colour, no wrap. */
export const LABEL_CLASSES =
  'font-[family-name:var(--general-font-family)] font-[weight:var(--general-caption-weight)] ' +
  'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] ' +
  'text-[color:var(--color-text-info)] whitespace-nowrap';

const VALUE_BASE_CLASSES =
  'font-[family-name:var(--general-font-family)] ' +
  'text-[color:var(--color-text-primary)]';

/** Body-sized value typography (14/17). Used by Default, LongContent, and
 *  MainSub's `rows[0]`. `wrap` swaps nowrap → pre-line for paragraph values
 *  (LongContent always passes true; Default always passes false). `bold`
 *  is the *resolved* weight (the caller has already merged `row.bold` with
 *  the component's `state`). */
export const valueBodyClass = ({ wrap, bold }: { wrap: boolean; bold: boolean }) =>
  [
    VALUE_BASE_CLASSES,
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)]',
    bold
      ? 'font-[weight:var(--general-body-bold-weight)]'
      : 'font-[weight:var(--general-body-weight)]',
    wrap ? 'whitespace-pre-line' : 'whitespace-nowrap',
  ].join(' ');

/** Caption-sized value typography (12/17). Used by MainSub's `rows[1]`. */
export const valueCaptionClass = () =>
  [
    VALUE_BASE_CLASSES,
    'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)]',
    'font-[weight:var(--general-caption-weight)]',
    'whitespace-nowrap',
  ].join(' ');

/** Empty-label predicate — empty string and undefined both mean "no label
 *  for this row". */
export const hasLabel = (row: SortBlockRow): boolean =>
  row.label !== undefined && row.label !== '';

/** Resolve a row's effective bold weight: per-row override wins over
 *  component-level `state`. */
export const resolveBold = (row: SortBlockRow, state: SortBlockState): boolean => {
  if (row.bold !== undefined) return row.bold;
  return state === 'Readonly Bold';
};

/** Append-style className composition. Built-in classes always render
 *  first; the consumer's className appends. Tailwind's last-wins resolution
 *  means consumer overrides win for atomic conflicts (e.g. `bg-red-500`
 *  beats the built-in fill). For non-atomic overrides, consumers use the
 *  `!` prefix per the existing project convention. */
export const appendClass = (builtIn: string, className?: string): string =>
  className ? `${builtIn} ${className}` : builtIn;
```

- [ ] **Step 1.2: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Expected: both clean. The new file has no consumers yet so any error is intrinsic to the file.

- [ ] **Step 1.3: Commit**

```bash
cd "/c/Users/Aster/SiteGiant File/D/Aster/Aster Testing/sitegiant-design-system/sitegiant-storybook"
git add src/components/SortBlock/shared.ts
git commit -m "feat(sort-block): add shared helpers module for the family split

Introduces FILL_CLASS, LABEL_CLASSES, valueBodyClass, valueCaptionClass,
hasLabel, resolveBold, appendClass plus the shared SortBlockRow + state
types that all 7 family members will import.

No consumers yet — wired up in subsequent commits."
```

---

## Task 2: Add `SortBlockDefault` (renamed from current SortBlock)

**Files:**
- Create: `src/components/SortBlock/SortBlockDefault.tsx`
- Create: `src/components/SortBlock/SortBlockDefault.stories.tsx`

**Why second:** Default carries the most behaviour from the old component (rows API, horizontal/vertical, mixed-label alignment). Getting it green proves the shared module's helpers are correctly factored before the simpler family members lean on them.

- [ ] **Step 2.1: Create `src/components/SortBlock/SortBlockDefault.tsx`**

```tsx
import {
  FILL_CLASS,
  LABEL_CLASSES,
  appendClass,
  hasLabel,
  resolveBold,
  valueBodyClass,
  type SortBlockRow,
  type SortBlockState,
} from './shared';

export type SortBlockOrientation = 'horizontal' | 'vertical';

export interface SortBlockDefaultProps {
  /** 1 or 2 label/value rows. */
  rows: SortBlockRow[];
  /** Layout direction. Horizontal places label and value side by side
   *  (per-row pairs stacked when 2 rows); vertical stacks label-over-value
   *  for each row, with rows themselves stacked. Default 'horizontal'. */
  orientation?: SortBlockOrientation;
  /** Component-level weight default. `'Readonly Bold'` makes every value
   *  bold unless an individual row overrides via `row.bold`. */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const horizontalLayout = () => 'gap-[var(--spacing-8)]';
const verticalLayout = (rowCount: number) =>
  rowCount > 1
    ? 'flex-col gap-[var(--spacing-8)]'
    : 'flex-col gap-[var(--spacing-2)]';

const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const VERTICAL_PAIR = 'inline-flex flex-col items-start gap-[var(--spacing-2)]';

/**
 * SortBlockDefault — Figma: Sort Block - Default (2411:39).
 *
 * Readonly label/value cell with the SortBlock fill, horizontal or vertical
 * layout, 1 or 2 rows. Use `state="Readonly Bold"` for whole-cell bold
 * defaults; use `row.bold` to override per row.
 *
 * For paragraph-style multi-line values, use `SortBlockLongContent` instead.
 * For 14/17 over 12/17 main+sub stacks, use `SortBlockMainSub`.
 */
export const SortBlockDefault = ({
  rows,
  orientation = 'horizontal',
  state = 'Readonly',
  className,
}: SortBlockDefaultProps) => {
  const layout =
    orientation === 'horizontal' ? horizontalLayout() : verticalLayout(rows.length);
  const rootClass = appendClass(`${ROOT_BASE} ${layout}`, className);

  if (orientation === 'horizontal') {
    const anyLabel = rows.some(hasLabel);
    return (
      <div className={rootClass}>
        {anyLabel && (
          <div className={HORIZONTAL_LABEL_STACK}>
            {rows.map((row, i) => (
              <span
                key={`l-${i}`}
                className={LABEL_CLASSES}
                aria-hidden={hasLabel(row) ? undefined : true}
              >
                {hasLabel(row) ? row.label : ' '}
              </span>
            ))}
          </div>
        )}
        <div className={HORIZONTAL_VALUE_STACK}>
          {rows.map((row, i) => (
            <span
              key={`v-${i}`}
              className={valueBodyClass({ wrap: false, bold: resolveBold(row, state) })}
            >
              {row.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Vertical: each row is its own label-over-value pair.
  return (
    <div className={rootClass}>
      {rows.map((row, i) => (
        <div key={i} className={VERTICAL_PAIR}>
          {hasLabel(row) && <span className={LABEL_CLASSES}>{row.label}</span>}
          <span
            className={valueBodyClass({ wrap: false, bold: resolveBold(row, state) })}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 2.2: Create `src/components/SortBlock/SortBlockDefault.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockDefault } from './SortBlockDefault';

const meta = {
  title: 'Information/SortBlock/Default',
  component: SortBlockDefault,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    rows: [{ label: 'Label', value: 'Value' }],
  },
} satisfies Meta<typeof SortBlockDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HorizontalSingleRow: Story = {
  args: { rows: [{ label: 'Label', value: 'Value' }] },
};

export const HorizontalTwoRows: Story = {
  args: {
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const VerticalSingleRow: Story = {
  args: { orientation: 'vertical', rows: [{ label: 'Label', value: 'Value' }] },
};

export const VerticalTwoRows: Story = {
  args: {
    orientation: 'vertical',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const ReadonlyBoldState: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const PerRowBoldOverride: Story = {
  args: {
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899', bold: true },
      { label: 'Delivery', value: '08 May 2025' },
    ],
  },
};

export const PerRowRegularOverride: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Tracking No.', value: 'MY123554G85899' },
      { label: 'Delivery', value: '08 May 2025', bold: false },
    ],
  },
};

export const NoLabel: Story = {
  args: { rows: [{ value: 'MY123554G85899' }] },
};

export const MixedLabelHorizontal: Story = {
  args: {
    rows: [
      { label: 'Tracking', value: 'MY123554G85899' },
      { value: '08 May 2025' },
    ],
  },
};

export const ClassNameAppendsSelfStretch: Story = {
  args: {
    rows: [{ value: 'MY123554G85899' }],
    className: 'self-stretch w-[200px]',
  },
};
```

- [ ] **Step 2.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Expected: both clean.

- [ ] **Step 2.4: Verify the new stories render in Storybook**

Visit each story under `http://localhost:6006/?path=/story/information-sortblock-default--*`. Confirm:
- `Playground` renders the default args with grey fill, label + value side-by-side.
- `MixedLabelHorizontal` shows the value column aligned (the no-label row has an invisible spacer in the label column).
- `ReadonlyBoldState` makes both values bold.
- `PerRowBoldOverride` makes only the first value bold.
- `PerRowRegularOverride` makes only the second value regular.
- `ClassNameAppendsSelfStretch` shows the stretch + width applied without losing the built-in fill/padding (this proves append semantics).

Use Chrome DevTools MCP if any look off — inspect the rendered class strings and confirm the built-in classes precede the consumer-passed ones.

- [ ] **Step 2.5: Commit**

```bash
git add src/components/SortBlock/SortBlockDefault.tsx src/components/SortBlock/SortBlockDefault.stories.tsx
git commit -m "feat(sort-block): add SortBlockDefault as first family member

Mirrors Figma 'Sort Block - Default' (2411:39) 1:1. Rows API
(horizontal/vertical, 1 or 2 rows), state prop for component-level
bold default, row.bold per-row override (including explicit false).
Mixed-label alignment preserved via invisible spacer.

className appends to built-ins instead of replacing — proven by
ClassNameAppendsSelfStretch story.

Old SortBlock still exists; family migration completed in later commits."
```

---

## Task 3: Add `SortBlockMainSub`

**Files:**
- Create: `src/components/SortBlock/SortBlockMainSub.tsx`
- Create: `src/components/SortBlock/SortBlockMainSub.stories.tsx`

- [ ] **Step 3.1: Create `src/components/SortBlock/SortBlockMainSub.tsx`**

```tsx
import {
  FILL_CLASS,
  LABEL_CLASSES,
  appendClass,
  hasLabel,
  resolveBold,
  valueBodyClass,
  valueCaptionClass,
  type SortBlockRow,
  type SortBlockState,
} from './shared';

export interface SortBlockMainSubProps {
  /** Exactly 2 rows. The tuple type is the contract — passing the wrong
   *  length is a TS compile error, not a runtime guard. */
  rows: [SortBlockRow, SortBlockRow];
  /** Component-level weight default for the *main* row (`rows[0]`). The
   *  sub row (`rows[1]`) is always caption-sized; weight on it follows the
   *  caption recipe regardless of `state`. Per-row `bold` on the main row
   *  overrides `state`; per-row `bold` on the sub row is ignored (caption
   *  recipe is fixed). */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start flex-col gap-[var(--spacing-4)] ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const PAIR_CLASSES = 'inline-flex items-start gap-[var(--spacing-8)]';

/**
 * SortBlockMainSub — Figma: Sort Block - MainSub (2411:41).
 *
 * Vertical 2-row stack with gap-4 between the main and sub pairs (vs
 * Default's gap-8 / gap-2). `rows[0]` is the body-sized "main" line
 * (14/17); `rows[1]` is the caption-sized "sub" line (12/17). Row position
 * determines size; there is no per-row size flag.
 */
export const SortBlockMainSub = ({
  rows,
  state = 'Readonly',
  className,
}: SortBlockMainSubProps) => {
  const [main, sub] = rows;
  const rootClass = appendClass(ROOT_BASE, className);

  return (
    <div className={rootClass}>
      <div className={PAIR_CLASSES}>
        {hasLabel(main) && <span className={LABEL_CLASSES}>{main.label}</span>}
        <span className={valueBodyClass({ wrap: false, bold: resolveBold(main, state) })}>
          {main.value}
        </span>
      </div>
      <div className={PAIR_CLASSES}>
        {hasLabel(sub) && <span className={LABEL_CLASSES}>{sub.label}</span>}
        <span className={valueCaptionClass()}>{sub.value}</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 3.2: Create `src/components/SortBlock/SortBlockMainSub.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockMainSub } from './SortBlockMainSub';

const meta = {
  title: 'Information/SortBlock/MainSub',
  component: SortBlockMainSub,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    rows: [
      { label: 'Main Label', value: 'Main Value' },
      { label: 'Sub Label', value: 'Sub Value' },
    ],
  },
} satisfies Meta<typeof SortBlockMainSub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ReadonlyBoldMain: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      { label: 'Main Label', value: 'Main Value' },
      { label: 'Sub Label', value: 'Sub Value' },
    ],
  },
};

export const NoLabels: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng' },
      { value: '60 12-456 6556' },
    ],
  },
};

export const MainBoldOverride: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng', bold: true },
      { value: '60 12-456 6556' },
    ],
  },
};

export const ClassNameAppendsSelfStretch: Story = {
  args: {
    rows: [
      { value: 'Wei Kheng' },
      { value: '60 12-456 6556' },
    ],
    className: 'self-stretch w-[130px]',
  },
};
```

- [ ] **Step 3.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Expected: both clean.

- [ ] **Step 3.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-mainsub--*`. Confirm:
- Default story shows two rows stacked, gap-4 between them.
- Main is body 14/17; sub is caption 12/17 (visibly smaller).
- `ReadonlyBoldMain` makes only the main bold (sub stays caption regular).
- `MainBoldOverride` also makes only the main bold via row-level override.
- `ClassNameAppendsSelfStretch` keeps the gap-4 *and* applies the stretch+width — this is the headline footgun from the spec being fixed.

- [ ] **Step 3.5: Commit**

```bash
git add src/components/SortBlock/SortBlockMainSub.tsx src/components/SortBlock/SortBlockMainSub.stories.tsx
git commit -m "feat(sort-block): add SortBlockMainSub family member

Mirrors Figma 'Sort Block - MainSub' (2411:41). Tuple-typed rows;
row[0] body 14/17 (main), row[1] caption 12/17 (sub). Position
determines size. state prop drives main-row default weight only;
sub row is fixed caption.

className appends — gap-4 and consumer self-stretch coexist
(headline footgun fix from the spec)."
```

---

## Task 4: Add `SortBlockLongContent`

**Files:**
- Create: `src/components/SortBlock/SortBlockLongContent.tsx`
- Create: `src/components/SortBlock/SortBlockLongContent.stories.tsx`

- [ ] **Step 4.1: Create `src/components/SortBlock/SortBlockLongContent.tsx`**

```tsx
import {
  FILL_CLASS,
  LABEL_CLASSES,
  appendClass,
  hasLabel,
  resolveBold,
  valueBodyClass,
  type SortBlockRow,
  type SortBlockState,
} from './shared';

export interface SortBlockLongContentProps {
  /** 1 or 2 paragraph-style rows. Values use whitespace-pre-line so both
   *  natural CSS wrap AND explicit \n line breaks are honoured. */
  rows: SortBlockRow[];
  /** Component-level weight default. */
  state?: SortBlockState;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start gap-[var(--spacing-8)] ${FILL_CLASS} ` +
  'px-[var(--spacing-6)] py-[var(--spacing-12)]';

const HORIZONTAL_LABEL_STACK = 'inline-flex flex-col items-start gap-[var(--spacing-8)]';
const HORIZONTAL_VALUE_STACK = 'flex flex-col items-start gap-[var(--spacing-8)] flex-1 min-w-0';

/**
 * SortBlockLongContent — Figma: Sort Block - Long Content (2411:40).
 *
 * For paragraph-style multi-line values (addresses, descriptions). Values
 * use `whitespace-pre-line` so explicit \n breaks AND natural CSS wrap
 * both work. Pair with a fixed-width parent (e.g. `className="w-[203px]"`)
 * for predictable wrap points.
 *
 * **Note on Figma divergence:** the Figma library node renders with
 * `text-ellipsis overflow-hidden` on a fixed-height `<p>`, but production
 * call sites (s7 Add Trip address cell) need wrap behaviour. This
 * implementation matches production. A library follow-up is open with the
 * Figma owner per the spec.
 */
export const SortBlockLongContent = ({
  rows,
  state = 'Readonly',
  className,
}: SortBlockLongContentProps) => {
  const rootClass = appendClass(ROOT_BASE, className);
  const anyLabel = rows.some(hasLabel);

  return (
    <div className={rootClass}>
      {anyLabel && (
        <div className={HORIZONTAL_LABEL_STACK}>
          {rows.map((row, i) => (
            <span
              key={`l-${i}`}
              className={LABEL_CLASSES}
              aria-hidden={hasLabel(row) ? undefined : true}
            >
              {hasLabel(row) ? row.label : ' '}
            </span>
          ))}
        </div>
      )}
      <div className={HORIZONTAL_VALUE_STACK}>
        {rows.map((row, i) => (
          <span
            key={`v-${i}`}
            className={valueBodyClass({ wrap: true, bold: resolveBold(row, state) })}
          >
            {row.value}
          </span>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 4.2: Create `src/components/SortBlock/SortBlockLongContent.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockLongContent } from './SortBlockLongContent';

const meta = {
  title: 'Information/SortBlock/LongContent',
  component: SortBlockLongContent,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    rows: [
      {
        value:
          'Long Content Long Content Long Content Long Content Long Content Long Content',
      },
    ],
    className: 'w-[193px]',
  },
} satisfies Meta<typeof SortBlockLongContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NaturalWrap: Story = {
  args: {
    rows: [
      {
        value:
          'A long shipping address that wraps naturally because the parent has a fixed width and the value has no explicit line breaks.',
      },
    ],
    className: 'w-[203px]',
  },
};

export const ExplicitLineBreaks: Story = {
  args: {
    rows: [
      {
        value: '123, Jalan Mayang Pasir,\n11200 Bayan Baru,\nPulau Pinang, Malaysia.',
      },
    ],
    className: 'w-[203px]',
  },
};

export const LongText2pa: Story = {
  args: {
    rows: [
      {
        label: 'Address',
        value: '123, Jalan Mayang Pasir,\n11200 Bayan Baru.',
      },
      {
        label: 'Notes',
        value: 'Leave at door.',
      },
    ],
    className: 'w-[260px]',
  },
};

export const ReadonlyBoldState: Story = {
  args: {
    state: 'Readonly Bold',
    rows: [
      {
        value:
          'A bold long value rendered with whitespace-pre-line so wraps still work.',
      },
    ],
    className: 'w-[203px]',
  },
};
```

- [ ] **Step 4.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

- [ ] **Step 4.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-longcontent--*`. Confirm:
- `NaturalWrap` wraps onto multiple lines via CSS at the parent's 203px width.
- `ExplicitLineBreaks` shows 3 lines, broken at the `\n` characters.
- `LongText2pa` shows 2 label/value pairs with the values wrapping.

- [ ] **Step 4.5: Commit**

```bash
git add src/components/SortBlock/SortBlockLongContent.tsx src/components/SortBlock/SortBlockLongContent.stories.tsx
git commit -m "feat(sort-block): add SortBlockLongContent family member

Mirrors Figma 'Sort Block - Long Content' (2411:40) intent — but
uses whitespace-pre-line instead of Figma's ellipsis fixture so
production wrap behaviour (s7 address cell) works. JSDoc documents
the divergence and points to the Figma library follow-up."
```

---

## Task 5: Add `SortBlockIcon`

**Files:**
- Create: `src/components/SortBlock/SortBlockIcon.tsx`
- Create: `src/components/SortBlock/SortBlockIcon.stories.tsx`

- [ ] **Step 5.1: Create `src/components/SortBlock/SortBlockIcon.tsx`**

```tsx
import type { ReactNode } from 'react';
import { FILL_CLASS, appendClass } from './shared';

export interface SortBlockIconProps {
  /** The icon content — typically an `<Icon>`, `<IconLink>`, or a
   *  `<button>` containing one. */
  children: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE =
  `inline-flex items-start ${FILL_CLASS} ` +
  'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-12)]';

/**
 * SortBlockIcon — Figma: Sort Block - Icon (2411:42).
 *
 * Holds a single 17px icon affordance (drag handle, close button, chevron,
 * etc.). Asymmetric `pl-12 pr-16` padding matches the Figma fixture.
 */
export const SortBlockIcon = ({ children, className }: SortBlockIconProps) => (
  <div className={appendClass(ROOT_BASE, className)}>{children}</div>
);
```

- [ ] **Step 5.2: Create `src/components/SortBlock/SortBlockIcon.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockIcon } from './SortBlockIcon';
import { Icon } from '../Icon';

const meta = {
  title: 'Information/SortBlock/Icon',
  component: SortBlockIcon,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drag: Story = {
  render: () => (
    <SortBlockIcon>
      <Icon name="drag" size={17} className="text-[color:var(--color-icon-secondary)]" />
    </SortBlockIcon>
  ),
};

export const Close: Story = {
  render: () => (
    <SortBlockIcon>
      <button
        type="button"
        aria-label="Remove"
        className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
      >
        <Icon name="close" size={17} className="text-[color:var(--color-icon-secondary)]" />
      </button>
    </SortBlockIcon>
  ),
};

export const ClassNameAppendsSelfStretch: Story = {
  render: () => (
    <SortBlockIcon className="self-stretch w-[45px]">
      <Icon name="drag" size={17} className="text-[color:var(--color-icon-secondary)]" />
    </SortBlockIcon>
  ),
};
```

- [ ] **Step 5.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

- [ ] **Step 5.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-icon--*`. Confirm asymmetric padding (12 left, 16 right) and grey fill.

- [ ] **Step 5.5: Commit**

```bash
git add src/components/SortBlock/SortBlockIcon.tsx src/components/SortBlock/SortBlockIcon.stories.tsx
git commit -m "feat(sort-block): add SortBlockIcon family member

Mirrors Figma 'Sort Block - Icon' (2411:42). Children API for the
17px icon/button affordance, asymmetric pl-12 pr-16 py-12 padding."
```

---

## Task 6: Add `SortBlockTag`

**Files:**
- Create: `src/components/SortBlock/SortBlockTag.tsx`
- Create: `src/components/SortBlock/SortBlockTag.stories.tsx`

- [ ] **Step 6.1: Create `src/components/SortBlock/SortBlockTag.tsx`**

```tsx
import type { ReactNode } from 'react';
import { FILL_CLASS, appendClass } from './shared';

export interface SortBlockTagProps {
  /** A `<Pip>` or `<Tag>` child. */
  children: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE =
  `inline-flex items-start ${FILL_CLASS} ` +
  'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-12)]';

/**
 * SortBlockTag — Figma: Sort Block - Tag (3127:10385).
 *
 * Holds a Pip or Tag inside a SortBlock fill. Same padding as
 * SortBlockIcon — both house a small atom that needs the asymmetric
 * pl-12 pr-16 chrome to sit snugly.
 */
export const SortBlockTag = ({ children, className }: SortBlockTagProps) => (
  <div className={appendClass(ROOT_BASE, className)}>{children}</div>
);
```

- [ ] **Step 6.2: Create `src/components/SortBlock/SortBlockTag.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockTag } from './SortBlockTag';
import { Pip } from '../Pip';

const meta = {
  title: 'Information/SortBlock/Tag',
  component: SortBlockTag,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSuccessPip: Story = {
  render: () => (
    <SortBlockTag>
      <Pip variant="success">Pip Text</Pip>
    </SortBlockTag>
  ),
};

export const WithAttentionPip: Story = {
  render: () => (
    <SortBlockTag>
      <Pip variant="attention">Pip Text</Pip>
    </SortBlockTag>
  ),
};
```

- [ ] **Step 6.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

If `Pip` does not accept `variant="success"` or the import shape differs, adjust the story to match the existing `Pip` API (read `src/components/Pip/Pip.tsx` to confirm). Do NOT modify Pip.

- [ ] **Step 6.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-tag--*`. Confirm a green "Pip Text" pill sits inside the grey SortBlock fill, asymmetric padding 12/16.

- [ ] **Step 6.5: Commit**

```bash
git add src/components/SortBlock/SortBlockTag.tsx src/components/SortBlock/SortBlockTag.stories.tsx
git commit -m "feat(sort-block): add SortBlockTag family member

Mirrors Figma 'Sort Block - Tag' (3127:10385). Children API for a
Pip/Tag inside the SortBlock fill, same pl-12 pr-16 py-12 chrome
as SortBlockIcon."
```

---

## Task 7: Add `SortBlockButton`

**Files:**
- Create: `src/components/SortBlock/SortBlockButton.tsx`
- Create: `src/components/SortBlock/SortBlockButton.stories.tsx`

- [ ] **Step 7.1: Create `src/components/SortBlock/SortBlockButton.tsx`**

```tsx
import type { ReactNode } from 'react';
import { FILL_CLASS, appendClass } from './shared';

export type SortBlockButtonKind = 'textlink' | 'dashed';

export interface SortBlockButtonProps {
  /** Selects vertical padding. `textlink` uses py-12 (matches the SortBlock
   *  text-content cells); `dashed` uses py-4 (the dashed-button affordance
   *  has its own pad and needs less chrome around it). */
  kind: SortBlockButtonKind;
  /** A `<TextLink>` or `<DashedButton>` child. */
  children: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE_BY_KIND: Record<SortBlockButtonKind, string> = {
  textlink:
    `inline-flex items-start ${FILL_CLASS} ` +
    'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-12)]',
  dashed:
    `inline-flex items-start ${FILL_CLASS} ` +
    'pl-[var(--spacing-12)] pr-[var(--spacing-16)] py-[var(--spacing-4)]',
};

/**
 * SortBlockButton — Figma: Sort Block - Button (2918:10689).
 *
 * Holds a TextLink or DashedButton inside a SortBlock fill. The `kind`
 * prop selects vertical padding 1:1 with Figma's `buttonType` axis.
 */
export const SortBlockButton = ({ kind, children, className }: SortBlockButtonProps) => (
  <div className={appendClass(ROOT_BASE_BY_KIND[kind], className)}>{children}</div>
);
```

- [ ] **Step 7.2: Create `src/components/SortBlock/SortBlockButton.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockButton } from './SortBlockButton';
import { TextLink } from '../TextLink';
import { DashedButton } from '../DashedButton';

const meta = {
  title: 'Information/SortBlock/Button',
  component: SortBlockButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextLinkKind: Story = {
  render: () => (
    <SortBlockButton kind="textlink">
      <TextLink>Button</TextLink>
    </SortBlockButton>
  ),
};

export const DashedKind: Story = {
  render: () => (
    <SortBlockButton kind="dashed">
      <DashedButton leftIcon="plus">Button</DashedButton>
    </SortBlockButton>
  ),
};
```

- [ ] **Step 7.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

If `TextLink` or `DashedButton` import names / props differ, read `src/components/TextLink/TextLink.tsx` and `src/components/DashedButton/DashedButton.tsx` and adjust the story (NOT the components).

- [ ] **Step 7.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-button--*`. Confirm:
- `TextLinkKind` has py-12 around the link.
- `DashedKind` has py-4 — visibly less vertical breathing room than `TextLinkKind`.

- [ ] **Step 7.5: Commit**

```bash
git add src/components/SortBlock/SortBlockButton.tsx src/components/SortBlock/SortBlockButton.stories.tsx
git commit -m "feat(sort-block): add SortBlockButton family member

Mirrors Figma 'Sort Block - Button' (2918:10689). kind: textlink
| dashed maps to Figma's buttonType axis 1:1 and selects vertical
padding (py-12 for textlink, py-4 for dashed)."
```

---

## Task 8: Add `SortBlockImage`

**Files:**
- Create: `src/components/SortBlock/SortBlockImage.tsx`
- Create: `src/components/SortBlock/SortBlockImage.stories.tsx`

- [ ] **Step 8.1: Create `src/components/SortBlock/SortBlockImage.tsx`**

```tsx
import type { ReactNode } from 'react';
import { FILL_CLASS, appendClass } from './shared';

export interface SortBlockImageProps {
  /** The image element (`<img>`, `<ProductImage>`, etc.). */
  children: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE = `inline-flex items-start ${FILL_CLASS}`;

/**
 * SortBlockImage — Figma: Sort Block - Image (3715:3682).
 *
 * Holds an image tile inside the SortBlock fill. No padding around the
 * tile (the image fills the cell edge-to-edge per the Figma fixture);
 * consumers can append size constraints via className.
 */
export const SortBlockImage = ({ children, className }: SortBlockImageProps) => (
  <div className={appendClass(ROOT_BASE, className)}>{children}</div>
);
```

- [ ] **Step 8.2: Create `src/components/SortBlock/SortBlockImage.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockImage } from './SortBlockImage';

const meta = {
  title: 'Information/SortBlock/Image',
  component: SortBlockImage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SortBlockImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTile: Story = {
  render: () => (
    <SortBlockImage>
      <div
        className="size-[41px] bg-[color:var(--color-set-lightest)]"
        aria-label="Light image placeholder"
      />
    </SortBlockImage>
  ),
};

export const DarkTile: Story = {
  render: () => (
    <SortBlockImage>
      <div
        className="size-[41px] bg-[color:var(--color-text-primary)]"
        aria-label="Dark image placeholder"
      />
    </SortBlockImage>
  ),
};
```

(Real images can replace the `<div>` placeholders later; the placeholder colours match Figma's Dark/Light axis intent without depending on a specific asset.)

- [ ] **Step 8.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

- [ ] **Step 8.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-image--*`. Confirm the 41×41 tile sits inside the grey SortBlock fill.

- [ ] **Step 8.5: Commit**

```bash
git add src/components/SortBlock/SortBlockImage.tsx src/components/SortBlock/SortBlockImage.stories.tsx
git commit -m "feat(sort-block): add SortBlockImage family member

Mirrors Figma 'Sort Block - Image' (3715:3682). Children API; no
padding around the tile per Figma. Stories use placeholder divs in
the Dark/Light intent colours."
```

---

## Task 9: Move composition examples to a dedicated story file

**Files:**
- Create: `src/components/SortBlock/CompositionExamples.stories.tsx`

The current `SortBlock.stories.tsx` contains two composition stories that aren't *about* a single SortBlock — they document patterns for combining SortBlocks with `TableHeaderCell`. Move them to their own file so the per-component story files stay focused.

- [ ] **Step 9.1: Read the current `SortBlock.stories.tsx` to extract the two composition stories**

```bash
sed -n '273,470p' src/components/SortBlock/SortBlock.stories.tsx
```

This range covers `SortableRowComposition` and `InsetHeaderWithSortBlockRows`. Save the renderers' source to refer to in the next step.

- [ ] **Step 9.2: Create `src/components/SortBlock/CompositionExamples.stories.tsx`**

Re-implement both stories using the new family. Replace every `<SortBlock>` instance per the migration table below; replace the `sbIconCell` / `sbTextCell` className constants with direct family-member usage (the family bakes in fill+padding).

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlockDefault } from './SortBlockDefault';
import { SortBlockMainSub } from './SortBlockMainSub';
import { SortBlockLongContent } from './SortBlockLongContent';
import { SortBlockIcon } from './SortBlockIcon';
import { Icon } from '../Icon';
import { IconLink } from '../IconLink';
import { TableHeaderCell } from '../TableHeaderCell';

const meta = {
  title: 'Information/SortBlock/Composition Examples',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * sb6 — single continuous grey row with cells flowing inline. Each cell is
 * a SortBlock-family member with `bg-transparent` to drop its own fill (the
 * parent paints one continuous strip).
 */
export const SortableRowComposition: Story = {
  render: () => (
    <div className="inline-flex items-stretch bg-[color:var(--sorting-block-sorting-fill)]">
      <div className="flex items-center px-[var(--spacing-8)]">
        <Icon name="drag" size={17} className="text-[color:var(--color-set-lightest)]" />
      </div>
      <div className="flex items-center px-[var(--spacing-4)] text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)] font-[var(--font-weight-medium)]">
        1
      </div>
      <SortBlockDefault
        className="bg-transparent px-[var(--spacing-12)]"
        rows={[{ value: '2023-03-09-1' }]}
      />
      <SortBlockIcon className="bg-transparent">
        <Icon name="calendar" size={17} className="text-[color:var(--color-set-lightest)]" />
      </SortBlockIcon>
      <SortBlockDefault
        className="bg-transparent px-[var(--spacing-12)]"
        rows={[{ label: 'Notes', value: 'testinggggggggggggg' }]}
      />
      <div className="flex items-center px-[var(--spacing-12)]">
        <IconLink icon="close" variant="close" aria-label="Remove row" />
      </div>
    </div>
  ),
};

/**
 * Inset Header + SortBlock Cells — pairing inset TableHeaderCells above
 * rows where every cell is its own SortBlock family member abutting
 * horizontally so the row reads as one strip.
 *
 * Canonical composition for "draggable list inside a card" patterns
 * (e.g. live ERP "Add Trip → Package List", Figma 3479:35614).
 */
export const InsetHeaderWithSortBlockRows: Story = {
  render: () => {
    const rows = [
      {
        id: 'pkg-1',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: ['123, Jalan Mayang Pasir,', '11200 Bayan Baru,', 'Pulau Pinang, Malaysia.'],
      },
      {
        id: 'pkg-2',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        addressLines: ['123, Jalan Mayang Pasir,', '11200 Bayan Baru,', 'Pulau Pinang, Malaysia.'],
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <div className="flex w-full">
          <div className="w-[45px] flex">
            <TableHeaderCell inset column="first" align="left" label="" />
          </div>
          <div className="flex-1 min-w-0 flex">
            <TableHeaderCell inset column="center" align="left" label="Tracking No." />
          </div>
          <div className="w-[166px] flex">
            <TableHeaderCell inset column="center" align="left" label="Delivery Date" />
          </div>
          <div className="w-[130px] flex">
            <TableHeaderCell inset column="center" align="left" label="Customer" />
          </div>
          <div className="w-[203px] flex">
            <TableHeaderCell inset column="center" align="left" label="Shipping Address" />
          </div>
          <div className="w-[45px] flex">
            <TableHeaderCell inset column="last" align="left" label="" />
          </div>
        </div>

        <div className="flex flex-col gap-[var(--spacing-4)]">
          {rows.map((row) => (
            <div key={row.id} className="flex w-full">
              <SortBlockIcon className="self-stretch w-[45px]">
                <Icon name="drag" size={17} className="text-[color:var(--color-icon-secondary)] cursor-grab" />
              </SortBlockIcon>
              <SortBlockDefault
                state="Readonly Bold"
                className="self-stretch flex-1 min-w-0"
                rows={[{ value: row.tracking }]}
              />
              <SortBlockDefault
                className="self-stretch w-[166px]"
                rows={[{ value: row.deliveryDate }]}
              />
              <SortBlockMainSub
                className="self-stretch w-[130px]"
                rows={[{ value: row.customerName }, { value: row.customerPhone }]}
              />
              <SortBlockLongContent
                className="self-stretch w-[203px]"
                rows={[{ value: row.addressLines.join('\n') }]}
              />
              <SortBlockIcon className="self-stretch w-[45px]">
                <button
                  type="button"
                  aria-label="Remove package"
                  className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
                >
                  <Icon name="close" size={17} className="text-[color:var(--color-icon-secondary)]" />
                </button>
              </SortBlockIcon>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
```

- [ ] **Step 9.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

- [ ] **Step 9.4: Verify Storybook**

Visit `http://localhost:6006/?path=/story/information-sortblock-composition-examples--*`. Both stories should render. The `InsetHeaderWithSortBlockRows` should look identical to the s7 Add Trip body (header strip + 2 grey rows of 6 cells each).

Compare to the baseline screenshot from Pre-flight Step P3.

- [ ] **Step 9.5: Commit**

```bash
git add src/components/SortBlock/CompositionExamples.stories.tsx
git commit -m "feat(sort-block): add CompositionExamples stories using the family

Reimplements SortableRowComposition and InsetHeaderWithSortBlockRows
on the new family. Old SortBlock.stories.tsx still exists; cleanup
in a later commit."
```

---

## Task 10: Update s7 Add Trip story to use the family

**Files:**
- Modify: `src/stories/Table/InsetTableScreens.stories.tsx`

This is the load-bearing call site. Update the imports and the body cells in the `S7AddTrip` story.

- [ ] **Step 10.1: Update the import**

Find the SortBlock import at the top of the file (currently `import { SortBlock } from '../../components/SortBlock';` near line 16). Replace with:

```tsx
import {
  SortBlockDefault,
  SortBlockMainSub,
  SortBlockLongContent,
  SortBlockIcon,
} from '../../components/SortBlock';
```

- [ ] **Step 10.2: Remove the `sbIconCell` and `sbTextCell` className constants**

These constants (declared just above the `S7AddTrip` story render function around line 620–630) re-specify the chrome that the family now bakes in. Delete them.

If they're referenced by other stories in the same file, leave them; only delete if they're s7-local. Run:

```bash
grep -n "sbIconCell\|sbTextCell" src/stories/Table/InsetTableScreens.stories.tsx
```

If the only references are inside the s7 story body (which is being rewritten in step 10.3), delete the constants.

- [ ] **Step 10.3: Replace the body cells in `S7AddTrip`**

Find the `rows.map((row) => (...))` block (around lines 668–741). Replace the inner `<div key={row.id} className="flex w-full">` and its 6 SortBlock children with:

```tsx
<div key={row.id} className="flex w-full">
  {/* Drag */}
  <SortBlockIcon className="self-stretch w-[45px]">
    <Icon
      name="drag"
      size={17}
      className="text-[color:var(--color-icon-secondary)] cursor-grab"
    />
  </SortBlockIcon>

  {/* Tracking — bold via state */}
  <SortBlockDefault
    state="Readonly Bold"
    className="self-stretch flex-1 min-w-0"
    rows={[{ value: row.tracking }]}
  />

  {/* Delivery */}
  <SortBlockDefault
    className="self-stretch w-[166px]"
    rows={[{ value: row.deliveryDate }]}
  />

  {/* Customer — Figma MainSub: row[0] body, row[1] caption */}
  <SortBlockMainSub
    className="self-stretch w-[130px]"
    rows={[{ value: row.customerName }, { value: row.customerPhone }]}
  />

  {/* Address — LongContent honours \n breaks AND wraps via CSS */}
  <SortBlockLongContent
    className="self-stretch w-[203px]"
    rows={[{ value: row.addressLines.join('\n') }]}
  />

  {/* Close */}
  <SortBlockIcon className="self-stretch w-[45px]">
    <button
      type="button"
      aria-label="Remove package"
      className="inline-flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
    >
      <Icon
        name="close"
        size={17}
        className="text-[color:var(--color-icon-secondary)]"
      />
    </button>
  </SortBlockIcon>
</div>
```

- [ ] **Step 10.4: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

If lint fails on unused imports (Icon, etc.), confirm they're still used elsewhere in the file before removing.

- [ ] **Step 10.5: Verify Storybook visual diff against baseline**

Visit `http://localhost:6006/?path=/story/tables-reference-screens--s-7-add-trip` and compare against the baseline screenshot from Pre-flight Step P3. The expected output is **pixel-identical** — same fill, same column widths, same gap-4 between rows, same MainSub stack, same address wrap.

If anything diverges, use Chrome DevTools MCP to diff the actual rendered DOM/CSS against the baseline. Common suspects:
- Mixed-label gap if any row sneaks an empty label in.
- MainSub gap-4 not applying (`className` semantics).
- Address cell padding doubling (consumer className conflicting with built-in).

- [ ] **Step 10.6: Commit**

```bash
git add src/stories/Table/InsetTableScreens.stories.tsx
git commit -m "refactor(s7-stories): consume SortBlock family directly

Replaces 6 generic <SortBlock> calls + ROW_OVERRIDE constants with
the dedicated family members (Default, MainSub, LongContent, Icon).
className appends to built-ins so cells only carry self-stretch +
column width — fill/padding/gap come from the family.

Old SortBlock still exists; final removal in a later commit."
```

---

## Task 11: Switch the SortBlock module index to the new family

**Files:**
- Rewrite: `src/components/SortBlock/index.ts`

- [ ] **Step 11.1: Replace `src/components/SortBlock/index.ts`**

```ts
export { SortBlockDefault } from './SortBlockDefault';
export type {
  SortBlockDefaultProps,
  SortBlockOrientation,
} from './SortBlockDefault';

export { SortBlockMainSub } from './SortBlockMainSub';
export type { SortBlockMainSubProps } from './SortBlockMainSub';

export { SortBlockLongContent } from './SortBlockLongContent';
export type { SortBlockLongContentProps } from './SortBlockLongContent';

export { SortBlockIcon } from './SortBlockIcon';
export type { SortBlockIconProps } from './SortBlockIcon';

export { SortBlockTag } from './SortBlockTag';
export type { SortBlockTagProps } from './SortBlockTag';

export { SortBlockButton } from './SortBlockButton';
export type { SortBlockButtonProps, SortBlockButtonKind } from './SortBlockButton';

export { SortBlockImage } from './SortBlockImage';
export type { SortBlockImageProps } from './SortBlockImage';

export type { SortBlockRow, SortBlockState } from './shared';
```

- [ ] **Step 11.2: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Expected: TS will now error on every remaining `import { SortBlock } from ...` in the codebase. Step 11.3 enumerates the survivors.

- [ ] **Step 11.3: Inventory remaining `SortBlock` consumers**

```bash
grep -rn "from.*SortBlock\|import.*SortBlock\|<SortBlock\b" src/ --include="*.tsx" --include="*.ts"
```

Expected matches at this point:
- `src/components/SortBlock/SortBlock.tsx` (old file — deleted in next task)
- `src/components/SortBlock/SortBlock.stories.tsx` (old file — deleted in next task)
- `src/components/index.ts` (top-level barrel — fixed in Step 11.4)

If any other file shows up (e.g. a screen that imported the old `SortBlock` directly), update it to use the appropriate family member before continuing.

- [ ] **Step 11.4: Update `src/components/index.ts`**

Find the SortBlock block (around lines 228–230):

```ts
// SortBlock
export { SortBlock } from './SortBlock';
export type { SortBlockProps, SortBlockRow, SortBlockOrientation } from './SortBlock';
```

Replace with:

```ts
// SortBlock family
export {
  SortBlockDefault,
  SortBlockMainSub,
  SortBlockLongContent,
  SortBlockIcon,
  SortBlockTag,
  SortBlockButton,
  SortBlockImage,
} from './SortBlock';
export type {
  SortBlockDefaultProps,
  SortBlockMainSubProps,
  SortBlockLongContentProps,
  SortBlockIconProps,
  SortBlockTagProps,
  SortBlockButtonProps,
  SortBlockButtonKind,
  SortBlockImageProps,
  SortBlockOrientation,
  SortBlockRow,
  SortBlockState,
} from './SortBlock';
```

- [ ] **Step 11.5: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Both must pass. The old `SortBlock.tsx` and `SortBlock.stories.tsx` still exist (and the index.ts no longer points to them), so they may produce dead-export lint warnings — those are expected and resolved in the next task.

- [ ] **Step 11.6: Commit**

```bash
git add src/components/SortBlock/index.ts src/components/index.ts
git commit -m "refactor(sort-block): switch barrels to the new family exports

Both src/components/SortBlock/index.ts and the top-level
src/components/index.ts now export the 7 family members + shared
types. Old SortBlock + SortBlock.stories files still on disk;
removed in the next commit."
```

---

## Task 12: Delete the old `SortBlock.tsx` and `SortBlock.stories.tsx`

**Files:**
- Delete: `src/components/SortBlock/SortBlock.tsx`
- Delete: `src/components/SortBlock/SortBlock.stories.tsx`

- [ ] **Step 12.1: Confirm no remaining references**

```bash
grep -rn "SortBlock\.tsx\|SortBlock\.stories\.tsx\|from '\./SortBlock'$\|from '\./SortBlock\";" src/
```

Expected: only the two files themselves match. If anything else imports them, fix it now.

Also run the broad consumer check from Step 11.3:

```bash
grep -rn "<SortBlock\b\|import { SortBlock }\|export { SortBlock }" src/ --include="*.tsx" --include="*.ts"
```

Expected: zero matches outside the two files about to be deleted.

- [ ] **Step 12.2: Delete the files**

```bash
git rm src/components/SortBlock/SortBlock.tsx src/components/SortBlock/SortBlock.stories.tsx
```

- [ ] **Step 12.3: Verify lint + typecheck**

```bash
npm run lint
npm run build
```

Both must be clean. If any test or story file still references the old `SortBlock`, the TS error will name it — fix and re-run.

- [ ] **Step 12.4: Verify Storybook still serves all stories**

Restart the Storybook dev server if needed:

```bash
# If Storybook is still running and shows stale errors, Ctrl-C and re-run:
npm run storybook
```

Visit:
- `http://localhost:6006/?path=/story/information-sortblock-default--*`
- `http://localhost:6006/?path=/story/information-sortblock-mainsub--*`
- `http://localhost:6006/?path=/story/information-sortblock-longcontent--*`
- `http://localhost:6006/?path=/story/information-sortblock-icon--*`
- `http://localhost:6006/?path=/story/information-sortblock-tag--*`
- `http://localhost:6006/?path=/story/information-sortblock-button--*`
- `http://localhost:6006/?path=/story/information-sortblock-image--*`
- `http://localhost:6006/?path=/story/information-sortblock-composition-examples--*`
- `http://localhost:6006/?path=/story/tables-reference-screens--s-7-add-trip`

All must render without console errors. The s7 Add Trip story must still match the baseline.

- [ ] **Step 12.5: Commit**

```bash
git commit -m "refactor(sort-block): drop the old monolithic SortBlock

Family split is now the only API. Hard cut — no alias preserved,
TS would have failed if any consumer was missed."
```

---

## Task 13: Final lint + build + push

- [ ] **Step 13.1: Full lint and build**

```bash
npm run lint
npm run build
```

Both clean.

- [ ] **Step 13.2: Confirm branch and commit graph**

```bash
git log --oneline -15
git status -s
```

Expected: 12 new commits on `main` (Tasks 1–12), each a focused step. Untracked other-terminal WIP files unchanged.

- [ ] **Step 13.3: Push**

Confirm with Aster before pushing — multi-terminal collisions have happened during recent sessions.

```bash
# Only after Aster says go:
git push origin main
```

- [ ] **Step 13.4: Update memory with the session handoff**

Add a new memory file `project_session_handoff_2026_05_05_sortblock_family_split.md` summarising the split, the API change, and the s7 + composition-story migration. Add the pointer to `MEMORY.md`.

---

## Self-review

Spec coverage check (each spec section → task):

- **Problem / Decision** → Task 1–8 implement the family; Task 11–12 enforce the hard cut.
- **Component family table (7 components)** → Tasks 2 (Default), 3 (MainSub), 4 (LongContent), 5 (Icon), 6 (Tag), 7 (Button), 8 (Image).
- **Shared row shape** → defined in `shared.ts` (Task 1).
- **`className` semantics across the family** → `appendClass` helper in Task 1; verified per-component via the `ClassNameAppendsSelfStretch` story in Tasks 2 + 3 + 5.
- **Files structure** → matches the file-structure section above.
- **Call site updates** → Task 9 (composition stories), Task 10 (s7 Add Trip).
- **Forward-compat for `state`** → typed as `'Readonly' | 'Readonly Bold'` in `shared.ts`; documented in JSDoc.
- **MainSub row mapping** → Task 3 enforces `[SortBlockRow, SortBlockRow]` tuple; `rows[0]` body, `rows[1]` caption.
- **Mixed-label alignment** → Task 2 (Default) `MixedLabelHorizontal` story exercises it; `LongContent` (Task 4) preserves the same logic.
- **`row.bold` precedence over `state`** → `resolveBold` helper in Task 1; verified by `PerRowBoldOverride` and `PerRowRegularOverride` stories in Task 2.
- **LongContent Figma divergence** → JSDoc note in Task 4; spec's library-follow-up bullet stands.

Placeholder scan: no "TBD" / "implement later" / "similar to Task N" markers.

Type consistency: `SortBlockRow`, `SortBlockState`, `SortBlockOrientation` exported from `shared.ts` (Task 1) and re-exported through `index.ts` (Task 11). `SortBlockButtonKind` exported from `SortBlockButton.tsx` (Task 7). All component prop types follow the `<Name>Props` convention.

No gaps detected.
