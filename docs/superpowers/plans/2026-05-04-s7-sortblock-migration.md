# s7 SortBlock Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the `S7AddTrip` Storybook story in `src/stories/Table/InsetTableScreens.stories.tsx` so it renders the live ERP "Add Trip — Package List" view using the shipped SortBlock atom, replacing the table-based placeholder.

**Architecture:** Drop the `<table>` entirely. Render a labels-only header `<div>` strip above two `<SortBlock>` row instances. Each SortBlock receives a `ROW_OVERRIDE` className that swaps its default `inline-flex` for `flex w-full` (so `flex-1` on the address cell can absorb container slack). Body cells inside each SortBlock are plain divs with story-local typography constants.

**Tech Stack:** React 19, TypeScript 5.9, Vite, Storybook 10, Tailwind v4 with CSS custom properties (no test framework — verification is via lint, typecheck, and Storybook visual diff).

**Spec:** `docs/superpowers/specs/2026-05-04-s7-sortblock-migration-design.md` (commit `bf8c26a`).

---

## File Structure

| File                                                  | Action  | Responsibility                                                                                                                                       |
| ----------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/stories/Table/InsetTableScreens.stories.tsx`     | Modify  | Rewrite `S7AddTrip` export; add 1 `ROW_OVERRIDE` constant + 5 typography constants; add SortBlock import; remove the `TODO(SortBlock)` JSDoc block. |
| `src/components/SortBlock/SortBlock.tsx`              | None    | Spec out-of-scope; do not edit.                                                                                                                      |
| `src/components/TableHeaderCell/*`                    | None    | Out-of-scope.                                                                                                                                        |

All constants are story-local (declared at module scope inside the stories file, not exported). The local `Cell` and `TH` helpers in the file stay — other stories (s1–s6, s8–s10) use them.

---

## Pre-flight

- [ ] **Step P1: Verify branch and clean tree for S7 file**

```bash
cd "/c/Users/Aster/SiteGiant File/D/Aster/Aster Testing/sitegiant-design-system/sitegiant-storybook"
git status -- src/stories/Table/InsetTableScreens.stories.tsx
git log --oneline -1
```

Expected: working tree clean for that file (other-terminal WIP `.gitignore`, `17px/`, `docs/session-2026-04-29-...md` are unrelated and stay untouched). Branch `main`.

- [ ] **Step P2: Verify Storybook dev server is reachable**

If Storybook is not running, start it:
```bash
npm run storybook
```
Visit `http://localhost:6006/?path=/story/tables-reference-screens--s-7-add-trip` and confirm the current placeholder renders. This is the baseline visual.

- [ ] **Step P3: Open the live ERP screenshot for reference**

The s7 reference image lives at `references/inset_table_s7.png` relative to the workspace root one level above the git root. Open it from there. (Gitignored per project memory; not in the repo.)

---

## Task 1: Add SortBlock import + typography/override constants

**Files:**
- Modify: `src/stories/Table/InsetTableScreens.stories.tsx` (add import near the top of the imports block; add 6 module-scope constants between the existing `cardClasses` declaration and the first story export, OR just above the `S7AddTrip` story export — pick whichever keeps the rest of the file undisturbed).

**Why first:** Constants are pure additions and don't affect any other story. Verifying lint/typecheck pass at this stage isolates the constant declarations from the story rewrite.

- [ ] **Step 1.1: Add SortBlock import**

Open `src/stories/Table/InsetTableScreens.stories.tsx`. Locate the existing imports (around lines 1–26). Add:

```tsx
import { SortBlock } from '../../components/SortBlock';
```

Place it alphabetically near the other component imports (e.g. after `ProgressBar` import, before `TextLink`). The exact line number doesn't matter — preserve existing import grouping.

- [ ] **Step 1.2: Add the 6 story-local constants**

Find a quiet spot in the file. Recommended location: directly above the `/* ── s7 Add Trip — Package List ────────────────────────── */` comment band (around line 579 in the current file). Insert the following block:

```tsx
/* ── s7-only constants for the SortBlock-per-row composition ───────────
 *
 * PATTERN: One <SortBlock> per body row; cells inside are plain divs.
 * SortBlock's default root is inline-flex, so we pass ROW_OVERRIDE which
 * REPLACES the built-in classes (per SortBlock.tsx:24) — we keep the bg,
 * px, py chrome and swap inline-flex for flex w-full.
 *
 * Body cells use plain typography constants (NOT SortBlock's rows API)
 * because: (a) values must wrap (rows API forces whitespace-nowrap),
 * (b) cells have no inline labels (rows API always renders the label
 * span, even for empty strings).
 * ──────────────────────────────────────────────────────────────────── */

