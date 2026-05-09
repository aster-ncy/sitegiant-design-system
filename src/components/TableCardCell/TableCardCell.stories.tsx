import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { TableCardCell } from './TableCardCell';
import { TableCardCellListing } from './TableCardCellListing';
import type {
  TableCardCellTopVariant,
  TableCardCellBottomVariant,
  TableCardCellMode,
  TableCardCellRow,
} from './TableCardCell';
import type { TableColumnPosition } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Pip } from '../Pip';
import { Toggle } from '../Toggle';
import { Button } from '../Button';
import { NumberInput } from '../NumberInput';
import { Icon } from '../Icon';
import { TextLink } from '../TextLink';
import { ProductImage } from '../ProductImageList';
import { IconButton } from '../TopBar/IconButton';
import shopeeIcon from '../../assets/channel-icons/shopee.png';
import { product1, productImages } from '../../assets/product-images';

const meta = {
  title: 'Tables/Card Table/Cell Atoms',
  component: TableCardCell,
  parameters: {
    layout: 'padded',
    // Honor declaration order in both the Controls panel and the Docs
    // page args table — Storybook defaults to alphabetical otherwise.
    // `tier` is hidden by default because every reference/matrix story
    // is hardcoded to one tier; only the Playground story re-includes
    // it via its own `parameters.controls.exclude` override.
    controls: { sort: 'none', exclude: ['tier'] },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'inline-radio' },
      options: ['default', 'inset'] satisfies ReadonlyArray<'default' | 'inset'>,
      description:
        'Sizing mode. `default` = standard-table padding (pl-24 pr-12 / pb-24 last row); `inset` = inset-table padding (pl-12 pr-6 / pb-12 last row).',
      table: { defaultValue: { summary: 'default' } },
    },
    tier: {
      control: { type: 'inline-radio' },
      options: ['top', 'bottom'] satisfies ReadonlyArray<'top' | 'bottom'>,
      description: 'Discriminated-union tier. Top tier reads `topVariant`; bottom tier reads `bottomVariant` + `row`.',
      table: { defaultValue: { summary: 'top' } },
    },
    topVariant: {
      control: { type: 'select' },
      if: { arg: 'tier', eq: 'top' },
      options: ['default', 'app-icon', 'user-icon', 'status', 'product-image'] satisfies ReadonlyArray<TableCardCellTopVariant>,
      description: [
        'Top-tier content variant — only adjusts the gap between `leadingIcon` and the text span.',
        '',
        '- `default` — 12px gap. No leading icon, or neutral leading element.',
        '- `app-icon` — 4px gap. Pair with a 21px channel/app tile (Shopee, Webstore).',
        '- `user-icon` — 4px gap. Pair with a 21px avatar/initials circle.',
        '- `status` — 12px gap. Type marker for Pip-based top tiers. No layout change vs `default`.',
        '- `product-image` — 12px gap. Type marker for ProductImage-led top tiers. No layout change.',
      ].join('\n'),
      table: { defaultValue: { summary: 'default' } },
    },
    bottomVariant: {
      control: { type: 'select' },
      if: { arg: 'tier', neq: 'top' },
      options: [
        'default',
        'data',
        'listing',
        'status',
        'star-rating',
        'status-toggle',
        'action-button',
        'form-field',
      ] satisfies ReadonlyArray<TableCardCellBottomVariant>,
      description: [
        'Bottom-tier content variant. Most are **type-vocabulary only** (semantic marker; visuals come from caller children). Three variant values change atom layout.',
        '',
        '- `default` — generic body row. No layout side-effects.',
        '- `data` — label-over-value / numeric / currency rows (positive/negative tone lives in children). Type marker only.',
        '- `listing` — product-listing block. Pair with `<TableCardCellListing>` children for Figma 1458:3174. Type marker only.',
        '- `status` — Pip-based status rows (single or stacked). Type marker only.',
        '- `star-rating` — star-rating + review-text rows. Type marker only.',
        '- `status-toggle` — Toggle in `trailing`. **On `column="last"`, padding flips to `pl-12 pr-24`** so the control sits flush right.',
        '- `action-button` — Button / IconButton in `trailing`. Same `column="last"` padding flip as `status-toggle`.',
        '- `form-field` — hosts form controls (NumberInput / Toggle / Button). **Switches alignment to `items-center`** per Figma 3453:7841.',
      ].join('\n'),
      table: { defaultValue: { summary: 'default' } },
    },
    column: {
      control: { type: 'inline-radio' },
      options: ['first', 'center', 'last'] satisfies ReadonlyArray<TableColumnPosition>,
      description:
        'Column position. Drives border + radius placement. **`last` is required to see the `action-button` / `status-toggle` padding flip.**',
      table: { defaultValue: { summary: 'first' } },
    },
    row: {
      control: { type: 'inline-radio' },
      if: { arg: 'tier', neq: 'top' },
      options: ['first', 'middle', 'last'] satisfies ReadonlyArray<TableCardCellRow>,
      description: 'Bottom-tier row position (only meaningful when tier renders a bottom cell). Drives vertical padding + bottom corner radii.',
      table: { defaultValue: { summary: 'first' } },
    },
  },
  args: {
    // Demo cells default to 'default' so the toolbar control starts where Card
    // Tables typically live; toggle to 'inset' to see the compact baseline.
    mode: 'default',
  },
} satisfies Meta<typeof TableCardCell>;

export default meta;
type Story = StoryObj<typeof TableCardCell>;

// Outer card recipe — every story wraps cells in this shell so the
// rounded corners visually close the box.
const cardShell = 'rounded-[var(--radius-4)] overflow-hidden inline-block';

const MatrixLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

const MatrixNote = ({ children }: { children: ReactNode }) => (
  <p className="max-w-[760px] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
    {children}
  </p>
);

// Heavier top-level group label for matrices that have multiple
// nesting levels — distinguishes group boundaries from cell labels.
const MatrixHeading = ({
  children,
  level = 1,
}: {
  children: ReactNode;
  level?: 1 | 2;
}) => (
  <span
    className={[
      'font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]',
      level === 1
        ? 'text-[length:var(--text-16)] leading-[var(--leading-21)]'
        : 'text-[length:var(--text-14)] leading-[var(--leading-17)]',
    ].join(' ')}
  >
    {children}
  </span>
);

