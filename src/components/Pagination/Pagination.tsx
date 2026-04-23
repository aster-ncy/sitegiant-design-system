import { Icon } from '../Icon';

export type PaginationSize = 'default' | 'compact';

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items (used in the "Showing X to Y of Z" text) */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Available page-size options in the size changer */
  pageSizeOptions?: number[];
  /** Number of pages shown on each side of the current page. Default 2 */
  siblingCount?: number;
  /** Visual size */
  size?: PaginationSize;
  /** Show the "Showing X to Y of Z" status text */
  showStatus?: boolean;
  /** Show the page-size changer dropdown */
  showSizeChanger?: boolean;
  /** Called when page changes */
  onPageChange?: (page: number) => void;
  /** Called when page size changes */
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

type Token = number | 'ellipsis-prev' | 'ellipsis-next';

function buildPageTokens(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): Token[] {
  if (totalPages <= 1) return [1];

  const first = 1;
  const last = totalPages;
  const startSibling = Math.max(currentPage - siblingCount, first + 1);
  const endSibling = Math.min(currentPage + siblingCount, last - 1);

  const tokens: Token[] = [first];
  if (startSibling > first + 1) tokens.push('ellipsis-prev');
  for (let p = startSibling; p <= endSibling; p++) tokens.push(p);
  if (endSibling < last - 1) tokens.push('ellipsis-next');
  if (last !== first) tokens.push(last);
  return tokens;
}

const ITEM_BASE = [
  'bg-[var(--color-surface-card)]',
  'border border-[var(--color-surface-card-border)]',
  'rounded-[var(--radius-4)]',
  'inline-flex items-center justify-center',
  'font-[family-name:var(--font-sans)]',
  'cursor-pointer',
  'transition-colors',
].join(' ');

const ITEM_SIZE: Record<PaginationSize, string> = {
  default: 'min-w-[32px] h-[32px] px-[var(--spacing-8)]',
  compact: 'w-[24px] h-[24px] px-[var(--spacing-8)]',
};

const BUTTON_SIZE: Record<PaginationSize, string> = {
  default: 'w-[32px] h-[32px] p-[var(--spacing-10)]',
  compact: 'w-[24px] h-[24px] p-[var(--spacing-6)]',
};

const NUM_TEXT: Record<PaginationSize, string> = {
  default:
    'text-[length:var(--text-14)] leading-[var(--leading-20)] font-[var(--font-weight-regular)] text-[color:var(--color-text-primary)]',
  compact:
    'text-[length:var(--text-14)] leading-[var(--leading-16)] font-[var(--font-weight-regular)] text-[color:var(--color-text-primary)]',
};

const NUM_TEXT_ACTIVE: Record<PaginationSize, string> = {
  default:
    'text-[length:var(--text-14)] leading-[var(--leading-20)] font-[var(--font-weight-medium)] text-[color:var(--button-basic-text)]',
  compact:
    'text-[length:var(--text-14)] leading-[var(--leading-16)] font-[var(--font-weight-medium)] text-[color:var(--button-basic-text)]',
};

const ELLIPSIS_SIZE: Record<PaginationSize, string> = {
  default: 'w-[32px] h-[32px]',
  compact: 'w-[24px] h-[24px]',
};

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  siblingCount = 2,
  size = 'default',
  showStatus = true,
  showSizeChanger = true,
  onPageChange,
  onPageSizeChange,
  className = '',
}: PaginationProps) => {
  const tokens = buildPageTokens(currentPage, totalPages, siblingCount);
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange?.(p);
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  const iconPx = size === 'compact' ? 12 : 12;
  const itemGap = size === 'compact' ? 'gap-[2px]' : 'gap-[var(--spacing-8)]';
  const rightGap = size === 'compact' ? 'gap-[var(--spacing-8)]' : 'gap-[var(--spacing-16)]';

  return (
    <div
      className={[
        'flex items-center justify-between w-full',
        'font-[family-name:var(--font-sans)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showStatus ? (
        <div className="pr-[var(--spacing-8)] py-[var(--spacing-6)] text-[length:var(--text-14)] leading-[var(--leading-20)] text-[color:var(--color-text-primary)]">
          Showing {firstItem} to {lastItem} of {totalItems} (Page {currentPage})
        </div>
      ) : <span />}

      <div className={['flex items-center', rightGap].join(' ')}>
        <div className={['flex items-center', itemGap].join(' ')}>
          <button
            type="button"
            aria-label="Previous page"
            disabled={prevDisabled}
            onClick={() => goTo(currentPage - 1)}
            className={[
              ITEM_BASE,
              BUTTON_SIZE[size],
              prevDisabled ? 'cursor-not-allowed' : '',
            ].join(' ')}
            style={{
              color: prevDisabled ? 'var(--color-surface-card-border)' : 'var(--color-text-primary)',
            }}
          >
            <Icon name="chevron-left" size={iconPx} />
          </button>

          {tokens.map((t, i) => {
            if (t === 'ellipsis-prev' || t === 'ellipsis-next') {
              return (
                <div
                  key={`${t}-${i}`}
                  className={[
                    ELLIPSIS_SIZE[size],
                    'inline-flex items-center justify-center',
                    'text-[color:var(--color-text-muted)]',
                    'text-[length:var(--text-14)]',
                    'tracking-widest select-none',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  •••
                </div>
              );
            }
            const isActive = t === currentPage;
            return (
              <button
                key={t}
                type="button"
                aria-label={`Page ${t}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => goTo(t)}
                className={[
                  ITEM_BASE,
                  ITEM_SIZE[size],
                  isActive ? 'border-[var(--button-basic-text)]' : '',
                ].join(' ')}
              >
                <span className={isActive ? NUM_TEXT_ACTIVE[size] : NUM_TEXT[size]}>
                  {t}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            aria-label="Next page"
            disabled={nextDisabled}
            onClick={() => goTo(currentPage + 1)}
            className={[
              ITEM_BASE,
              BUTTON_SIZE[size],
              nextDisabled ? 'cursor-not-allowed' : '',
            ].join(' ')}
            style={{
              color: nextDisabled ? 'var(--color-surface-card-border)' : 'var(--color-text-primary)',
            }}
          >
            <Icon name="chevron-right" size={iconPx} />
          </button>
        </div>

        {showSizeChanger && (
          <div
            className={[
              'inline-flex items-center justify-end',
              'gap-[var(--spacing-8)]',
              'px-[var(--spacing-12)] py-[var(--spacing-4)]',
              'bg-[var(--color-surface-card)]',
              'border border-[var(--color-surface-card-border)]',
              'rounded-[var(--radius-4)]',
              size === 'compact' ? 'h-[24px]' : 'h-[32px]',
            ].join(' ')}
          >
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className={[
                'appearance-none bg-transparent cursor-pointer',
                'text-[length:var(--text-14)] leading-[var(--leading-20)]',
                'text-[color:var(--color-text-primary)]',
                'focus:outline-none',
              ].join(' ')}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={size === 'compact' ? 12 : 16} color="var(--color-text-muted)" />
          </div>
        )}
      </div>
    </div>
  );
};
