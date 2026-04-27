import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface UseTagSelectMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface UseTagSelectMenuResult<T extends UseTagSelectMenuOption> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  query: string;
  setQuery: (q: string) => void;
  filteredOptions: T[];
  triggerRef: RefObject<HTMLDivElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
}

/**
 * Shared popover + search state for TagSelect / MultiTagSelect.
 *
 * - Filters options case-insensitively by `query`.
 * - Disabled options are kept visible but pushed to the bottom of the list.
 * - Clicking outside the trigger AND popover closes the menu.
 * - Pressing Escape from inside the popover closes the menu.
 */
export const useTagSelectMenu = <T extends UseTagSelectMenuOption>(
  options: T[],
): UseTagSelectMenuResult<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matching = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    const enabled = matching.filter((o) => !o.disabled);
    const disabled = matching.filter((o) => o.disabled);
    return [...enabled, ...disabled];
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const popover = popoverRef.current;
      if (popover && popover.contains(document.activeElement)) {
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    query,
    setQuery,
    filteredOptions,
    triggerRef,
    popoverRef,
  };
};
