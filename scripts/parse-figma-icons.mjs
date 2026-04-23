#!/usr/bin/env node
/**
 * parse-figma-icons.mjs
 *
 * Reads the Figma HTML dump at scripts/figma-icons-source.html
 * (exported via "Figma to Code" plugin → HTML + HTML option) and
 * fully regenerates src/components/Icon/iconPaths.ts so every icon
 * uses the 24×24 canvas from the Figma source of truth.
 *
 * Run: node scripts/parse-figma-icons.mjs
 *
 * Rules:
 *  - Only <div data-svg-wrapper data-layer="..."> blocks are parsed.
 *    This skips the outer wrapper (<div data-layer="Icon">) and any
 *    nested layout wrappers (e.g. <div data-layer="Vector"> inside a
 *    transformed sort-vertical container).
 *  - `Star/full` → `star-full`, `Mobile` → `mobile`, `flash solid` → `flash-solid`.
 *  - Duplicate names get a suffix based on Figma context (e.g., the second
 *    `shopping-bag` becomes `shopping-bag-solid` because Figma placed a
 *    filled-style variant in the page).
 *  - `fill-rule="evenodd"` is preserved at the icon level when every path has it.
 *  - Stroke-based icons (stroke + stroke-width) are preserved with
 *    { width, linecap, linejoin } so Icon.tsx can render them with stroke
 *    instead of fill.
 *  - <g clip-path="url(#...)">...</g> wrappers are unwrapped (we keep their
 *    inner paths). <defs>…</defs> blocks are dropped (we don't use clipPath
 *    at render time — the viewBox already constrains rendering).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Accept either filename — the Figma plugin dump is stored as either
// figma-icons-source.html (HTML+HTML option) or icons-export.html (React JSX).
// Both parse identically because we match on data-layer="..." which is
// unchanged between the two formats.
const SOURCE_HTML = existsSync(resolve(__dirname, 'figma-icons-source.html'))
  ? resolve(__dirname, 'figma-icons-source.html')
  : resolve(__dirname, 'icons-export.html');
const OUTPUT_FILE = resolve(__dirname, '../src/components/Icon/iconPaths.ts');

if (!existsSync(SOURCE_HTML)) {
  console.error(`[parse-figma-icons] Source not found: ${relative(process.cwd(), SOURCE_HTML)}`);
  console.error('[parse-figma-icons] Paste the Figma "HTML + HTML" dump into that file first.');
  process.exit(1);
}

const html = readFileSync(SOURCE_HTML, 'utf8');

function toKebab(s) {
  return s
    .replace(/\//g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Extract every <div data-svg-wrapper data-layer="..."> block.
 * We use a function-based walker instead of a single giant regex so we can
 * match the balanced closing </div> reliably.
 */
function extractWrappers(src) {
  const results = [];
  const openRe = /<div\s+data-svg-wrapper\s+data-layer="([^"]+)"[^>]*>/g;
  let m;
  while ((m = openRe.exec(src)) !== null) {
    const name = m[1];
    const start = openRe.lastIndex;
    // Find the balanced </div> — data-svg-wrapper blocks never nest other
    // data-svg-wrapper blocks in the Figma export, so a simple depth count on
    // <div>/</div> tags is safe.
    let depth = 1;
    let i = start;
    const tagRe = /<(\/?)div\b[^>]*>/g;
    tagRe.lastIndex = start;
    let t;
    while ((t = tagRe.exec(src)) !== null) {
      if (t[1] === '/') depth--;
      else depth++;
      if (depth === 0) {
        i = t.index;
        break;
      }
    }
    if (depth !== 0) continue; // malformed, skip
    const inner = src.slice(start, i);
    results.push({ name, inner });
  }
  return results;
}

function parsePathTag(tag) {
  const dMatch = tag.match(/\bd="([^"]+)"/);
  if (!dMatch) return null;
  const entry = { d: dMatch[1].trim() };

  const fillRuleMatch = tag.match(/\bfill-rule="([^"]+)"/);
  if (fillRuleMatch && fillRuleMatch[1] === 'evenodd') entry.fillRule = 'evenodd';

  const strokeMatch = tag.match(/\bstroke="([^"]+)"/);
  if (strokeMatch && strokeMatch[1] && strokeMatch[1] !== 'none') {
    const sw = tag.match(/\bstroke-width="([^"]+)"/);
    const lc = tag.match(/\bstroke-linecap="([^"]+)"/);
    const lj = tag.match(/\bstroke-linejoin="([^"]+)"/);
    entry.stroke = {
      width: sw ? Number(sw[1]) : 2,
      linecap: lc ? lc[1] : undefined,
      linejoin: lj ? lj[1] : undefined,
    };
  }

  return entry;
}

// Context-aware suffix rules for duplicate names in the Figma dump.
// When the same `data-layer` appears twice (e.g. outline + filled), we apply
// these suffixes so both variants coexist in the library.
function resolveDuplicateName(baseName, existing) {
  const rules = {
    'shopping-bag': 'shopping-bag-solid',
    'share': 'share-solid',
    'minus-circle': 'minus-circle-solid',
    'plus-circle': 'plus-circle-solid',
    'check-circle': 'check-circle-outline',
    'arrow-up': 'arrow-up-triangle',
    'arrow-down': 'arrow-down-triangle',
    'flash': 'flash-solid',
    'desktop': 'desktop-solid',
    'tablet': 'tablet-solid',
    'mobile': 'mobile-solid',
  };
  const mapped = rules[baseName];
  if (mapped && !existing.has(mapped)) return mapped;
  // Counter-based fallback for anything the ruleset doesn't cover, or where
  // the mapped name is also taken (3rd+ duplicate). Starts at -alt, then
  // -alt-2, -alt-3, etc., rather than silently colliding.
  let counter = 1;
  let candidate = `${baseName}-alt`;
  while (existing.has(candidate)) {
    counter += 1;
    candidate = `${baseName}-alt-${counter}`;
  }
  return candidate;
}

