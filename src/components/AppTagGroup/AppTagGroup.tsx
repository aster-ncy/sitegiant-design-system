import { AppTag, type AppTagType, type AppTagSize } from '../AppTag';

export interface AppTagGroupItem {
  type: AppTagType;
  /** Optional label override. Falls back to the default label for the type. */
  label?: string;
}

export interface AppTagGroupProps {
  /** Tags to render left-to-right. */
  tags: AppTagGroupItem[];
  /** Size applied to every tag in the group. */
  size?: AppTagSize;
  className?: string;
}

export const AppTagGroup = ({
  tags,
  size = 'default',
  className = '',
}: AppTagGroupProps) => {
  return (
    <div
      className={[
        'inline-flex items-center justify-start',
        'gap-[var(--spacing-4)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tags.map((tag, i) => (
        <AppTag key={i} type={tag.type} label={tag.label} size={size} />
      ))}
    </div>
  );
};
