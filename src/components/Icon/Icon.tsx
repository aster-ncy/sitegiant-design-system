import { iconPaths, type IconName } from './iconPaths';

export type { IconName } from './iconPaths';
export { iconNames } from './iconPaths';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /** Icon name from the SiteGiant Core Library */
  name: IconName;
  /** Icon size preset or custom number (px) */
  size?: IconSize | number;
  /** Icon color — uses currentColor by default (inherits from parent) */
  color?: string;
  /** Extra Tailwind/CSS classes */
  className?: string;
  /** Accessible label (renders as aria-label; icon hidden from screen readers if omitted) */
  label?: string;
  /** Click handler */
  onClick?: () => void;
}

/*
 * Figma spec: All icons are 24×24px bounding box with varying internal viewBoxes.
 * Size tokens map to common usage patterns:
 *   xs: 12px  — inline badges, small indicators
 *   sm: 16px  — compact buttons, form fields
 *   md: 20px  — default size, sidebar nav
 *   lg: 24px  — standard icon size (matches Figma 1:1)
 *   xl: 32px  — headers, hero sections
 */
const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * SiteGiant Icon component.
 *
 * Renders inline SVG icons from the Core SiteGiant Library.
 * Icons use `currentColor` for fills, so they inherit text color from parents.
 *
 * @example
 * <Icon name="search" size="md" />
 * <Icon name="plus" size={17} color="var(--button-primary-icon)" />
 */
export const Icon = ({
  name,
  size = 'lg',
  color,
  className = '',
  label,
  onClick,
}: IconProps) => {
  const iconData = iconPaths[name];

  if (!iconData) {
    console.warn(`[Icon] Unknown icon name: "${name}"`);
    return null;
  }

  const px = typeof size === 'number' ? size : sizeMap[size];
  const fillColor = color || 'currentColor';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox}
      width={px}
      height={px}
      className={`shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      fill="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onClick={onClick}
    >
      {iconData.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={iconData.stroke ? 'none' : fillColor}
          stroke={iconData.stroke ? fillColor : undefined}
          strokeWidth={iconData.stroke?.width}
          strokeLinecap={iconData.stroke?.linecap}
          strokeLinejoin={iconData.stroke?.linejoin}
          fillRule={!iconData.stroke && iconData.fillRule === 'evenodd' ? 'evenodd' : undefined}
          clipRule={!iconData.stroke && iconData.fillRule === 'evenodd' ? 'evenodd' : undefined}
        />
      ))}
    </svg>
  );
};
