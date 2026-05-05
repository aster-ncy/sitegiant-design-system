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
