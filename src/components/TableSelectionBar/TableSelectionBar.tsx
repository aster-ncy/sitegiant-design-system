import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { DropdownMenuItem } from '../DropdownMenu/DropdownMenuItem';

export interface TableSelectionBarMenuItem {
  /** Stable key. */
  key: string;
  /** Menu item label. */
  label: string;
  /** Click handler — closes the menu after firing. */
  onClick?: () => void;
  /** Disable this item. */
  disabled?: boolean;
}

export interface TableSelectionBarAction {
  /** Stable key. */
  key: string;
  /** Visible label. */
  label: ReactNode;
  /** Click handler — ignored if `menuItems` is provided. */
  onClick?: () => void;
  /**
   * Show a chevron-down icon after the label.
   * Implied true when `menuItems` is provided.
   */
  hasMenu?: boolean;
  /**
   * If provided, the action becomes a dropdown trigger; clicking it opens
   * a DropdownMenu populated with these items. `onClick` is ignored.
   */
  menuItems?: TableSelectionBarMenuItem[];
  /** Disable this action. */
  disabled?: boolean;
}

export interface TableSelectionBarProps {
  /** Slot for the row-select-all checkbox. Optional but typical. */
  checkbox?: ReactNode;
  /** Selected count, e.g. "1 Selected" → pass `selectedCount={1}`. */
  selectedCount: number;
  /** Custom selected-label suffix. Default `'Selected'`. */
  selectedLabel?: string;
  /** Action segments shown to the right of the count chip. */
  actions?: TableSelectionBarAction[];
  /** Show a trash-can icon as the rightmost segment. */
  onDelete?: () => void;
  /** Disable the trash button. */
  deleteDisabled?: boolean;
  /** Extra classes on the root bar. */
  className?: string;
}

const segmentBaseClass = [
  'inline-flex items-center justify-center gap-[var(--spacing-4)]',
  'border border-solid border-[var(--table-divider-border)]',
  'px-[var(--spacing-12)] py-[var(--spacing-4)]',
  'text-[length:var(--text-14)] leading-[var(--leading-17)]',
  'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
  'whitespace-nowrap outline-none',
  'transition-colors duration-150',
  // Pull subsequent segments under the right border so they share it.
  '-mr-px',
].join(' ');

const cornerClass = (isFirst: boolean, isLast: boolean) => {
  if (isFirst && isLast) return 'rounded-[var(--radius-4)]';
  if (isFirst) return 'rounded-l-[var(--radius-4)]';
  if (isLast) return 'rounded-r-[var(--radius-4)]';
  return '';
};

/**
 * TableSelectionBar — Figma: Table Header - Selected (1920:5155).
 *
 * Toolbar that replaces the default table header when one or more rows
 * are selected. Renders a checkbox, "N Selected" pill, and a connected
 * row of action segments (Action 1, Action 2, More Action ⌄, Trash).
 * All action segments are optional — pass only what each call site needs.
 *
 * Composition: render this above the table (or as the first <thead>
 * row) only when `selectedCount > 0`. Hide otherwise to fall back to
 * the regular header row.
 */
