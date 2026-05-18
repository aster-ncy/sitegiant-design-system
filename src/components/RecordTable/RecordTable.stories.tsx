import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { RecordTableActionCell } from './RecordTableActionCell';
import { RecordTableFormFieldCell } from './RecordTableFormFieldCell';
import { RecordTableHeaderCell } from './RecordTableHeaderCell';
import { RecordTableListingCell } from './RecordTableListingCell';
import { RecordTableMoreInfoCell } from './RecordTableMoreInfoCell';
import { RecordTableRowCell } from './RecordTableRowCell';
import type { TableColumnPosition } from '../TableHeaderCell';
import { productImages } from '../../assets/product-images';

// ── Product data (mirrors TableCell stories listing products) ────────────────

type ProductKey = 'product-1' | 'product-2' | 'product-3' | 'product-4' | 'product-5';

const listingProducts: Record<ProductKey, { image: { src: string; alt: string }; productName: string; iSku: string; sku: string }> = {
  'product-1': { image: productImages[0], productName: 'DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs', iSku: 'ISKU-LDC-240321-MY-0001', sku: 'DYN-4IN1-FRESH-10ML52' },
  'product-2': { image: productImages[1], productName: 'Premium Wireless Barcode Scanner USB-C Set', iSku: 'ISKU-BAR-240422-MY-0002', sku: 'SCAN-USB-C-PRO-BLK' },
  'product-3': { image: productImages[2], productName: 'Thermal Shipping Label Roll 100mm x 150mm', iSku: 'ISKU-LBL-240515-MY-0003', sku: 'LBL-100X150-500PCS' },
  'product-4': { image: productImages[3], productName: 'Eco Kraft Mailer Box Medium 30 Pieces', iSku: 'ISKU-PKG-240603-MY-0004', sku: 'BOX-KRAFT-M-30' },
  'product-5': { image: productImages[4], productName: 'Mini Desktop Receipt Printer Bluetooth', iSku: 'ISKU-PRT-240711-MY-0005', sku: 'PRT-BT-MINI-WHT' },
};

const productKeyLabels: Record<ProductKey, string> = {
  'product-1': 'Product 1 — DYNAMO',
  'product-2': 'Product 2 — Barcode Scanner',
  'product-3': 'Product 3 — Shipping Label',
  'product-4': 'Product 4 — Mailer Box',
  'product-5': 'Product 5 — Receipt Printer',
};

// ── Shared types ────────────────────────────────────────────────────────────

type CellType = 'header' | 'row' | 'form-field' | 'action' | 'listing' | 'more-info';

type PlaygroundArgs = {
  cellType: CellType;
  // Shared
  showCheckbox: boolean;
  // Header
  headerColumn: TableColumnPosition;
  headerAlign: 'left' | 'center' | 'right';
  headerLabel: string;
  headerSortable: boolean;
  // Row
  rowColumn: TableColumnPosition;
  rowHovered: boolean;
  rowValue: string;
  rowHint: string;
  rowShowActionIcon: boolean;
  // Form field
  formColumn: TableColumnPosition;
  formHovered: boolean;
  formPrefix: string;
  formValue: string;
  formPlaceholder: string;
  // Action
  actionType: 'text' | 'icon';
  actionCount: 1 | 2 | 3 | 4;
  actionHovered: boolean;
  actionLabel: string;
  // Listing
  listingColumn: 'first' | 'center';
  listingHovered: boolean;
  listingProduct: ProductKey;
  // More info
  moreInfoColumn: 'first' | 'center';
  moreInfoHovered: boolean;
  moreInfoLabel: string;
  moreInfoValue: string;
  moreInfoShowExtra: boolean;
  moreInfoShowLink: boolean;
};

// ── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Tables/Record Table/Cells',
  parameters: {
    layout: 'padded',
    controls: { sort: 'none' },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Matrix helpers (used by visual-qa stories) ──────────────────────────────

const columns = ['first', 'center', 'last'] as const;
const alignments = ['left', 'center', 'right'] as const;
const listingColumns = ['first', 'center'] as const;

const MatrixLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[length:var(--text-12)] leading-[var(--leading-15)] text-[color:var(--color-text-info)]">
    {children}
  </span>
);

