import type { ReactNode } from 'react';
import { FILL_CLASS, appendClass } from './shared';

export type SortBlockButtonKind = 'textlink' | 'dashed';

export interface SortBlockButtonProps {
  /** Selects vertical padding. `textlink` uses py-12 (matches the SortBlock
   *  text-content cells); `dashed` uses py-4 (the dashed-button affordance
   *  has its own pad and needs less chrome around it). */
  kind: SortBlockButtonKind;
  /** A `<TextLink>` or `<DashedButton>` child. */
  children: ReactNode;
  /** Appended to the built-in root classes. */
  className?: string;
}

const ROOT_BASE_SHARED =
  `inline-flex items-start ${FILL_CLASS} ` +
  'pl-[var(--spacing-12)] pr-[var(--spacing-16)]';

const ROOT_BASE_BY_KIND: Record<SortBlockButtonKind, string> = {
  textlink: `${ROOT_BASE_SHARED} py-[var(--spacing-12)]`,
  dashed: `${ROOT_BASE_SHARED} py-[var(--spacing-4)]`,
};

/**
 * SortBlockButton — Figma: Sort Block - Button (2918:10689).
 *
 * Holds a TextLink or DashedButton inside a SortBlock fill. The `kind`
 * prop selects vertical padding 1:1 with Figma's `buttonType` axis.
 */
export const SortBlockButton = ({ kind, children, className }: SortBlockButtonProps) => (
  <div className={appendClass(ROOT_BASE_BY_KIND[kind], className)}>{children}</div>
);