export const TableSelectionBar = ({
  checkbox,
  selectedCount,
  selectedLabel = 'Selected',
  actions,
  onDelete,
  deleteDisabled = false,
  className = '',
}: TableSelectionBarProps) => {
  const totalActions = (actions?.length ?? 0) + (onDelete ? 1 : 0);
  // Total segments = count chip + actions + (delete?). Used to figure
  // out which segment owns the rounded right corners.
  const totalSegments = 1 + totalActions;

  // Track which dropdown-menu action is currently open. Only one menu
  // open at a time; clicking another menu trigger swaps the open key.
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const menuTriggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  // Click-outside-to-close behavior for any open dropdown.
  useEffect(() => {
    if (!openMenuKey) return;
    const handle = (e: MouseEvent) => {
      const trigger = menuTriggerRefs.current.get(openMenuKey);
      if (!trigger) return;
      const target = e.target as Node;
      // Don't close if click was on the trigger itself or inside the menu.
      if (trigger.contains(target)) return;
      // The menu lives in a sibling div with data-tsbar-menu attribute.
      if ((target as Element)?.closest?.('[data-tsbar-menu]')) return;
      setOpenMenuKey(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [openMenuKey]);

  return (
    <div
      className={[
        'relative flex items-center gap-[var(--spacing-12)] w-full',
        'pl-[var(--spacing-24)] pr-[var(--spacing-12)] py-[var(--spacing-16)]',
        'bg-[var(--table-header-fill)]',
        'shadow-[inset_0_-1px_0_0_var(--table-divider-last-border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {checkbox && <span className="shrink-0 inline-flex items-center">{checkbox}</span>}
      <div className="inline-flex items-center pr-px shrink-0">
        {/* "N Selected" count chip — always first. */}
        <span
          className={[
            segmentBaseClass,
            cornerClass(true, totalSegments === 1),
            'bg-[var(--color-space-light)]',
            'text-[length:var(--table-header-size)] leading-[var(--table-header-lineheight)]',
            'text-[color:var(--table-header-disabled-text)]',
          ].join(' ')}
        >
          {selectedCount} {selectedLabel}
        </span>

        {/* Action buttons (label / label-with-menu). */}
        {actions?.map((action, idx) => {
          const isLastInSegments = idx === actions.length - 1 && !onDelete;
          const hasDropdown = (action.menuItems?.length ?? 0) > 0;
          const showChevron = hasDropdown || action.hasMenu;
          const isOpen = openMenuKey === action.key;

          const buttonClasses = [
            segmentBaseClass,
            cornerClass(false, isLastInSegments),
            'bg-transparent',
            'text-[color:var(--text-link-subtle-default)]',
            action.disabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:bg-[var(--color-space-lighter)]',
          ].join(' ');

          const handleClick = () => {
            if (action.disabled) return;
            if (hasDropdown) {
              setOpenMenuKey(isOpen ? null : action.key);
            } else {
              action.onClick?.();
            }
          };

          return (
            <div key={action.key} className="relative inline-flex">
              <button
                type="button"
                ref={(el) => {
                  menuTriggerRefs.current.set(action.key, el);
                }}
                onClick={handleClick}
                disabled={action.disabled}
                aria-haspopup={hasDropdown ? 'menu' : undefined}
                aria-expanded={hasDropdown ? isOpen : undefined}
                className={buttonClasses}
              >
                <span>{action.label}</span>
                {showChevron && (
                  <Icon
                    name="chevron-down"
                    size={17}
                    className="text-[color:var(--color-icon-secondary)] shrink-0"
                  />
                )}
              </button>
              {hasDropdown && isOpen && (
                <div
                  data-tsbar-menu
                  className="absolute top-full left-0 mt-[var(--spacing-4)] z-10"
                >
                  <DropdownMenu
                    aria-label={typeof action.label === 'string' ? action.label : 'More actions'}
                    onEscape={() => setOpenMenuKey(null)}
                  >
                    {action.menuItems!.map((item) => (
                      <DropdownMenuItem
                        key={item.key}
                        label={item.label}
                        disabled={item.disabled}
                        onClick={() => {
                          item.onClick?.();
                          setOpenMenuKey(null);
                        }}
                      />
                    ))}
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })}

        {/* Trash button — always last when present. Subtle-danger:
            grey icon by default switches to danger red on hover, but
            the background hover follows the neutral action-button
            treatment (light grey wash) — only the icon signals danger. */}
        {onDelete && (
          <button
            type="button"
            onClick={deleteDisabled ? undefined : onDelete}
            disabled={deleteDisabled}
            aria-label="Delete selected"
            className={[
              segmentBaseClass,
              cornerClass(false, true),
              'bg-transparent group',
              deleteDisabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:bg-[var(--color-space-lighter)]',
            ].join(' ')}
          >
            <Icon
              name="trash"
              size={17}
              className={[
                'text-[color:var(--color-icon-secondary)]',
                deleteDisabled ? '' : 'group-hover:text-[color:var(--color-icon-danger)]',
                'transition-colors duration-150',
              ].join(' ')}
            />
          </button>
        )}
      </div>
    </div>
  );
};