const wrappers = extractWrappers(html);
const icons = new Map();
const skipped = [];
const duplicatesResolved = [];

for (const { name: rawName, inner } of wrappers) {
  // Skip layout-only layers
  if (/^vector$/i.test(rawName)) {
    skipped.push(rawName);
    continue;
  }

  const svgMatch = inner.match(/<svg[^>]*\bviewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  if (!svgMatch) {
    skipped.push(`${rawName} (no <svg>)`);
    continue;
  }

  let svgBody = svgMatch[2];
  // Drop <defs>...</defs>
  svgBody = svgBody.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  // Unwrap <g clip-path="...">...</g>
  svgBody = svgBody.replace(/<g\s+clip-path="[^"]*">([\s\S]*?)<\/g>/g, '$1');

  // Find every <path …/> tag (self-closing or with explicit close)
  const pathRegex = /<path\b[^>]*\/?>/g;
  const paths = [];
  let pTag;
  while ((pTag = pathRegex.exec(svgBody)) !== null) {
    const parsed = parsePathTag(pTag[0]);
    if (parsed) paths.push(parsed);
  }

  if (paths.length === 0) {
    skipped.push(`${rawName} (no <path>)`);
    continue;
  }

  let name = toKebab(rawName);

  const iconData = {
    viewBox: svgMatch[1],
    paths: paths.map(p => p.d),
  };

  if (paths.every(p => p.fillRule === 'evenodd')) {
    iconData.fillRule = 'evenodd';
  }

  // Lift stroke config if all paths share it
  const strokes = paths.map(p => p.stroke).filter(Boolean);
  if (strokes.length === paths.length && strokes.length > 0) {
    const s0 = strokes[0];
    const uniform = strokes.every(
      s => s.width === s0.width && s.linecap === s0.linecap && s.linejoin === s0.linejoin,
    );
    if (uniform) {
      iconData.stroke = { width: s0.width };
      if (s0.linecap) iconData.stroke.linecap = s0.linecap;
      if (s0.linejoin) iconData.stroke.linejoin = s0.linejoin;
    }
  }

  if (icons.has(name)) {
    const resolved = resolveDuplicateName(name, icons);
    duplicatesResolved.push(`${name} → ${resolved}`);
    name = resolved;
  }
  icons.set(name, iconData);
}

// Preserve the existing `check-stroke` icon (added manually, not in Figma dump)
// so we don't lose it during regeneration. It's a Figma-style stroke check.
// If a future Figma dump adds a real `check-stroke`, the parser will pick it
// up above and this fallback becomes dead code — the warn below makes that
// visible so we can remove the fallback when it's no longer needed.
if (!icons.has('check-stroke')) {
  console.warn(
    '[parse-figma-icons] Using hand-written check-stroke fallback. ' +
    'If Figma now exports a check-stroke layer, remove this fallback block.',
  );
  icons.set('check-stroke', {
    viewBox: '0 0 18 18',
    paths: ['M15 5L6.75 13.25L3 9.5'],
    stroke: { width: 2, linecap: 'round', linejoin: 'round' },
  });
}

if (icons.size === 0) {
  console.error('[parse-figma-icons] No icons parsed.');
  process.exit(1);
}

const sortedNames = [...icons.keys()].sort();

const header = `// Auto-generated from Figma Core SiteGiant Library
// Regenerated: ${new Date().toISOString()}
// Source: scripts/figma-icons-source.html → scripts/parse-figma-icons.mjs
// Total: ${icons.size} icons

export interface IconPathData {
  viewBox: string;
  paths: string[];
  fillRule?: string;
  /** Render paths with stroke instead of fill (for line-style icons) */
  stroke?: {
    width?: number;
    linecap?: 'butt' | 'round' | 'square';
    linejoin?: 'miter' | 'round' | 'bevel';
  };
}

export const iconPaths: Record<string, IconPathData> = {
`;

let body = '';
for (const name of sortedNames) {
  const icon = icons.get(name);
  body += `  ${JSON.stringify(name)}: {\n`;
  body += `    "viewBox": ${JSON.stringify(icon.viewBox)},\n`;
  body += `    "paths": [\n`;
  for (const d of icon.paths) body += `      ${JSON.stringify(d)},\n`;
  body += `    ]`;
  if (icon.fillRule) body += `,\n    "fillRule": ${JSON.stringify(icon.fillRule)}`;
  if (icon.stroke) {
    const parts = [];
    if (icon.stroke.width !== undefined) parts.push(`"width": ${icon.stroke.width}`);
    if (icon.stroke.linecap) parts.push(`"linecap": ${JSON.stringify(icon.stroke.linecap)}`);
    if (icon.stroke.linejoin) parts.push(`"linejoin": ${JSON.stringify(icon.stroke.linejoin)}`);
    body += `,\n    "stroke": { ${parts.join(', ')} }`;
  }
  body += `\n  },\n`;
}

const footer = `};

export type IconName = keyof typeof iconPaths;
export const iconNames = Object.keys(iconPaths) as IconName[];
`;

writeFileSync(OUTPUT_FILE, header + body + footer, 'utf8');

console.log(`[parse-figma-icons] Wrote ${icons.size} icons to ${relative(process.cwd(), OUTPUT_FILE)}`);
if (duplicatesResolved.length) {
  console.log(`[parse-figma-icons] Duplicate names resolved with suffixes:`);
  for (const d of duplicatesResolved) console.log(`  - ${d}`);
}
if (skipped.length) {
  console.log(`[parse-figma-icons] Skipped: ${skipped.join(', ')}`);
}
