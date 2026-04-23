# SiteGiant Storybook Agent Rules

This file mirrors the workspace-level agent policy for convenience.
Primary policy file: `../AGENTS.md`

## Quick Rules

1. Build UI using shared components in `src/components`.
2. Keep component visuals exact with Figma token values.
3. Prefer token variables from `src/index.css`; avoid hardcoded visual values.
4. Cover all variants, sizes, and states in stories.
5. Treat Storybook visual verification as required before done.

## Start Prompt For Any Agent

```text
Read AGENTS.md and follow it strictly. Use token-based styling, preserve exact Figma parity, and include complete Storybook state coverage for every component change.
```