const S7_ROW_OVERRIDE =
  'flex items-start w-full ' +
  'bg-[color:var(--sorting-block-sorting-fill)] ' +
  'px-[var(--spacing-6)] py-[var(--spacing-12)] ' +
  'gap-[var(--spacing-8)]';

const S7_HEADER_LABEL =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-info)]';

const S7_VALUE_REG =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const S7_VALUE_BOLD =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-bold)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

const S7_VALUE_CAPTION =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-12)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)] whitespace-nowrap';

// Intentionally NO whitespace-nowrap — the address cell must wrap.
const S7_VALUE_WRAP =
  'font-[family-name:var(--general-font-family)] font-[var(--font-weight-regular)] ' +
  'text-[length:var(--text-14)] leading-[var(--leading-17)] ' +
  'text-[color:var(--color-text-primary)]';
```

The `S7_` prefix prevents collisions with any future story-local constants in the same file. The pattern-block comment satisfies the spec's Acceptance line: "the new pattern is documented either as a brief Storybook story added alongside `S7AddTrip` OR as a `/* PATTERN: ... */` comment block."

- [ ] **Step 1.3: Run typecheck — expect PASS (constants are unused, but TS6133 is normally allowed for top-level consts; verify)**

```bash
npm run lint
```

Expected: no new errors. If ESLint complains about unused vars (`no-unused-vars` / `@typescript-eslint/no-unused-vars`), that's fine to suppress only if the same suppression style already exists in the file; otherwise tolerate the warning until Task 2 consumes them. Check existing file output first to know the baseline.

If lint fails for a reason unrelated to unused vars, stop and report the error.

- [ ] **Step 1.4: Commit**

```bash
git add src/stories/Table/InsetTableScreens.stories.tsx
git commit -m "$(cat <<'EOF'
chore(s7-stories): add SortBlock import + s7-local typography/override constants

Pre-step for the s7 SortBlock migration. The constants are unused at
this commit; the next commit consumes them when S7AddTrip is rewritten.

Spec: docs/superpowers/specs/2026-05-04-s7-sortblock-migration-design.md
EOF
)"
```

---

## Task 2: Rewrite the S7AddTrip story body

**Files:**
- Modify: `src/stories/Table/InsetTableScreens.stories.tsx` — replace the `S7AddTrip` export and the JSDoc block above it. Lines roughly 579–663 in the current file.

- [ ] **Step 2.1: Locate the current S7AddTrip block**

Read the file around lines 579–665. The block to replace starts at the `/* ── s7 Add Trip — Package List ────────────────────────── */` comment band and ends at the closing `};` of the `S7AddTrip` export (before the next comment band `/* ── s8 Select Package modal ───────────────────────────── */`).

The `S7_*` constants from Task 1 should be ABOVE this block — leave them in place.

- [ ] **Step 2.2: Replace the JSDoc + story body**

Replace the entire block from `/* ── s7 Add Trip — Package List ────────────────────────── */` through the closing `};` (just before the s8 comment band) with:

```tsx
/* ── s7 Add Trip — Package List ────────────────────────── */

/**
 * Each row is one <SortBlock className={S7_ROW_OVERRIDE}> with plain div
 * cells inside. The header above the rows is a plain <div> strip — not
 * a SortBlock — that mirrors the same grey chrome and column widths so
 * the header labels align horizontally with the body values.
 *
 * Figma: "Sort Block — MainSub" (component_set
 * `b59d4f9522e1d0ef16c22b7eee9ed78c831fe36b`).
 */
