import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type TypographyType =
  | 'section-title'
  | 'section-small-title'
  | 'display'
  | 'display-small'
  | 'heading'
  | 'body-large'
  | 'body'
  | 'body-medium'
  | 'body-bold'
  | 'body-slim'
  | 'body-medium-slim'
  | 'body-bold-slim'
  | 'caption'
  | 'caption-slim'
  | 'caption-small'
  | 'caption-medium-small'
  | 'caption-medium-slim'
  | 'caption-large'
  | 'caption-larger';

export type TypographyState =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'muted'
  | 'basic'
  | 'success'
  | 'danger'
  | 'alert'
  | 'warning'
  | 'on-dark'
  | 'inherit';

export type TypographyLang = 'en' | 'tc' | 'sc';

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  /** Default 'body'. */
  type?: TypographyType;
  /** Color/state. Default 'primary'. */
  state?: TypographyState;
  /** Italic — only meaningful with Body or Body Slim. Default false. */
  italic?: boolean;
  /** Language → font-family. 'en' = Roboto, 'tc' = Noto Sans TC, 'sc' = Noto Sans SC. Default 'en'. */
  lang?: TypographyLang;
  /** Render-as element. Default 'span'. */
  as?: ElementType;
  children: ReactNode;
  /** REPLACES (not appends) the built-in classes. */
  className?: string;
}

// Type → CSS-class chain. Each chain pulls Figma-named --general-* tokens which
// alias the underlying --text-/--leading-/--font-weight- primitives.
// Tailwind v4 type hints required: `text-[length:...]` for size, `leading-[...]`
// for line-height, `font-[weight:...]` for weight.
const TYPE_CLASSES: Record<TypographyType, string> = {
  'section-title':
    'text-[length:var(--general-section-large-title-size)] leading-[var(--general-section-large-title-lineheight)] font-[weight:var(--general-section-large-title-weight)]',
  'section-small-title':
    'text-[length:var(--general-section-title-size)] leading-[var(--general-section-title-lineheight)] font-[weight:var(--general-section-title-weight)]',
  display:
    'text-[length:var(--general-display-size)] leading-[var(--general-display-lineheight)] font-[weight:var(--general-display-weight)]',
  'display-small':
    'text-[length:var(--general-display-small-size)] leading-[var(--general-display-small-lineheight)] font-[weight:var(--general-display-small-weight)]',
  heading:
    'text-[length:var(--general-heading-size)] leading-[var(--general-heading-lineheight)] font-[weight:var(--general-heading-weight)]',
  'body-large':
    'text-[length:var(--general-body-large-size)] leading-[var(--general-body-large-lineheight)] font-[weight:var(--general-body-weight)]',
  body: 'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] font-[weight:var(--general-body-weight)]',
  'body-medium':
    'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] font-[weight:var(--general-body-medium-weight)]',
  'body-bold':
    'text-[length:var(--general-body-size)] leading-[var(--general-body-lineheight)] font-[weight:var(--general-body-bold-weight)]',
  'body-slim':
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)] font-[weight:var(--general-body-weight)]',
  'body-medium-slim':
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)] font-[weight:var(--general-body-medium-weight)]',
  'body-bold-slim':
    'text-[length:var(--general-body-size)] leading-[var(--general-body-slim-lineheight)] font-[weight:var(--general-body-bold-weight)]',
  caption:
    'text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] font-[weight:var(--general-caption-weight)]',
  'caption-slim':
    'text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)] font-[weight:var(--general-caption-weight)]',
  'caption-small':
    'text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)] font-[weight:var(--general-caption-weight)]',
  'caption-medium-small':
    'text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)] font-[weight:var(--general-caption-medium-weight)]',
  'caption-medium-slim':
    'text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)] font-[weight:var(--general-caption-medium-weight)]',
  'caption-large':
    'text-[length:var(--general-caption-large-size)] leading-[var(--general-caption-large-lineheight)] font-[weight:var(--general-caption-weight)]',
  'caption-larger':
    'text-[length:var(--general-caption-larger-size)] leading-[var(--general-caption-larger-lineheight)] font-[weight:var(--general-caption-weight)]',
};

const STATE_CLASSES: Record<TypographyState, string> = {
  primary: 'text-[color:var(--color-text-primary)]',
  secondary: 'text-[color:var(--color-text-secondary)]',
  info: 'text-[color:var(--color-text-info)]',
  muted: 'text-[color:var(--color-text-muted)]',
  basic: 'text-[color:var(--color-text-basic)]',
  success: 'text-[color:var(--color-text-success)]',
  danger: 'text-[color:var(--color-text-danger)]',
  alert: 'text-[color:var(--color-text-alert)]',
  warning: 'text-[color:var(--color-text-warning)]',
  'on-dark': 'text-[color:var(--color-text-ondark)]',
  // 'inherit' contributes no color class — color cascades from parent.
  // Use this when wrapping Typography inside a component that owns its own
  // color/hover/state logic (e.g. TextLink, Button) and just needs the
  // size/leading/weight from the typography scale.
  inherit: '',
};

const LANG_CLASSES: Record<TypographyLang, string> = {
  en: 'font-[family-name:var(--font-sans)]',
  tc: 'font-[family-name:var(--font-tc)]',
  sc: 'font-[family-name:var(--font-sc)]',
};

/**
 * Typography — Figma: [EN]/[繁中]/[简中] Text (2338:4549, 2338:4551, 2338:4553).
 *
 * Single canonical text component. 19 type scales × 10 color states (plus
 * `inherit` for parent-driven color) × 3 languages, all driven by
 * --general-* and --color-text-* tokens. The `italic` flag works with
 * body/body-slim variants per Figma's "Body Italic" and "Body Italic Slim"
 * Type axis.
 *
 * Renders a `<span>` by default; pass `as` to override the element while
 * keeping the typography (e.g. `<Typography as="h2" type="section-small-title">`).
 */
export const Typography = ({
  type = 'body',
  state = 'primary',
  italic = false,
  lang = 'en',
  as: Component = 'span',
  children,
  className,
  ...rest
}: TypographyProps) => {
  const builtin = [
    LANG_CLASSES[lang],
    TYPE_CLASSES[type],
    STATE_CLASSES[state],
    italic ? 'italic' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const classes = className || builtin;
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