const AppIcon = () => (
  <span className="inline-flex size-[21px] items-center justify-center overflow-hidden rounded-[var(--radius-4)]">
    <img src={shopeeIcon} alt="Shopee" className="size-full object-cover" />
  </span>
);

const UserIcon = () => (
  <span className="inline-flex size-[21px] items-center justify-center rounded-full bg-[var(--color-surface-empty-state-placeholder-fill)] text-[length:var(--general-body-large-size)] leading-[var(--general-body-slim-lineheight)] text-[color:var(--text-default-text-primary)]">
    A
  </span>
);

const ProductThumb = () => (
  <ProductImage src={product1} alt="Product" size="md" />
);

const PaperclipIndicator = () => (
  <span className="inline-flex items-center py-[var(--spacing-2)]">
    <Icon name="paperclip" size={17} color="var(--color-icon-secondary)" />
  </span>
);

const TopTierInfoValue = ({
  value = 'Table Body Data',
  info = 'Info:',
}: {
  value?: string;
  info?: string;
}) => (
  <span className="inline-flex min-w-0 items-center gap-[var(--spacing-4)]">
    <span className="inline-flex items-center gap-[var(--spacing-4)] whitespace-nowrap">
      <span className="text-[color:var(--text-default-text-info)]">{info}</span>
      <span>{value}</span>
    </span>
    <span className="shrink-0">
      <PaperclipIndicator />
    </span>
  </span>
);

const TopTierStatus = ({ label = 'Tag Label' }: { label?: string }) => (
  <>
    <span className="text-[color:var(--text-default-text-info)]">{label}</span>
    <Pip type="warning" pipStyle="default" label="Pip Text" />
  </>
);

const TopTierPlusButton = () => (
  <IconButton name="plus" label="Add" variant="default" />
);

const topTierActionCellClass =
  '!h-[45px] !w-[93px] !min-w-[93px] !max-w-[93px] shrink-0 !justify-center !py-[var(--spacing-6)]';

const topTierFirstStoryCellClass = '!h-[45px] !w-[248px] !min-w-[248px] !max-w-[248px] shrink-0';
const topTierCenterStoryCellClass = '!h-[45px] !w-[259px] !min-w-[259px] !max-w-[259px] shrink-0';

const topTierRowShell = 'inline-flex overflow-hidden rounded-t-[var(--radius-4)] group/row';