export const S7AddTrip: Story = {
  render: () => {
    const rows = [
      {
        id: 'pkg-1',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        address:
          '123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.',
      },
      {
        id: 'pkg-2',
        tracking: 'MY123554G85899',
        deliveryDate: '08 May 2025 4:00PM',
        customerName: 'Wei Kheng',
        customerPhone: '60 12-456 6556',
        address:
          '123, Jalan Mayang Pasir, 11200 Bayan Baru, Pulau Pinang, Malaysia.',
      },
    ];

    return (
      <div className={cardClasses}>
        <div className="flex flex-col gap-[var(--spacing-8)]">
          {/* Header strip — labels only, NOT a SortBlock */}
          <div
            className="flex items-center w-full bg-[color:var(--sorting-block-sorting-fill)]
                       px-[var(--spacing-6)] py-[var(--spacing-12)] gap-[var(--spacing-8)]"
          >
            <div className="w-[24px] flex-none" aria-hidden />
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Tracking No.
            </span>
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Delivery Date
            </span>
            <span className={S7_HEADER_LABEL} style={{ width: 180 }}>
              Customer
            </span>
            <span className={`${S7_HEADER_LABEL} flex-1`}>Shipping Address</span>
            <div className="w-[24px] flex-none" aria-hidden />
          </div>

          {/* Body rows — each is one SortBlock */}
          {rows.map((row) => (
            <SortBlock key={row.id} className={S7_ROW_OVERRIDE}>
              <div className="flex items-center self-stretch">
                <Icon
                  name="drag"
                  size={17}
                  className="text-[color:var(--color-icon-secondary)] cursor-grab"
                />
              </div>
              <span style={{ width: 180 }} className={S7_VALUE_BOLD}>
                {row.tracking}
              </span>
              <span style={{ width: 180 }} className={S7_VALUE_REG}>
                {row.deliveryDate}
              </span>
              <div
                style={{ width: 180 }}
                className="flex flex-col gap-[var(--spacing-2)]"
              >
                <span className={S7_VALUE_REG}>{row.customerName}</span>
                <span className={S7_VALUE_CAPTION}>{row.customerPhone}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={S7_VALUE_WRAP}>{row.address}</span>
              </div>
              <div className="flex items-start self-stretch">
                <IconButton name="close" label="Remove package" />
              </div>
            </SortBlock>
          ))}
        </div>
      </div>
    );
  },
};
```

Note the surrounding `<div className="flex flex-col gap-[var(--spacing-8)]">` inside the card — this provides the vertical gap between header and rows that the spec calls for.

- [ ] **Step 2.3: Run typecheck + lint**

```bash
npm run lint
```

Expected: no errors. Common issues to watch for:
- Unused constants (Task 1's S7_* should now all be referenced).
- TableCellInfo / TableCell / TableHeaderCell / TableExpandToggle / Checkbox / Pip / etc. should still be used by other stories; if any becomes unused, do NOT remove from imports — leave them, since other stories in the same file consume them.

If lint fails:
- Read the error.
- If it's an unused-variable warning for one of the S7_* constants, you missed using it in the JSX above — re-check the markup.
- If it's a typing issue with the `key` or `style` props, fix inline.

- [ ] **Step 2.4: Run a build to catch TypeScript errors lint might miss**

```bash
npm run build
```

Expected: success. If `tsc` errors out on the new code, fix it.

- [ ] **Step 2.5: Visual check in Storybook**

Reload `http://localhost:6006/?path=/story/tables-reference-screens--s-7-add-trip`. Verify against the spec's Acceptance criteria:

1. ✅ Header strip with column labels visible above the rows
2. ✅ 2 SortBlock rows, each with drag handle, value cells, close button
3. ✅ Customer cell: "Wei Kheng" (regular 14px) above "60 12-456 6556" (caption 12px), no inline labels
4. ✅ Address wraps onto multiple lines inside its `flex-1` cell
5. ✅ Tracking No. is bold; other values are regular
6. ✅ Header labels align horizontally with body values beneath
7. ✅ Card wrapper preserved; no `<table>` in the story
8. ✅ No `TODO(SortBlock)` JSDoc

If any of these fail, debug — don't proceed to commit. Common issues:
- Header labels misaligned with body values → adjust the 24px spacer width (try 25px or 26px).
- Address doesn't wrap → confirm `S7_VALUE_WRAP` has no `whitespace-nowrap` AND the wrapper div has `min-w-0`.
- Drag handle vertically centered when row is multi-line → confirm the drag wrapper has `items-center` (icon centers within the cell) and `self-stretch` (cell spans row height).

