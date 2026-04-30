import { Children, cloneElement, isValidElement } from 'react';
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import {
  SmallSegmentedButtonSegment,
  type SmallSegmentedButtonSegmentProps,
  type SmallSegmentedSegmentPosition,
} from './SmallSegmentedButtonSegment';

const computePosition = (index: number, total: number): SmallSegmentedSegmentPosition => {
  if (total === 1) return 'single';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'center';
};

const ROOT_BUILTIN_CLASSES = 'inline-flex h-[17px] items-center';

export interface SmallSegmentedButtonProps {
  /** Selected segment's value (controlled). */
  value: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  /**
   * Replaces the root tablist's built-in classes. Tailwind v4 resolves utility
   * conflicts by stylesheet insertion order, not class-string order, so an
   * append-style override is unreliable; pass the full layout you want here.
   */
  className?: string;
  'aria-label'?: string;
}

/**
 * SmallSegmentedButton — Figma: Small Segmented Button (3504:3253).
 *
 * A compact 17px-tall segmented control for dense toolbar contexts:
 * color/text emphasis pickers, device-preview toggles.
 */
// Compound API: <SmallSegmentedButton value onChange><SmallSegmentedButton.Segment ... />…</>.
// Keyboard nav (WAI-ARIA tabs, selection-follows-focus): ArrowLeft/Right wrap,
// Home/End, skips disabled. Roving tabindex (selected=0, others=-1).
// Inner segment borders collapse via mr-[-1px]; outer-end radii only.
// Distinct from <Tab> (33px) by size class — different padding, glyph framing,
// and decorative-vs-library-icon rules. If another size appears, prefer a
// sibling component over reintroducing a `size` axis.
const SmallSegmentedButtonComponent = ({
  value,
  onChange,
  children,
  className,
  'aria-label': ariaLabel,
}: SmallSegmentedButtonProps) => {
  const segmentChildren = Children.toArray(children).filter(
    (child): child is ReactElement<SmallSegmentedButtonSegmentProps> =>
      isValidElement(child) && child.type === SmallSegmentedButtonSegment,
  );
  const total = segmentChildren.length;

  // Determine which index should host tabIndex=0. The selected segment if
  // enabled; otherwise the first enabled segment; otherwise none (-1 on all).
  const selectedIndex = segmentChildren.findIndex(
    (c) => c.props.value === value && !c.props.disabled,
  );
  const firstEnabled = segmentChildren.findIndex((c) => !c.props.disabled);
  const focusableIndex = selectedIndex !== -1 ? selectedIndex : firstEnabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target || target.getAttribute('role') !== 'tab') return;

    // Bail if the keydown originated inside a nested [role=tablist] (e.g. a
    // consumer-provided custom glyph). The closest tablist ancestor of the
    // target must be this tablist; otherwise we'd hijack a child group's keys.
    if (target.closest('[role="tablist"]') !== event.currentTarget) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ).filter((tab) => tab.closest('[role="tablist"]') === event.currentTarget);
    const currentIndex = tabs.indexOf(target as HTMLButtonElement);
    if (currentIndex === -1) return;

    const findEnabled = (start: number, step: 1 | -1): number => {
      let i = start;
      for (let n = 0; n < tabs.length; n++) {
        if (i < 0) i = tabs.length - 1;
        if (i >= tabs.length) i = 0;
        if (tabs[i].getAttribute('aria-disabled') !== 'true' && !tabs[i].disabled) {
          return i;
        }
        i += step;
      }
      return -1;
    };

    const moveTo = (target: number) => {
      if (target < 0 || target >= tabs.length) return;
      const child = segmentChildren[target];
      if (child.props.disabled) return;
      tabs[target].focus();
      onChange?.(child.props.value);
    };

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const next = findEnabled(currentIndex + 1, 1);
        if (next !== -1) moveTo(next);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const prev = findEnabled(currentIndex - 1, -1);
        if (prev !== -1) moveTo(prev);
        break;
      }
      case 'Home': {
        event.preventDefault();
        const first = findEnabled(0, 1);
        if (first !== -1) moveTo(first);
        break;
      }
      case 'End': {
        event.preventDefault();
        const last = findEnabled(tabs.length - 1, -1);
        if (last !== -1) moveTo(last);
        break;
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={className || ROOT_BUILTIN_CLASSES}
    >
      {segmentChildren.map((child, index) => {
        const position = computePosition(index, total);
        const isSelected = child.props.value === value;
        return cloneElement(child, {
          key: child.key ?? child.props.value,
          __position: position,
          __isSelected: isSelected,
          __onClick: () => onChange?.(child.props.value),
          __tabIndex: index === focusableIndex ? 0 : -1,
        });
      })}
    </div>
  );
};

SmallSegmentedButtonComponent.Segment = SmallSegmentedButtonSegment;

export const SmallSegmentedButton = SmallSegmentedButtonComponent;
