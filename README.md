# SiteGiant Design System

A React component library and Storybook for the SiteGiant ERP product UI. All
visual values (color, spacing, radius, typography) are token-driven from a
single CSS-variable theme so every component stays in sync with the Figma
source of truth.

- **Stack:** React 19 + TypeScript 5.9 + Vite 8 + Tailwind CSS v4
- **Storybook:** v10.x

## Getting started

```bash
npm install
npm run storybook
```

Storybook runs at <http://localhost:6006>.

## Scripts

| Command | What it does |
|---|---|
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Static Storybook build |
| `npm run dev` | Vite dev server (minimal demo page) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run lint` | ESLint |

## Project layout

```
sitegiant-storybook/
├── src/
│   ├── index.css            # design tokens (~400 CSS vars in a Tailwind v4 @theme block)
│   ├── components/          # the component library
│   └── screens/             # demo screens that compose multiple components
├── .storybook/              # Storybook config
└── scripts/                 # icon-pipeline tools (Figma SVG → TS path data)
```

## Conventions for contributors

- **No hardcoded visual values when a token exists.** Read tokens from
  `src/index.css` (e.g. `var(--spacing-16)`, `var(--color-text-primary)`).
- **Tailwind v4 type hints are required** for ambiguous utilities:
  `text-[color:var(--token)]` for color, `text-[length:var(--token)]` for
  font size.
- **State naming:** the design system uses `clicked` for the active/pressed
  state (matching the Figma variable names), not `active`.
- Cover all variants, sizes, and states in `*.stories.tsx`.

See `AGENTS.md` for the full house-style rules used by AI-assisted contributors.

## Trademarks

Brand logos in `src/components/CardBrand` (Visa, Mastercard) and
`src/components/Icon/channelIconPaths.ts` (Shopee, Lazada, Amazon, TikTok,
Shopify, etc.) are trademarks of their respective owners and are used here
for identification purposes only. See `TRADEMARKS.md`.

## License

MIT — see [LICENSE](./LICENSE).

If you build something with this design system, a credit or link back to
this repository is appreciated. It's not legally required beyond the MIT
terms, just a friendly ask.
