# SiteGiant Storybook Agent Rules

This file mirrors the workspace-level agent policy for convenience.
Primary policy file: `../AGENTS.md`

## Quick Rules

1. Build UI using shared components in `src/components`.
2. Keep component visuals exact with Figma token values.
3. Prefer token variables from `src/index.css`; avoid hardcoded visual values.
4. Cover all variants, sizes, and states in stories.
5. Treat Storybook visual verification as required before done.

## Raw Color Exceptions

The token-only rule applies to SiteGiant-owned visual primitives. Raw hex
color values are acceptable in two narrow cases:

1. **Third-party brand identities** — e.g., marketplace brand colors
   (Shopee, Lazada, TikTok Shop) rendered inside a tile representing that
   brand. These are not SiteGiant's colors to own; tokenizing them would
   misleadingly couple the design system to external rebrands. Document
   the exception in a comment where the raw hex lives.
2. **Storybook story mocks** — decorative placeholders inside `*.stories.tsx`
   that stand in for consumer-supplied imagery (e.g., country flags in a
   DropdownMenu example).

Any other raw hex inside the `src/components` runtime is a token violation.

## Start Prompt For Any Agent

```text
Read AGENTS.md and follow it strictly. Use token-based styling, preserve exact Figma parity, and include complete Storybook state coverage for every component change.
```