// ── Playground ──────────────────────────────────────────────────────────────

export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { controls: { sort: 'none' } },
  argTypes: {
    // ── Cell type ────────────────────────────────────────────────────────
    cellType: {
      control: { type: 'select' },
      options: ['header', 'row', 'form-field', 'action', 'listing', 'more-info'] satisfies ReadonlyArray<CellType>,
      description: 'Which Record Table cell to preview.',
      table: { category: '1. Cell Type', defaultValue: { summary: 'header' } },
    },
    // ── Shared controls ──────────────────────────────────────────────────
    showCheckbox: {
      control: 'boolean',
      description: 'Show checkbox in the cell. Hidden for "action" cells which have no checkbox slot.',
      table: { category: '1. Cell Type', defaultValue: { summary: 'true' } },
      if: { arg: 'cellType', neq: 'action' },
    },
    // ── Header controls ──────────────────────────────────────────────────
    headerColumn: {
      control: { type: 'inline-radio' },
      options: ['first', 'center', 'last'] satisfies ReadonlyArray<TableColumnPosition>,
      table: { category: '2. Header', defaultValue: { summary: 'first' } },
      if: { arg: 'cellType', eq: 'header' },
    },
    headerAlign: {
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'],
      table: { category: '2. Header', defaultValue: { summary: 'left' } },
      if: { arg: 'cellType', eq: 'header' },
    },
    headerLabel: {
      control: 'text',
      description: 'Header cell label.',
      table: { category: '2. Header', defaultValue: { summary: 'Table Header Title' } },
      if: { arg: 'cellType', eq: 'header' },
    },
    headerSortable: {
      control: 'boolean',
      table: { category: '2. Header', defaultValue: { summary: 'true' } },
      if: { arg: 'cellType', eq: 'header' },
    },
    // ── Row controls ─────────────────────────────────────────────────────
    rowColumn: {
      control: { type: 'inline-radio' },
      options: ['first', 'center', 'last'] satisfies ReadonlyArray<TableColumnPosition>,
      table: { category: '3. Row', defaultValue: { summary: 'first' } },
      if: { arg: 'cellType', eq: 'row' },
    },
    rowHovered: {
      control: 'boolean',
      table: { category: '3. Row', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'row' },
    },
    rowValue: {
      control: 'text',
      description: 'Primary cell value.',
      table: { category: '3. Row', defaultValue: { summary: 'Table Body Data' } },
      if: { arg: 'cellType', eq: 'row' },
    },
    rowHint: {
      control: 'text',
      description: 'Secondary caption below value.',
      table: { category: '3. Row', defaultValue: { summary: '' } },
      if: { arg: 'cellType', eq: 'row' },
    },
    rowShowActionIcon: {
      control: 'boolean',
      description: 'Show inline + icon link action.',
      table: { category: '3. Row', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'row' },
    },
    // ── Form field controls ──────────────────────────────────────────────
    formColumn: {
      control: { type: 'inline-radio' },
      options: ['first', 'center', 'last'] satisfies ReadonlyArray<TableColumnPosition>,
      table: { category: '4. Form Field', defaultValue: { summary: 'first' } },
      if: { arg: 'cellType', eq: 'form-field' },
    },
    formHovered: {
      control: 'boolean',
      table: { category: '4. Form Field', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'form-field' },
    },
    formPrefix: {
      control: 'text',
      description: 'Prefix shown in the input.',
      table: { category: '4. Form Field', defaultValue: { summary: '+' } },
      if: { arg: 'cellType', eq: 'form-field' },
    },
    formValue: {
      control: 'text',
      description: 'Input value.',
      table: { category: '4. Form Field', defaultValue: { summary: '' } },
      if: { arg: 'cellType', eq: 'form-field' },
    },
    formPlaceholder: {
      control: 'text',
      description: 'Input placeholder.',
      table: { category: '4. Form Field', defaultValue: { summary: '0' } },
      if: { arg: 'cellType', eq: 'form-field' },
    },
    // ── Action controls ──────────────────────────────────────────────────
    actionType: {
      control: { type: 'inline-radio' },
      options: ['text', 'icon'] satisfies ReadonlyArray<'text' | 'icon'>,
      description: 'TextLink or IconLink actions.',
      table: { category: '5. Action', defaultValue: { summary: 'text' } },
      if: { arg: 'cellType', eq: 'action' },
    },
    actionCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4] satisfies ReadonlyArray<1 | 2 | 3 | 4>,
      description: 'Number of action items (max 3 for icon type).',
      table: { category: '5. Action', defaultValue: { summary: '1' } },
      if: { arg: 'cellType', eq: 'action' },
    },
    actionHovered: {
      control: 'boolean',
      table: { category: '5. Action', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'action' },
    },
    actionLabel: {
      control: 'text',
      description: 'Label for text-type actions.',
      table: { category: '5. Action', defaultValue: { summary: 'Button' } },
      if: { arg: 'cellType', eq: 'action' },
    },
    // ── Listing controls ─────────────────────────────────────────────────
    listingColumn: {
      control: { type: 'inline-radio' },
      options: ['first', 'center'] satisfies ReadonlyArray<'first' | 'center'>,
      table: { category: '6. Listing', defaultValue: { summary: 'first' } },
      if: { arg: 'cellType', eq: 'listing' },
    },
    listingHovered: {
      control: 'boolean',
      table: { category: '6. Listing', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'listing' },
    },
    listingProduct: {
      control: { type: 'select', labels: productKeyLabels },
      options: ['product-1', 'product-2', 'product-3', 'product-4', 'product-5'] satisfies ReadonlyArray<ProductKey>,
      description: 'Product record — changes name, image, iSKU and SKU together.',
      table: { category: '6. Listing', defaultValue: { summary: 'product-1' } },
      if: { arg: 'cellType', eq: 'listing' },
    },
    // ── More info controls ────────────────────────────────────────────────
    moreInfoColumn: {
      control: { type: 'inline-radio' },
      options: ['first', 'center'] satisfies ReadonlyArray<'first' | 'center'>,
      table: { category: '7. More Info', defaultValue: { summary: 'first' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
    moreInfoHovered: {
      control: 'boolean',
      table: { category: '7. More Info', defaultValue: { summary: 'false' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
    moreInfoLabel: {
      control: 'text',
      description: 'Info label (left side).',
      table: { category: '7. More Info', defaultValue: { summary: 'Label:' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
    moreInfoValue: {
      control: 'text',
      description: 'Info value (right side).',
      table: { category: '7. More Info', defaultValue: { summary: 'Value' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
    moreInfoShowExtra: {
      control: 'boolean',
      description: 'Show secondary Info 1 / Info 2 rows.',
      table: { category: '7. More Info', defaultValue: { summary: 'true' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
    moreInfoShowLink: {
      control: 'boolean',
      description: 'Show Edit TextLink below the info block.',
      table: { category: '7. More Info', defaultValue: { summary: 'true' } },
      if: { arg: 'cellType', eq: 'more-info' },
    },
  },
  args: {
    cellType: 'header',
    // Shared
    showCheckbox: true,
    // Header
    headerColumn: 'first',
    headerAlign: 'left',
    headerLabel: 'Table Header Title',
    headerSortable: true,
    // Row
    rowColumn: 'first',
    rowHovered: false,
    rowValue: 'Table Body Data',
    rowHint: '',
    rowShowActionIcon: false,
    // Form field
    formColumn: 'first',
    formHovered: false,
    formPrefix: '+',
    formValue: '',
    formPlaceholder: '0',
    // Action
    actionType: 'text',
    actionCount: 1,
    actionHovered: false,
    actionLabel: 'Button',
    // Listing
    listingColumn: 'first',
    listingHovered: false,
    listingProduct: 'product-1',
    // More info
    moreInfoColumn: 'first',
    moreInfoHovered: false,
    moreInfoLabel: 'Label:',
    moreInfoValue: 'Value',
    moreInfoShowExtra: true,
    moreInfoShowLink: true,
  },
  render: ({
    cellType,
    showCheckbox,
    headerColumn, headerAlign, headerLabel, headerSortable,
    rowColumn, rowHovered, rowValue, rowHint, rowShowActionIcon,
    formColumn, formHovered, formPrefix, formValue, formPlaceholder,
    actionType, actionCount, actionHovered, actionLabel,
    listingColumn, listingHovered, listingProduct,
    moreInfoColumn, moreInfoHovered, moreInfoLabel, moreInfoValue, moreInfoShowExtra, moreInfoShowLink,
  }: PlaygroundArgs) => {
    // false is a valid ReactNode (boolean ∈ ReactNode). It is non-nullish so
    // `checkbox ?? <Checkbox />` resolves to false, and `{false && ...}` renders nothing.
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;

    if (cellType === 'header') {
      return (
        <div className="w-[220px]">
          <RecordTableHeaderCell
            column={headerColumn}
            align={headerAlign}
            label={headerLabel}
            sortable={headerSortable}
            checkbox={checkboxProp}
          />
        </div>
      );
    }
    if (cellType === 'row') {
      return (
        <div className="w-[220px]">
          <RecordTableRowCell
            column={rowColumn}
            hovered={rowHovered}
            value={rowValue}
            hint={rowHint || undefined}
            showActionIcon={rowShowActionIcon}
            checkbox={checkboxProp}
          />
        </div>
      );
    }
    if (cellType === 'form-field') {
      return (
        <div className="w-[190px]">
          <RecordTableFormFieldCell
            column={formColumn}
            hovered={formHovered}
            prefix={formPrefix}
            value={formValue}
            placeholder={formPlaceholder}
            checkbox={checkboxProp}
          />
        </div>
      );
    }
    if (cellType === 'action') {
      // Clamp actionCount to max 3 for icon type
      const clampedCount = (actionType === 'icon' ? Math.min(actionCount, 3) : actionCount) as 1 | 2 | 3 | 4;
      return (
        <RecordTableActionCell
          type={actionType}
          actionCount={clampedCount}
          hovered={actionHovered}
          label={actionLabel}
        />
      );
    }
    if (cellType === 'listing') {
      const product = listingProducts[listingProduct];
      return (
        <div className="w-[409px]">
          <RecordTableListingCell
            column={listingColumn}
            hovered={listingHovered}
            productName={product.productName}
            imageSrc={product.image.src}
            imageAlt={product.image.alt}
            iSku={product.iSku}
            sku={product.sku}
            checkbox={checkboxProp}
          />
        </div>
      );
    }
    // more-info
    return (
      <div className="w-[227px]">
        <RecordTableMoreInfoCell
          column={moreInfoColumn}
          hovered={moreInfoHovered}
          label={moreInfoLabel}
          value={moreInfoValue}
          showExtraInfo={moreInfoShowExtra}
          showTextLink={moreInfoShowLink}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

// ── Recipe stories ───────────────────────────────────────────────────────────

type HeaderArgs = {
  column: TableColumnPosition;
  align: 'left' | 'center' | 'right';
  label: string;
  sortable: boolean;
  showCheckbox: boolean;
};

export const Header: StoryObj<HeaderArgs> = {
  argTypes: {
    column: { control: { type: 'inline-radio' }, options: ['first', 'center', 'last'] },
    align: { control: { type: 'inline-radio' }, options: ['left', 'center', 'right'] },
    label: { control: 'text' },
    sortable: { control: 'boolean' },
    showCheckbox: { control: 'boolean', description: 'Show checkbox. Only has a visual effect when column is "first" — the component auto-inserts a checkbox for first columns only.' },
  },
  args: { column: 'first', align: 'left', label: 'Table Header Title', sortable: true, showCheckbox: true },
  render: ({ column, align, label, sortable, showCheckbox }: HeaderArgs) => {
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;
    return (
      <div className="w-[220px]">
        <RecordTableHeaderCell
          column={column}
          align={align}
          label={label}
          sortable={sortable}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

type RowArgs = {
  column: TableColumnPosition;
  hovered: boolean;
  value: string;
  hint: string;
  showActionIcon: boolean;
  showCheckbox: boolean;
};

export const DefaultRow: StoryObj<RowArgs> = {
  argTypes: {
    column: { control: { type: 'inline-radio' }, options: ['first', 'center', 'last'] },
    hovered: { control: 'boolean' },
    value: { control: 'text', description: 'Primary cell value.' },
    hint: { control: 'text', description: 'Secondary caption below value.' },
    showActionIcon: { control: 'boolean', description: 'Show inline + icon link.' },
    showCheckbox: { control: 'boolean', description: 'Show checkbox.' },
  },
  args: { column: 'first', hovered: false, value: 'Table Body Data', hint: '', showActionIcon: false, showCheckbox: true },
  render: ({ column, hovered, value, hint, showActionIcon, showCheckbox }: RowArgs) => {
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;
    return (
      <div className="w-[220px]">
        <RecordTableRowCell
          column={column}
          hovered={hovered}
          value={value}
          hint={hint || undefined}
          showActionIcon={showActionIcon}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

type FormFieldArgs = {
  column: TableColumnPosition;
  hovered: boolean;
  prefix: string;
  value: string;
  placeholder: string;
  showCheckbox: boolean;
};

export const FormFieldRow: StoryObj<FormFieldArgs> = {
  argTypes: {
    column: { control: { type: 'inline-radio' }, options: ['first', 'center', 'last'] },
    hovered: { control: 'boolean' },
    prefix: { control: 'text', description: 'Prefix shown in the input.' },
    value: { control: 'text', description: 'Input value.' },
    placeholder: { control: 'text', description: 'Input placeholder.' },
    showCheckbox: { control: 'boolean', description: 'Show checkbox.' },
  },
  args: { column: 'first', hovered: false, prefix: '+', value: '', placeholder: '0', showCheckbox: true },
  render: ({ column, hovered, prefix, value, placeholder, showCheckbox }: FormFieldArgs) => {
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;
    return (
      <div className="w-[190px]">
        <RecordTableFormFieldCell
          column={column}
          hovered={hovered}
          prefix={prefix}
          value={value}
          placeholder={placeholder}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

type ActionArgs = {
  type: 'text' | 'icon';
  actionCount: 1 | 2 | 3 | 4;
  hovered: boolean;
  label: string;
};

export const ActionButtonRow: StoryObj<ActionArgs> = {
  argTypes: {
    type: { control: { type: 'inline-radio' }, options: ['text', 'icon'], description: 'TextLink or IconLink actions.' },
    actionCount: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4], description: 'Number of actions (max 3 for icon).' },
    hovered: { control: 'boolean' },
    label: { control: 'text', description: 'Label for text-type actions.', if: { arg: 'type', eq: 'text' } },
  },
  args: { type: 'text', actionCount: 1, hovered: false, label: 'Button' },
  render: ({ type, actionCount, hovered, label }: ActionArgs) => {
    const clampedCount = (type === 'icon' ? Math.min(actionCount, 3) : actionCount) as 1 | 2 | 3 | 4;
    return (
      <RecordTableActionCell
        type={type}
        actionCount={clampedCount}
        hovered={hovered}
        label={label}
      />
    );
  },
};

type ListingArgs = {
  column: 'first' | 'center';
  hovered: boolean;
  product: ProductKey;
  showCheckbox: boolean;
};

export const ListingRow: StoryObj<ListingArgs> = {
  argTypes: {
    column: { control: { type: 'inline-radio' }, options: ['first', 'center'] },
    hovered: { control: 'boolean' },
    product: {
      control: { type: 'select', labels: productKeyLabels },
      options: ['product-1', 'product-2', 'product-3', 'product-4', 'product-5'] satisfies ReadonlyArray<ProductKey>,
      description: 'Product record — changes name, image, iSKU and SKU together.',
    },
    showCheckbox: { control: 'boolean', description: 'Show checkbox.' },
  },
  args: { column: 'first', hovered: false, product: 'product-1', showCheckbox: true },
  render: ({ column, hovered, product, showCheckbox }: ListingArgs) => {
    const p = listingProducts[product];
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;
    return (
      <div className="w-[409px]">
        <RecordTableListingCell
          column={column}
          hovered={hovered}
          productName={p.productName}
          imageSrc={p.image.src}
          imageAlt={p.image.alt}
          iSku={p.iSku}
          sku={p.sku}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

type MoreInfoArgs = {
  column: 'first' | 'center';
  hovered: boolean;
  label: string;
  value: string;
  showExtraInfo: boolean;
  showTextLink: boolean;
  showCheckbox: boolean;
};

export const MoreInfoRow: StoryObj<MoreInfoArgs> = {
  argTypes: {
    column: { control: { type: 'inline-radio' }, options: ['first', 'center'] },
    hovered: { control: 'boolean' },
    label: { control: 'text', description: 'Info label (left side).' },
    value: { control: 'text', description: 'Info value (right side).' },
    showExtraInfo: { control: 'boolean', description: 'Show secondary Info 1 / Info 2 rows.' },
    showTextLink: { control: 'boolean', description: 'Show Edit TextLink below the info block.' },
    showCheckbox: { control: 'boolean', description: 'Show checkbox.' },
  },
  args: { column: 'first', hovered: false, label: 'Label:', value: 'Value', showExtraInfo: true, showTextLink: true, showCheckbox: true },
  render: ({ column, hovered, label, value, showExtraInfo, showTextLink, showCheckbox }: MoreInfoArgs) => {
    const checkboxProp: ReactNode = showCheckbox ? undefined : false;
    return (
      <div className="w-[227px]">
        <RecordTableMoreInfoCell
          column={column}
          hovered={hovered}
          label={label}
          value={value}
          showExtraInfo={showExtraInfo}
          showTextLink={showTextLink}
          checkbox={checkboxProp}
        />
      </div>
    );
  },
};

// ── Visual QA matrix stories (hidden from sidebar) ───────────────────────────

export const HeaderMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-14)] leading-[var(--leading-21)] text-[color:var(--color-text-primary)]">
        Visual check only. Use Header for copyable product code.
      </p>
      <div className="grid grid-cols-[96px_repeat(3,220px)] gap-[var(--spacing-12)] items-start">
        <span />
        {columns.map((column) => (
          <MatrixLabel key={column}>{column}</MatrixLabel>
        ))}
        {alignments.map((align) => (
          <Fragment key={align}>
            <MatrixLabel key={`${align}-label`}>{align}</MatrixLabel>
            {columns.map((column) => (
              <RecordTableHeaderCell
                key={`${column}-${align}`}
                column={column}
                align={align}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  ),
};

export const ListingMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(2,409px)] gap-[var(--spacing-16)] items-start">
      <span />
      {listingColumns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel key={`${hovered}-label`}>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {listingColumns.map((column) => (
            <RecordTableListingCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const FormFieldMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(3,190px)] gap-[var(--spacing-12)] items-start">
      <span />
      {columns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel key={`${hovered}-label`}>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {columns.map((column) => (
            <RecordTableFormFieldCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const ActionButtonMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(7,max-content)] gap-[var(--spacing-16)] items-start">
      <span />
      {[1, 2, 3, 4].map((count) => (
        <MatrixLabel key={`text-${count}`}>{count} action{count > 1 ? 's' : ''}</MatrixLabel>
      ))}
      {[1, 2, 3].map((count) => (
        <MatrixLabel key={`icon-${count}`}>{count} icon</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {[1, 2, 3, 4].map((count) => (
            <RecordTableActionCell
              key={`text-${count}-${hovered}`}
              type="text"
              actionCount={count as 1 | 2 | 3 | 4}
              hovered={hovered}
            />
          ))}
          {[1, 2, 3].map((count) => (
            <RecordTableActionCell
              key={`icon-${count}-${hovered}`}
              type="icon"
              actionCount={count as 1 | 2 | 3}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const DefaultRowMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(3,190px)] gap-[var(--spacing-12)] items-start">
      <span />
      {columns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {columns.map((column) => (
            <RecordTableRowCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const MoreInfoMatrix: Story = {
  tags: ['!dev', '!autodocs', 'visual-qa'],
  render: () => (
    <div className="grid grid-cols-[96px_repeat(2,227px)] gap-[var(--spacing-16)] items-start">
      <span />
      {listingColumns.map((column) => (
        <MatrixLabel key={column}>{column}</MatrixLabel>
      ))}
      {[false, true].map((hovered) => (
        <Fragment key={hovered ? 'hover' : 'default'}>
          <MatrixLabel>{hovered ? 'hover' : 'default'}</MatrixLabel>
          {listingColumns.map((column) => (
            <RecordTableMoreInfoCell
              key={`${column}-${hovered}`}
              column={column}
              hovered={hovered}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};
