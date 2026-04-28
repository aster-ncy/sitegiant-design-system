# Codex Update 2026-04-28

## Scope

This note records the changes made by Codex in `sitegiant-storybook` on 2026-04-28.
It is intentionally separate from `CLAUDE.md` and `AGENTS.md` to avoid mixing
workspace policy with task-specific implementation updates.

## Summary

The project was brought back to a clean verification state:

- `npm run lint` passes
- `npm run build` passes
- Targeted Storybook visual smoke checks passed
- Keyboard behavior for filled `TagSelect` and `MultiTagSelect` was fixed

## Files Changed

### Lint and config

- `eslint.config.js`
  - Added `storybook-static` to global ignores so generated Storybook output is not linted.

### Icon export cleanup

- `src/components/Icon/Icon.tsx`
  - Removed non-component re-exports from the component file to satisfy fast-refresh lint rules.
- `src/components/Icon/index.ts`
  - Re-exported `IconName` from `iconPaths`.
- `src/components/index.ts`
  - Kept barrel exports aligned with the `Icon` module cleanup.

### TagSelect and MultiTagSelect

- `src/components/TagSelect/TagSelect.tsx`
  - Destructured `useTagSelectMenu()` results instead of accessing them off an object during render.
  - Enabled popup search input autofocus when the menu opens.
- `src/components/MultiTagSelect/MultiTagSelect.tsx`
  - Same lint cleanup pattern as `TagSelect`.
  - Enabled popup search input autofocus when the menu opens.
- `src/components/DropdownMenu/DropdownMenuCustomInput.tsx`
  - Added an `autoFocus` prop and applied it to the input element.

### SearchBox cleanup

- `src/components/SearchBox/SearchBox.tsx`
  - Replaced render-time nested component declarations with render helper functions.
  - This removed `react-hooks/static-components` lint violations.

### Sidebar CSS warning fix

- `src/components/Sidebar/Sidebar.tsx`
  - Replaced the invalid premium background utility with a valid arbitrary
    `background-image` utility:
    - from `bg-[image:var(--color-navigator-sidebar-premium-fill)]`
    - to `[background-image:var(--color-navigator-sidebar-premium-fill)]`

### Storybook story typing fixes

- `src/components/AccountingCard/AccountingCard.stories.tsx`
- `src/components/AppImageCard/AppImageCard.stories.tsx`
- `src/components/DropdownMenu/DropdownMenu.stories.tsx`
- `src/components/Icon/Icon.stories.tsx`
- `src/components/ModuleCard/ModuleCard.stories.tsx`
- `src/components/Radio/Radio.stories.tsx`
  - Added required default `args` for stories with custom `render`.

### Minor cleanup

- `src/components/TaskCard/TaskCard.stories.tsx`
  - Removed unused `React` import.
- `src/screens/onboarding/TeamSetupStep.tsx`
  - Removed unused `useState` import.

## Keyboard Behavior Fix

### Problem

In filled states, opening `TagSelect` or `MultiTagSelect` with the keyboard left
focus inside the trigger contents first:

- `TagSelect`: chip remove button
- `MultiTagSelect`: chip remove buttons, then clear-all button

That meant keyboard users had to tab through trigger internals before reaching the
search field inside the open popup.

### Fix

The search input inside the popup now receives focus immediately on open via the
new `autoFocus` support in `DropdownMenuCustomInput`.

### Result

Filled-state keyboard flow now behaves as expected:

- `Enter`/`Space` opens the popup
- focus moves directly to the search input
- typing works immediately
- `Escape` closes the popup from the search field

## Verification Performed

### Source checks

- `npm run lint`
- `npm run build`

### Visual checks

Targeted Storybook smoke checks were run for:

- `Forms/TagSelect`
- `Forms/MultiTagSelect`
- `Forms/SearchBox`
- `Navigation/Sidebar/Sidebar`
- `Foundations/Icon`

### Keyboard checks

Focused keyboard verification was run against Storybook for:

- filled `TagSelect`
- filled `MultiTagSelect`

Verified behavior:

- focus lands on search input when opened
- typing works immediately
- `Escape` closes the popup

## Operational Notes

- Storybook was used during validation and may still be running locally depending
  on whether it has been stopped after this update.
- Git reports CRLF normalization warnings on touched files. This is non-blocking
  but still present in the working tree output.
- Another terminal was reported as active in the same repo, so standard merge
  caution still applies before commit.

## Suggested Commit Scope

This change set is logically one stabilization pass:

- lint cleanup
- Storybook typing fixes
- sidebar CSS warning fix
- keyboard accessibility improvement for select components

## Suggested Commit Message

`fix: stabilize storybook components and select keyboard focus`
