import { useState as useLocalState } from 'react';
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

/* ── State → border class ────────────────────────────── */
const stateBorderClasses: Record<SearchBoxState, string> = {
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
  const isDanger = resolvedState === 'danger';
  const hasForcedFocus = resolvedState === 'focus';
  const hasValue = Boolean(value && value.length > 0);

  const wrapperBorder = stateBorderClasses[resolvedState];
  const wrapperFill = stateFillClasses[resolvedState];
  const padding = sizePaddingClasses[size];

  const focusWithin = !hasForcedFocus && !isDanger && !isDisabled && !isReadonly
    ? 'focus-within:border-[var(--searchbox-focus-border)]'
    : '';

  /* ── Category dropdown segment ─────────────────────── */
  const CategorySegment = ({ roundedLeft, roundedRight }: { roundedLeft?: boolean; roundedRight?: boolean }) => (
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
        roundedLeft ? 'rounded-l-[var(--radius-4)]' : '',
        roundedRight ? 'rounded-r-[var(--radius-4)]' : '',
        'shrink-0 cursor-pointer',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
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
  const SearchInputSegment = ({ roundedLeft, roundedRight, showIcon }: { roundedLeft?: boolean; roundedRight?: boolean; showIcon?: boolean }) => (
    <div
      className={[
        'flex items-center gap-[var(--spacing-8)] flex-1',
        padding,
        wrapperFill,
        'border border-solid',
        wrapperBorder,
        focusWithin,
        roundedLeft ? 'rounded-l-[var(--radius-4)]' : '',
        roundedRight ? 'rounded-r-[var(--radius-4)]' : '',
        'transition-colors duration-150',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
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
        'border border-solid',
        wrapperBorder,
        'rounded-r-[var(--radius-4)]',
        'cursor-pointer',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
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
        'border border-solid',
        wrapperBorder,
        'rounded-r-[var(--radius-4)]',
        'cursor-pointer',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
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
  const DateRangeSegment = ({ roundedLeft, roundedRight }: { roundedLeft?: boolean; roundedRight?: boolean }) => (
    <div
      className={[
        'flex items-center gap-[var(--spacing-8)] w-[256px]',
        padding,
        wrapperFill,
        'border border-solid',
        wrapperBorder,
        roundedLeft ? 'rounded-l-[var(--radius-4)]' : '',
        roundedRight ? 'rounded-r-[var(--radius-4)]' : '',
      ].filter(Boolean).join(' ')}
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

  /* ── Dropdown-only segment ─────────────────────────── */
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
        'shrink-0 cursor-pointer',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
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
      <div className={['inline-flex items-center', className].filter(Boolean).join(' ')}>
        <SearchInputSegment roundedLeft roundedRight showIcon />
      </div>
    );
  }

  /* Type: with Categories — category dropdown + search input (+ optional search button) */
  if (type === 'with-categories') {
    return (
      <div className={['inline-flex items-center', className].filter(Boolean).join(' ')}>
        <CategorySegment roundedLeft />
        <SearchInputSegment roundedRight={!showSearchButton} />
        {showSearchButton && <SearchButtonSegment />}
      </div>
    );
  }

  /* Type: Search Placeholder only — input + search button */
  if (type === 'search-placeholder-only') {
    return (
      <div className={['inline-flex items-center', className].filter(Boolean).join(' ')}>
        <SearchInputSegment roundedLeft roundedRight={!showSearchButton} />
        {showSearchButton && <SearchButtonSegment />}
      </div>
    );
  }

  /* Type: Dropdown — label + dropdown */
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
        <DateRangeSegment roundedLeft roundedRight />
      </div>
    );
  }

  /* Type: Date Range with Search — label + date range + search text button */
  if (type === 'date-range-with-search') {
    return (
      <div className={['inline-flex items-center gap-[var(--spacing-12)]', className].filter(Boolean).join(' ')}>
        {LabelElement}
        <div className="inline-flex items-center">
          <DateRangeSegment roundedLeft />
          <SearchTextButtonSegment />
        </div>
      </div>
    );
  }

  return null;
};
