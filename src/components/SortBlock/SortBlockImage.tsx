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
