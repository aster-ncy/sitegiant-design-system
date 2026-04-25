import { Children, cloneElement, isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';
import {
  TabSegment,
  type TabSegmentProps,
  type TabSize,
  type TabSelectedVariant,
  type SegmentPosition,
} from './TabSegment';

const computePosition = (index: number, total: number): SegmentPosition => {
  if (total === 1) return 'single';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'center';
};

export interface TabProps {
  /** Selected segment's value (controlled). */
  value: string;
  onChange?: (value: string) => void;
  size?: TabSize;
  selectedVariant?: TabSelectedVariant;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Tab — Figma: Tab/Small (segmented button).
 *
 * Compound API:
 *   <Tab value={v} onChange={setV} size="sm">
 *     <Tab.Segment value="a">Option</Tab.Segment>
 *     <Tab.Segment value="b" type="icon" icon="apps" aria-label="Apps" />
 *   </Tab>
 *
 * <Tab> walks its children, derives each segment's position (first / center /
 * last / single), and injects the active state. Inner borders collapse via
 * `mr-[-1px]` so adjacent segments share their 1px stroke instead of doubling
 * up. The selected segment paints `--color-tab-small-selected-fill` (default
 * variant) or `--color-tab-small-selected-primary-fill` (primary variant).
 */
const TabComponent = ({
  value,
  onChange,
  size = 'sm',
  selectedVariant = 'default',
  children,
  className = '',
  'aria-label': ariaLabel,
}: TabProps) => {
  const segmentChildren = Children.toArray(children).filter(
    (child): child is ReactElement<TabSegmentProps> =>
      isValidElement(child) && child.type === TabSegment,
  );
  const total = segmentChildren.length;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={['inline-flex items-center', className].filter(Boolean).join(' ')}
    >
      {segmentChildren.map((child, index) => {
        const position = computePosition(index, total);
        const isSelected = child.props.value === value;
        return cloneElement(child, {
          key: child.key ?? child.props.value,
          __position: position,
          __isSelected: isSelected,
          __selectedVariant: selectedVariant,
          __size: size,
          __onClick: () => onChange?.(child.props.value),
        });
      })}
    </div>
  );
};

TabComponent.Segment = TabSegment;

export const Tab = TabComponent;
