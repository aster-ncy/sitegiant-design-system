import { Icon } from '../Icon/Icon';

export type SearchBoxState = 'default' | 'focus' | 'danger' | 'disabled' | 'readonly';
export type SearchBoxSize = 'default' | 'small';
export type SearchBoxType =
  | 'default'
  | 'with-categories'
  | 'search-placeholder-only'
  | 'dropdown'
  | 'date-range'
  | 'date-range-with-search';

export interface SearchBoxProps {
  /** Visual type/layout */
  type?: SearchBoxType;
  /** Size variant */
  size?: SearchBoxSize;
  /** Show search button on the right */
  showSearchButton?: boolean;
  /** Input placeholder */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Force a visual state — Storybook only */
  state?: SearchBoxState;
  /** Disables the search box */
  disabled?: boolean;
  /** Makes the search box readonly */
  readonly?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Called when the clear button is clicked */
  onClear?: () => void;
  /** Called when the search button is clicked */
  onSearchClick?: () => void;
  /** Label text (shown before the input for dropdown/date-range types) */
  label?: string;
  /** Category dropdown text */
  categoryLabel?: string;
  /** Called when the category dropdown is clicked */
  onCategoryClick?: () => void;
  /** Date range start value */
  dateStart?: string;
  /** Date range end value */
  dateEnd?: string;
  /** HTML id for the input element */
  id?: string;
  /** Extra classes on the root wrapper */
  className?: string;
}

/* ── State → border class (OUTER wrapper only) ───────── */
const stateBorderClasses: Record<SearchBoxState, string> = {
  default:  'border-[var(--searchbox-default-border)]',
  focus:    'border-[var(--searchbox-focus-border)]',
  danger:   'border-[var(--searchbox-danger-border)]',
  disabled: 'border-[var(--searchbox-default-border)]',
  readonly: 'border-transparent',
};

/* ── State → divider color (between segments) ────────── */
// Internal dividers are subtle — they separate sibling segments without
// drawing a second hard border. Kept the same default hue as the outer
// border so the compound reads as a single field, not multiple.
const stateDividerClasses: Record<SearchBoxState, string> = {
  default:  'border-[var(--searchbox-default-border)]',
  focus:    'border-[var(--searchbox-focus-border)]',
  danger:   'border-[var(--searchbox-danger-border)]',
  disabled: 'border-[var(--searchbox-default-border)]',
  readonly: 'border-transparent',
};

const stateFillClasses: Record<SearchBoxState, string> = {
  default:  'bg-[var(--searchbox-default-fill)]',
  focus:    'bg-[var(--searchbox-default-fill)]',
  danger:   'bg-[var(--searchbox-default-fill)]',
  disabled: 'bg-[var(--searchbox-disabled-fill)]',
  readonly: 'bg-transparent',
};

/* ── Size → padding ──────────────────────────────────── */
const sizePaddingClasses: Record<SearchBoxSize, string> = {
  default: 'px-[var(--spacing-12)] py-[var(--spacing-12)]',
  small:   'px-[var(--spacing-12)] py-[var(--spacing-8)]',
};

/* ── Shared text classes ─────────────────────────────── */
const textClasses = [
  'text-[length:var(--text-14)] leading-[var(--leading-16)]',
  'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
].join(' ');

const valueTextClass = 'text-[color:var(--searchbox-value-text)]';
const placeholderTextClass = 'text-[color:var(--searchbox-placeholder-text)]';
const dropdownValueTextClass = 'text-[color:var(--dropdown-value-text)]';

