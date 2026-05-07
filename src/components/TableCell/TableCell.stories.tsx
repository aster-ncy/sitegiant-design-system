import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell } from './TableCell';
import { TableCellInfo } from './TableCellInfo';
import { TableCellMainSub } from './TableCellMainSub';
import { TableCellListing } from './TableCellListing';
import { useState, type ReactNode } from 'react';
import { TableHeaderCell, sortDirectionToAria } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { Pip } from '../Pip';
import { TableExpandToggle } from '../TableExpandToggle';
import { NumberInput } from '../NumberInput';
import { Quantity, type QuantityState, type QuantityValidation } from '../Quantity';
import { TextLink } from '../TextLink';
import { IconLink } from '../IconLink';
import { Toggle } from '../Toggle';
import { ProductImage } from '../ProductImageList/ProductImage';
import { ProductImageList } from '../ProductImageList';
import sitegiantWebstore from '../../assets/channel-icons/sitegiant-webstore.png';
import shopee from '../../assets/channel-icons/shopee.png';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import { productImages } from '../../assets/product-images';
import sitegiantDemoApp from '../../assets/method-images/sitegiant-demo-app.png';

const meta = {
  title: 'Tables/TableCell',
  component: TableCell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    column: { control: 'inline-radio', options: ['first', 'center', 'last'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    weight: { control: 'inline-radio', options: ['normal', 'bold'] },
    tone: { control: 'inline-radio', options: ['default', 'success', 'danger'] },
    row: { control: 'inline-radio', options: ['first', 'middle', 'last'] },
    hovered: { control: 'boolean' },
  },
  args: {
    children: 'Table Body Data',
  },
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;
type ProductOnlyStory = StoryObj<React.ComponentProps<typeof TableCell> & { productCount?: 1 | 2 | 3 | 4 | 6 }>;
type TagRecipeStory = StoryObj<React.ComponentProps<typeof TableCell> & { tagCount?: 1 | 2 | 3 }>;
type ActionTextLinkStory = StoryObj<React.ComponentProps<typeof TableCell> & { actionCount?: 1 | 2 | 3 | 4 }>;
type ActionIconButtonStory = StoryObj<React.ComponentProps<typeof TableCell> & { actionCount?: 1 | 2 | 3 }>;
type IconStatusStory = StoryObj<React.ComponentProps<typeof TableCell> & { statusCount?: 1 | 2 | 3 }>;
type TextInfoStory = StoryObj<React.ComponentProps<typeof TableCell> & { textWeight?: 'normal' | 'bold' }>;
type DefaultInfoStory = StoryObj<React.ComponentProps<typeof TableCell> & {
  alignment?: 'horizontal' | 'vertical';
  statusCount?: 1 | 2 | 3;
  paragraphCount?: 1 | 2 | 3;
}>;

const recipeOnlyControls = {
  children: { table: { disable: true } },
  inset: { table: { disable: true } },
  column: { table: { disable: true } },
  align: { table: { disable: true } },
  weight: { table: { disable: true } },
  tone: { table: { disable: true } },
  boldOnRowHover: { table: { disable: true } },
  row: { table: { disable: true } },
  hovered: { table: { disable: true } },
  selected: { table: { disable: true } },
  subrow: { table: { disable: true } },
  checkbox: { table: { disable: true } },
  leadingIcon: { table: { disable: true } },
  trailing: { table: { disable: true } },
  className: { table: { disable: true } },
};

const productOnlySource = (count: 1 | 2 | 3 | 4 | 6) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="first" checkbox={<Checkbox size="sm" />}>
  <ProductImageList
    size="md"
    items={productImages.slice(0, ${count})}
    maxVisible={${count} > 4 ? 4 : undefined}
  />
</TableCell>
  </td>
</tr>`;

const tagSource = (order: 'after' | 'first', count: 1 | 2 | 3) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="center">
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {Array.from({ length: ${count} }).map((_, index) => (
      <span key={index} className="inline-flex items-center gap-[var(--spacing-8)]">
        ${order === 'first' ? '<Pip type="warning" pipStyle="default" label="Pip Text" />\n        ' : ''}<span className="font-[family-name:var(--general-font-family)] text-[length:var(--table-body-size)] font-[var(--font-weight-regular)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-primary)]">
          Tag Label{${count} > 1 ? \` \${index + 1}\` : ''}
        </span>
        ${order === 'after' ? '<Pip type="warning" pipStyle="default" label="Pip Text" />' : ''}
      </span>
    ))}
  </span>
</TableCell>
  </td>
</tr>`;

const actionLinksSource = (count: 1 | 2 | 3 | 4) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="last" className="!items-start">
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {Array.from({ length: ${count} }).map((_, index) => (
      <TextLink
        key={index}
        label="Button"
        iconPosition="left"
        icon={<Icon name="plus" size={17} />}
      />
    ))}
  </span>
</TableCell>
  </td>
</tr>`;

const actionIconsSource = (count: 1 | 2 | 3) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="last">
  <span className="inline-flex items-center gap-[var(--spacing-12)]">
    {Array.from({ length: ${count} }).map((_, index) => (
      <IconLink
        key={index}
        icon="plus"
        aria-label={\`Action \${index + 1}\`}
        showTooltip={false}
      />
    ))}
  </span>
</TableCell>
  </td>
</tr>`;

const iconStatusSource = (count: 1 | 2 | 3) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="center">
  <span className="inline-flex items-start gap-[var(--spacing-4)]">
    <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
      {Array.from({ length: ${count} }).map((_, index) => (
        <span key={index} className="text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--table-body-text)]">
          Status Label{${count} > 1 ? \` \${index + 1}\` : ''}
        </span>
      ))}
    </span>
    <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
      {Array.from({ length: ${count} }).map((_, index) => (
        <span key={index} className="inline-flex h-[var(--table-body-lineheight)] items-center py-[var(--spacing-2)]">
          <Icon name="check" size={17} className="text-[color:var(--table-body-text)]" />
        </span>
      ))}
    </span>
  </span>
</TableCell>
  </td>
</tr>`;

const statusToggleSource = `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="center">
  <Toggle checked />
</TableCell>
  </td>
</tr>`;

const textInfoSource = (textWeight: 'normal' | 'bold') => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="first" checkbox={<Checkbox size="sm" />}>
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    <span className="${textWeight === 'bold' ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]'} text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--table-body-text)]">
      Table Body Data
    </span>
    <span className="inline-flex items-center gap-[var(--spacing-4)]">
      <img src={shopeeMy} alt="" className="size-[17px] rounded-[var(--radius-2)] object-cover" />
      <span className="text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] text-[color:var(--color-text-info)]">
        Info
      </span>
    </span>
  </span>
</TableCell>
  </td>
</tr>`;

const defaultInfoSource = (
  alignment: 'horizontal' | 'vertical',
  statusCount: 1 | 2 | 3,
  paragraphCount: 1 | 2 | 3,
) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="center" className="!items-start">
  <TableCellInfo
    ${alignment === 'vertical' ? 'alignment="vertical"\n    ' : ''}statuses={[
${Array.from({ length: statusCount }).map((_, index) => {
  const label = index === 0 ? 'Status Label' : `Status Label ${index + 1}`;
  return `      { label: '${label}', body: 'Long Info Long Info Long Info Long Info ', maxLines: ${paragraphCount} }`;
}).join(',\n')}
    ]}
  />
</TableCell>
  </td>
</tr>`;

const defaultListingSource = (column: 'first' | 'center') => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="${column}">
  <TableCellListing
    ${column === 'first' ? 'checkbox={<Checkbox size="sm" />}\n    ' : ''}image={<ProductImage size="lg" src={productImages[1].src} alt={productImages[1].alt} />}
    tag={<Pip type="success" pipStyle="default" label="Published" />}
    productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
    infoRows={[
      { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
      { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
    ]}
    extras={
      <>
        <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
          <img src={sitegiantWebstore} alt="" aria-hidden="true" width={15} height={15} className="shrink-0 rounded-[var(--radius-4)]" />
          Webstore
        </span>
        <button type="button" className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)]">
          <Icon name="plus-square" size={15} />
          5 more SKUs
        </button>
      </>
    }
  />
</TableCell>
  </td>
</tr>`;

const channelIconSource = `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="first" checkbox={<Checkbox size="sm" />}>
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <img src={shopee} alt="" className="size-[48px] rounded-[var(--radius-12)] object-cover" />
    <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
      <span className="font-[var(--font-weight-bold)] text-[length:var(--table-body-size)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
        Awesome Store
      </span>
      <span className="inline-flex flex-col gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)]">
        <span className="text-[color:var(--color-text-info)]">Shopee</span>
        <span className="text-[color:var(--color-text-primary)]">Malaysia</span>
      </span>
    </span>
  </span>
</TableCell>
  </td>
</tr>`;

const paymentShippingMethodSource = `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="first" checkbox={<Checkbox size="sm" />}>
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <span className="inline-flex h-[48px] w-[120px] shrink-0 overflow-hidden rounded-[var(--radius-4)] border border-[color:var(--product-image-border)]">
      <img src={sitegiantDemoApp} alt="" className="h-full w-full object-cover" />
    </span>
    <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
      <span className="font-[var(--font-weight-bold)] text-[length:var(--table-body-size)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
        Awesome Store
      </span>
      <span className="inline-flex flex-col gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)]">
        <span className="text-[color:var(--color-text-info)]">Shopee</span>
        <span className="text-[color:var(--color-text-primary)]">Malaysia</span>
      </span>
    </span>
  </span>
</TableCell>
  </td>
</tr>`;

const formFieldSource = (column: 'first' | 'center' | 'last') => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell
      column="${column}"
      checkbox={<Checkbox size="sm" />}
      className="${column === 'first' ? '!pl-[var(--spacing-12)] !pr-[var(--spacing-6)]' : column === 'last' ? '!pl-[var(--spacing-6)] !pr-[var(--spacing-24)]' : ''}"
    >
  <NumberInput type="stepper" value="1" onChange={() => undefined} />
</TableCell>
  </td>
</tr>`;

const tagWithChannelSource = (column: 'center' | 'last') => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="${column}">
  <span className="inline-flex flex-col items-start gap-[var(--spacing-8)]">
    <span className="inline-flex flex-col items-start">
      <span className="text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-info)]">
        Tag Label
      </span>
      <span className="py-[var(--spacing-2)]">
        <Pip type="warning" pipStyle="default" label="Pip Text" />
      </span>
    </span>
    <span className="inline-flex flex-col items-start">
      <span className="text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-info)]">
        Tag Label 2
      </span>
      <span className="py-[var(--spacing-2)]">
        <Pip type="warning" pipStyle="default" label="Pip Text" />
      </span>
    </span>
    <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
      <img src={sitegiantWebstore} alt="" aria-hidden="true" width={15} height={15} className="shrink-0 rounded-[var(--radius-4)]" />
      Company Name
    </span>
  </span>
</TableCell>
  </td>
</tr>`;

const defaultHoverRowClass = 'group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]';

const RowHoverPreview = ({
  children,
}: {
  children: ReactNode;
}) => (
  <table className="border-collapse table-fixed w-full">
    <tbody>
      <tr className={defaultHoverRowClass}>
        <td className="p-0">
          {children}
        </td>
      </tr>
    </tbody>
  </table>
);

export const Default: Story = {};

export const Bold: Story = {
  args: { weight: 'bold' },
};

export const Hovered: Story = {
  args: { hovered: true },
};

export const NumberRightAligned: Story = {
  args: { children: '123,456', align: 'right', column: 'center' },
};

export const SuccessValue: Story = {
  args: { children: '+24.5%', tone: 'success', align: 'right', column: 'last' },
};

export const DangerValue: Story = {
  args: { children: '-12.8%', tone: 'danger', align: 'right', column: 'last' },
};

export const FirstColumnWithCheckbox: Story = {
  args: {
    column: 'first',
    children: 'Product name',
    checkbox: <Checkbox size="sm" />,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Categorized item',
    leadingIcon: <Icon name="check" size={17} className="text-[color:var(--color-icon-secondary)]" />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: '12.5 kg',
    align: 'right',
    column: 'last',
    trailing: <Icon name="alert-triangle" size={17} className="text-[color:var(--color-sys-yellow-DEFAULT)]" />,
  },
};

export const LastRow: Story = {
  args: { row: 'last' },
};

/* ── Composite: a small table ────────────────────────── */
const Cell = ({ children, ...rest }: React.ComponentProps<typeof TableCell>) => (
  <td className="p-0">
    <TableCell {...rest}>{children}</TableCell>
  </td>
);

const insetColumns = ['first', 'center', 'last'] as const;
const insetRows = ['middle', 'last'] as const;
const insetStates = [
  { label: 'Default', hovered: false },
  { label: 'Hover', hovered: true },
] as const;

const InsetStoryFrame = ({ children }: { children: ReactNode }) => (
  <div className="max-w-full overflow-x-auto rounded-[var(--radius-4)]">
    <div className="inline-block min-w-max">
      {children}
    </div>
  </div>
);

const MatrixLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

const MatrixNote = ({ children }: { children: ReactNode }) => (
  <p className="max-w-[720px] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
    {children}
  </p>
);

const defaultColumns = ['first', 'center', 'last'] as const;
const defaultRows = ['middle', 'last'] as const;
const defaultStates = [
  { label: 'Default', hovered: false },
  { label: 'Hover', hovered: true },
] as const;
const defaultAlignments = ['left', 'center', 'right'] as const;

const ShopeeIcon = () => (
  <img src={shopeeMy} alt="" className="w-[21px] h-[21px] rounded-[var(--radius-2)] object-cover" />
);

const ActionLinks = ({ count }: { count: 1 | 2 | 3 | 4 }) => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {Array.from({ length: count }).map((_, index) => (
      <TextLink
        key={index}
        label="Button"
        iconPosition="left"
        icon={<Icon name="plus" size={17} />}
      />
    ))}
  </span>
);

const ActionIcons = ({ count }: { count: 1 | 2 | 3 }) => (
  <span className="inline-flex items-center gap-[var(--spacing-12)]">
    {Array.from({ length: count }).map((_, index) => (
      <IconLink
        key={index}
        icon="plus"
        aria-label={`Action ${index + 1}`}
        showTooltip={false}
        className="inline-flex items-center justify-center text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)]"
      />
    ))}
  </span>
);

const TagPair = ({ order = 'after', count = 1 }: { order?: 'first' | 'after'; count?: 1 | 2 | 3 }) => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {Array.from({ length: count }).map((_, index) => (
      <span key={index} className="inline-flex items-center gap-[var(--spacing-8)]">
        {order === 'first' && <Pip type="warning" pipStyle="default" label="Pip Text" />}
        <span className="font-[family-name:var(--general-font-family)] text-[length:var(--table-body-size)] font-[var(--font-weight-regular)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-primary)]">
          Tag Label{count > 1 ? ` ${index + 1}` : ''}
        </span>
        {order === 'after' && <Pip type="warning" pipStyle="default" label="Pip Text" />}
      </span>
    ))}
  </span>
);

const ProductOnlyContent = ({ count }: { count: 1 | 2 | 3 | 4 | 6 }) => (
  <ProductImageList
    size="md"
    items={Array.from({ length: count }, (_, index) => productImages[index % productImages.length])}
    maxVisible={count > 4 ? 4 : undefined}
  />
);

const IconStatus = ({ count }: { count: 1 | 2 | 3 }) => (
  <span className="inline-flex items-start gap-[var(--spacing-4)]">
    <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="whitespace-nowrap text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--table-body-text)]"
        >
          Status Label{count > 1 ? ` ${index + 1}` : ''}
        </span>
      ))}
    </span>
    <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="inline-flex h-[var(--table-body-lineheight)] items-center py-[var(--spacing-2)]">
          <Icon name="check" size={17} className="text-[color:var(--table-body-text)]" />
        </span>
      ))}
    </span>
  </span>
);

const StatusToggleCell = () => <Toggle checked />;

const TextInfoContent = ({ textWeight = 'normal' }: { textWeight?: 'normal' | 'bold' }) => (
  <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
    <span
      className={[
        'max-w-full truncate text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--table-body-text)]',
        textWeight === 'bold' ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
      ].join(' ')}
    >
      Table Body Data
    </span>
    <span className="inline-flex items-center gap-[var(--spacing-4)]">
      <img src={shopeeMy} alt="" className="size-[17px] rounded-[var(--radius-2)] object-cover" />
      <span className="whitespace-nowrap text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] text-[color:var(--color-text-info)]">
        Info
      </span>
    </span>
  </span>
);

const ListingExtras = () => (
  <>
    <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
      <img
        src={sitegiantWebstore}
        alt=""
        aria-hidden="true"
        width={15}
        height={15}
        className="shrink-0 block rounded-[var(--radius-4)]"
      />
      Webstore
    </span>
    <button
      type="button"
      className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)] cursor-pointer"
    >
      <Icon name="plus-square" size={15} />
      5 more SKUs
    </button>
  </>
);

const DefaultListingContent = ({ showCheckbox = true }: { showCheckbox?: boolean }) => (
  <TableCellListing
    checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
    image={<ProductImage size="lg" src={productImages[1].src} alt={productImages[1].alt} />}
    tag={<Pip type="success" pipStyle="default" label="Published" />}
    productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
    infoRows={[
      { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
      { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
    ]}
    extras={<ListingExtras />}
  />
);

const StoreMeta = () => (
  <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
    <span className="max-w-full truncate font-[var(--font-weight-bold)] text-[length:var(--table-body-size)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
      Awesome Store
    </span>
    <span className="inline-flex flex-col gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)]">
      <span className="text-[color:var(--color-text-info)]">Shopee</span>
      <span className="text-[color:var(--color-text-primary)]">Malaysia</span>
    </span>
  </span>
);

const ChannelIconContent = () => (
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <img src={shopee} alt="" className="size-[48px] shrink-0 rounded-[var(--radius-12)] object-cover" />
    <StoreMeta />
  </span>
);

const PaymentShippingMethodContent = () => (
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <span className="inline-flex h-[48px] w-[120px] shrink-0 overflow-hidden rounded-[var(--radius-4)] border border-[color:var(--product-image-border)]">
      <img src={sitegiantDemoApp} alt="" className="h-full w-full object-cover" />
    </span>
    <StoreMeta />
  </span>
);

const formFieldColumnClass = (column: 'first' | 'center' | 'last') =>
  column === 'first'
    ? '!pl-[var(--spacing-12)] !pr-[var(--spacing-6)]'
    : column === 'last'
      ? '!pl-[var(--spacing-6)] !pr-[var(--spacing-24)]'
      : '';

const FormFieldContent = () => (
  <NumberInput type="stepper" value="1" onChange={() => undefined} />
);

const TagWithChannelContent = () => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-8)]">
    <span className="inline-flex flex-col items-start">
      <span className="whitespace-nowrap text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-info)]">
        Tag Label
      </span>
      <span className="py-[var(--spacing-2)]">
        <Pip type="warning" pipStyle="default" label="Pip Text" />
      </span>
    </span>
    <span className="inline-flex flex-col items-start">
      <span className="whitespace-nowrap text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-info)]">
        Tag Label 2
      </span>
      <span className="py-[var(--spacing-2)]">
        <Pip type="warning" pipStyle="default" label="Pip Text" />
      </span>
    </span>
    <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
      <img
        src={sitegiantWebstore}
        alt=""
        aria-hidden="true"
        width={15}
        height={15}
        className="shrink-0 rounded-[var(--radius-4)]"
      />
      Company Name
    </span>
  </span>
);

type InsetProgressStatus = 'default' | 'progress' | 'error' | 'success';

const InsetProgress = ({ status }: { status: InsetProgressStatus }) => {
  const fillClass = status === 'error'
    ? 'bg-[var(--color-sys-red-DEFAULT)]'
    : status === 'progress'
      ? 'bg-[var(--color-sys-blue-DEFAULT)]'
      : status === 'success'
        ? 'bg-[var(--color-sys-green-DEFAULT)]'
        : 'bg-[var(--color-space-mid)]';
  const widthClass = status === 'default' ? 'w-full' : status === 'progress' ? 'w-[48%]' : 'w-full';

  return (
    <span className="inline-flex items-center gap-[var(--spacing-4)]">
      <span className="inline-flex h-[var(--spacing-6)] w-[40px] items-center rounded-[var(--radius-120)] bg-[var(--color-space-mid)] overflow-hidden">
        <span className={['block h-full rounded-[var(--radius-120)]', fillClass, widthClass].join(' ')} />
      </span>
      <Icon
        name={status === 'success' ? 'check-circle' : status === 'error' ? 'close-circle' : 'refresh-cw'}
        size={15}
        className={status === 'success'
          ? 'text-[color:var(--color-sys-green-DEFAULT)]'
          : status === 'error'
            ? 'text-[color:var(--color-sys-red-DEFAULT)]'
            : 'text-[color:var(--color-icon-secondary)]'}
      />
    </span>
  );
};

const TextListing = ({
  titleWeight = 'bold',
  paragraphCount = 1,
}: {
  titleWeight?: 'regular' | 'bold';
  paragraphCount?: 1 | 2 | 3;
}) => (
  <span className="flex min-w-0 flex-col gap-[var(--spacing-2)] items-start">
    <span
      className={[
        'max-w-full truncate text-[length:var(--table-body-size)] leading-[var(--leading-17)]',
        titleWeight === 'bold' ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
        'text-[color:var(--color-text-primary)]',
      ].join(' ')}
    >
      Title
    </span>
    <span className="flex min-w-0 flex-col text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] text-[color:var(--color-text-secondary)]">
      {Array.from({ length: paragraphCount }).map((_, index) => (
        <span key={index} className="block max-w-full truncate">
          Long info Long info Long info Long info
        </span>
      ))}
    </span>
  </span>
);

/* ── Inset variant ──────────────────────────────────── */

/**
 * Figma parity matrix: Table Row (973:1745), text data property.
 * Visual check only. Use Default, Bold, FirstColumnWithCheckbox, or the
 * args controls for copyable product code.
 */
export const DefaultTextMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const weights = ['normal', 'bold'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This Figma node is already represented by TableCell; use the smaller copyable stories for product code.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {defaultColumns.map((column) => (
                  <th key={column} className="p-0" colSpan={weights.length}>
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="p-0" />
                {defaultColumns.flatMap((column) =>
                  weights.map((weight) => (
                    <th key={`${column}-${weight}`} className="p-0 w-[132px]">
                      <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                        <MatrixLabel>{weight === 'bold' ? 'Bold' : 'Normal'}</MatrixLabel>
                      </div>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {defaultColumns.flatMap((column) =>
                      weights.map((weight) => (
                        <Cell
                          key={`${column}-${weight}`}
                          row={row}
                          column={column}
                          weight={weight}
                          hovered={hovered}
                          checkbox={<Checkbox size="sm" />}
                        >
                          Table Body Data
                        </Cell>
                      )),
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row (973:1745), number data property.
 * Visual check only. Use NumberRightAligned, SuccessValue, DangerValue,
 * or the args controls for copyable product code.
 */
export const DefaultNumberMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const weights = ['normal', 'bold'] as const;
    const tones = ['default', 'success', 'danger'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. This covers number alignment, semantic tone, weight, row position, and hover from Figma node 973:1745.
        </MatrixNote>
        {tones.map((tone) => (
          <div key={tone} className="flex flex-col gap-[var(--spacing-12)]">
            <MatrixLabel>{tone === 'default' ? 'Default number' : `${tone} number`}</MatrixLabel>
            {defaultColumns.map((column) => (
              <div key={`${tone}-${column}`} className="flex flex-col gap-[var(--spacing-4)]">
                <MatrixLabel>{column} column</MatrixLabel>
                <InsetStoryFrame>
                  <table className="border-collapse table-fixed">
                    <thead>
                      <tr>
                        <th className="p-0 w-[120px]" />
                        {defaultAlignments.flatMap((align) =>
                          weights.map((weight) => (
                            <th key={`${align}-${weight}`} className="p-0 w-[112px]">
                              <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                                <MatrixLabel>{align} / {weight === 'bold' ? 'bold' : 'normal'}</MatrixLabel>
                              </div>
                            </th>
                          )),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {defaultRows.flatMap((row) =>
                        defaultStates.map(({ label, hovered }) => (
                          <tr key={`${tone}-${column}-${row}-${label}`}>
                            <td className="p-0 align-top">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                                <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                              </div>
                            </td>
                            {defaultAlignments.flatMap((align) =>
                              weights.map((weight) => (
                                <Cell
                                  key={`${align}-${weight}`}
                                  row={row}
                                  column={column}
                                  align={align}
                                  weight={weight}
                                  tone={tone}
                                  hovered={hovered}
                                  checkbox={<Checkbox size="sm" />}
                                >
                                  {tone === 'success' ? '+24.5%' : tone === 'danger' ? '-12.8%' : '1,234.00'}
                                </Cell>
                              )),
                            )}
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </InsetStoryFrame>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Copyable recipe: default table row cell that contains only product
 * thumbnails. Figma: Table Row - Product only (1262:9694).
 */
export const ProductOnly: ProductOnlyStory = {
  argTypes: {
    ...recipeOnlyControls,
    productCount: { control: 'inline-radio', options: [1, 2, 3, 4, 6] },
  },
  args: {
    productCount: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for product-only cells. Use the Product Count control to preview 1, 2, 3, 4, or 4+ products.',
      },
      source: {
        code: productOnlySource(6),
      },
    },
  },
  render: ({ productCount = 6 }) => (
    <RowHoverPreview>
      <TableCell column="first" checkbox={<Checkbox size="sm" />}>
        <ProductOnlyContent count={productCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row cell with a label followed by stacked
 * warning pips. Figma: Table Row - Tag (1262:9699), Type=Tag after.
 */
export const TagAfter: TagRecipeStory = {
  argTypes: {
    ...recipeOnlyControls,
    tagCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    tagCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for label text followed by a warning pip. Use the Tag Count control to preview stacked tag rows.',
      },
      source: {
        code: tagSource('after', 1),
      },
    },
  },
  render: ({ tagCount = 1 }) => (
    <RowHoverPreview>
      <TableCell column="center">
        <TagPair order="after" count={tagCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row cell with stacked warning pips before
 * the label. Figma: Table Row - Tag (1262:9699), Type=Tag first.
 */
export const TagFirst: TagRecipeStory = {
  argTypes: {
    ...recipeOnlyControls,
    tagCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    tagCount: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for warning pip before the label. Use the Tag Count control to preview stacked tag rows.',
      },
      source: {
        code: tagSource('first', 1),
      },
    },
  },
  render: ({ tagCount = 1 }) => (
    <RowHoverPreview>
      <TableCell column="center">
        <TagPair order="first" count={tagCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row action cell with text-link actions.
 * Figma: Table Row - Action Button (1262:9930), Type=Text Link.
 */
export const ActionTextLinks: ActionTextLinkStory = {
  argTypes: {
    ...recipeOnlyControls,
    actionCount: { control: 'inline-radio', options: [1, 2, 3, 4] },
  },
  args: {
    actionCount: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for stacked text-link actions. Use the Action Count control to preview 1 to 4 actions.',
      },
      source: {
        code: actionLinksSource(2),
      },
    },
  },
  render: ({ actionCount = 2 }) => (
    <RowHoverPreview>
      <TableCell column="last" className="!items-start">
        <ActionLinks count={actionCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row action cell with icon-only actions.
 * Figma: Table Row - Action Button (1262:9930), Type=Icon.
 */
export const ActionIconButtons: ActionIconButtonStory = {
  argTypes: {
    ...recipeOnlyControls,
    actionCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    actionCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for icon-only actions. Use the Action Count control to preview 1 to 3 actions.',
      },
      source: {
        code: actionIconsSource(3),
      },
    },
  },
  render: ({ actionCount = 3 }) => (
    <RowHoverPreview>
      <TableCell column="last">
        <ActionIcons count={actionCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row status cell with stacked labels and
 * check icons. Figma: Table Row - Icon Status (1263:3455).
 */
export const IconStatusCell: IconStatusStory = {
  name: 'Icon Status',
  argTypes: {
    ...recipeOnlyControls,
    statusCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    statusCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for one to three status labels with matching check icons.',
      },
      source: {
        code: iconStatusSource(3),
      },
    },
  },
  render: ({ statusCount = 3 }) => (
    <RowHoverPreview>
      <TableCell column="center">
        <IconStatus count={statusCount} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row cell with a checked status toggle.
 * Figma: Table Row - Status Toggle (2071:5717).
 */
export const StatusToggle: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for a checked status toggle inside a default table row cell.',
      },
      source: {
        code: statusToggleSource,
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="center">
        <StatusToggleCell />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: first-column text cell with checkbox, primary data,
 * and secondary app info. Figma: Table Row - Text Info (3019:8701).
 */
export const TextInfo: TextInfoStory = {
  argTypes: {
    ...recipeOnlyControls,
    textWeight: { control: 'inline-radio', options: ['normal', 'bold'] },
  },
  args: {
    textWeight: 'normal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for checkbox + body text + secondary app info. Use Text Weight to preview normal or bold primary text.',
      },
      source: {
        code: textInfoSource('normal'),
      },
    },
  },
  render: ({ textWeight = 'normal' }) => (
    <RowHoverPreview>
      <TableCell column="first" checkbox={<Checkbox size="sm" />}>
        <TextInfoContent textWeight={textWeight} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row product listing cell.
 * Figma: Table Row - Listing (1262:9931), Column Sorting=First Column.
 */
export const DefaultListing: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for the default table product listing row: product image, published pip, product identifiers, channel, and more-SKUs link.',
      },
      source: {
        code: defaultListingSource('first'),
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="first">
        <DefaultListingContent />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: center-column version of the default table row listing.
 * Figma: Table Row - Listing (1262:9931), Column Sorting=Center Column.
 */
export const DefaultListingCenter: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for the center-column default listing cell.',
      },
      source: {
        code: defaultListingSource('center'),
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="center">
        <DefaultListingContent showCheckbox={false} />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row channel icon cell.
 * Figma: Table Row - Channel Icon (2670:17908).
 */
export const ChannelIcon: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for a channel/store cell with row checkbox, 48px Shopee icon, store name, marketplace, and country.',
      },
      source: {
        code: channelIconSource,
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="first" checkbox={<Checkbox size="sm" />}>
        <ChannelIconContent />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row payment/shipping method cell.
 * Figma: Table Row - Payment & Shipping Method (3256:9922).
 */
export const PaymentShippingMethod: Story = {
  name: 'Payment & Shipping Method',
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for a payment/shipping method cell with a wide method logo and store metadata.',
      },
      source: {
        code: paymentShippingMethodSource,
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="first" checkbox={<Checkbox size="sm" />}>
        <PaymentShippingMethodContent />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row form-field cell with row checkbox
 * and compact quantity stepper. Figma: Table Row - Form field (3251:9609).
 */
export const FormField: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for a checkbox + quantity stepper inside a default table row cell.',
      },
      source: {
        code: formFieldSource('first'),
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="first" checkbox={<Checkbox size="sm" />} className={formFieldColumnClass('first')}>
        <FormFieldContent />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Copyable recipe: default table row tag stack with channel metadata.
 * Figma: Table Row - Tag with Channel (3789:7967).
 */
export const TagWithChannel: Story = {
  argTypes: {
    ...recipeOnlyControls,
  },
  parameters: {
    docs: {
      description: {
        story: 'Copyable recipe for two tag-label rows followed by channel/company metadata.',
      },
      source: {
        code: tagWithChannelSource('center'),
      },
    },
  },
  render: () => (
    <RowHoverPreview>
      <TableCell column="center">
        <TagWithChannelContent />
      </TableCell>
    </RowHoverPreview>
  ),
};

/**
 * Figma parity matrix: Table Row - Form field (3251:9609).
 * Visual check only. Use FormField for copyable product code.
 */
export const FormFieldMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <MatrixNote>
        Visual check only. This covers form-field column position, row position, and hover from Figma node 3251:9609.
      </MatrixNote>
      <InsetStoryFrame>
        <table className="border-collapse table-fixed">
          <thead>
            <tr>
              <th className="p-0 w-[120px]" />
              {defaultColumns.map((column) => (
                <th key={column} className="p-0 w-[180px]">
                  <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                    <MatrixLabel>{column} column</MatrixLabel>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {defaultRows.flatMap((row) =>
              defaultStates.map(({ label, hovered }) => (
                <tr key={`${row}-${label}`}>
                  <td className="p-0 align-top">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                      <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                    </div>
                  </td>
                  {defaultColumns.map((column) => (
                    <Cell
                      key={column}
                      row={row}
                      column={column}
                      hovered={hovered}
                      checkbox={<Checkbox size="sm" />}
                      className={formFieldColumnClass(column)}
                    >
                      <FormFieldContent />
                    </Cell>
                  ))}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </InsetStoryFrame>
    </div>
  ),
};

/**
 * Figma parity matrix: Table Row - Tag with Channel (3789:7967).
 * Visual check only. Use TagWithChannel for copyable product code.
 */
export const TagWithChannelMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers tag-with-channel column position, row position, and hover from Figma node 3789:7967.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {columns.map((column) => (
                  <th key={column} className="p-0 w-[170px]">
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {columns.map((column) => (
                      <Cell key={column} row={row} column={column} hovered={hovered}>
                        <TagWithChannelContent />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Listing (1262:9931).
 * Visual check only. Use DefaultListing or DefaultListingCenter for copyable product code.
 */
export const DefaultListingMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const columns = ['first', 'center'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers default-row listing column position, row position, and hover from Figma node 1262:9931.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {columns.map((column) => (
                  <th key={column} className="p-0 w-[430px]">
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {columns.map((column) => (
                      <Cell key={column} row={row} column={column} hovered={hovered}>
                        <DefaultListingContent showCheckbox={column === 'first'} />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Channel Icon (2670:17908).
 * Visual check only. Use ChannelIcon for copyable product code.
 */
export const ChannelIconMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <MatrixNote>
        Visual check only. This covers channel icon row position and hover from Figma node 2670:17908.
      </MatrixNote>
      <InsetStoryFrame>
        <table className="border-collapse table-fixed">
          <thead>
            <tr>
              <th className="p-0 w-[120px]" />
              <th className="p-0 w-[310px]">
                <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                  <MatrixLabel>first column</MatrixLabel>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {defaultRows.flatMap((row) =>
              defaultStates.map(({ label, hovered }) => (
                <tr key={`${row}-${label}`}>
                  <td className="p-0 align-top">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                      <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                    </div>
                  </td>
                  <Cell row={row} column="first" hovered={hovered} checkbox={<Checkbox size="sm" />}>
                    <ChannelIconContent />
                  </Cell>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </InsetStoryFrame>
    </div>
  ),
};

/**
 * Figma parity matrix: Table Row - Payment & Shipping Method (3256:9922).
 * Visual check only. Use PaymentShippingMethod for copyable product code.
 */
export const PaymentShippingMethodMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <MatrixNote>
        Visual check only. This covers payment/shipping method row position and hover from Figma node 3256:9922.
      </MatrixNote>
      <InsetStoryFrame>
        <table className="border-collapse table-fixed">
          <thead>
            <tr>
              <th className="p-0 w-[120px]" />
              <th className="p-0 w-[360px]">
                <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                  <MatrixLabel>first column</MatrixLabel>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {defaultRows.flatMap((row) =>
              defaultStates.map(({ label, hovered }) => (
                <tr key={`${row}-${label}`}>
                  <td className="p-0 align-top">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                      <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                    </div>
                  </td>
                  <Cell row={row} column="first" hovered={hovered} checkbox={<Checkbox size="sm" />}>
                    <PaymentShippingMethodContent />
                  </Cell>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </InsetStoryFrame>
    </div>
  ),
};

/**
 * Figma parity matrix: Table Row - Product only (1262:9694).
 * Visual check only. Use ProductOnly for copyable product code.
 */
export const ProductOnlyMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const productCounts = [
      { label: '4+ products', count: 6 },
      { label: '4 products', count: 4 },
      { label: '3 products', count: 3 },
      { label: '2 products', count: 2 },
      { label: '1 product', count: 1 },
    ] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers product count, row position, and hover from Figma node 1262:9694.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {productCounts.map(({ label }) => (
                  <th key={label} className="p-0 w-[300px]">
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{label}</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {productCounts.map(({ label: countLabel, count }) => (
                      <Cell key={countLabel} row={row} column="first" hovered={hovered} checkbox={<Checkbox size="sm" />}>
                        <ProductOnlyContent count={count} />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Tag (1262:9699).
 * Visual check only. Use TagAfter or TagFirst for copyable product code.
 */
export const TagMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const orders = ['after', 'first'] as const;
    const counts = [1, 2, 3] as const;
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. This covers tag order, tag count, column position, row position, and hover from Figma node 1262:9699.
        </MatrixNote>
        {orders.map((order) => (
          <div key={order} className="flex flex-col gap-[var(--spacing-12)]">
            <MatrixLabel>{order === 'after' ? 'Tag after' : 'Tag first'}</MatrixLabel>
            <InsetStoryFrame>
              <table className="border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="p-0 w-[120px]" />
                    {counts.flatMap((count) =>
                      columns.map((column) => (
                        <th key={`${count}-${column}`} className="p-0 w-[180px]">
                          <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                            <MatrixLabel>{count} tag / {column}</MatrixLabel>
                          </div>
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {defaultRows.flatMap((row) =>
                    defaultStates.map(({ label, hovered }) => (
                      <tr key={`${order}-${row}-${label}`}>
                        <td className="p-0 align-top">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                            <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                          </div>
                        </td>
                        {counts.flatMap((count) =>
                          columns.map((column) => (
                            <Cell key={`${count}-${column}`} row={row} column={column} hovered={hovered}>
                              <TagPair order={order} count={count} />
                            </Cell>
                          )),
                        )}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </InsetStoryFrame>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Icon Status (1263:3455).
 * Visual check only. Use IconStatus for copyable product code.
 */
export const IconStatusMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const counts = [1, 2, 3] as const;
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers icon-status count, column position, row position, and hover from Figma node 1263:3455.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {counts.flatMap((count) =>
                  columns.map((column) => (
                    <th key={`${count}-${column}`} className="p-0 w-[190px]">
                      <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                        <MatrixLabel>{count} status / {column}</MatrixLabel>
                      </div>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {counts.flatMap((count) =>
                      columns.map((column) => (
                        <Cell key={`${count}-${column}`} row={row} column={column} hovered={hovered}>
                          <IconStatus count={count} />
                        </Cell>
                      )),
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Status Toggle (2071:5717).
 * Visual check only. Use StatusToggle for copyable product code.
 */
export const StatusToggleMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers toggle column position, row position, and hover from Figma node 2071:5717.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {columns.map((column) => (
                  <th key={column} className="p-0 w-[140px]">
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {columns.map((column) => (
                      <Cell key={column} row={row} column={column} hovered={hovered}>
                        <StatusToggleCell />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Text Info (3019:8701).
 * Visual check only. Use TextInfo for copyable product code.
 */
export const TextInfoMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const weights = ['normal', 'bold'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. This covers text-info column position, weight, row position, and hover from Figma node 3019:8701.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {defaultColumns.map((column) => (
                  <th key={column} className="p-0" colSpan={weights.length}>
                    <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="p-0" />
                {defaultColumns.flatMap((column) =>
                  weights.map((weight) => (
                    <th key={`${column}-${weight}`} className="p-0 w-[210px]">
                      <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                        <MatrixLabel>{weight === 'bold' ? 'Bold' : 'Normal'}</MatrixLabel>
                      </div>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {defaultRows.flatMap((row) =>
                defaultStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {defaultColumns.flatMap((column) =>
                      weights.map((weight) => (
                        <Cell key={`${column}-${weight}`} row={row} column={column} hovered={hovered} checkbox={<Checkbox size="sm" />}>
                          <TextInfoContent textWeight={weight} />
                        </Cell>
                      )),
                    )}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: Table Row - Action Button (1262:9930).
 * Visual check only. Use ActionTextLinks or ActionIconButtons for copyable product code.
 */
export const ActionButtonMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const linkCounts = [1, 2, 3, 4] as const;
    const iconCounts = [1, 2, 3] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. This covers text-link and icon action cells across count, row position, and hover from Figma node 1262:9930.
        </MatrixNote>
        <div className="flex flex-col gap-[var(--spacing-12)]">
          <MatrixLabel>Text Link</MatrixLabel>
          <InsetStoryFrame>
            <table className="border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="p-0 w-[120px]" />
                  {linkCounts.map((count) => (
                    <th key={count} className="p-0 w-[150px]">
                      <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                        <MatrixLabel>{count} action</MatrixLabel>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {defaultRows.flatMap((row) =>
                  defaultStates.map(({ label, hovered }) => (
                    <tr key={`links-${row}-${label}`}>
                      <td className="p-0 align-top">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                          <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                        </div>
                      </td>
                      {linkCounts.map((count) => (
                        <Cell key={count} row={row} column="last" hovered={hovered} className="!items-start">
                          <ActionLinks count={count} />
                        </Cell>
                      ))}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </InsetStoryFrame>
        </div>
        <div className="flex flex-col gap-[var(--spacing-12)]">
          <MatrixLabel>Icon</MatrixLabel>
          <InsetStoryFrame>
            <table className="border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="p-0 w-[120px]" />
                  {iconCounts.map((count) => (
                    <th key={count} className="p-0 w-[180px]">
                      <div className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-left">
                        <MatrixLabel>{count} action</MatrixLabel>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {defaultRows.flatMap((row) =>
                  defaultStates.map(({ label, hovered }) => (
                    <tr key={`icons-${row}-${label}`}>
                      <td className="p-0 align-top">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-24)]">
                          <MatrixLabel>{row === 'last' ? 'Last row' : 'First row'} / {label}</MatrixLabel>
                        </div>
                      </td>
                      {iconCounts.map((count) => (
                        <Cell key={count} row={row} column="last" hovered={hovered}>
                          <ActionIcons count={count} />
                        </Cell>
                      ))}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </InsetStoryFrame>
        </div>
      </div>
    );
  },
};
export const Inset: Story = {
  args: { inset: true, children: 'Inset cell value' },
};

export const InsetBold: Story = {
  args: { inset: true, weight: 'bold', children: 'Inset bold' },
};

export const InsetHovered: Story = {
  args: { inset: true, hovered: true, children: 'Inset hover' },
};

/**
 * Copyable recipe: use this when an inset table cell needs a compact
 * quantity stepper with a row checkbox.
 */
export const InsetFormField: Story = {
  render: () => (
    <TableCell inset column="first" checkbox={<Checkbox size="sm" />}>
      <NumberInput type="stepper" value="1" onChange={() => undefined} />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this when an inset table cell needs an icon-only
 * value beside a row checkbox.
 */
export const InsetIcon: Story = {
  render: () => (
    <TableCell inset column="first" checkbox={<Checkbox size="sm" />}>
      <Icon name="info" size={17} className="text-[color:var(--color-icon-secondary)]" />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this when the last inset table column contains
 * one or more stacked text-link actions.
 */
export const InsetActionLinks: Story = {
  render: () => (
    <TableCell inset column="last" className="!items-start !pr-[var(--spacing-12)]">
      <ActionLinks count={2} />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this when the last inset table column contains
 * icon-only actions in a row.
 */
export const InsetActionIcons: Story = {
  render: () => (
    <TableCell inset column="last" className="!items-start !pr-[var(--spacing-12)]">
      <ActionIcons count={3} />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this for the expand/collapse trigger cell in an
 * inset table row.
 */
export const InsetExpandable: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TableCell inset column="center" align="center">
        <TableExpandToggle expanded={expanded} onToggle={setExpanded} />
      </TableCell>
    );
  },
};

/**
 * Copyable recipe: use this for a plain text value in an inset table row.
 */
export const InsetTextValue: Story = {
  args: {
    inset: true,
    column: 'first',
    children: 'Inset text value',
  },
};

/**
 * Copyable recipe: use this for a numeric value in an inset table row.
 */
export const InsetNumberValue: Story = {
  args: {
    inset: true,
    column: 'last',
    align: 'right',
    children: '1,234.00',
  },
};

/**
 * Copyable recipe: use this for a positive semantic value in an inset
 * table row.
 */
export const InsetSuccessValue: Story = {
  args: {
    inset: true,
    column: 'center',
    tone: 'success',
    children: '+24.5%',
  },
};

/**
 * Copyable recipe: use this for a negative semantic value in an inset
 * table row.
 */
export const InsetDangerValue: Story = {
  args: {
    inset: true,
    column: 'center',
    tone: 'danger',
    children: '-12.8%',
  },
};

/**
 * Copyable recipe: use this when an inset row cell needs label text with
 * a status pip after the label.
 */
export const InsetTagAfter: Story = {
  render: () => (
    <TableCell inset column="center">
      <TagPair order="after" />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this when the pip should lead the tag label.
 */
export const InsetTagFirst: Story = {
  render: () => (
    <TableCell inset column="center">
      <TagPair order="first" />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this for the status toggle cell in an inset row.
 */
export const InsetStatusToggle: Story = {
  render: () => (
    <TableCell inset column="center">
      <Toggle checked />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this for compact row progress with a status icon.
 */
export const InsetProgressStatus: Story = {
  render: () => (
    <TableCell inset column="center">
      <InsetProgress status="success" />
    </TableCell>
  ),
};

/**
 * Figma parity matrix: use this to check text and number visual variants
 * across row position, hover state, font weight, tone, and alignment.
 * Do not copy this full story into product code.
 */
export const InsetTextNumberMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const weights = ['normal', 'bold'] as const;
    const tones = ['default', 'success', 'danger'] as const;
    const alignments = ['left', 'center', 'right'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        {weights.map((weight) => (
          <div key={weight} className="flex flex-col gap-[var(--spacing-8)]">
            <MatrixLabel>{weight === 'bold' ? 'Bold' : 'Default'} weight</MatrixLabel>
            <InsetStoryFrame>
              <table className="border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="p-0 w-[120px]" />
                    {tones.map((tone) => (
                      <th key={tone} className="p-0 w-[130px]">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                          <MatrixLabel>Text / {tone}</MatrixLabel>
                        </div>
                      </th>
                    ))}
                    {alignments.map((align) => (
                      <th key={align} className="p-0 w-[130px]">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                          <MatrixLabel>Number / {align}</MatrixLabel>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insetRows.flatMap((row) =>
                    insetStates.map(({ label, hovered }) => (
                      <tr key={`${weight}-${row}-${label}`}>
                        <td className="p-0 align-top">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                            <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                          </div>
                        </td>
                        {tones.map((tone) => (
                          <Cell
                            key={tone}
                            inset
                            row={row}
                            column="first"
                            weight={weight}
                            tone={tone}
                            hovered={hovered}
                          >
                            {tone === 'success' ? '+24.5%' : tone === 'danger' ? '-12.8%' : 'Text value'}
                          </Cell>
                        ))}
                        {alignments.map((align) => (
                          <Cell
                            key={align}
                            inset
                            row={row}
                            column={align === 'right' ? 'last' : 'center'}
                            align={align}
                            weight={weight}
                            hovered={hovered}
                          >
                            1,234.00
                          </Cell>
                        ))}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </InsetStoryFrame>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Figma parity matrix: use this to check form-field cells across column
 * position, row position, and hover state. Do not copy this full story
 * into product code.
 */
export const InsetFormFieldMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <InsetStoryFrame>
      <table className="border-collapse table-fixed w-[720px]">
        <thead>
          <tr>
            <th className="p-0 w-[120px]" />
            {insetColumns.map((column) => (
              <th key={column} className="p-0">
                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                  <MatrixLabel>{column} column</MatrixLabel>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {insetRows.flatMap((row) =>
            insetStates.map(({ label, hovered }) => (
              <tr key={`${row}-${label}`}>
                <td className="p-0 align-top">
                  <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                    <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                  </div>
                </td>
                {insetColumns.map((column) => (
                  <Cell key={column} inset row={row} column={column} hovered={hovered} checkbox={<Checkbox size="sm" />}>
                    <NumberInput type="stepper" value="1" onChange={() => undefined} />
                  </Cell>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </InsetStoryFrame>
  ),
};

/**
 * Figma parity matrix: use this to check icon cells across column
 * position, row position, and hover state. Do not copy this full story
 * into product code.
 */
export const InsetIconMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <InsetStoryFrame>
      <table className="border-collapse table-fixed w-[480px]">
        <thead>
          <tr>
            <th className="p-0 w-[120px]" />
            {insetColumns.map((column) => (
              <th key={column} className="p-0">
                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                  <MatrixLabel>{column} column</MatrixLabel>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {insetRows.flatMap((row) =>
            insetStates.map(({ label, hovered }) => (
              <tr key={`${row}-${label}`}>
                <td className="p-0 align-top">
                  <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                    <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                  </div>
                </td>
                {insetColumns.map((column) => (
                  <Cell key={column} inset row={row} column={column} hovered={hovered} checkbox={<Checkbox size="sm" />}>
                    <Icon name="info" size={17} className="text-[color:var(--color-icon-secondary)]" />
                  </Cell>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </InsetStoryFrame>
  ),
};

/**
 * Figma parity matrix: use this to check action-link and icon-action
 * cells across count, row position, and hover state. Do not copy this
 * full story into product code.
 */
export const InsetActionButtonMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const linkCounts = [1, 2, 3, 4] as const;
    const iconCounts = [1, 2, 3] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {linkCounts.map((count) => (
                  <th key={count} className="p-0 w-[120px]">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{count} text {count === 1 ? 'link' : 'links'}</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insetRows.flatMap((row) =>
                insetStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {linkCounts.map((count) => (
                      <Cell
                        key={count}
                        inset
                        row={row}
                        column="last"
                        hovered={hovered}
                        className="!items-start !pr-[var(--spacing-12)]"
                      >
                        <ActionLinks count={count} />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>

        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {iconCounts.map((count) => (
                  <th key={count} className="p-0 w-[120px]">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{count} {count === 1 ? 'icon' : 'icons'}</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insetRows.flatMap((row) =>
                insetStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {iconCounts.map((count) => (
                      <Cell
                        key={count}
                        inset
                        row={row}
                        column="last"
                        hovered={hovered}
                        className="!items-start !pr-[var(--spacing-12)]"
                      >
                        <ActionIcons count={count} />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: use this to check collapse/expand trigger cells
 * across default and last-row positions. Do not copy this full story into
 * product code.
 */
export const InsetExpandableMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <InsetStoryFrame>
      <table className="border-collapse table-fixed w-[360px]">
        <thead>
          <tr>
            <th className="p-0">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                <MatrixLabel>Default / collapse</MatrixLabel>
              </div>
            </th>
            <th className="p-0">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                <MatrixLabel>Last row / collapse</MatrixLabel>
              </div>
            </th>
            <th className="p-0">
              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                <MatrixLabel>Default / expand</MatrixLabel>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Cell inset row="middle" column="center" align="center">
              <TableExpandToggle expanded={false} />
            </Cell>
            <Cell inset row="last" column="center" align="center">
              <TableExpandToggle expanded={false} />
            </Cell>
            <Cell inset row="middle" column="center" align="center">
              <TableExpandToggle expanded />
            </Cell>
          </tr>
        </tbody>
      </table>
    </InsetStoryFrame>
  ),
};

/**
 * Figma parity matrix: use this to check tag-after and tag-first inset
 * row variants across row position, hover state, column position, and
 * one/two action rows. Do not copy this full story into product code.
 */
export const InsetTagMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const orders = ['after', 'first'] as const;
    const counts = [1, 2] as const;
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use InsetTagAfter or InsetTagFirst for copyable product code.
        </MatrixNote>
        {orders.map((order) => (
          <div key={order} className="flex flex-col gap-[var(--spacing-12)]">
            <MatrixLabel>{order === 'after' ? 'Tag after' : 'Tag first'}</MatrixLabel>
            {counts.map((count) => (
              <InsetStoryFrame key={`${order}-${count}`}>
                <table className="border-collapse table-fixed">
                  <thead>
                    <tr>
                      <th className="p-0 w-[120px]" />
                      {columns.map((column) => (
                        <th key={column} className="p-0 w-[190px]">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                            <MatrixLabel>{count} action / {column}</MatrixLabel>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {insetRows.flatMap((row) =>
                      insetStates.map(({ label, hovered }) => (
                        <tr key={`${order}-${count}-${row}-${label}`}>
                          <td className="p-0 align-top">
                            <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                              <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                            </div>
                          </td>
                          {columns.map((column) => (
                            <Cell key={column} inset row={row} column={column} hovered={hovered}>
                              <TagPair order={order} count={count} />
                            </Cell>
                          ))}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </InsetStoryFrame>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Figma parity matrix: use this to check status toggle cells across
 * row position, hover state, and center/last columns. Do not copy this
 * full story into product code.
 */
export const InsetStatusToggleMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. Use InsetStatusToggle for copyable product code.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed w-[420px]">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {columns.map((column) => (
                  <th key={column} className="p-0">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insetRows.flatMap((row) =>
                insetStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {columns.map((column) => (
                      <Cell key={column} inset row={row} column={column} hovered={hovered}>
                        <Toggle checked />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/**
 * Figma parity matrix: use this to check compact progress status cells
 * across default, in-progress, error, and success states. Do not copy
 * this full story into product code.
 */
export const InsetProgressStatusMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const statuses: Array<{ label: string; status: InsetProgressStatus }> = [
      { label: 'None', status: 'default' },
      { label: 'In progress', status: 'progress' },
      { label: 'Error', status: 'error' },
      { label: 'Success', status: 'success' },
    ];
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. Use InsetProgressStatus for copyable product code.
        </MatrixNote>
        {columns.map((column) => (
          <div key={column} className="flex flex-col gap-[var(--spacing-4)]">
            <MatrixLabel>{column} column</MatrixLabel>
            <InsetStoryFrame>
              <table className="border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="p-0 w-[120px]" />
                    {statuses.map(({ label }) => (
                      <th key={label} className="p-0 w-[116px]">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                          <MatrixLabel>{label}</MatrixLabel>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insetRows.flatMap((row) =>
                    insetStates.map(({ label, hovered }) => (
                      <tr key={`${column}-${row}-${label}`}>
                        <td className="p-0 align-top">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                            <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                          </div>
                        </td>
                        {statuses.map(({ status }) => (
                          <Cell key={status} inset row={row} column={column} hovered={hovered}>
                            <InsetProgress status={status} />
                          </Cell>
                        ))}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </InsetStoryFrame>
          </div>
        ))}
      </div>
    );
  },
};

export const Selected: Story = {
  args: { selected: true, children: 'Selected row cell' },
};

/* ── Sub-row variant (Sales Channel "Today Sales" pattern) ── */

export const Subrow: Story = {
  args: { subrow: true, column: 'first', children: 'Awesome Store 1899' },
};

export const SubrowHovered: Story = {
  args: { subrow: true, hovered: true, column: 'first', children: 'Awesome Store 1899' },
};

/**
 * Center column with content geometrically centered (align='center').
 * `column` sets the left/right padding asymmetry; `align` decides
 * where content sits inside that padded zone.
 */
export const SubrowCenter: Story = {
  args: { subrow: true, column: 'center', align: 'center', children: '25' },
};

export const SubrowLast: Story = {
  args: { subrow: true, column: 'last', align: 'right', children: '10,000.00' },
};

export const SubrowSelected: Story = {
  args: {
    subrow: true,
    selected: true,
    column: 'first',
    children: 'Selected sub-row (selection still wins over subrow fill)',
  },
};

/**
 * Copyable recipe: use this for a sub-row text value with checkbox and
 * channel/app icon.
 */
export const SubrowTextWithChannel: Story = {
  args: {
    subrow: true,
    column: 'first',
    checkbox: <Checkbox size="sm" />,
    leadingIcon: <ShopeeIcon />,
    children: 'Table Body Data',
  },
};

/**
 * Copyable recipe: use this for a sub-row numeric value with checkbox,
 * channel/app icon, semantic tone, and a trend glyph.
 */
export const SubrowNumberWithTrend: Story = {
  args: {
    subrow: true,
    column: 'last',
    align: 'right',
    checkbox: <Checkbox size="sm" />,
    leadingIcon: <ShopeeIcon />,
    tone: 'success',
    trailing: <Icon name="minus" size={20} className="text-[color:var(--color-sys-green-DEFAULT)]" />,
    children: 'Data Number',
  },
};

/**
 * Copyable recipe: use this for a sub-row quantity field.
 */
export const SubrowQuantityField: Story = {
  render: () => (
    <TableCell subrow column="first" className="!items-start">
      <Quantity
        size="slim"
        label="Label"
        helperText="Hint text"
        defaultValue={{ current: '0', total: '1' }}
      />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this for a sub-row quantity field with validation.
 */
export const SubrowQuantityFieldError: Story = {
  render: () => (
    <TableCell subrow column="first" className="!items-start">
      <Quantity
        size="slim"
        label="Label"
        helperText="Hint text"
        validation="error"
        defaultValue={{ current: '0', total: '1' }}
      />
    </TableCell>
  ),
};

/**
 * Figma parity matrix: use this to check sub-row text and number cells
 * across row position, hover state, column position, alignment, and
 * semantic tone. Do not copy this full story into product code.
 */
export const SubrowTextNumberMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const tones = ['default', 'success', 'danger'] as const;
    const alignments = ['left', 'center', 'right'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use SubrowTextWithChannel or SubrowNumberWithTrend for copyable product code.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed w-[720px]">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {insetColumns.map((column) => (
                  <th key={column} className="p-0">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>Text / {column}</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insetRows.flatMap((row) =>
                insetStates.map(({ label, hovered }) => (
                  <tr key={`text-${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {insetColumns.map((column) => (
                      <Cell
                        key={column}
                        subrow
                        row={row}
                        column={column}
                        hovered={hovered}
                        checkbox={<Checkbox size="sm" />}
                        leadingIcon={<ShopeeIcon />}
                      >
                        Table Body Data
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>

        {tones.map((tone) => (
          <div key={tone} className="flex flex-col gap-[var(--spacing-8)]">
            <MatrixLabel>Number / {tone}</MatrixLabel>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-[var(--spacing-16)]">
              {insetColumns.map((column) => (
                <div key={`${tone}-${column}`} className="flex flex-col gap-[var(--spacing-4)]">
                  <MatrixLabel>{column} column</MatrixLabel>
                  <InsetStoryFrame>
                    <table className="border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="p-0 w-[120px]" />
                          {alignments.map((align) => (
                            <th key={align} className="p-0 w-[116px]">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                                <MatrixLabel>{align}</MatrixLabel>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {insetRows.flatMap((row) =>
                          insetStates.map(({ label, hovered }) => (
                            <tr key={`${tone}-${column}-${row}-${label}`}>
                              <td className="p-0 align-top">
                                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                                  <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                                </div>
                              </td>
                              {alignments.map((align) => (
                                <Cell
                                  key={align}
                                  subrow
                                  row={row}
                                  column={column}
                                  align={align}
                                  tone={tone}
                                  hovered={hovered}
                                  checkbox={<Checkbox size="sm" />}
                                  leadingIcon={<ShopeeIcon />}
                                  trailing={
                                    tone === 'default'
                                      ? undefined
                                      : (
                                        <Icon
                                          name="minus"
                                          size={20}
                                          className={tone === 'success'
                                            ? 'text-[color:var(--color-sys-green-DEFAULT)]'
                                            : 'text-[color:var(--color-sys-red-DEFAULT)]'}
                                        />
                                      )
                                  }
                                >
                                  Data Number
                                </Cell>
                              ))}
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </InsetStoryFrame>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Figma parity matrix: use this to check sub-row quantity fields across
 * row position, column position, field state, and validation. Do not copy
 * this full story into product code.
 */
export const SubrowQuantityFieldMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const quantityStates: Array<{ label: string; state: QuantityState; focus?: boolean; hovered?: boolean }> = [
      { label: 'Default', state: 'default' },
      { label: 'Hover', state: 'default', hovered: true },
      { label: 'Focus', state: 'default', focus: true },
      { label: 'Disabled', state: 'disabled' },
      { label: 'Readonly', state: 'readonly' },
    ];
    const validations: QuantityValidation[] = ['default', 'error', 'success', 'warning'];

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use SubrowQuantityField or SubrowQuantityFieldError for copyable product code.
        </MatrixNote>
        {insetRows.map((row) => (
          <div key={row} className="flex flex-col gap-[var(--spacing-16)]">
            <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'}</MatrixLabel>
            <div className="grid grid-cols-1 gap-[var(--spacing-16)]">
              {insetColumns.map((column) => (
                <div key={`${row}-${column}`} className="flex flex-col gap-[var(--spacing-4)]">
                  <MatrixLabel>{column} column</MatrixLabel>
                  <InsetStoryFrame>
                    <table className="border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="p-0 w-[104px]" />
                          {validations.map((validation) => (
                            <th key={validation} className="p-0 w-[170px]">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                                <MatrixLabel>{validation === 'default' ? 'none' : validation}</MatrixLabel>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quantityStates.map(({ label, state, focus, hovered }) => (
                          <tr key={label}>
                            <td className="p-0 align-top">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                                <MatrixLabel>{label}</MatrixLabel>
                              </div>
                            </td>
                            {validations.map((validation) => (
                              <Cell
                                key={validation}
                                subrow
                                row={row}
                                column={column}
                                hovered={hovered}
                                className="!items-start"
                              >
                                <Quantity
                                  size="slim"
                                  label="Label"
                                  helperText="Hint text"
                                  state={state}
                                  validation={validation}
                                  defaultValue={{ current: '0', total: '1' }}
                                  inputRef={focus ? (el) => el?.focus() : undefined}
                                />
                              </Cell>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </InsetStoryFrame>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Composite sub-row showing the full sub-row band as it appears in the
 * Sales Channel "Today Sales" expanded parent (s2 reference). Confirms
 * left/center/right column padding lines up across the row.
 *
 * Note: in real product use the sub-rows are preceded by an Inset Table
 * Sub-row Header band — see TableHeaderCell's SubheaderRow story for
 * that piece, and SubheaderWithSubrows below for the full s2 stack.
 */
export const SubrowComposite: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <tbody>
        <tr>
          <Cell subrow column="first">Awesome Store 1899</Cell>
          <Cell subrow column="center" align="left">25</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
        <tr>
          <Cell subrow column="first">Super Hype</Cell>
          <Cell subrow column="center" align="left">5</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
      </tbody>
    </table>
  ),
};

/**
 * Full s2 reproduction: Inset Table Sub-row Header (Margin=Top) on top
 * of two sub-rows. Verifies that the sub-header's pt-8/pb-0 + the
 * sub-row's py-6 produce the right vertical rhythm — sub-row content
 * should align to the same x-position as the header label, with no
 * extra gap between the header band and the first sub-row.
 */
export const SubheaderWithSubrows: Story = {
  render: () => (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th>
            <TableHeaderCell subheader column="first" align="left" label="Store" />
          </th>
          <th>
            <TableHeaderCell subheader column="center" align="left" label="Order" />
          </th>
          <th>
            <TableHeaderCell subheader column="last" align="right" label="Total (RM)" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Cell subrow column="first">Awesome Store 1899</Cell>
          <Cell subrow column="center" align="left">25</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
        <tr>
          <Cell subrow column="first">Super Hype</Cell>
          <Cell subrow column="center" align="left">5</Cell>
          <Cell subrow column="last" align="right">10,000.00</Cell>
        </tr>
      </tbody>
    </table>
  ),
};

/* ── TableCellInfo content variant (Figma Inset Table Row - Info, 1298:1893) ── */

/**
 * s1 single-line label + body. Figma: alignment=Horizontal, statusCount=1,
 * paragraphCount=1.
 */
/* TableCellInfo content variant (Figma Table Row - Info, 1270:2216) */

const tableRowInfoLabels = ['Status Label', 'Status Label 2', 'Status Label 3'] as const;

const tableRowInfoStatuses = (
  statusCount: 1 | 2 | 3,
  paragraphCount: 1 | 2 | 3,
) => Array.from({ length: statusCount }).map((_, index) => ({
  label: tableRowInfoLabels[index],
  body: 'Long Info Long Info Long Info Long Info ',
  maxLines: paragraphCount,
}));

const DefaultInfoCell = ({
  alignment = 'horizontal',
  statusCount = 1,
  paragraphCount = 1,
  column = 'center',
  row = 'middle',
  hovered = false,
}: {
  alignment?: 'horizontal' | 'vertical';
  statusCount?: 1 | 2 | 3;
  paragraphCount?: 1 | 2 | 3;
  column?: 'center' | 'last';
  row?: 'middle' | 'last';
  hovered?: boolean;
}) => (
  <TableCell
    column={column}
    row={row}
    hovered={hovered}
    className="!items-start"
  >
    <TableCellInfo
      alignment={alignment}
      statuses={tableRowInfoStatuses(statusCount, paragraphCount)}
    />
  </TableCell>
);

/**
 * Default table-row info, horizontal label/value layout. Figma:
 * Table Row - Info (1270:2216), Type=Horizontal.
 */
export const DefaultInfoHorizontal: DefaultInfoStory = {
  argTypes: {
    ...recipeOnlyControls,
    alignment: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    statusCount: { control: 'inline-radio', options: [1, 2, 3] },
    paragraphCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    alignment: 'horizontal',
    statusCount: 1,
    paragraphCount: 1,
  },
  parameters: {
    docs: {
      source: {
        code: defaultInfoSource('horizontal', 1, 1),
      },
    },
  },
  render: ({ alignment = 'horizontal', statusCount = 1, paragraphCount = 1 }) => (
    <RowHoverPreview>
      <DefaultInfoCell
        alignment={alignment}
        statusCount={statusCount}
        paragraphCount={paragraphCount}
      />
    </RowHoverPreview>
  ),
};

/**
 * Default table-row info, vertical label/value layout. Figma:
 * Table Row - Info (1270:2216), Type=Vertical.
 */
export const DefaultInfoVertical: DefaultInfoStory = {
  argTypes: {
    ...recipeOnlyControls,
    alignment: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    statusCount: { control: 'inline-radio', options: [1, 2, 3] },
    paragraphCount: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: {
    alignment: 'vertical',
    statusCount: 1,
    paragraphCount: 1,
  },
  parameters: {
    docs: {
      source: {
        code: defaultInfoSource('vertical', 1, 1),
      },
    },
  },
  render: ({ alignment = 'vertical', statusCount = 1, paragraphCount = 1 }) => (
    <RowHoverPreview>
      <DefaultInfoCell
        alignment={alignment}
        statusCount={statusCount}
        paragraphCount={paragraphCount}
      />
    </RowHoverPreview>
  ),
};

/**
 * Figma parity matrix for default Table Row - Info. Covers horizontal/vertical
 * layout, one/two/three info rows, paragraph count, center/last column padding,
 * last-row divider, and hover fill.
 */
export const DefaultInfoMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const alignments = ['horizontal', 'vertical'] as const;
    const statusCounts = [1, 2, 3] as const;
    const paragraphCounts = [1, 2, 3] as const;
    const columns = ['center', 'last'] as const;
    const rows = ['middle', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use DefaultInfoHorizontal or DefaultInfoVertical for copyable product code.
        </MatrixNote>
        {paragraphCounts.map((paragraphCount) => (
          <div key={paragraphCount} className="flex flex-col gap-[var(--spacing-16)]">
            <MatrixLabel>{paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}</MatrixLabel>
            {alignments.map((alignment) => (
              <div key={`${paragraphCount}-${alignment}`} className="flex flex-col gap-[var(--spacing-8)]">
                <MatrixLabel>{alignment}</MatrixLabel>
                {statusCounts.map((statusCount) => (
                  <InsetStoryFrame key={`${paragraphCount}-${alignment}-${statusCount}`}>
                    <table className="border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="p-0 w-[120px]" />
                          {columns.map((column) => (
                            <th key={column} className="p-0 w-[213px]">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                                <MatrixLabel>{statusCount} info / {column}</MatrixLabel>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.flatMap((row) =>
                          insetStates.map(({ label, hovered }) => (
                            <tr key={`${paragraphCount}-${alignment}-${statusCount}-${row}-${label}`}>
                              <td className="p-0 align-top">
                                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                                  <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                                </div>
                              </td>
                              {columns.map((column) => (
                                <td key={column} className="p-0 align-top">
                                  <DefaultInfoCell
                                    alignment={alignment}
                                    statusCount={statusCount}
                                    paragraphCount={paragraphCount}
                                    column={column}
                                    row={row}
                                    hovered={hovered}
                                  />
                                </td>
                              ))}
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </InsetStoryFrame>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const InfoSingleLine: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[{ label: 'Order ID', body: 'INV-878973829' }]}
      />
    ),
  },
};

/**
 * s8 multi-status pattern (Order ID + COID style). Figma: alignment=Horizontal,
 * statusCount=2, paragraphCount=1. Labels stretch to match each body row.
 */
export const InfoMultiStatus: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          { label: 'Order ID', body: 'INV-878973829' },
          { label: 'COID', body: '36386598983784' },
        ]}
      />
    ),
  },
};

/**
 * s6 vertical alignment — label sits above its body. Figma: alignment=Vertical,
 * statusCount=1, paragraphCount=1.
 */
export const InfoVertical: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[{ label: 'Reference No.', body: 'CP13010263179835' }]}
      />
    ),
  },
};

/**
 * Worst-case multi-status × multi-paragraph: each row's label should
 * vertically align with its body row. Confirms the two-column geometry
 * holds when label height (1 line) is shorter than body height (N lines).
 */
export const InfoMultiStatusMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          {
            label: 'Pickup',
            body: ['Block A, Level 12, Tower 3', 'Jalan Equine Park'],
          },
          {
            label: 'Dropoff',
            body: ['Lot 7, Bandar Sunway', '47500 Petaling Jaya'],
          },
        ]}
      />
    ),
  },
};

/**
 * Vertical alignment, multi-status. Figma: alignment=Vertical, statusCount=2,
 * paragraphCount=1. Each (label above body) block stacks with gap-4 between.
 */
export const InfoVerticalMultiStatus: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[
          { label: 'Pickup', body: 'Block A, Level 12, Tower 3' },
          { label: 'Dropoff', body: 'Lot 7, Bandar Sunway' },
        ]}
      />
    ),
  },
};

/**
 * Vertical alignment, multi-paragraph body. Figma: alignment=Vertical,
 * statusCount=1, paragraphCount=3.
 */
export const InfoVerticalMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        alignment="vertical"
        statuses={[
          {
            label: 'Address',
            body: [
              'Block A, Level 12, Tower 3',
              'Jalan Equine Park, Sri Kembangan',
              '43300 Selangor, Malaysia',
            ],
          },
        ]}
      />
    ),
  },
};

/**
 * Multi-paragraph body — Figma: paragraphCount=3. Each paragraph is a wrapped
 * line; the label stays vertically centred against the first row in horizontal
 * alignment.
 */
export const InfoMultiParagraph: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellInfo
        statuses={[
          {
            label: 'Address',
            body: [
              'Block A, Level 12, Tower 3',
              'Jalan Equine Park, Sri Kembangan',
              '43300 Selangor, Malaysia',
            ],
          },
        ]}
      />
    ),
  },
};

/**
 * Figma parity matrix: use this to check the Info cell family across
 * horizontal/vertical layout, one/two/three status rows, paragraph count,
 * row position, hover state, and center/last column padding. Do not copy
 * this full story into product code.
 */
export const InfoMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const alignments = ['horizontal', 'vertical'] as const;
    const statusCounts = [1, 2, 3] as const;
    const paragraphCounts = [1, 2, 3] as const;
    const columns = ['center', 'last'] as const;

    const statusesFor = (statusCount: 1 | 2 | 3, paragraphCount: 1 | 2 | 3) =>
      Array.from({ length: statusCount }).map((_, index) => ({
        label: ['Order ID', 'COID', 'Reference'][index],
        body: paragraphCount === 1
          ? ['INV-878973829', '36386598983784', 'CP13010263179835'][index]
          : Array.from({ length: paragraphCount }).map((__, paragraphIndex) =>
            paragraphIndex === 0
              ? 'Block A, Level 12'
              : paragraphIndex === 1
                ? 'Jalan Equine Park'
                : '43300 Selangor',
          ),
      }));

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use InfoSingleLine, InfoMultiStatus, InfoVertical, or the focused Info stories for copyable product code.
        </MatrixNote>
        {paragraphCounts.map((paragraphCount) => (
          <div key={paragraphCount} className="flex flex-col gap-[var(--spacing-16)]">
            <MatrixLabel>{paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}</MatrixLabel>
            {alignments.map((alignment) => (
              <div key={`${paragraphCount}-${alignment}`} className="flex flex-col gap-[var(--spacing-8)]">
                <MatrixLabel>{alignment}</MatrixLabel>
                {statusCounts.map((statusCount) => (
                  <InsetStoryFrame key={`${paragraphCount}-${alignment}-${statusCount}`}>
                    <table className="border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="p-0 w-[120px]" />
                          {columns.map((column) => (
                            <th key={column} className="p-0 w-[260px]">
                              <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                                <MatrixLabel>{statusCount} info / {column}</MatrixLabel>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {insetRows.flatMap((row) =>
                          insetStates.map(({ label, hovered }) => (
                            <tr key={`${paragraphCount}-${alignment}-${statusCount}-${row}-${label}`}>
                              <td className="p-0 align-top">
                                <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                                  <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                                </div>
                              </td>
                              {columns.map((column) => (
                                <Cell key={column} inset row={row} column={column} hovered={hovered} className="!items-start">
                                  <TableCellInfo
                                    alignment={alignment}
                                    statuses={statusesFor(statusCount, paragraphCount)}
                                  />
                                </Cell>
                              ))}
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </InsetStoryFrame>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/* ── TableCellMainSub content variant (Figma Inset Table Row - MainSub, 2121:9632) ── */

/**
 * Default MainSub: caption label + 14/17 main value above caption label +
 * 12/17 secondary sub value. Figma: Type=Default.
 */
export const MainSub: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainLabel="Total"
        mainValue="RM 10,250.00"
        subLabel="Tax"
        subValue="RM 615.00"
      />
    ),
  },
};

/**
 * Main Bold variant — Figma Type=Main Bold. Bolds the main value to draw
 * attention; sub line stays regular. Mirrors the s8 Select Package row's
 * tracking-number-with-meta pattern.
 */
export const MainSubBold: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainBold
        mainLabel="Tracking"
        mainValue="MY984746382"
        subLabel="Order"
        subValue="878973829"
      />
    ),
  },
};

/**
 * No labels — just main value above sub value. Useful when the column
 * header already names the field.
 */
export const MainSubLabelless: Story = {
  args: {
    inset: true,
    column: 'first',
    children: (
      <TableCellMainSub
        mainBold
        mainValue="MY984746382"
        subValue="878973829"
      />
    ),
  },
};

/**
 * Figma parity matrix: use this to check MainSub cells across default/main-bold
 * type, center/last columns, row position, and hover state. Do not copy this
 * full story into product code.
 */
export const MainSubMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const types = ['default', 'mainBold'] as const;
    const columns = ['center', 'last'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. This Figma node was already represented by MainSub, MainSubBold, and MainSubLabelless.
        </MatrixNote>
        {types.map((type) => (
          <div key={type} className="flex flex-col gap-[var(--spacing-8)]">
            <MatrixLabel>{type === 'mainBold' ? 'Main Bold' : 'Default'}</MatrixLabel>
            <InsetStoryFrame>
              <table className="border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="p-0 w-[120px]" />
                    {columns.map((column) => (
                      <th key={column} className="p-0 w-[170px]">
                        <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                          <MatrixLabel>{column} column</MatrixLabel>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insetRows.flatMap((row) =>
                    insetStates.map(({ label, hovered }) => (
                      <tr key={`${type}-${row}-${label}`}>
                        <td className="p-0 align-top">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                            <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                          </div>
                        </td>
                        {columns.map((column) => (
                          <Cell key={column} inset row={row} column={column} hovered={hovered} className="!items-start">
                            <TableCellMainSub
                              mainLabel="Main Label"
                              mainValue="Main Value"
                              subLabel="Sub Label"
                              subValue="Sub Value"
                              mainBold={type === 'mainBold'}
                            />
                          </Cell>
                        ))}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </InsetStoryFrame>
          </div>
        ))}
      </div>
    );
  },
};

/* ── Text listing content variant (Figma Inset Table Row - Text Listing, 2809:9099) ── */

/**
 * Copyable recipe: use this for text listing content with bold title and
 * one secondary paragraph.
 */
export const TextListingBold: Story = {
  render: () => (
    <TableCell inset column="first" className="!items-start">
      <TextListing titleWeight="bold" paragraphCount={1} />
    </TableCell>
  ),
};

/**
 * Copyable recipe: use this for text listing content with regular title.
 */
export const TextListingRegular: Story = {
  render: () => (
    <TableCell inset column="first" className="!items-start">
      <TextListing titleWeight="regular" paragraphCount={2} />
    </TableCell>
  ),
};

/**
 * Figma parity matrix: use this to check text listing cells across title
 * weight, paragraph count, row position, hover state, and first/center/last
 * columns. Do not copy this full story into product code.
 */
export const TextListingMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const titleWeights = ['bold', 'regular'] as const;
    const paragraphCounts = [1, 2, 3] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <MatrixNote>
          Visual check only. Use TextListingBold or TextListingRegular for copyable product code.
        </MatrixNote>
        {titleWeights.map((titleWeight) => (
          <div key={titleWeight} className="flex flex-col gap-[var(--spacing-16)]">
            <MatrixLabel>Title weight {titleWeight}</MatrixLabel>
            {paragraphCounts.map((paragraphCount) => (
              <InsetStoryFrame key={`${titleWeight}-${paragraphCount}`}>
                <table className="border-collapse table-fixed">
                  <thead>
                    <tr>
                      <th className="p-0 w-[120px]" />
                      {insetColumns.map((column) => (
                        <th key={column} className="p-0 w-[230px]">
                          <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                            <MatrixLabel>{paragraphCount} paragraph / {column}</MatrixLabel>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {insetRows.flatMap((row) =>
                      insetStates.map(({ label, hovered }) => (
                        <tr key={`${titleWeight}-${paragraphCount}-${row}-${label}`}>
                          <td className="p-0 align-top">
                            <div className="px-[var(--spacing-6)] py-[var(--spacing-6)]">
                              <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                            </div>
                          </td>
                          {insetColumns.map((column) => (
                            <Cell key={column} inset row={row} column={column} hovered={hovered} className="!items-start">
                              <TextListing titleWeight={titleWeight} paragraphCount={paragraphCount} />
                            </Cell>
                          ))}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </InsetStoryFrame>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/* ── TableCellListing content variant (Figma Inset Table Row - Listing, 1262:9692) ── */

/**
 * Single-line product listing — image, status pip, bold name, two info
 * rows (iSKU/SKU), and an extras row (channel + more-skus link). Uses
 * `column='first'` with the s9 padding override (`!pl-12`) per Figma
 * 1248:8395; center-column listings drop the override.
 */
export const Listing: Story = {
  args: {
    inset: true,
    column: 'first',
    className: '!pl-[var(--spacing-12)]',
    children: (
      <TableCellListing
        checkbox={<Checkbox size="sm" />}
        image={<ProductImage size="lg" src={productImages[0].src} alt={productImages[0].alt} />}
        tag={<Pip type="success" pipStyle="default" label="Published" />}
        productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
        infoRows={[
          { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
          { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
        ]}
        extras={
          <>
            <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
              <img
                src={sitegiantWebstore}
                alt=""
                aria-hidden="true"
                width={15}
                height={15}
                className="shrink-0 block rounded-[var(--radius-4)]"
              />
              Webstore
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)] cursor-pointer"
            >
              <Icon name="plus-square" size={15} />
              5 more SKUs
            </button>
          </>
        }
      />
    ),
  },
};

/**
 * Center column variant of the same listing — drops the `!pl-12` override
 * since the cell already has center-column padding.
 */
export const ListingCenter: Story = {
  args: {
    inset: true,
    column: 'center',
    children: (
      <TableCellListing
        image={<ProductImage size="lg" src={productImages[0].src} alt={productImages[0].alt} />}
        tag={<Pip type="success" pipStyle="default" label="Published" />}
        productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
        infoRows={[
          { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
          { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
        ]}
      />
    ),
  },
};

/**
 * Figma parity matrix: use this to check listing cells across first/center
 * columns, default/last row dividers, and hover fill. Do not copy this
 * full story into product code.
 */
export const ListingMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => {
    const columns = ['first', 'center'] as const;

    return (
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <MatrixNote>
          Visual check only. Use Listing or ListingCenter for copyable product code.
        </MatrixNote>
        <InsetStoryFrame>
          <table className="border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-0 w-[120px]" />
                {columns.map((column) => (
                  <th key={column} className="p-0 w-[430px]">
                    <div className="px-[var(--spacing-6)] py-[var(--spacing-6)] text-left">
                      <MatrixLabel>{column} column</MatrixLabel>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insetRows.flatMap((row) =>
                insetStates.map(({ label, hovered }) => (
                  <tr key={`${row}-${label}`}>
                    <td className="p-0 align-top">
                      <div className="px-[var(--spacing-6)] py-[var(--spacing-12)]">
                        <MatrixLabel>{row === 'last' ? 'Last row' : 'Default row'} / {label}</MatrixLabel>
                      </div>
                    </td>
                    {columns.map((column) => (
                      <Cell
                        key={column}
                        inset
                        row={row}
                        column={column}
                        hovered={hovered}
                        className={column === 'first' ? '!pl-[var(--spacing-12)]' : undefined}
                      >
                        <TableCellListing
                          checkbox={column === 'first' ? <Checkbox size="sm" /> : undefined}
                          image={<ProductImage size="lg" src={productImages[0].src} alt={productImages[0].alt} />}
                          tag={<Pip type="success" pipStyle="default" label="Published" />}
                          productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
                          infoRows={[
                            { label: 'iSKU', value: 'ISKU-LDC-240321-MY-0001' },
                            { label: 'SKU', value: 'DYN-4IN1-FRESH-10ML52' },
                          ]}
                          extras={
                            <>
                              <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
                                <img
                                  src={sitegiantWebstore}
                                  alt=""
                                  aria-hidden="true"
                                  width={15}
                                  height={15}
                                  className="shrink-0 block rounded-[var(--radius-4)]"
                                />
                                Webstore
                              </span>
                              <button
                                type="button"
                                className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)] cursor-pointer"
                              >
                                <Icon name="plus-square" size={15} />
                                5 more SKUs
                              </button>
                            </>
                          }
                        />
                      </Cell>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </InsetStoryFrame>
      </div>
    );
  },
};

/* ── Content composition variants (Inset Table Row family) ── */

export const WithTagContent: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-[var(--spacing-4)]">
        <Tag label="Tag Label" />
        <Pip type="warning" pipStyle="solid" label="Pip Text" />
      </span>
    ),
  },
};

export const WithExpandToggle: Story = {
  args: { column: 'last', align: 'right' },
  render: (args) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <TableCell
        {...args}
        trailing={
          <TableExpandToggle expanded={expanded} onToggle={setExpanded} />
        }
      >
        Expandable row
      </TableCell>
    );
  },
};

/* ── Full table example ─────────────────────────────── */

export const FullTable: Story = {
  render: () => (
    <table className="border-collapse w-full table-fixed">
      <thead>
        <tr>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="first" align="left" label="Product" sortable checkbox={<Checkbox size="sm" />} />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="left" label="SKU" sortable />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Stock" sortable />
          </th>
          <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
            <TableHeaderCell column="center" align="right" label="Price" sortable />
          </th>
          <th className="p-0">
            <TableHeaderCell column="last" align="left" label="Action" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox size="sm" />}>
            Wireless mouse
          </Cell>
          <Cell column="center" align="left">SKU-1042</Cell>
          <Cell column="center" align="right">128</Cell>
          <Cell column="center" align="right">RM 89.00</Cell>
          <Cell column="last" align="left">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" checkbox={<Checkbox size="sm" />}>
            USB-C Hub
          </Cell>
          <Cell column="center" align="left">SKU-2103</Cell>
          <Cell column="center" align="right">42</Cell>
          <Cell column="center" align="right">RM 159.00</Cell>
          <Cell column="last" align="left">⋯</Cell>
        </tr>
        <tr>
          <Cell column="first" align="left" weight="bold" row="last" checkbox={<Checkbox size="sm" />}>
            Mechanical keyboard
          </Cell>
          <Cell column="center" align="left" row="last">SKU-3088</Cell>
          <Cell column="center" align="right" row="last">7</Cell>
          <Cell column="center" align="right" row="last">RM 459.00</Cell>
          <Cell column="last" align="left" row="last">⋯</Cell>
        </tr>
      </tbody>
    </table>
  ),
};