Compare side-by-side against `references/inset_table_s7.png` (workspace root, one level above git root). 1–2px tweaks to spacer widths are fine.

- [ ] **Step 2.6: Commit**

```bash
git add src/stories/Table/InsetTableScreens.stories.tsx
git commit -m "$(cat <<'EOF'
feat(s7-stories): rewrite S7AddTrip with SortBlock-per-row composition

Drops the placeholder <table>. Each body row is now a single SortBlock
with plain div cells inside (drag, tracking bold, delivery date,
customer name+phone caption stack, wrapping address, close icon).

Header strip is a separate non-SortBlock div that mirrors the row
chrome and column widths so labels align with body values.

ROW_OVERRIDE swaps SortBlock's default inline-flex for flex w-full
(className REPLACES per SortBlock.tsx:24) so flex-1 on the address
cell absorbs container slack. Address sits in a flex-1 min-w-0 div
wrapper for proper shrink behavior. Customer is regular weight (matches
live ERP screenshot).

Spec: docs/superpowers/specs/2026-05-04-s7-sortblock-migration-design.md
EOF
)"
```

---

## Task 3: Codex adversarial review

- [ ] **Step 3.1: Hand off to Codex**

Send the diff for review:

```
Use the codex:rescue skill (or the codex-rescue subagent) with:

review the s7 SortBlock migration: 2 commits on main implementing
docs/superpowers/specs/2026-05-04-s7-sortblock-migration-design.md.
Cross-check against src/components/SortBlock/SortBlock.tsx,
src/stories/Table/InsetTableScreens.stories.tsx, and the spec.
Adversarial pass: missed acceptance criteria, drift from spec, lint
violations, typing issues, visual regressions.
```

If using `--resume`, the prior session's context (the v1→v6 spec review) carries over and Codex can verify implementation against its own prior findings.

- [ ] **Step 3.2: Apply Codex findings**

If Codex returns BLOCKER or HIGH findings, fix each in a new commit. Use commit prefix `fix(s7-stories): ...` for behavior changes or `chore(s7-stories): ...` for cleanup. Re-run lint + visual check after each batch of fixes.

If Codex returns only LOW or APPROVE, proceed.

---

## Task 4: Final verification

- [ ] **Step 4.1: Lint + build clean**

```bash
npm run lint && npm run build
```

Expected: both pass.

- [ ] **Step 4.2: Storybook regression sweep**

Open Storybook and check:
- s7 (the new one) — matches spec acceptance.
- s1, s2, s3, s4, s5, s6, s8, s9, s10 — all still render unchanged. (We only touched s7, but a stray edit to a shared helper or import would surface here.)
- `Information/SortBlock` stories — all still render unchanged. (We didn't touch SortBlock.tsx, but cross-check.)

- [ ] **Step 4.3: Push when ready**

```bash
git log --oneline -5
git push origin main
```

(If the branch is ahead of `origin/main` by more than the s7 commits, that's the carry-over from prior sessions. Check `git log origin/main..HEAD` to see exactly what will be pushed.)

---

## Self-Review Checklist (run after writing this plan)

- ✅ Spec coverage: Acceptance lines 246–255 each map to Step 2.5 visual check or Task 4 regression sweep.
- ✅ No placeholders: every step has actual content.
- ✅ Type consistency: constant names `S7_ROW_OVERRIDE`, `S7_HEADER_LABEL`, `S7_VALUE_REG`, `S7_VALUE_BOLD`, `S7_VALUE_CAPTION`, `S7_VALUE_WRAP` used identically across Tasks 1 and 2.
- ✅ The pattern documentation (Acceptance line 255) is satisfied by the comment block in Step 1.2.
- ✅ Fixture flatten (spec lines 198–200) is satisfied by Step 2.2's `address` field (single string, not array).
- ✅ TODO removal (spec line 254 + Acceptance line 254) is satisfied by Step 2.2's replacement of the entire JSDoc block.
- ✅ TDD note: this codebase has no test framework — verification is lint, build, Storybook visual diff, and Codex review. The plan reflects this honestly rather than fabricating tests.