export const SearchBox = ({
  type = 'default',
  size = 'default',
  showSearchButton = false,
  placeholder = 'Search Placeholder',
  value,
  state = 'default',
  disabled = false,
  readonly = false,
  onChange,
  onClear,
  onSearchClick,
  label,
  categoryLabel = 'Search Categories',
  onCategoryClick,
  dateStart = 'DD-MM-YYYY',
  dateEnd = 'DD-MM-YYYY',
  id,
  className = '',
}: SearchBoxProps) => {
  const resolvedState: SearchBoxState = disabled ? 'disabled' : readonly ? 'readonly' : state;
  const isDisabled = resolvedState === 'disabled';
  const isReadonly = resolvedState === 'readonly';
  const hasForcedFocus = resolvedState === 'focus';
  const hasValue = Boolean(value && value.length > 0);

  const wrapperBorder = stateBorderClasses[resolvedState];
  const wrapperFill = stateFillClasses[resolvedState];
  const dividerBorder = stateDividerClasses[resolvedState];
  const padding = sizePaddingClasses[size];

  // Focus-within always wins over default/danger/readonly so tabbing into
  // the input repaints the wrapper border. Disabled stays unresponsive.
  // Applies to the OUTER wrapper now that segments share it.
  const focusWithin = !hasForcedFocus && !isDisabled && !isReadonly
    ? 'focus-within:border-[var(--searchbox-focus-border)]'
    : '';
  // Keep divider colour in sync with focus — otherwise inner dividers would
  // still read as the default border color while the outer went focused.
  const focusWithinDivider = !hasForcedFocus && !isDisabled && !isReadonly
    ? 'group-focus-within:border-[var(--searchbox-focus-border)]'
    : '';

  /* ── Outer wrapper — OWNS the border + radius + state ─
     Children sit flush; their own edges draw only internal dividers via
     border-l / border-r on segments that need to separate from neighbors. */
  const wrapperClasses = [
    'group inline-flex items-stretch',
    'border border-solid',
    'rounded-[var(--radius-4)]',
    'overflow-hidden',
    'transition-colors duration-150',
    wrapperBorder,
    focusWithin,
    isDisabled ? 'opacity-60' : '',
    className,
  ].filter(Boolean).join(' ');

  /* ── Category dropdown segment ─────────────────────── */
  const CategorySegment = ({ dividerRight }: { dividerRight?: boolean }) => (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onCategoryClick}
      className={[
        'flex items-center justify-between w-[160px]',
        padding,
        wrapperFill,
        dividerRight ? `border-r border-solid ${dividerBorder} ${focusWithinDivider}` : '',
        'shrink-0',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].filter(Boolean).join(' ')}
    >
      <span className={[
        'flex-1 max-w-[112px] text-left line-clamp-1',
        textClasses,
        valueTextClass,
      ].join(' ')}>
        {categoryLabel}
      </span>
      <span style={{ color: 'var(--dropdown-icon)' }}>
        <Icon name="chevron-down" size={17} />
      </span>
    </button>
  );

  /* ── Search input segment ──────────────────────────── */
  const SearchInputSegment = ({ showIcon }: { showIcon?: boolean }) => (
    <div
      className={[
        'flex items-center gap-[var(--spacing-8)] flex-1',
        padding,
        wrapperFill,
        isDisabled ? 'cursor-not-allowed' : '',
      ].filter(Boolean).join(' ')}
    >
      {showIcon && (
        <span className="shrink-0 flex items-center" style={{ color: 'var(--searchbox-search-icon)' }}>
          <Icon name="search" size={17} />
        </span>
      )}
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        disabled={isDisabled}
        readOnly={isReadonly}
        onChange={(e) => onChange?.(e.target.value)}
        className={[
          'flex-1 min-w-0',
          'bg-transparent outline-none border-none',
          textClasses,
          valueTextClass,
          `placeholder:${placeholderTextClass}`,
          '[&::-webkit-search-cancel-button]:appearance-none',
          '[&::-webkit-search-decoration]:appearance-none',
          isDisabled ? 'cursor-not-allowed' : '',
        ].filter(Boolean).join(' ')}
      />
      {hasValue && !isDisabled && !isReadonly && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="shrink-0 flex items-center cursor-pointer bg-transparent border-none"
          style={{ color: 'var(--searchbox-search-icon)' }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );

  /* ── Search button segment (icon) ──────────────────── */
  const SearchButtonSegment = () => (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onSearchClick}
      className={[
        'flex items-center justify-center shrink-0',
        size === 'small' ? 'p-[var(--spacing-8)]' : 'p-[var(--spacing-12)]',
        wrapperFill,
        `border-l border-solid ${dividerBorder} ${focusWithinDivider}`,
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].filter(Boolean).join(' ')}
      style={{ color: 'var(--color-text-primary)' }}
    >
      <Icon name="search" size={17} />
    </button>
  );

  /* ── Search text button segment ────────────────────── */
  const SearchTextButtonSegment = () => (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onSearchClick}
      className={[
        'flex items-center shrink-0',
        size === 'small' ? 'px-[var(--spacing-16)] py-[var(--spacing-8)]' : 'px-[var(--spacing-16)] py-[var(--spacing-12)]',
        wrapperFill,
        `border-l border-solid ${dividerBorder} ${focusWithinDivider}`,
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].filter(Boolean).join(' ')}
    >
      <span className={[
        'flex-1 max-w-[112px] text-left line-clamp-1',
        textClasses,
        valueTextClass,
      ].join(' ')}>
        Search
      </span>
    </button>
  );

  /* ── Date range segment ────────────────────────────── */
  const DateRangeSegment = () => (
    <div
      className={[
        'flex items-center gap-[var(--spacing-8)] w-[256px]',
        padding,
        wrapperFill,
      ].join(' ')}
    >
      <span className="shrink-0 flex items-center" style={{ color: 'var(--searchbox-search-icon)' }}>
        <Icon name="calendar" size={17} />
      </span>
      <span className={['flex-1 line-clamp-1', textClasses, valueTextClass].join(' ')}>
        {dateStart}
      </span>
      <span className="shrink-0 flex items-center" style={{ color: 'var(--searchbox-search-icon)' }}>
        <Icon name="minus" size={17} />
      </span>
      <span className={['flex-1 line-clamp-1', textClasses, valueTextClass].join(' ')}>
        {dateEnd}
      </span>
    </div>
  );

  /* ── Dropdown-only segment (standalone — keeps its own border) ─ */
  const DropdownSegment = () => (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onCategoryClick}
      className={[
        'flex items-center justify-between w-[160px]',
        padding,
        wrapperFill,
        'border border-solid',
        wrapperBorder,
        'rounded-[var(--radius-4)]',
        'shrink-0',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].filter(Boolean).join(' ')}
    >
      <span className={[
        'flex-1 max-w-[112px] text-left line-clamp-1',
        textClasses,
        dropdownValueTextClass,
      ].join(' ')}>
        {placeholder}
      </span>
      <span style={{ color: 'var(--dropdown-icon)' }}>
        <Icon name="chevron-down" size={17} />
      </span>
    </button>
  );

  /* ── Optional label ────────────────────────────────── */
  const LabelElement = label ? (
    <span className={[
      'shrink-0 line-clamp-1',
      textClasses,
      valueTextClass,
    ].join(' ')}>
      {label}
    </span>
  ) : null;

  /* ── Render by type ────────────────────────────────── */

  /* Type: Default — search icon + input */
  if (type === 'default') {
    return (
      <div className={wrapperClasses}>
        <SearchInputSegment showIcon />
      </div>
    );
  }

  /* Type: with Categories — category dropdown + search input (+ optional search button) */
  if (type === 'with-categories') {
    return (
      <div className={wrapperClasses}>
        <CategorySegment dividerRight />
        <SearchInputSegment />
        {showSearchButton && <SearchButtonSegment />}
      </div>
    );
  }

  /* Type: Search Placeholder only — input + search button */
  if (type === 'search-placeholder-only') {
    return (
      <div className={wrapperClasses}>
        <SearchInputSegment />
        {showSearchButton && <SearchButtonSegment />}
      </div>
    );
  }

  /* Type: Dropdown — label + dropdown (standalone, outer wrapper has no border) */
  if (type === 'dropdown') {
    return (
      <div className={['inline-flex items-center gap-[var(--spacing-12)]', className].filter(Boolean).join(' ')}>
        {LabelElement}
        <DropdownSegment />
      </div>
    );
  }

  /* Type: Date Range — label + date range box */
  if (type === 'date-range') {
    return (
      <div className={['inline-flex items-center gap-[var(--spacing-12)]', className].filter(Boolean).join(' ')}>
        {LabelElement}
        <div className={wrapperClasses.replace(className, '')}>
          <DateRangeSegment />
        </div>
      </div>
    );
  }

  /* Type: Date Range with Search — label + date range + search text button */
  if (type === 'date-range-with-search') {
    return (
      <div className={['inline-flex items-center gap-[var(--spacing-12)]', className].filter(Boolean).join(' ')}>
        {LabelElement}
        <div className={wrapperClasses.replace(className, '')}>
          <DateRangeSegment />
          <SearchTextButtonSegment />
        </div>
      </div>
    );
  }

  return null;
};
