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
