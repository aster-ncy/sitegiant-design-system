import type { ReactNode } from 'react';
import {
  ColorSwatchGlyph,
  CursorTGlyph,
  MobileGlyph,
  MonitorGlyph,
  PaintBucketGlyph,
  TabletGlyph,
  TextMarkGlyph,
} from './glyphs';

export type SmallSegmentedGlyphName =
  | 'color'
  | 'text'
  | 'hover-color'
  | 'hover-text'
  | 'monitor'
  | 'tablet'
  | 'mobile';

/**
 * Each glyph renders at its **native Figma bbox** so the segment's 2px
 * padding produces visible breathing room around the glyph instead of the
 * glyph filling the segment edge-to-edge. Sizes match `viewBox` units in
 * `glyphs.tsx` exactly (extracted from the Figma SVG exports for node
 * 3504:3253).
 */
export const glyphForName = (name: SmallSegmentedGlyphName): ReactNode => {
  switch (name) {
    case 'color':
      // Native 10x7
      return <ColorSwatchGlyph className="block h-[7px] w-[10px]" />;
    case 'text':
      // Native 5.80078 x 7.10938 → integer-rounded
      return <TextMarkGlyph className="block h-[7px] w-[6px]" />;
    case 'hover-color':
      // Native 15.6164 x 12.0015 → integer-rounded
      return <PaintBucketGlyph className="block h-[12px] w-[16px]" />;
    case 'hover-text':
      // Native 12.5089 x 11.1111 → integer-rounded
      return <CursorTGlyph className="block h-[11px] w-[13px]" />;
    case 'monitor':
      // Native 12.8516 x 11.6484 → integer-rounded
      return <MonitorGlyph className="block h-[12px] w-[13px]" />;
    case 'tablet':
      // Native 11.0742 x 14 → integer-rounded (height kept at 14 to preserve aspect)
      return <TabletGlyph className="block h-[14px] w-[11px]" />;
    case 'mobile':
      // Native 7.57422 x 12.8516 → integer-rounded
      return <MobileGlyph className="block h-[13px] w-[8px]" />;
  }
};

export const isColorPickerGlyph = (name: SmallSegmentedGlyphName) =>
  name === 'color' || name === 'text' || name === 'hover-color' || name === 'hover-text';

export const isDeviceGlyph = (name: SmallSegmentedGlyphName) =>
  name === 'monitor' || name === 'tablet' || name === 'mobile';