const TopTierStoryTable = ({ children, width = 248 }: { children: ReactNode; width?: number }) => (
  <div className={cardShell}>
    <table className="border-collapse table-fixed" style={{ width }}>
      <tbody>
        <tr className="group/row">
          <td className="p-0">{children}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TopTierCheckboxFrame = ({
  children,
  width,
}: {
  children: ReactNode;
  width: number;
}) => (
  <div className="inline-flex items-start gap-[var(--spacing-12)] pl-[var(--spacing-24)]" style={{ width }}>
    <span className="inline-flex shrink-0 items-start py-[var(--spacing-14)]">
      <Checkbox size="sm" />
    </span>
    {children}
  </div>
);

const topTierColumnWidth: Record<'first' | 'center' | 'last', string> = {
  first: 'w-[248px]',
  center: 'w-[184px]',
  last: 'w-[220px]',
};

const topTierCellClass = (column: 'first' | 'center' | 'last') => topTierColumnWidth[column];

const topTierVariantCellClass = (type: string, column: 'first' | 'center' | 'last') => {
  if (type === 'App Icon' || type === 'User Icon') {
    return {
      first: 'w-[216px]',
      center: 'w-[151px]',
      last: 'w-[187px]',
    }[column];
  }

  if (type === 'Status') {
    return {
      first: 'w-[217px]',
      center: 'w-[152px]',
      last: 'w-[188px]',
    }[column];
  }

  if (type === 'Product Image') return 'w-[247px]';

  return topTierCellClass(column);
};

const topTierContainerWidth = (type: string, column: 'first' | 'center' | 'last') => {
  if (column !== 'first') return topTierVariantCellClass(type, column);

  if (type === 'App Icon' || type === 'User Icon') return 'w-[163px]';
  if (type === 'Status') return 'w-[164px]';
  if (type === 'Product Image') return 'w-[194px]';
  return 'w-[195px]';
};

const topTierVariantProp = (type: string): TableCardCellTopVariant => {
  if (type === 'App Icon') return 'app-icon';
  if (type === 'User Icon') return 'user-icon';
  if (type === 'Status') return 'status';
  if (type === 'Product Image') return 'product-image';
  return 'default';
};

const topTierContent = (type: string, textState: 'normal' | 'bold' | 'link') => {
  const textClass = `whitespace-nowrap ${textState === 'bold' ? 'font-[var(--font-weight-bold)]' : ''}`;

  if (type === 'Default') {
    return <TopTierInfoValue />;
  }

  if (type === 'App Icon') {
    return <span className={textClass}>Table Body Data</span>;
  }

  if (type === 'User Icon') {
    if (textState === 'link') return <TextLink label="Table Body Data" />;
    return <span className={textClass}>Table Body Data</span>;
  }

  if (type === 'Status') {
    return <TopTierStatus />;
  }

  if (type === 'Product Image') {
    return <span className={textClass}>Table Body Data</span>;
  }

  return null;
};

const topTierLeading = (type: string) => {
  if (type === 'App Icon') return <AppIcon />;
  if (type === 'User Icon') return <UserIcon />;
  if (type === 'Product Image') return <ProductThumb />;
  return undefined;
};

const renderTopTierFigmaCell = ({
  type,
  column,
  hovered = false,
  textState = 'normal',
  mode = 'default',
}: {
  type: string;
  column: 'first' | 'center' | 'last';
  hovered?: boolean;
  textState?: 'normal' | 'bold' | 'link';
  mode?: 'default' | 'inset';
}) => {
  const cell = (
    <TableCardCell
      tier="top"
      column={column}
      hovered={hovered}
      mode={mode}
      topVariant={topTierVariantProp(type)}
      leadingIcon={topTierLeading(type)}
      className={topTierContainerWidth(type, column)}
    >
      {topTierContent(type, textState)}
    </TableCardCell>
  );

  if (column !== 'first' || !['Default', 'App Icon', 'User Icon', 'Status', 'Product Image'].includes(type)) {
    return cell;
  }

  const rootWidth = Number.parseInt(topTierVariantCellClass(type, column).match(/\d+/)?.[0] ?? '248', 10);

  return (
    <TopTierCheckboxFrame width={rootWidth}>
      {cell}
    </TopTierCheckboxFrame>
  );
};

type BottomTierVariant =
  | 'Default'
  | 'Data'
  | 'Listing'
  | 'Status'
  | 'Action Button'
  | 'Star Rating'
  | 'Status Toggle'
  | 'Form Field';

type BottomTierRow = 'first' | 'last';

const bottomTierVariantWidth = (
  type: BottomTierVariant,
  column: 'first' | 'center' | 'last',
  withGutter = false,
) => {
  if (withGutter) {
    if (type === 'Default') return 248;
    if (type === 'Status' && column === 'first') return 223;
    if (type === 'Data' && column === 'first') return 223;
    if (type === 'Star Rating' && column === 'first') return 223;
    if (type === 'Form Field' && column === 'first') return 195;
  }

  if (type === 'Default') {
    return { first: 219, center: 183, last: 219 }[column];
  }

  if (type === 'Data') {
    return { first: 194, center: 158, last: 182 }[column];
  }

  if (type === 'Listing') {
    return { first: 374, center: 374, last: 374 }[column];
  }

  if (type === 'Status') {
    return { first: 194, center: 158, last: 194 }[column];
  }

  if (type === 'Star Rating') {
    return { first: 194, center: 158, last: 194 }[column];
  }

  if (type === 'Status Toggle') {
    return { first: 80, center: 80, last: 104 }[column];
  }

  if (type === 'Form Field') {
    return { first: 166, center: 130, last: 166 }[column];
  }

  return 93;
};

const bottomTierCellHeight = (type: BottomTierVariant, row: BottomTierRow) => {
  if (type === 'Default') return row === 'first' ? 45 : 81;
  if (type === 'Action Button') return row === 'first' ? 57 : 93;
  if (type === 'Status Toggle') return row === 'first' ? 57 : 93;
  if (type === 'Form Field') return row === 'first' ? 45 : 87;
  if (type === 'Data') return 103;
  if (type === 'Listing') return 181;
  if (type === 'Status') return 125;
  if (type === 'Star Rating') return 105;
  return 45;
};

const bottomTierWidthClass = (width: number) => ({
  40: 'w-[40px]',
  51: 'w-[51px]',
  57: 'w-[57px]',
  80: 'w-[80px]',
  93: 'w-[93px]',
  104: 'w-[104px]',
  130: 'w-[130px]',
  142: 'w-[142px]',
  158: 'w-[158px]',
  166: 'w-[166px]',
  170: 'w-[170px]',
  182: 'w-[182px]',
  183: 'w-[183px]',
  194: 'w-[194px]',
  195: 'w-[195px]',
  219: 'w-[219px]',
  321: 'w-[321px]',
  338: 'w-[338px]',
  374: 'w-[374px]',
}[width] ?? 'w-auto');

const bottomTierHeightClass = (height: number) => ({
  45: '!h-[45px]',
  57: '!h-[57px]',
  81: '!h-[81px]',
  87: '!h-[87px]',
  93: '!h-[93px]',
  103: '!h-[103px]',
  105: '!h-[105px]',
  125: '!h-[125px]',
  127: '!h-[127px]',
  181: '!h-[181px]',
}[height] ?? '');

// Standalone bottom-tier wrapper — clips ONLY the bottom corners so the
// cell's own rounded-bl/br on row='last' shows clean while the top
// edge stays square (a bottom tier never paints top corners; rounding
// them via overflow-hidden would be a visual lie).
const BottomTierRecipeFrame = ({
  children,
  width,
}: {
  children: ReactNode;
  width: number;
}) => (
  <div className="overflow-hidden rounded-b-[var(--radius-4)] inline-block">
    <table className="border-collapse table-fixed" style={{ width }}>
      <tbody>
        <tr className="group/row">
          <td className="p-0">{children}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const BottomTierGutterFrame = ({
  children,
  width,
  row,
}: {
  children: ReactNode;
  width: number;
  row: BottomTierRow;
}) => (
  <div
    className={[
      'inline-flex items-start pl-[53px]',
      row === 'last' ? 'pb-[var(--spacing-24)]' : '',
    ].filter(Boolean).join(' ')}
    style={{ width }}
  >
    {children}
  </div>
);

const BottomInfoValue = ({
  value = 'Table Body Data',
  info = 'Info:',
}: {
  value?: string;
  info?: string;
}) => (
  <span className="inline-flex items-center gap-[var(--spacing-8)] whitespace-nowrap">
    <span className="inline-flex items-center gap-[var(--spacing-4)]">
      <span className="text-[color:var(--text-default-text-info)]">{info}</span>
      <span>{value}</span>
    </span>
    <PaperclipIndicator />
  </span>
);

const BottomPlainInfoValue = ({
  value = 'Table Body Data',
  info = 'Info:',
}: {
  value?: string;
  info?: string;
}) => (
  <span className="inline-flex items-center gap-[var(--spacing-4)] whitespace-nowrap">
    <span className="text-[color:var(--text-default-text-info)]">{info}</span>
    <span>{value}</span>
  </span>
);

const BottomDataValue = ({ tone = 'success' }: { tone?: 'success' | 'danger' }) => (
  <div className="flex flex-col gap-[var(--spacing-4)]">
    <BottomPlainInfoValue />
    <span className="inline-flex items-start gap-[var(--spacing-4)]">
      <Icon name="database" size={17} color="var(--color-icon-secondary)" />
      <span
        className={[
          'flex flex-col whitespace-nowrap',
          tone === 'success'
            ? 'text-[color:var(--color-sys-green-DEFAULT)]'
            : 'text-[color:var(--color-sys-red-DEFAULT)]',
        ].join(' ')}
      >
        <span>RM0.00</span>
        <span>0%</span>
      </span>
    </span>
  </div>
);

const BottomStatusValue = ({ count = 1 }: { count?: 1 | 2 }) => (
  <div className="flex flex-col gap-[var(--spacing-4)]">
    <span className="inline-flex items-center gap-[var(--spacing-8)] whitespace-nowrap">
      <span>Tag Label</span>
      <Pip type="warning" pipStyle="default" label="Pip Text" />
    </span>
    {count === 2 && (
      <span className="inline-flex items-center gap-[var(--spacing-8)] whitespace-nowrap">
        <span>Tag Label</span>
        <Pip type="warning" pipStyle="default" label="Pip Text" />
      </span>
    )}
    <span className="inline-flex items-center gap-[var(--spacing-4)] whitespace-nowrap">
      <span className="text-[color:var(--text-default-text-info)]">Info:</span>
      <span>Table Body Data</span>
    </span>
    <TextLink label="Tracking" iconPosition="left" icon={<Icon name="truck" size={15} />} />
  </div>
);

// Half-filled star — single star-full glyph with orange left half and
// grey right half. Layers two stacked star-full icons; the top one is
// grey and clipped to its right half so the orange beneath shows
// through on the left.
const HalfStar = ({ size = 16 }: { size?: number }) => (
  <span
    className="relative inline-flex shrink-0 items-center"
    style={{ width: size, height: size }}
  >
    <Icon name="star-full" size={size} />
    <span
      className="absolute inset-0 inline-flex"
      style={{ clipPath: 'inset(0 0 0 50%)' }}
    >
      <Icon name="star-full" size={size} color="var(--color-space-DEFAULT)" />
    </span>
  </span>
);

const StarRatingValue = () => (
  <span className="flex flex-col items-start gap-[var(--spacing-4)]">
    <span className="inline-flex items-center gap-[2px] text-[color:var(--color-sys-orange-light)]">
      <Icon name="star-full" size={16} />
      <Icon name="star-full" size={16} />
      <Icon name="star-full" size={16} />
      <Icon name="star-full" size={16} />
      <HalfStar size={16} />
    </span>
    <span>Baju dalam keadaan baik. Pembungkusan pun teliti.</span>
  </span>
);

const BottomActionButtonValue = () => (
  <IconButton name="plus" label="Add" variant="basic" />
);

const BottomTierQuantityValue = () => (
  <NumberInput type="stepper" value="1" onChange={() => undefined} className="shrink-0" />
);

const ProductBadge = ({ label = '1' }: { label?: string }) => (
  <span className="absolute left-[-4px] top-[-4px] inline-flex min-w-[16px] items-center justify-center rounded-[var(--radius-20)] bg-[var(--badge-primary-fill)] px-[var(--spacing-6)] py-[var(--spacing-2)] text-center font-[family-name:var(--font-sans)] text-[length:var(--general-badge-size)] leading-[var(--general-badge-lineheight)] text-[color:var(--badge-text)]">
    {label}
  </span>
);

const ListingProductImage = ({ index = 1 }: { index?: number }) => {
  const image = productImages[index] ?? productImages[1];

  return (
    <span className="relative inline-flex shrink-0 overflow-visible">
      <ProductImage
        src={image.src}
        alt={image.alt}
        size="lg"
      />
      <ProductBadge />
    </span>
  );
};

const ListingInfoRow = ({
  label,
  value,
  medium = false,
}: {
  label: string;
  value: string;
  medium?: boolean;
}) => (
  <span className="inline-flex max-w-full items-start gap-[var(--spacing-4)]">
    <span className="shrink-0 whitespace-nowrap text-[color:var(--text-default-text-info)]">{label}</span>
    <span className={['min-w-0 truncate text-[color:var(--text-default-text-primary)]', medium ? 'font-[var(--font-weight-medium)]' : ''].join(' ')}>
      {value}
    </span>
  </span>
);

const ListingProductInfo = () => (
  <span className="flex min-w-0 flex-1 flex-col items-start gap-[var(--spacing-4)]">
    <Pip type="success" pipStyle="default" label="Published" />
    <span className="max-h-[34px] overflow-hidden font-[family-name:var(--font-sans)] text-[length:var(--table-body-size)] font-[var(--font-weight-bold)] leading-[var(--leading-17)] text-[color:var(--text-default-text-primary)]">
      DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs
    </span>
    <span className="flex w-full min-w-0 flex-col gap-[var(--spacing-8)]">
      <span className="flex flex-col gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--general-caption-slim-lineheight)]">
        <ListingInfoRow label="Variant:" value="Red" />
        <ListingInfoRow label="SKU:" value="1902839204" />
      </span>
      <span className="flex flex-col gap-[var(--spacing-4)] text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)]">
        <ListingInfoRow label="Product Property" value="Property (+RM0.00)" medium />
        <ListingInfoRow label="Product Property" value="Property (+RM0.00)" medium />
      </span>
    </span>
  </span>
);

const BottomListingValue = ({ imageIndex = 1 }: { imageIndex?: number }) => (
  <span className="flex w-[338px] items-start gap-[var(--spacing-12)]">
    <span className="shrink-0">
      <ListingProductImage index={imageIndex} />
    </span>
    <ListingProductInfo />
    <span className="shrink-0 whitespace-nowrap pt-[var(--spacing-2)] text-[length:var(--general-caption-small-size)] leading-[var(--general-caption-small-lineheight)] text-[color:var(--text-default-text-primary)]">
      x 1
    </span>
  </span>
);

const BottomListingStackValue = ({
  expanded = false,
  withCheckbox = false,
}: {
  expanded?: boolean;
  withCheckbox?: boolean;
}) => {
  const rows = expanded ? [0, 1, 2, 3] : [0, 1];

  return (
    <span className="flex items-start gap-[var(--spacing-12)]">
      {withCheckbox && (
        <span className="inline-flex shrink-0 pt-[var(--spacing-2)]">
          <Checkbox size="sm" />
        </span>
      )}
      <span className="flex flex-col gap-[var(--spacing-16)]">
        {rows.map((_, index) => (
          <BottomListingValue key={index} imageIndex={(index % productImages.length) as 0 | 1 | 2 | 3 | 4} />
        ))}
        {expanded ? (
          <TextLink
            label="Collapse"
            iconPosition="left"
            icon={<Icon name="minus-square" size={15} />}
            className="ml-[calc(56px+var(--spacing-12))]"
          />
        ) : (
          <TextLink
            label="2 more product(s)"
            iconPosition="left"
            icon={<Icon name="plus-square" size={15} />}
            className="ml-[calc(56px+var(--spacing-12))]"
          />
        )}
      </span>
    </span>
  );
};

const bottomTierVariantProp = (type: BottomTierVariant): TableCardCellBottomVariant => {
  if (type === 'Data') return 'data';
  if (type === 'Listing') return 'listing';
  if (type === 'Status') return 'status';
  if (type === 'Star Rating') return 'star-rating';
  if (type === 'Action Button') return 'action-button';
  if (type === 'Status Toggle') return 'status-toggle';
  if (type === 'Form Field') return 'form-field';
  return 'default';
};

// Shared variant → demo-content map keyed off the canonical prop type
// `TableCardCellBottomVariant`. Both the Figma matrix renderer and the
// Playground story delegate here so a new variant only needs one wiring.
// `listing` is the only variant where callers diverge: the matrix uses
// the legacy 3-column `BottomListingValue` (image + info + "x 1"); the
// Playground uses the canonical `TableCardCellListing` helper. Pass a
// `listing` override to swap.
const bottomVariantContent = (
  variant: TableCardCellBottomVariant,
  overrides?: { listing?: ReactNode },
): ReactNode => {
  if (variant === 'data') return <BottomDataValue tone="success" />;
  if (variant === 'listing') return overrides?.listing ?? <BottomListingValue />;
  if (variant === 'status') return <BottomStatusValue count={1} />;
  if (variant === 'star-rating') return <StarRatingValue />;
  if (variant === 'action-button') return <BottomActionButtonValue />;
  if (variant === 'status-toggle') return <Toggle checked={true} onChange={() => undefined} />;
  if (variant === 'form-field') return <BottomTierQuantityValue />;
  return <BottomInfoValue />;
};

const bottomTierContent = (type: BottomTierVariant) => {
  if (type === 'Default') return <BottomInfoValue />;
  return bottomVariantContent(bottomTierVariantProp(type));
};

const renderBottomTierFigmaCell = ({
  type,
  column,
  row = 'last',
  hovered = false,
  withGutter = false,
  mode = 'default',
}: {
  type: BottomTierVariant;
  column: 'first' | 'center' | 'last';
  row?: BottomTierRow;
  hovered?: boolean;
  withGutter?: boolean;
  mode?: 'default' | 'inset';
}) => {
  const width = bottomTierVariantWidth(type, column, withGutter);
  const contentWidth = withGutter ? width - 53 : width;
  const height = bottomTierCellHeight(type, row);
  const cell = (
    <TableCardCell
      tier="bottom"
      row={row}
      column={column}
      hovered={hovered}
      mode={mode}
      bottomVariant={bottomTierVariantProp(type)}
      className={[
        bottomTierWidthClass(contentWidth),
        bottomTierHeightClass(height),
        type === 'Form Field' ? '!items-center !justify-center !py-[var(--spacing-6)]' : '',
      ].filter(Boolean).join(' ')}
    >
      {bottomTierContent(type)}
    </TableCardCell>
  );

  if (!withGutter) return cell;

  return (
    <BottomTierGutterFrame width={width} row={row}>
      {cell}
    </BottomTierGutterFrame>
  );
};

// ---------------------------------------------------------------------------
// Playground — single live cell driven by Controls panel.
// Exported FIRST so Storybook lands here by default. Lets you flip
// mode / tier / topVariant / bottomVariant / column / row and see the atom
// respond. The matrix stories below render fixed compositions and ignore
// topVariant/bottomVariant; this is the one that actually consumes them.
// ---------------------------------------------------------------------------

type PlaygroundTier = 'top' | 'bottom' | 'bottom-with-top';

type PlaygroundArgs = {
  mode: TableCardCellMode;
  tier: PlaygroundTier;
  topVariant: TableCardCellTopVariant;
  bottomVariant: TableCardCellBottomVariant;
  column: TableColumnPosition;
  row: TableCardCellRow;
};

const playgroundLeadingIcon = (variant: TableCardCellTopVariant): ReactNode => {
  if (variant === 'app-icon') return <AppIcon />;
  if (variant === 'user-icon') return <UserIcon />;
  if (variant === 'product-image') return <ProductThumb />;
  if (variant === 'status') return <Pip type="info" pipStyle="default" label="Status" />;
  return null;
};

const playgroundListingDemo = (
  <TableCardCellListing
    image={<ListingProductImage index={1} />}
    pip={<Pip type="success" pipStyle="default" label="Published" />}
    productName="DYNAMO 4in1 Laundry Capsules — Anti-Bacterial Lavender 35s"
    variant={{ label: 'Variant:', value: 'Lavender 35s' }}
    sku={{ label: 'SKU:', value: '1902839204' }}
    properties={[{ label: 'Product Property', value: 'Property (+RM0.00)' }]}
  />
);

const playgroundBottomChildren = (variant: TableCardCellBottomVariant): ReactNode =>
  bottomVariantContent(variant, { listing: playgroundListingDemo });

/** Live playground — flip every prop and watch the atom respond. Start
 *  here to learn what each variant does, then jump into the matrix
 *  stories below for the full Figma reference compositions. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: {
    // Re-include `tier` for the Playground (meta default excludes it
    // because reference stories are hardcoded to one tier).
    controls: { sort: 'none', exclude: [] },
  },
  argTypes: {
    // Playground-only override: extend tier with a third value that
    // composites a fixed top tier above a live bottom cell. Scoped
    // here (not at meta) so Autodocs doesn't imply the atom accepts
    // 'bottom-with-top' as a real prop value.
    tier: {
      control: { type: 'inline-radio' },
      options: ['top', 'bottom', 'bottom-with-top'] satisfies ReadonlyArray<PlaygroundTier>,
      description: [
        'Which tier(s) to render in the Playground story.',
        '',
        '- `top` — top tier alone (closes naturally with its own borders). Reads `topVariant`.',
        '- `bottom` — bottom tier alone (raw — partial borders, since siblings normally close the box). Reads `bottomVariant` + `row`.',
        '- `bottom-with-top` — fixed top tier above a live bottom cell so the card closes naturally on top. Reads `bottomVariant` + `row`.',
      ].join('\n'),
      table: { defaultValue: { summary: 'top' } },
    },
  },
  args: {
    mode: 'default',
    tier: 'top',
    topVariant: 'app-icon',
    bottomVariant: 'default',
    column: 'first',
    row: 'first',
  },
  render: ({ mode, tier, topVariant, bottomVariant, column, row }) => {
    // Render the cell honestly — borders + corners reflect what the
    // atom paints for the given column/row (single-column slice of a
    // real card). `bottom-with-top` adds a fixed top tier above the
    // bottom cell so the card closes naturally on top; `bottom` alone
    // shows the raw bottom cell with whatever borders the atom paints
    // standalone.
    const wrapWidth = column === 'last' ? 220 : 320;
    return (
      <div className="inline-block" style={{ width: wrapWidth }}>
        <table className="border-collapse w-full table-fixed">
          <tbody>
            {tier === 'top' ? (
              <tr className="group/row">
                <td className="p-0">
                  <TableCardCell
                    tier="top"
                    column={column}
                    mode={mode}
                    topVariant={topVariant}
                    leadingIcon={playgroundLeadingIcon(topVariant)}
                  >
                    Top tier — variant: {topVariant}
                  </TableCardCell>
                </td>
              </tr>
            ) : (
              <>
                {tier === 'bottom-with-top' && (
                  <tr className="group/row">
                    <td className="p-0">
                      <TableCardCell tier="top" column={column} mode={mode} topVariant="default">
                        Top tier (header)
                      </TableCardCell>
                    </td>
                  </tr>
                )}
                <tr className="group/row">
                  <td className="p-0">
                    <TableCardCell
                      tier="bottom"
                      row={row}
                      column={column}
                      mode={mode}
                      bottomVariant={bottomVariant}
                    >
                      {playgroundBottomChildren(bottomVariant)}
                    </TableCardCell>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── Top Tier ────────────────────────────────────────── */

/** Top Tier 3-column row — Default state. Hover the row to see bold
 *  + green text on the first column (parent-driven via `group/row`). */
export const TopTierDefault: Story = {
  render: ({ mode = 'default' }) => (
    <div className={topTierRowShell}>
      <TableCardCell tier="top" column="first" mode={mode} checkbox={<Checkbox size="sm" />} className={topTierFirstStoryCellClass}>
        Product Name Here
      </TableCardCell>
      <TableCardCell tier="top" column="center" mode={mode} className={topTierCenterStoryCellClass}>
        Center cell
      </TableCardCell>
      <TableCardCell
        tier="top"
        column="last"
        mode={mode}
        className={topTierActionCellClass}
      >
        <TopTierPlusButton />
      </TableCardCell>
    </div>
  ),
};

/** Top Tier with `hovered` prop forced — proves the bold-green text
 *  state outside of mouse-hover (useful for visual regression). */
export const TopTierHovered: Story = {
  render: ({ mode = 'default' }) => (
    <div className={topTierRowShell}>
      <TableCardCell tier="top" column="first" mode={mode} hovered className={topTierFirstStoryCellClass}>
        Hovered first
      </TableCardCell>
      <TableCardCell tier="top" column="center" mode={mode} hovered className={topTierCenterStoryCellClass}>
        Hovered center
      </TableCardCell>
      <TableCardCell
        tier="top"
        column="last"
        mode={mode}
        hovered
        className={topTierActionCellClass}
      >
        <TopTierPlusButton />
      </TableCardCell>
    </div>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=Default. */
export const TopTierInfo: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable>
      {renderTopTierFigmaCell({ type: 'Default', column: 'first', mode })}
    </TopTierStoryTable>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=App Icon. */
export const TopTierAppIcon: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable width={216}>
      {renderTopTierFigmaCell({ type: 'App Icon', column: 'first', mode })}
    </TopTierStoryTable>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=User Icon. */
export const TopTierUserIcon: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable width={216}>
      {renderTopTierFigmaCell({ type: 'User Icon', column: 'first', mode })}
    </TopTierStoryTable>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=Status. */
export const TopTierStatusPip: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable width={217}>
      {renderTopTierFigmaCell({ type: 'Status', column: 'first', mode })}
    </TopTierStoryTable>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=Product Image. */
export const TopTierProductImage: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable width={247}>
      {renderTopTierFigmaCell({ type: 'Product Image', column: 'first', mode })}
    </TopTierStoryTable>
  ),
};

/** Figma: Table Row - Card - Top Tier (1432:2527), Type=Action Icon Button. */
export const TopTierAddButton: Story = {
  render: ({ mode = 'default' }) => (
    <TopTierStoryTable width={93}>
      <TableCardCell
        tier="top"
        column="last"
        mode={mode}
        className={topTierActionCellClass}
      >
        <TopTierPlusButton />
      </TableCardCell>
    </TopTierStoryTable>
  ),
};

/** Top Tier with leadingIcon (App Icon / Product Image equivalents). */
export const TopTierWithLeadingIcon: Story = {
  parameters: { layout: 'centered' },
  render: ({ mode = 'default' }) => (
    <div className="flex min-h-[116px] items-center">
      <div className={topTierRowShell}>
        <TableCardCell
          tier="top"
          column="first"
          mode={mode}
          leadingIcon={<AppIcon />}
          className={topTierFirstStoryCellClass}
        >
          Product with icon
        </TableCardCell>
        <TableCardCell tier="top" column="center" mode={mode} className={topTierCenterStoryCellClass}>
          <Pip type="success" pipStyle="default" label="Active" />
        </TableCardCell>
        <TableCardCell
          tier="top"
          column="last"
          mode={mode}
          className={topTierActionCellClass}
        >
          <TopTierPlusButton />
        </TableCardCell>
      </div>
    </div>
  ),
};

/* ── Bottom Tier ─────────────────────────────────────── */

/** Bottom Tier 3-row × 3-column matrix — proves continuous-strip
 *  borders + last-row rounded corners. Hover any row to see fill flip. */
/**
 * Visual matrix for Figma 1432:2527. Use the smaller TopTier* stories
 * above for copyable product code.
 */
export const TopTierFigmaMatrix: Story = {
  tags: ['!dev', 'visual-qa'],
  render: ({ mode = 'default' }) => {
    const columns: Array<'first' | 'center' | 'last'> = ['first', 'center', 'last'];
    const defaultRows = [
      { label: 'Default', hovered: false },
      { label: 'Hover', hovered: true },
    ];
    const iconRows = [
      { label: 'Default', hovered: false, textState: 'normal' as const },
      { label: 'Hover', hovered: true, textState: 'bold' as const },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use TopTierInfo, TopTierAppIcon, TopTierUserIcon, TopTierStatusPip, TopTierProductImage, or TopTierAddButton for copyable product code.
        </MatrixNote>

        <div className="grid grid-cols-[112px_1fr] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-12)]">
          <MatrixLabel>Default</MatrixLabel>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
              {columns.map((column) => (
                <MatrixLabel key={column}>{column} column</MatrixLabel>
              ))}
            </div>
            {defaultRows.map(({ label, hovered }) => (
              <div key={label} className="grid grid-cols-[72px_1fr] items-start gap-x-[var(--spacing-12)]">
                <MatrixLabel>{label}</MatrixLabel>
                <div className={cardShell}>
                  <table className="border-collapse table-fixed w-[720px]">
                    <tbody>
                      <tr className="group/row">
                        {columns.map((column) => (
                          <td key={column} className="p-0">
                            {renderTopTierFigmaCell({ type: 'Default', column, hovered, mode })}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {(['App Icon', 'User Icon'] as const).map((type) => (
            <div key={type} className="contents">
              <MatrixLabel>{type}</MatrixLabel>
              <div className="flex flex-col gap-[var(--spacing-12)]">
                <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
                  {columns.map((column) => (
                    <MatrixLabel key={column}>{column} column</MatrixLabel>
                  ))}
                </div>
                {iconRows.map(({ label, hovered, textState }) => (
                  <div key={label} className="grid grid-cols-[72px_1fr] items-start gap-x-[var(--spacing-12)]">
                    <MatrixLabel>{label}</MatrixLabel>
                    <div className={cardShell}>
                      <table className="border-collapse table-fixed w-[720px]">
                        <tbody>
                          <tr className="group/row">
                            {columns.map((column) => (
                              <td key={column} className="p-0">
                                {renderTopTierFigmaCell({ type, column, hovered, textState, mode })}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
                {type === 'User Icon' && (
                  <div className="grid grid-cols-[72px_1fr] items-start gap-x-[var(--spacing-12)]">
                    <MatrixLabel>Text link</MatrixLabel>
                    <div className={cardShell}>
                      <table className="border-collapse table-fixed w-[720px]">
                        <tbody>
                          <tr>
                            {columns.map((column) => (
                              <td key={column} className="p-0">
                                {renderTopTierFigmaCell({ type, column, textState: 'link', mode })}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <MatrixLabel>Status</MatrixLabel>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <div className="grid grid-cols-3 gap-[var(--spacing-16)]">
              {columns.map((column) => (
                <MatrixLabel key={column}>{column} column</MatrixLabel>
              ))}
            </div>
            <div className="grid grid-cols-[72px_1fr] items-start gap-x-[var(--spacing-12)]">
              <MatrixLabel>Default</MatrixLabel>
              <div className={cardShell}>
                <table className="border-collapse table-fixed w-[720px]">
                  <tbody>
                    <tr>
                      {columns.map((column) => (
                        <td key={column} className="p-0">
                          {renderTopTierFigmaCell({ type: 'Status', column, mode })}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <MatrixLabel>Product Image</MatrixLabel>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <div className="grid grid-cols-2 gap-[var(--spacing-16)]">
              {(['Normal weight', 'Bold weight'] as const).map((label) => (
                <MatrixLabel key={label}>{label}</MatrixLabel>
              ))}
            </div>
            <div className={cardShell}>
              <table className="border-collapse table-fixed w-[520px]">
                <tbody>
                  <tr>
                    {(['normal', 'bold'] as const).map((textState) => (
                      <td key={textState} className="p-0">
                        {renderTopTierFigmaCell({ type: 'Product Image', column: 'first', textState, mode })}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <MatrixLabel>Action Icon Button</MatrixLabel>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <MatrixLabel>Last column</MatrixLabel>
            <TopTierStoryTable width={93}>
              <TableCardCell
                tier="top"
                column="last"
                className={topTierActionCellClass}
              >
                <TopTierPlusButton />
              </TableCardCell>
            </TopTierStoryTable>
          </div>
        </div>
      </div>
    );
  },
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Default. */
export const BottomTierInfo: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={248}>
      {renderBottomTierFigmaCell({ type: 'Default', column: 'first', row: 'first', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Default, Row Sorting=Last Row. */
export const BottomTierInfoLastRow: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={248}>
      {renderBottomTierFigmaCell({ type: 'Default', column: 'first', row: 'last', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Data. */
export const BottomTierData: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={223}>
      {renderBottomTierFigmaCell({ type: 'Data', column: 'first', row: 'last', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: _Table Row - Bottom Tier - Listing (1458:3174), collapsed item content. */
export const BottomTierListing: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={374}>
      {renderBottomTierFigmaCell({ type: 'Listing', column: 'first', row: 'last', mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier Listing matrix (1445:2740), expanded list. */
export const BottomTierListingExpanded: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={427}>
      <TableCardCell
        tier="bottom"
        row="last"
        column="first"
        mode={mode}
        bottomVariant="listing"
        className="!h-auto !min-h-[640px] !w-[427px] !items-start"
      >
        <BottomListingStackValue expanded withCheckbox />
      </TableCardCell>
    </BottomTierRecipeFrame>
  ),
};

/** Visual matrix for Figma 1445:2740. Hidden from default docs/navigation. */
export const BottomTierListingMatrix: Story = {
  tags: ['!dev', 'visual-qa'],
  render: ({ mode = 'default' }) => {
    const columns: Array<'first' | 'center'> = ['first', 'center'];
    const states = [
      { label: 'Default', hovered: false },
      { label: 'Hover', hovered: true },
    ];
    const expansionModes = [
      { label: 'Collapse', expanded: false },
      { label: 'Expand', expanded: true },
    ];
    const checkboxOptions = [
      { label: 'with Checkbox', withCheckbox: true },
      { label: 'without Checkbox', withCheckbox: false },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use BottomTierListing or BottomTierListingExpanded for copyable product code.
        </MatrixNote>
        {expansionModes.map((expansion) => (
          <div key={expansion.label} className="flex flex-col gap-[var(--spacing-16)]">
            <MatrixHeading level={1}>{expansion.label}</MatrixHeading>
            {states.map((state) => (
              <div key={state.label} className="flex flex-col gap-[var(--spacing-12)]">
                <MatrixHeading level={2}>{state.label}</MatrixHeading>
                <div className="grid grid-cols-2 gap-[var(--spacing-24)]">
                  {columns.map((column) => (
                    <div key={column} className="flex flex-col gap-[var(--spacing-12)]">
                      <MatrixLabel>{column} column</MatrixLabel>
                      {checkboxOptions.map((option) => (
                        <div key={option.label} className="flex flex-col gap-[var(--spacing-4)]">
                          <MatrixLabel>{option.label}</MatrixLabel>
                          <BottomTierRecipeFrame width={option.withCheckbox ? 427 : 374}>
                            <TableCardCell
                              tier="bottom"
                              row="last"
                              column={column}
                              hovered={state.hovered}
                              mode={mode}
                              bottomVariant="listing"
                              className={[
                                '!h-auto',
                                expansion.expanded ? '!min-h-[640px]' : '!min-h-[181px]',
                                option.withCheckbox ? '!w-[427px]' : '!w-[374px]',
                                '!items-start',
                              ].join(' ')}
                            >
                              {expansion.expanded || option.withCheckbox ? (
                                <BottomListingStackValue expanded={expansion.expanded} withCheckbox={option.withCheckbox} />
                              ) : (
                                <BottomListingValue />
                              )}
                            </TableCardCell>
                          </BottomTierRecipeFrame>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Status. */
export const BottomTierStatusPip: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={223}>
      {renderBottomTierFigmaCell({ type: 'Status', column: 'first', row: 'last', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Action Button. */
export const BottomTierActionButton: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={93}>
      {renderBottomTierFigmaCell({ type: 'Action Button', column: 'last', row: 'last', mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Star Rating. */
export const BottomTierStarRating: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={223}>
      {renderBottomTierFigmaCell({ type: 'Star Rating', column: 'first', row: 'last', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Status Toggle. */
export const BottomTierStatusToggle: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={104}>
      {renderBottomTierFigmaCell({ type: 'Status Toggle', column: 'last', row: 'first', mode })}
    </BottomTierRecipeFrame>
  ),
};

/** Figma: Table Row - Card - Bottom Tier (1438:4957), Type=Form Field. */
export const BottomTierQuantityField: Story = {
  render: ({ mode = 'default' }) => (
    <BottomTierRecipeFrame width={195}>
      {renderBottomTierFigmaCell({ type: 'Form Field', column: 'first', row: 'first', withGutter: true, mode })}
    </BottomTierRecipeFrame>
  ),
};

export const BottomTierMatrix: Story = {
  render: ({ mode = 'default' }) => {
    const rows: Array<'first' | 'middle' | 'last'> = ['first', 'middle', 'last'];
    return (
      <div className={cardShell}>
        <table className="border-collapse table-fixed w-[600px]">
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="group/row">
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="first" mode={mode}>
                    {row} first
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="center" mode={mode}>
                    {row} center
                  </TableCardCell>
                </td>
                <td className="p-0">
                  <TableCardCell tier="bottom" row={row} column="last" mode={mode}>
                    {row} last
                  </TableCardCell>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** Bottom Tier hosting form controls — `bottomVariant="form-field"`
 *  centres NumberInput / Toggle / Button vertically in the cell. */
export const BottomTierFormControls: Story = {
  render: ({ mode = 'default' }) => (
    <div className={cardShell}>
      <table className="border-collapse table-fixed w-[600px]">
        <tbody>
          <tr className="group/row">
            <td className="p-0">
              <TableCardCell tier="bottom" row="first" column="first" mode={mode} bottomVariant="form-field">
                <NumberInput value="1" onChange={() => undefined} />
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="first"
                column="center"
                mode={mode}
                bottomVariant="form-field"
                trailing={<Toggle checked={true} onChange={() => undefined} />}
              />
            </td>
            <td className="p-0">
              <TableCardCell
                tier="bottom"
                row="last"
                column="last"
                mode={mode}
                bottomVariant="form-field"
                trailing={<Button variant="primary" size="sm" label="Save" />}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Visual matrix for Figma 1438:4957. Use the smaller BottomTier*
 * stories above for copyable product code.
 */
export const BottomTierFigmaMatrix: Story = {
  tags: ['!dev', 'visual-qa'],
  render: ({ mode = 'default' }) => {
    const columns: Array<'first' | 'center' | 'last'> = ['first', 'center', 'last'];
    const states = [
      { label: 'Default', hovered: false },
      { label: 'Hover', hovered: true },
    ];
    const variants: Array<{
      label: string;
      type: BottomTierVariant;
      row: BottomTierRow;
      columns: Array<'first' | 'center' | 'last'>;
      withFirstGutter?: boolean;
    }> = [
      { label: 'Default / First Row', type: 'Default', row: 'first', columns, withFirstGutter: true },
      { label: 'Default / Last Row', type: 'Default', row: 'last', columns, withFirstGutter: true },
      { label: 'Data', type: 'Data', row: 'last', columns, withFirstGutter: true },
      { label: 'Status', type: 'Status', row: 'last', columns, withFirstGutter: true },
      { label: 'Action Button', type: 'Action Button', row: 'last', columns: ['last'] },
      { label: 'Star Rating', type: 'Star Rating', row: 'last', columns, withFirstGutter: true },
      { label: 'Status Toggle / First Row', type: 'Status Toggle', row: 'first', columns: ['center', 'last'] },
      { label: 'Status Toggle / Last Row', type: 'Status Toggle', row: 'last', columns: ['center', 'last'] },
      { label: 'Form Field / First Row', type: 'Form Field', row: 'first', columns, withFirstGutter: true },
      { label: 'Form Field / Last Row', type: 'Form Field', row: 'last', columns, withFirstGutter: true },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use BottomTierInfo, BottomTierData, BottomTierStatusPip, BottomTierActionButton, BottomTierStarRating, BottomTierStatusToggle, or BottomTierQuantityField for copyable product code.
        </MatrixNote>
        {variants.map((variant) => (
          <div key={variant.label} className="flex flex-col gap-[var(--spacing-8)]">
            <MatrixLabel>{variant.label}</MatrixLabel>
            <div className="grid grid-cols-[90px_1fr] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-12)]">
              <div />
              <div className="flex gap-[var(--spacing-16)]">
                {variant.columns.map((column) => (
                  <MatrixLabel key={column}>{column} column</MatrixLabel>
                ))}
              </div>
              {states.map(({ label, hovered }) => (
                <div key={label} className="contents">
                  <MatrixLabel>{label}</MatrixLabel>
                  <div className={cardShell}>
                    <table className="border-collapse table-fixed">
                      <tbody>
                        <tr className="group/row">
                          {variant.columns.map((column) => (
                            <td key={column} className="p-0">
                              {renderBottomTierFigmaCell({
                                type: variant.type,
                                column,
                                row: variant.row,
                                hovered,
                                withGutter: column === 'first' && variant.withFirstGutter,
                                mode,
                              })}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
