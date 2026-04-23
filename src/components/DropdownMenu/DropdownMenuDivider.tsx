export interface DropdownMenuDividerProps {
  className?: string;
}

export const DropdownMenuDivider = ({ className = '' }: DropdownMenuDividerProps) => {
  return (
    <div
      role="separator"
      className={[
        'w-full py-[var(--spacing-4)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="w-full h-px bg-[var(--dropdown-default-border)]" />
    </div>
  );
};
