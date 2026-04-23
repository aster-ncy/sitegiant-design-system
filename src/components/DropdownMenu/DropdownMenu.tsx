import { useEffect, useRef, useState, Children, isValidElement, cloneElement } from 'react';
import type { ReactNode, ReactElement, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { DropdownMenuItem } from './DropdownMenuItem';
import type { DropdownMenuItemProps } from './DropdownMenuItem';

export interface DropdownMenuProps {
  children: ReactNode;
  /** Fixed width in px. Defaults to auto */
  width?: number;
  /** Accessible label for the listbox */
  'aria-label'?: string;
  /** Called when the user presses Escape while focus is inside the menu */
  onEscape?: () => void;
  className?: string;
}

/**
 * Dropdown option panel with roving-tabindex keyboard navigation:
 *  - ArrowDown / ArrowUp moves focus between DropdownMenuItem children
 *  - Home / End jump to first / last item
 *  - Enter / Space activates the focused item (native button behavior)
 *  - Escape calls onEscape so the parent can close the panel
 *
 * Non-item children (DropdownMenuDivider, DropdownMenuCustomInput,
 * DropdownMenuActions) are rendered inline and are not part of the roving
 * focus ring — they contain their own interactive controls with their own
 * tabbing behavior.
 */
export const DropdownMenu = ({
  children,
  width,
  onEscape,
  className = '',
  'aria-label': ariaLabel,
}: DropdownMenuProps) => {
  const listboxRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Flatten children so we can identify DropdownMenuItem children by position
  const childArray = Children.toArray(children);
  let itemCursor = 0;
  const itemIndexByKey = new Map<unknown, number>();
  childArray.forEach((child, idx) => {
    if (isValidElement(child) && child.type === DropdownMenuItem) {
      itemIndexByKey.set(child.key ?? idx, itemCursor);
      itemCursor += 1;
    }
  });
  const itemCount = itemCursor;

  // If an item becomes selected by default, start focus there
  useEffect(() => {
    if (itemCount === 0) return;
    let defaultIndex = 0;
    let cursor = 0;
    childArray.forEach((child) => {
      if (isValidElement(child) && child.type === DropdownMenuItem) {
        const props = child.props as DropdownMenuItemProps;
        if (props.selected && defaultIndex === 0) defaultIndex = cursor;
        cursor += 1;
      }
    });
    setActiveIndex(defaultIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  const focusItemAt = (index: number) => {
    if (!listboxRef.current) return;
    const buttons = listboxRef.current.querySelectorAll<HTMLButtonElement>('[role="option"]:not([aria-disabled="true"])');
    const target = buttons[index];
    if (target) target.focus();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (itemCount === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (activeIndex + 1) % itemCount;
      setActiveIndex(next);
      focusItemAt(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (activeIndex - 1 + itemCount) % itemCount;
      setActiveIndex(next);
      focusItemAt(next);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      focusItemAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = itemCount - 1;
      setActiveIndex(last);
      focusItemAt(last);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
    }
  };

  // Inject tabIndex into DropdownMenuItem children using roving tabindex:
  // the active item gets 0, the rest get -1.
  const enhanced = childArray.map((child) => {
    if (isValidElement(child) && child.type === DropdownMenuItem) {
      const key = child.key ?? itemIndexByKey.get(child) ?? 0;
      const myIndex = itemIndexByKey.get(key) ?? 0;
      return cloneElement(child as ReactElement<DropdownMenuItemProps>, {
        tabIndex: myIndex === activeIndex ? 0 : -1,
      });
    }
    return child;
  });

  return (
    <div
      ref={listboxRef}
      role="listbox"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      style={width ? { width } : undefined}
      className={[
        'flex flex-col',
        'bg-[var(--color-surface-card)]',
        'border border-[var(--color-surface-card-border)]',
        'rounded-[var(--radius-8)]',
        'shadow-[var(--shadow-md)]',
        'py-[var(--spacing-4)]',
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {enhanced}
    </div>
  );
};
