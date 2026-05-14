import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell } from './TableCell';
import { TableCellInfo } from './TableCellInfo';
import { TableCellMainSub } from './TableCellMainSub';
import { TableCellListing } from './TableCellListing';
import { useState, type ReactNode } from 'react';
import { useArgs, useEffect } from 'storybook/preview-api';
import { TableHeaderCell, sortDirectionToAria } from '../TableHeaderCell';
import { Checkbox } from '../Checkbox';
import { Icon, type IconName } from '../Icon';
import { Tag } from '../Tag';
import { Pip, type PipType } from '../Pip';
import { TableExpandToggle } from '../TableExpandToggle';
import { NumberInput } from '../NumberInput';
import { Quantity, type QuantityState, type QuantityValidation } from '../Quantity';
import { TextLink } from '../TextLink';
import { IconLink } from '../IconLink';
import { Toggle } from '../Toggle';
import { ProductImage } from '../ProductImageList/ProductImage';
import { ProductImageList } from '../ProductImageList';
import sitegiantWebstore from '../../assets/channel-icons/sitegiant-webstore.png';
import lazadaMy from '../../assets/channel-icons/lazada-my.png';
import shopee from '../../assets/channel-icons/shopee.png';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import shopeeSg from '../../assets/channel-icons/shopee-sg.png';
import tiktokMy from '../../assets/channel-icons/tiktok-my.png';
import { productImages } from '../../assets/product-images';
import sitegiantDemoApp from '../../assets/method-images/sitegiant-demo-app.png';

type TableMode = 'default' | 'inset' | 'subrow';
type TableCellVariantOption =
  | 'text'
  | 'leading-icon'
  | 'info-icon'
  | 'small-channel-icon'
  | 'product-only'
  | 'tag-after'
  | 'tag-first'
  | 'action-text-links'
  | 'action-icon-buttons'
  | 'icon-status'
  | 'status-toggle'
  | 'text-info'
  | 'listing'
  | 'channel-icon'
  | 'payment-shipping-method'
  | 'form-field'
  | 'tag-with-channel';
type TableCellStoryArgs = React.ComponentProps<typeof TableCell> & {
  mode?: TableMode;
  variant?: TableCellVariantOption;
  previewIcon?: IconName;
  infoIcon?: IconName;
  smallChannelIconChannel?: ListingChannelOption;
  smallChannelIconLabel?: string;
  productCount?: 1 | 2 | 3 | 4 | 6;
  listingProduct?: ProductPreviewOption;
  listingTag?: ListingTagOption;
  listingChannel?: ListingChannelOption;
  showListingTag?: boolean;
  showListingInfoRows?: boolean;
  showListingChannel?: boolean;
  showListingMoreSkus?: boolean;
  listingMoreSkuCount?: number;
  listingTagControlVisible?: boolean;
  listingChannelControlVisible?: boolean;
  listingMoreSkuCountControlVisible?: boolean;
  childrenControlVisible?: boolean;
  typographyControlsVisible?: boolean;
  columnControlVisible?: boolean;
  checkboxControlVisible?: boolean;
  actionTextLinkCount?: 1 | 2 | 3 | 4;
  actionIconCount?: 1 | 2 | 3;
  iconStatusCount?: 1 | 2 | 3;
  // Row Builder
  columnCount?: 1 | 2 | 3 | 4 | 5 | 6;
  showHeader?: boolean;
  col1Variant?: TableCellVariantOption; col1Width?: 'auto' | 'fixed'; col1WidthPx?: number; col1Label?: string; col1Sortable?: boolean; col1Align?: 'left' | 'center' | 'right'; col1Checkbox?: boolean; col1HoverStyle?: 'off' | 'green-bold';
  col2Variant?: TableCellVariantOption; col2Width?: 'auto' | 'fixed'; col2WidthPx?: number; col2Label?: string; col2Sortable?: boolean; col2Align?: 'left' | 'center' | 'right';
  col3Variant?: TableCellVariantOption; col3Width?: 'auto' | 'fixed'; col3WidthPx?: number; col3Label?: string; col3Sortable?: boolean; col3Align?: 'left' | 'center' | 'right';
  col4Variant?: TableCellVariantOption; col4Width?: 'auto' | 'fixed'; col4WidthPx?: number; col4Label?: string; col4Sortable?: boolean; col4Align?: 'left' | 'center' | 'right';
  col5Variant?: TableCellVariantOption; col5Width?: 'auto' | 'fixed'; col5WidthPx?: number; col5Label?: string; col5Sortable?: boolean; col5Align?: 'left' | 'center' | 'right';
  col6Variant?: TableCellVariantOption; col6Width?: 'auto' | 'fixed'; col6WidthPx?: number; col6Label?: string; col6Sortable?: boolean; col6Align?: 'left' | 'center' | 'right';
  col2Visible?: boolean; col3Visible?: boolean; col4Visible?: boolean;
  col5Visible?: boolean; col6Visible?: boolean;
  col1WidthPxVisible?: boolean; col2WidthPxVisible?: boolean; col3WidthPxVisible?: boolean;
  col4WidthPxVisible?: boolean; col5WidthPxVisible?: boolean; col6WidthPxVisible?: boolean;
  tagCount?: 1 | 2 | 3;
  tagLabel1?: string;
  tagPipType1?: PipType;
  tagPipLabel1?: string;
  tagLabel2?: string;
  tagPipType2?: PipType;
  tagPipLabel2?: string;
  tagLabel3?: string;
  tagPipType3?: PipType;
  tagPipLabel3?: string;
  tagVariantControlsVisible?: boolean;
  tagRow2Visible?: boolean;
  tagRow3Visible?: boolean;
  statusToggleChecked?: boolean;
  formFieldValue?: number;
  textInfoBody?: string;
  textInfoWeight?: 'normal' | 'bold';
  textInfoChannel?: ListingChannelOption;
  textInfoLabel?: string;
  tagWithChannelCount?: 1 | 2 | 3;
  tagWithChannelTagLabel1?: string;
  tagWithChannelPipType1?: PipType;
  tagWithChannelPipLabel1?: string;
  tagWithChannelTagLabel2?: string;
  tagWithChannelPipType2?: PipType;
  tagWithChannelPipLabel2?: string;
  tagWithChannelTagLabel3?: string;
  tagWithChannelPipType3?: PipType;
  tagWithChannelPipLabel3?: string;
  tagWithChannelRow2Visible?: boolean;
  tagWithChannelRow3Visible?: boolean;
  tagWithChannelChannel?: ListingChannelOption;
  tagWithChannelLabel?: string;
};

const tableCellVariantOptions = [
  'text',
  'leading-icon',
  'info-icon',
  'small-channel-icon',
  'product-only',
  'tag-after',
  'tag-first',
  'action-text-links',
  'action-icon-buttons',
  'icon-status',
  'status-toggle',
  'text-info',
  'listing',
  'channel-icon',
  'payment-shipping-method',
  'form-field',
  'tag-with-channel',
] satisfies ReadonlyArray<TableCellVariantOption>;

const tableCellVariantLabels = {
  text: 'Text',
  'leading-icon': 'Leading Icon',
  'info-icon': 'Info Icon',
  'small-channel-icon': 'Small Channel Icon',
  'product-only': 'Product Only',
  'tag-after': 'Tag After',
  'tag-first': 'Tag First',
  'action-text-links': 'Action Text Links',
  'action-icon-buttons': 'Action Icon Buttons',
  'icon-status': 'Icon Status',
  'status-toggle': 'Status Toggle',
  'text-info': 'Text Info',
  listing: 'Listing',
  'channel-icon': 'Channel Icon',
  'payment-shipping-method': 'Payment / Shipping Method',
  'form-field': 'Form Field',
  'tag-with-channel': 'Tag With Channel',
} satisfies Record<TableCellVariantOption, string>;

const previewIconOptions = [
  'check',
  'info',
  'plus',
  'minus',
  'alert-circle',
  'refresh-cw',
] satisfies ReadonlyArray<IconName>;

const productPreviewOptions = [
  'product-1',
  'product-2',
  'product-3',
  'product-4',
  'product-5',
] as const;
type ProductPreviewOption = typeof productPreviewOptions[number];

const productPreviewLabels = {
  'product-1': 'Product 1',
  'product-2': 'Product 2',
  'product-3': 'Product 3',
  'product-4': 'Product 4',
  'product-5': 'Product 5',
} satisfies Record<ProductPreviewOption, string>;

const listingProducts = {
  'product-1': {
    image: productImages[0],
    productName: 'DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs',
    iSku: 'ISKU-LDC-240321-MY-0001',
    sku: 'DYN-4IN1-FRESH-10ML52',
  },
  'product-2': {
    image: productImages[1],
    productName: 'Premium Wireless Barcode Scanner USB-C Set',
    iSku: 'ISKU-BAR-240422-MY-0002',
    sku: 'SCAN-USB-C-PRO-BLK',
  },
  'product-3': {
    image: productImages[2],
    productName: 'Thermal Shipping Label Roll 100mm x 150mm',
    iSku: 'ISKU-LBL-240515-MY-0003',
    sku: 'LBL-100X150-500PCS',
  },
  'product-4': {
    image: productImages[3],
    productName: 'Eco Kraft Mailer Box Medium 30 Pieces',
    iSku: 'ISKU-PKG-240603-MY-0004',
    sku: 'BOX-KRAFT-M-30',
  },
  'product-5': {
    image: productImages[4],
    productName: 'Mini Desktop Receipt Printer Bluetooth',
    iSku: 'ISKU-PRT-240711-MY-0005',
    sku: 'PRT-BT-MINI-WHT',
  },
} satisfies Record<ProductPreviewOption, {
  image: typeof productImages[number];
  productName: string;
  iSku: string;
  sku: string;
}>;

const listingTagOptions = [
  'published',
  'draft',
  'syncing',
  'out-of-stock',
  'blocked',
] as const;
type ListingTagOption = typeof listingTagOptions[number];

const listingTags = {
  published: { label: 'Published', type: 'success' },
  draft: { label: 'Draft', type: 'muted' },
  syncing: { label: 'Syncing', type: 'info' },
  'out-of-stock': { label: 'Out of stock', type: 'warning' },
  blocked: { label: 'Blocked', type: 'blocked' },
} satisfies Record<ListingTagOption, { label: string; type: PipType }>;

const listingTagLabels = {
  published: 'Published',
  draft: 'Draft',
  syncing: 'Syncing',
  'out-of-stock': 'Out of stock',
  blocked: 'Blocked',
} satisfies Record<ListingTagOption, string>;

const listingChannelOptions = [
  'WEBSTORE',
  'SHOPEE_MY',
  'SHOPEE_SG',
  'LAZADA_MY',
  'TIKTOK_MY',
] as const;
type ListingChannelOption = typeof listingChannelOptions[number];

const listingChannels = {
  WEBSTORE: { label: 'WEBSTORE', image: sitegiantWebstore },
  SHOPEE_MY: { label: 'SHOPEE MY', image: shopeeMy },
  SHOPEE_SG: { label: 'SHOPEE SG', image: shopeeSg },
  LAZADA_MY: { label: 'LAZADA MY', image: lazadaMy },
  TIKTOK_MY: { label: 'TIKTOK MY', image: tiktokMy },
} satisfies Record<ListingChannelOption, { label: string; image: string }>;

const listingChannelLabels = {
  WEBSTORE: 'WEBSTORE',
  SHOPEE_MY: 'SHOPEE MY',
  SHOPEE_SG: 'SHOPEE SG',
  LAZADA_MY: 'LAZADA MY',
  TIKTOK_MY: 'TIKTOK MY',
} satisfies Record<ListingChannelOption, string>;

const legacyListingChannelMap: Record<string, ListingChannelOption> = {
  webstore: 'WEBSTORE',
  'shopee-my': 'SHOPEE_MY',
  'shopee-sg': 'SHOPEE_SG',
  'lazada-my': 'LAZADA_MY',
  'tiktok-my': 'TIKTOK_MY',
};

const normalizeListingChannel = (channel: ListingChannelOption | string): ListingChannelOption => {
  if (channel in listingChannels) {
    return channel as ListingChannelOption;
  }

  return legacyListingChannelMap[channel] ?? 'WEBSTORE';
};

const variantArgType = {
  control: { type: 'select', labels: tableCellVariantLabels },
  name: 'variant',
  options: tableCellVariantOptions,
  description: [
    'Body Cell atom variant for the Playground.',
    '',
    '- `text` - simple text-value cell. Use `align` for number alignment and `tone` for success/danger values.',
    '- `leading-icon` - generic leading glyph before text.',
    '- `info-icon` - inline info icon after text, 8px gap.',
    '- `small-channel-icon` - 21px channel icon with one-line text, 8px gap.',
    '- `product-only` - product image stack.',
    '- `tag-after` / `tag-first` - text with Pip tag placement.',
    '- `action-text-links` / `action-icon-buttons` - action cell recipes.',
    '- `icon-status` - status label with matching icon column.',
    '- `status-toggle` - toggle cell.',
    '- `text-info` - body text plus secondary app info.',
    '- `listing` - product listing content block.',
    '- `channel-icon` - large 48px channel icon plus store metadata.',
    '- `payment-shipping-method` - large method image plus store metadata.',
    '- `form-field` - quantity input cell.',
    '- `tag-with-channel` - tag stack plus channel metadata.',
  ].join('\n'),
  table: { category: '1. Variant', defaultValue: { summary: 'text' } },
} as const;

const meta = {
  title: 'Tables/Table Atoms/Body Cell',
  component: TableCell,
  parameters: {
    layout: 'padded',
    controls: {
      sort: 'none',
      exclude: ['inset', 'leadingIcon', 'trailing', 'className', 'onClick'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // ── 1. Variant (variant selector + per-variant preview controls) ─────────
    variant: variantArgType,

    previewIcon: {
      control: { type: 'select' },
      options: previewIconOptions,
      description: 'Playground-only icon used by the Leading Icon variant.',
      if: { arg: 'variant', eq: 'leading-icon' },
      table: { category: '1. Variant', defaultValue: { summary: 'check' } },
    },
    infoIcon: {
      control: { type: 'select' },
      options: previewIconOptions,
      description: 'Playground-only icon used by the Info Icon variant.',
      if: { arg: 'variant', eq: 'info-icon' },
      table: { category: '1. Variant', defaultValue: { summary: 'info' } },
    },
    children: {
      control: 'text',
      description: 'Cell text content. Used by `text`, `leading-icon`, and `info-icon` variants.',
      if: { arg: 'childrenControlVisible', truthy: true },
      table: { category: '1. Variant' },
    },
    childrenControlVisible: { table: { disable: true } },
    smallChannelIconChannel: {
      control: { type: 'select', labels: listingChannelLabels },
      options: listingChannelOptions,
      description: 'Playground-only channel icon for the Small Channel Icon variant.',
      if: { arg: 'variant', eq: 'small-channel-icon' },
      table: { category: '1. Variant', defaultValue: { summary: 'SHOPEE_MY' } },
    },
    smallChannelIconLabel: {
      control: 'text',
      description: 'Playground-only store name label for the Small Channel Icon variant.',
      if: { arg: 'variant', eq: 'small-channel-icon' },
      table: { category: '1. Variant', defaultValue: { summary: 'Awesome Store' } },
    },
    productCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4, 6],
      description: 'Playground-only product image count.',
      if: { arg: 'variant', eq: 'product-only' },
      table: { category: '1. Variant', defaultValue: { summary: '4' } },
    },
    tagCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3] satisfies ReadonlyArray<1 | 2 | 3>,
      description: 'Playground-only number of tag rows for the Tag After / Tag First variants.',
      if: { arg: 'tagVariantControlsVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: '1' } },
    },
    // Row 1 — always visible when variant is tag-after / tag-first
    tagLabel1: {
      control: 'text',
      description: 'Row 1 tag label.',
      if: { arg: 'tagVariantControlsVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label' } },
    },
    tagPipType1: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 1 Pip type.',
      if: { arg: 'tagVariantControlsVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagPipLabel1: {
      control: 'text',
      description: 'Row 1 Pip label.',
      if: { arg: 'tagVariantControlsVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    // Row 2 — visible when tagCount >= 2
    tagLabel2: {
      control: 'text',
      description: 'Row 2 tag label.',
      if: { arg: 'tagRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label' } },
    },
    tagPipType2: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 2 Pip type.',
      if: { arg: 'tagRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagPipLabel2: {
      control: 'text',
      description: 'Row 2 Pip label.',
      if: { arg: 'tagRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    // Row 3 — visible when tagCount >= 3
    tagLabel3: {
      control: 'text',
      description: 'Row 3 tag label.',
      if: { arg: 'tagRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label' } },
    },
    tagPipType3: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 3 Pip type.',
      if: { arg: 'tagRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagPipLabel3: {
      control: 'text',
      description: 'Row 3 Pip label.',
      if: { arg: 'tagRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    tagVariantControlsVisible: { table: { disable: true } },
    tagRow2Visible: { table: { disable: true } },
    tagRow3Visible: { table: { disable: true } },
    listingProduct: {
      control: { type: 'select', labels: productPreviewLabels },
      options: productPreviewOptions,
      description: 'Playground-only product record for the Listing variant. Image, product name, iSKU, and SKU change together.',
      if: { arg: 'variant', eq: 'listing' },
      table: { category: '1. Variant', defaultValue: { summary: 'Product 2' } },
    },
    showListingTag: {
      control: 'boolean',
      description: 'Playground-only switch for the listing status tag.',
      if: { arg: 'variant', eq: 'listing' },
      table: { category: '1. Variant', defaultValue: { summary: 'true' } },
    },
    listingTag: {
      control: { type: 'select', labels: listingTagLabels },
      options: listingTagOptions,
      description: 'Playground-only status tag for the Listing variant.',
      if: { arg: 'listingTagControlVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Published' } },
    },
    showListingInfoRows: {
      control: 'boolean',
      description: 'Playground-only switch for the listing iSKU/SKU rows.',
      if: { arg: 'variant', eq: 'listing' },
      table: { category: '1. Variant', defaultValue: { summary: 'true' } },
    },
    showListingChannel: {
      control: 'boolean',
      description: 'Playground-only switch for the listing channel label.',
      if: { arg: 'variant', eq: 'listing' },
      table: { category: '1. Variant', defaultValue: { summary: 'true' } },
    },
    listingChannel: {
      control: { type: 'select', labels: listingChannelLabels },
      options: listingChannelOptions,
      description: 'Playground-only channel icon for the Listing variant.',
      if: { arg: 'listingChannelControlVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'WEBSTORE' } },
    },
    showListingMoreSkus: {
      control: 'boolean',
      description: 'Playground-only switch for the listing more-SKUs link.',
      if: { arg: 'variant', eq: 'listing' },
      table: { category: '1. Variant', defaultValue: { summary: 'true' } },
    },
    listingMoreSkuCount: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Playground-only count shown in the listing more-SKUs link.',
      if: { arg: 'listingMoreSkuCountControlVisible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: '5' } },
    },
    listingTagControlVisible: { table: { disable: true } },
    listingChannelControlVisible: { table: { disable: true } },
    listingMoreSkuCountControlVisible: { table: { disable: true } },
    statusToggleChecked: {
      control: 'boolean',
      description: 'Playground-only checked state for the Status Toggle variant.',
      if: { arg: 'variant', eq: 'status-toggle' },
      table: { category: '1. Variant', defaultValue: { summary: 'true' } },
    },
    iconStatusCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3] satisfies ReadonlyArray<1 | 2 | 3>,
      description: 'Playground-only number of status rows for the Icon Status variant.',
      if: { arg: 'variant', eq: 'icon-status' },
      table: { category: '1. Variant', defaultValue: { summary: '3' } },
    },
    actionTextLinkCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4] satisfies ReadonlyArray<1 | 2 | 3 | 4>,
      description: 'Playground-only number of action links for the Action Text Links variant.',
      if: { arg: 'variant', eq: 'action-text-links' },
      table: { category: '1. Variant', defaultValue: { summary: '2' } },
    },
    actionIconCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3] satisfies ReadonlyArray<1 | 2 | 3>,
      description: 'Playground-only number of action icon buttons for the Action Icon Buttons variant.',
      if: { arg: 'variant', eq: 'action-icon-buttons' },
      table: { category: '1. Variant', defaultValue: { summary: '3' } },
    },
    formFieldValue: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Playground-only quantity value for the Form Field variant.',
      if: { arg: 'variant', eq: 'form-field' },
      table: { category: '1. Variant', defaultValue: { summary: '1' } },
    },
    textInfoBody: {
      control: 'text',
      description: 'Playground-only body text for the Text Info variant.',
      if: { arg: 'variant', eq: 'text-info' },
      table: { category: '1. Variant', defaultValue: { summary: 'Table Body Data' } },
    },
    textInfoWeight: {
      control: { type: 'inline-radio' },
      options: ['normal', 'bold'] satisfies ReadonlyArray<'normal' | 'bold'>,
      description: 'Playground-only body text weight for the Text Info variant.',
      if: { arg: 'variant', eq: 'text-info' },
      table: { category: '1. Variant', defaultValue: { summary: 'normal' } },
    },
    textInfoChannel: {
      control: { type: 'select', labels: listingChannelLabels },
      options: listingChannelOptions,
      description: 'Playground-only channel icon for the Text Info variant.',
      if: { arg: 'variant', eq: 'text-info' },
      table: { category: '1. Variant', defaultValue: { summary: 'SHOPEE_MY' } },
    },
    textInfoLabel: {
      control: 'text',
      description: 'Playground-only info label for the Text Info variant.',
      if: { arg: 'variant', eq: 'text-info' },
      table: { category: '1. Variant', defaultValue: { summary: 'Info' } },
    },
    tagWithChannelCount: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3] satisfies ReadonlyArray<1 | 2 | 3>,
      description: 'Playground-only number of tag rows for the Tag With Channel variant.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: '2' } },
    },
    // Row 1 (always visible when variant=tag-with-channel)
    tagWithChannelTagLabel1: {
      control: 'text',
      description: 'Row 1 tag label.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label 1' } },
    },
    tagWithChannelPipType1: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 1 Pip type.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagWithChannelPipLabel1: {
      control: 'text',
      description: 'Row 1 Pip label.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    // Row 2 (visible when count >= 2)
    tagWithChannelTagLabel2: {
      control: 'text',
      description: 'Row 2 tag label.',
      if: { arg: 'tagWithChannelRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label 2' } },
    },
    tagWithChannelPipType2: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 2 Pip type.',
      if: { arg: 'tagWithChannelRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagWithChannelPipLabel2: {
      control: 'text',
      description: 'Row 2 Pip label.',
      if: { arg: 'tagWithChannelRow2Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    // Row 3 (visible when count >= 3)
    tagWithChannelTagLabel3: {
      control: 'text',
      description: 'Row 3 tag label.',
      if: { arg: 'tagWithChannelRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Tag Label 3' } },
    },
    tagWithChannelPipType3: {
      control: { type: 'select' },
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'] satisfies ReadonlyArray<PipType>,
      description: 'Row 3 Pip type.',
      if: { arg: 'tagWithChannelRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'warning' } },
    },
    tagWithChannelPipLabel3: {
      control: 'text',
      description: 'Row 3 Pip label.',
      if: { arg: 'tagWithChannelRow3Visible', truthy: true },
      table: { category: '1. Variant', defaultValue: { summary: 'Pip Text' } },
    },
    tagWithChannelRow2Visible: { table: { disable: true } },
    tagWithChannelRow3Visible: { table: { disable: true } },
    // Channel (always visible)
    tagWithChannelChannel: {
      control: { type: 'select', labels: listingChannelLabels },
      options: listingChannelOptions,
      description: 'Playground-only channel icon for the Tag With Channel variant.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: 'WEBSTORE' } },
    },
    tagWithChannelLabel: {
      control: 'text',
      description: 'Playground-only channel name label for the Tag With Channel variant.',
      if: { arg: 'variant', eq: 'tag-with-channel' },
      table: { category: '1. Variant', defaultValue: { summary: 'Company Name' } },
    },

    // ── 2. Layout ────────────────────────────────────────────────────────────
    mode: {
      control: { type: 'inline-radio' },
      options: ['default', 'inset', 'subrow'] satisfies ReadonlyArray<TableMode>,
      description: 'Storybook control for table surface. `subrow` maps to the component `subrow` prop.',
      table: { category: '2. Layout', defaultValue: { summary: 'default' } },
    },
    column: {
      control: { type: 'inline-radio' },
      options: ['first', 'center', 'last'],
      if: { arg: 'columnControlVisible', truthy: true },
      table: { category: '2. Layout' },
    },
    columnControlVisible: { table: { disable: true } },
    align: {
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'],
      if: { arg: 'typographyControlsVisible', truthy: true },
      table: { category: '2. Layout' },
    },
    row: {
      control: { type: 'inline-radio' },
      options: ['default', 'last'],
      description: 'Default row or final-row styling. Use `last` only for the final row in a table.',
      table: { category: '2. Layout' },
    },

    // ── 3. Content ───────────────────────────────────────────────────────────
    checkbox: {
      control: { type: 'boolean' },
      description: 'Storybook-only switch. Shows a row-selection checkbox slot without overriding the selected column padding.',
      if: { arg: 'checkboxControlVisible', truthy: true },
      table: { category: '3. Content', defaultValue: { summary: 'false' } },
    },
    checkboxControlVisible: { table: { disable: true } },

    // ── 5. State (follows Typography due to Storybook component-inference order) ──
    hovered: { control: 'boolean', table: { category: '5. State' } },
    selected: { control: 'boolean', table: { category: '5. State' } },

    // ── 4. Typography ────────────────────────────────────────────────────────
    weight: {
      control: { type: 'inline-radio' },
      options: ['normal', 'bold'],
      description: 'Text weight for simple cell content. When `variant` is `listing`, this controls only the product name.',
      if: { arg: 'typographyControlsVisible', truthy: true },
      table: { category: '4. Typography' },
    },
    tone: {
      control: { type: 'inline-radio' },
      options: ['default', 'success', 'danger'],
      if: { arg: 'typographyControlsVisible', truthy: true },
      table: { category: '4. Typography' },
    },
    boldOnRowHover: {
      control: 'boolean',
      if: { arg: 'typographyControlsVisible', truthy: true },
      table: { category: '4. Typography' },
    },
    typographyControlsVisible: { table: { disable: true } },

    // ── hidden ───────────────────────────────────────────────────────────────
    inset: { table: { disable: true } },
    subrow: { table: { disable: true } },
    leadingIcon: { table: { disable: true } },
    trailing: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
  args: {
    variant: 'text',
    mode: 'default',
    children: 'Table Body Data',
    column: 'center',
    align: 'left',
    weight: 'normal',
    tone: 'default',
    row: 'default',
    hovered: false,
    selected: false,
    boldOnRowHover: false,
    checkbox: false,
    previewIcon: 'check',
    infoIcon: 'info',
    smallChannelIconChannel: 'SHOPEE_MY',
    smallChannelIconLabel: 'Awesome Store',
    productCount: 4,
    listingProduct: 'product-2',
    showListingTag: true,
    listingTag: 'published',
    showListingInfoRows: true,
    showListingChannel: true,
    listingChannel: 'WEBSTORE',
    showListingMoreSkus: true,
    listingMoreSkuCount: 5,
    listingTagControlVisible: false,
    listingChannelControlVisible: false,
    listingMoreSkuCountControlVisible: false,
    childrenControlVisible: true,
    typographyControlsVisible: true,
    columnControlVisible: true,
    checkboxControlVisible: true,
    tagCount: 1,
    tagLabel1: 'Tag Label',
    tagPipType1: 'warning',
    tagPipLabel1: 'Pip Text',
    tagLabel2: 'Tag Label',
    tagPipType2: 'warning',
    tagPipLabel2: 'Pip Text',
    tagLabel3: 'Tag Label',
    tagPipType3: 'warning',
    tagPipLabel3: 'Pip Text',
    tagVariantControlsVisible: false,
    tagRow2Visible: false,
    tagRow3Visible: false,
    statusToggleChecked: true,
    iconStatusCount: 3,
    actionTextLinkCount: 2,
    actionIconCount: 3,
    formFieldValue: 1,
    textInfoBody: 'Table Body Data',
    textInfoWeight: 'normal',
    textInfoChannel: 'SHOPEE_MY',
    textInfoLabel: 'Info',
    tagWithChannelCount: 2,
    tagWithChannelTagLabel1: 'Tag Label 1',
    tagWithChannelPipType1: 'warning',
    tagWithChannelPipLabel1: 'Pip Text',
    tagWithChannelTagLabel2: 'Tag Label 2',
    tagWithChannelPipType2: 'warning',
    tagWithChannelPipLabel2: 'Pip Text',
    tagWithChannelTagLabel3: 'Tag Label 3',
    tagWithChannelPipType3: 'warning',
    tagWithChannelPipLabel3: 'Pip Text',
    tagWithChannelRow2Visible: true,
    tagWithChannelRow3Visible: false,
    tagWithChannelChannel: 'WEBSTORE',
    tagWithChannelLabel: 'Company Name',
  },
  render: ({
    mode = 'default',
    variant = 'text',
    inset,
    column,
    checkbox,
    previewIcon = 'check',
    infoIcon = 'info',
    smallChannelIconChannel = 'SHOPEE_MY',
    smallChannelIconLabel = 'Awesome Store',
    productCount = 4,
    listingProduct = 'product-2',
    showListingTag = true,
    listingTag = 'published',
    showListingInfoRows = true,
    showListingChannel = true,
    listingChannel = 'WEBSTORE',
    showListingMoreSkus = true,
    listingMoreSkuCount = 5,
    listingTagControlVisible = false,
    listingChannelControlVisible = false,
    listingMoreSkuCountControlVisible = false,
    childrenControlVisible = true,
    typographyControlsVisible = true,
    columnControlVisible = true,
    checkboxControlVisible = true,
    tagCount = 1,
    tagLabel1 = 'Tag Label',
    tagPipType1 = 'warning' as PipType,
    tagPipLabel1 = 'Pip Text',
    tagLabel2 = 'Tag Label',
    tagPipType2 = 'warning' as PipType,
    tagPipLabel2 = 'Pip Text',
    tagLabel3 = 'Tag Label',
    tagPipType3 = 'warning' as PipType,
    tagPipLabel3 = 'Pip Text',
    tagVariantControlsVisible = false,
    tagRow2Visible = false,
    tagRow3Visible = false,
    statusToggleChecked = true,
    iconStatusCount = 3,
    actionTextLinkCount = 2,
    actionIconCount = 3,
    formFieldValue = 1,
    tagWithChannelCount = 2,
    tagWithChannelTagLabel1 = 'Tag Label 1',
    tagWithChannelPipType1 = 'warning',
    tagWithChannelPipLabel1 = 'Pip Text',
    tagWithChannelTagLabel2 = 'Tag Label 2',
    tagWithChannelPipType2 = 'warning',
    tagWithChannelPipLabel2 = 'Pip Text',
    tagWithChannelTagLabel3 = 'Tag Label 3',
    tagWithChannelPipType3 = 'warning',
    tagWithChannelPipLabel3 = 'Pip Text',
    tagWithChannelRow2Visible = true,
    tagWithChannelRow3Visible = false,
    tagWithChannelChannel = 'WEBSTORE',
    tagWithChannelLabel = 'Company Name',
    textInfoBody = 'Table Body Data',
    textInfoWeight = 'normal' as const,
    textInfoChannel = 'SHOPEE_MY' as ListingChannelOption,
    textInfoLabel = 'Info',
    ...args
  }) => {
    const [, updateArgs] = useArgs<TableCellStoryArgs>();
    const isSubrow = mode === 'subrow';
    const isInsetMode = mode === 'inset' || isSubrow || inset;
    const showCheckbox = Boolean(checkbox);
    const columnWithCheckbox = column;
    const variantsWithChildren: TableCellVariantOption[] = ['text', 'leading-icon', 'info-icon'];
    const nextChildrenControlVisible = variantsWithChildren.includes(variant);
    const variantsWithoutTypography: TableCellVariantOption[] = ['listing', 'tag-with-channel', 'form-field', 'payment-shipping-method', 'channel-icon', 'text-info', 'status-toggle', 'product-only', 'tag-after', 'tag-first', 'action-text-links', 'action-icon-buttons', 'icon-status'];
    const actionVariants: TableCellVariantOption[] = ['action-text-links', 'action-icon-buttons'];
    const nextColumnControlVisible = !actionVariants.includes(variant);
    const nextCheckboxControlVisible = !actionVariants.includes(variant);
    const tagVariants: TableCellVariantOption[] = ['tag-after', 'tag-first'];
    const nextTagVariantControlsVisible = tagVariants.includes(variant);
    const nextTagRow2Visible = tagVariants.includes(variant) && tagCount >= 2;
    const nextTagRow3Visible = tagVariants.includes(variant) && tagCount >= 3;
    const nextTypographyControlsVisible = !variantsWithoutTypography.includes(variant);
    const nextTagWithChannelRow2Visible = variant === 'tag-with-channel' && tagWithChannelCount >= 2;
    const nextTagWithChannelRow3Visible = variant === 'tag-with-channel' && tagWithChannelCount >= 3;
    const nextListingTagControlVisible = variant === 'listing' && showListingTag;
    const nextListingChannelControlVisible = variant === 'listing' && showListingChannel;
    const nextListingMoreSkuCountControlVisible = variant === 'listing' && showListingMoreSkus;

    useEffect(() => {
      const nextControlVisibility: Partial<TableCellStoryArgs> = {};

      if (childrenControlVisible !== nextChildrenControlVisible) {
        nextControlVisibility.childrenControlVisible = nextChildrenControlVisible;
      }

      if (typographyControlsVisible !== nextTypographyControlsVisible) {
        nextControlVisibility.typographyControlsVisible = nextTypographyControlsVisible;
      }

      if (columnControlVisible !== nextColumnControlVisible) {
        nextControlVisibility.columnControlVisible = nextColumnControlVisible;
      }

      if (checkboxControlVisible !== nextCheckboxControlVisible) {
        nextControlVisibility.checkboxControlVisible = nextCheckboxControlVisible;
      }

      if (tagVariantControlsVisible !== nextTagVariantControlsVisible) {
        nextControlVisibility.tagVariantControlsVisible = nextTagVariantControlsVisible;
      }

      if (tagRow2Visible !== nextTagRow2Visible) {
        nextControlVisibility.tagRow2Visible = nextTagRow2Visible;
      }

      if (tagRow3Visible !== nextTagRow3Visible) {
        nextControlVisibility.tagRow3Visible = nextTagRow3Visible;
      }

      if (tagWithChannelRow2Visible !== nextTagWithChannelRow2Visible) {
        nextControlVisibility.tagWithChannelRow2Visible = nextTagWithChannelRow2Visible;
      }

      if (tagWithChannelRow3Visible !== nextTagWithChannelRow3Visible) {
        nextControlVisibility.tagWithChannelRow3Visible = nextTagWithChannelRow3Visible;
      }

      if (listingTagControlVisible !== nextListingTagControlVisible) {
        nextControlVisibility.listingTagControlVisible = nextListingTagControlVisible;
      }

      if (listingChannelControlVisible !== nextListingChannelControlVisible) {
        nextControlVisibility.listingChannelControlVisible = nextListingChannelControlVisible;
      }

      if (listingMoreSkuCountControlVisible !== nextListingMoreSkuCountControlVisible) {
        nextControlVisibility.listingMoreSkuCountControlVisible = nextListingMoreSkuCountControlVisible;
      }

      if (Object.keys(nextControlVisibility).length > 0) {
        updateArgs(nextControlVisibility);
      }
    }, [
      childrenControlVisible,
      nextChildrenControlVisible,
      typographyControlsVisible,
      nextTypographyControlsVisible,
      columnControlVisible,
      nextColumnControlVisible,
      checkboxControlVisible,
      nextCheckboxControlVisible,
      tagVariantControlsVisible,
      nextTagVariantControlsVisible,
      tagRow2Visible,
      nextTagRow2Visible,
      tagRow3Visible,
      nextTagRow3Visible,
      tagWithChannelRow2Visible,
      nextTagWithChannelRow2Visible,
      tagWithChannelRow3Visible,
      nextTagWithChannelRow3Visible,
      listingChannelControlVisible,
      listingMoreSkuCountControlVisible,
      listingTagControlVisible,
      nextListingChannelControlVisible,
      nextListingMoreSkuCountControlVisible,
      nextListingTagControlVisible,
      updateArgs,
    ]);

    if (variant === 'product-only') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
            hovered={args.hovered}
            selected={args.selected}
            className={isInsetMode ? '!items-start' : undefined}
          >
            <ProductOnlyContent count={productCount} />
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'tag-after' || variant === 'tag-first') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
            hovered={args.hovered}
            selected={args.selected}
            className={isInsetMode ? '!items-start' : undefined}
          >
            <TagPair
              order={variant === 'tag-after' ? 'after' : 'first'}
              rows={[
                { label: tagLabel1, pipType: tagPipType1, pipLabel: tagPipLabel1 },
                ...(tagCount >= 2 ? [{ label: tagLabel2, pipType: tagPipType2, pipLabel: tagPipLabel2 }] : []),
                ...(tagCount >= 3 ? [{ label: tagLabel3, pipType: tagPipType3, pipLabel: tagPipLabel3 }] : []),
              ]}
            />
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'action-text-links' || variant === 'action-icon-buttons') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column="last"
            hovered={args.hovered}
            selected={args.selected}
            className={variant === 'action-text-links' ? '!items-start' : undefined}
          >
            {variant === 'action-text-links' ? <ActionLinks count={actionTextLinkCount} /> : <ActionIcons count={actionIconCount} />}
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'icon-status' || variant === 'status-toggle') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
            hovered={args.hovered}
            selected={args.selected}
            className={
              variant === 'status-toggle' && !isInsetMode
                ? '!items-center'
                : variant === 'icon-status' && isInsetMode
                  ? '!items-start'
                  : undefined
            }
          >
            {variant === 'icon-status' ? <IconStatus count={iconStatusCount} /> : <StatusToggleCell checked={statusToggleChecked} />}
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'text-info') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
            hovered={args.hovered}
            selected={args.selected}
            className={isInsetMode ? '!items-start' : undefined}
          >
            <TextInfoContent
              body={textInfoBody}
              textWeight={textInfoWeight}
              channel={textInfoChannel}
              label={textInfoLabel}
            />
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'listing') {
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            weight="normal"
            hovered={args.hovered}
            selected={args.selected}
            className={isInsetMode ? '!items-start' : undefined}
          >
            <DefaultListingContent
              showCheckbox={showCheckbox}
              product={listingProduct}
              listingTag={listingTag}
              listingChannel={listingChannel}
              showTag={showListingTag}
              showInfoRows={showListingInfoRows}
              showChannel={showListingChannel}
              showMoreSkus={showListingMoreSkus}
              moreSkuCount={listingMoreSkuCount}
              productNameWeight={args.weight}
            />
          </TableCell>
        </RowHoverPreview>
      );
    }

    if (variant === 'channel-icon' || variant === 'payment-shipping-method' || variant === 'form-field' || variant === 'tag-with-channel') {
      const isFormField = variant === 'form-field';
      const isTagWithChannel = variant === 'tag-with-channel';
      const isPaymentShipping = variant === 'payment-shipping-method';
      const isChannelIcon = variant === 'channel-icon';
      return (
        <RowHoverPreview>
          <TableCell
            inset={isInsetMode}
            subrow={isSubrow}
            row={args.row}
            column={columnWithCheckbox}
            checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
            className={
              isFormField
                ? ['!items-center', formFieldColumnClass(columnWithCheckbox)].filter(Boolean).join(' ')
                : (isPaymentShipping || isChannelIcon || isTagWithChannel) && isInsetMode
                  ? '!items-start'
                  : undefined
            }
            hovered={args.hovered}
            selected={args.selected}
          >
            {variant === 'channel-icon' && <ChannelIconContent />}
            {variant === 'payment-shipping-method' && <PaymentShippingMethodContent />}
            {variant === 'form-field' && <FormFieldContent value={String(formFieldValue)} />}
            {variant === 'tag-with-channel' && (
              <TagWithChannelContent
                rows={[
                  { tagLabel: tagWithChannelTagLabel1, pipType: tagWithChannelPipType1, pipLabel: tagWithChannelPipLabel1 },
                  ...(tagWithChannelCount >= 2 ? [{ tagLabel: tagWithChannelTagLabel2, pipType: tagWithChannelPipType2, pipLabel: tagWithChannelPipLabel2 }] : []),
                  ...(tagWithChannelCount >= 3 ? [{ tagLabel: tagWithChannelTagLabel3, pipType: tagWithChannelPipType3, pipLabel: tagWithChannelPipLabel3 }] : []),
                ]}
                channel={tagWithChannelChannel}
                label={tagWithChannelLabel}
              />
            )}
          </TableCell>
        </RowHoverPreview>
      );
    }

    const cellContent = variant === 'leading-icon'
      ? (
          <span className="inline-flex items-center gap-[var(--spacing-12)]">
            <Icon name={previewIcon} size={17} className="text-[color:var(--color-icon-secondary)]" />
            <span>{args.children}</span>
          </span>
        )
      : variant === 'small-channel-icon'
        ? (
            <span className="inline-flex items-center gap-[var(--spacing-8)]">
              <img src={listingChannels[normalizeListingChannel(smallChannelIconChannel)].image} alt="" className="w-[21px] h-[21px] rounded-[var(--radius-2)] object-cover" />
              <span>{smallChannelIconLabel}</span>
            </span>
          )
        : variant === 'info-icon'
          ? (
              <span className="inline-flex items-center gap-[var(--spacing-8)]">
                <span>{args.children}</span>
                <Icon name={infoIcon} size={17} className="text-[color:var(--color-icon-secondary)]" />
              </span>
            )
          : args.children;

    return (
      <RowHoverPreview>
        <TableCell
          {...args}
          column={columnWithCheckbox}
          align={args.align}
          tone={args.tone}
          inset={isInsetMode}
          subrow={isSubrow}
          checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
        >
          {cellContent}
        </TableCell>
      </RowHoverPreview>
    );
  },
} satisfies Meta<TableCellStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
type ProductOnlyStory = StoryObj<React.ComponentProps<typeof TableCell> & { productCount?: 1 | 2 | 3 | 4 | 6 }>;
type TagRecipeStory = StoryObj<React.ComponentProps<typeof TableCell> & { tagCount?: 1 | 2 | 3 }>;
type ActionTextLinkStory = StoryObj<React.ComponentProps<typeof TableCell> & { actionCount?: 1 | 2 | 3 | 4 }>;
type ActionIconButtonStory = StoryObj<React.ComponentProps<typeof TableCell> & { actionCount?: 1 | 2 | 3 }>;
type IconStatusStory = StoryObj<React.ComponentProps<typeof TableCell> & { statusCount?: 1 | 2 | 3 }>;
type TextInfoStory = StoryObj<React.ComponentProps<typeof TableCell> & { textWeight?: 'normal' | 'bold' }>;
type MainSubStory = StoryObj<React.ComponentProps<typeof TableCell> & {
  mainLabel?: string;
  mainValue?: string;
  subLabel?: string;
  subValue?: string;
  mainBold?: boolean;
}>;
type ListingStory = StoryObj<React.ComponentProps<typeof TableCell> & {
  productName?: string;
  withListingCheckbox?: boolean;
  withTag?: boolean;
  withInfoRows?: boolean;
  withExtras?: boolean;
}>;
type DefaultInfoStory = StoryObj<React.ComponentProps<typeof TableCell> & {
  alignment?: 'horizontal' | 'vertical';
  statusCount?: 1 | 2 | 3;
  paragraphCount?: 1 | 2 | 3;
}>;

const hiddenControl = { control: false, table: { disable: true } } as const;
const hiddenStoryTags = ['!dev', '!autodocs'];

const typographyStatePlaygroundControls = {
  variant: hiddenControl,
  mode: hiddenControl,
  children: hiddenControl,
  column: hiddenControl,
  align: hiddenControl,
  row: hiddenControl,
  subrow: hiddenControl,
  inset: hiddenControl,
  checkbox: hiddenControl,
  leadingIcon: hiddenControl,
  trailing: hiddenControl,
  className: hiddenControl,
};

const playgroundOnlyControls = {
  previewIcon: hiddenControl, infoIcon: hiddenControl,
  smallChannelIconChannel: hiddenControl, smallChannelIconLabel: hiddenControl,
  productCount: hiddenControl,
  tagCount: hiddenControl,
  tagLabel1: hiddenControl, tagPipType1: hiddenControl, tagPipLabel1: hiddenControl,
  tagLabel2: hiddenControl, tagPipType2: hiddenControl, tagPipLabel2: hiddenControl,
  tagLabel3: hiddenControl, tagPipType3: hiddenControl, tagPipLabel3: hiddenControl,
  tagVariantControlsVisible: hiddenControl, tagRow2Visible: hiddenControl, tagRow3Visible: hiddenControl,
  listingProduct: hiddenControl, showListingTag: hiddenControl, listingTag: hiddenControl,
  showListingInfoRows: hiddenControl, showListingChannel: hiddenControl, listingChannel: hiddenControl,
  showListingMoreSkus: hiddenControl, listingMoreSkuCount: hiddenControl,
  listingTagControlVisible: hiddenControl, listingChannelControlVisible: hiddenControl, listingMoreSkuCountControlVisible: hiddenControl,
  statusToggleChecked: hiddenControl, iconStatusCount: hiddenControl,
  actionTextLinkCount: hiddenControl, actionIconCount: hiddenControl,
  formFieldValue: hiddenControl,
  textInfoBody: hiddenControl, textInfoWeight: hiddenControl, textInfoChannel: hiddenControl, textInfoLabel: hiddenControl,
  tagWithChannelCount: hiddenControl,
  tagWithChannelTagLabel1: hiddenControl, tagWithChannelPipType1: hiddenControl, tagWithChannelPipLabel1: hiddenControl,
  tagWithChannelTagLabel2: hiddenControl, tagWithChannelPipType2: hiddenControl, tagWithChannelPipLabel2: hiddenControl,
  tagWithChannelTagLabel3: hiddenControl, tagWithChannelPipType3: hiddenControl, tagWithChannelPipLabel3: hiddenControl,
  tagWithChannelRow2Visible: hiddenControl, tagWithChannelRow3Visible: hiddenControl,
  tagWithChannelChannel: hiddenControl, tagWithChannelLabel: hiddenControl,
  childrenControlVisible: hiddenControl, typographyControlsVisible: hiddenControl,
  columnControlVisible: hiddenControl, checkboxControlVisible: hiddenControl,
  showHeader: hiddenControl,
  col1Label: hiddenControl, col2Label: hiddenControl, col3Label: hiddenControl,
  col4Label: hiddenControl, col5Label: hiddenControl, col6Label: hiddenControl,
  col1Sortable: hiddenControl, col2Sortable: hiddenControl, col3Sortable: hiddenControl,
  col4Sortable: hiddenControl, col5Sortable: hiddenControl, col6Sortable: hiddenControl,
  col1Align: hiddenControl, col2Align: hiddenControl, col3Align: hiddenControl,
  col4Align: hiddenControl, col5Align: hiddenControl, col6Align: hiddenControl,
  col1HoverStyle: hiddenControl,
};

const recipeOnlyControls = {
  mode: hiddenControl,
  variant: hiddenControl,
  children: hiddenControl,
  inset: hiddenControl,
  column: hiddenControl,
  align: hiddenControl,
  weight: hiddenControl,
  tone: hiddenControl,
  boldOnRowHover: hiddenControl,
  row: hiddenControl,
  hovered: hiddenControl,
  selected: hiddenControl,
  subrow: hiddenControl,
  checkbox: hiddenControl,
  leadingIcon: hiddenControl,
  trailing: hiddenControl,
  className: hiddenControl,
};

const visualReferenceParameters = {
  controls: { disable: true },
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
      <span key={index} className="inline-flex items-start py-[var(--spacing-2)]">
        <TextLink
          label="Button"
          iconPosition="left"
          icon={<Icon name="plus" size={17} />}
        />
      </span>
    ))}
  </span>
</TableCell>
  </td>
</tr>`;

const actionIconsSource = (count: 1 | 2 | 3) => `<tr className="group/row hover:[&_td>div]:bg-[var(--table-body-hover-fill)]">
  <td className="p-0">
    <TableCell column="last">
  <span className="inline-flex items-center gap-[var(--spacing-6)]">
    {Array.from({ length: ${count} }).map((_, index) => (
      <IconLink
        key={index}
        icon="plus"
        aria-label={\`Action \${index + 1}\`}
        showTooltip={false}
        className="inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)] text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)] cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]"
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
          WEBSTORE
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
    <span className="inline-flex h-[48px] w-[120px] shrink-0 overflow-hidden rounded-[var(--radius-4)] border border-[color:var(--color-product-image-border)]">
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
const insetHoverRowClass   = 'group/row hover:[&_td>div]:bg-[var(--table-inset-body-hover-fill)]';
const subrowHoverRowClass  = 'group/row hover:[&_td>div]:bg-[var(--table-inset-subrow-hover-fill)]';

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

const ShopeeIcon = () => (
  <img src={shopeeMy} alt="" className="w-[21px] h-[21px] rounded-[var(--radius-2)] object-cover" />
);

export const Playground: Story = {
  args: {
    mode: 'default',
    variant: 'text',
    column: 'center',
    align: 'left',
    weight: 'normal',
    tone: 'default',
    row: 'default',
    hovered: false,
    selected: false,
    boldOnRowHover: false,
    checkbox: false,
    children: 'Table Body Data',
  },
};

export const TypographyStateControls: Story = {
  tags: hiddenStoryTags,
  argTypes: typographyStatePlaygroundControls,
  args: {
    mode: 'default',
    variant: 'text',
    column: 'center',
    align: 'left',
    weight: 'normal',
    tone: 'default',
    row: 'default',
    hovered: false,
    selected: false,
    boldOnRowHover: false,
    children: 'Table Body Data',
  },
};

export const Bold: Story = {
  tags: hiddenStoryTags,
  args: { weight: 'bold' },
};

export const Hovered: Story = {
  tags: hiddenStoryTags,
  args: { hovered: true },
};

export const NumberRightAligned: Story = {
  tags: hiddenStoryTags,
  args: { children: '123,456', align: 'right', column: 'center' },
};

export const SuccessValue: Story = {
  tags: hiddenStoryTags,
  args: { children: '+24.5%', tone: 'success', align: 'right', column: 'last' },
};

export const DangerValue: Story = {
  tags: hiddenStoryTags,
  args: { children: '-12.8%', tone: 'danger', align: 'right', column: 'last' },
};

export const FirstColumnWithCheckbox: Story = {
  tags: hiddenStoryTags,
  args: {
    column: 'first',
    children: 'Product name',
    checkbox: <Checkbox size="sm" />,
  },
};

export const WithLeadingIcon: Story = {
  tags: hiddenStoryTags,
  args: {
    children: 'Categorized item',
    leadingIcon: <Icon name="check" size={17} className="text-[color:var(--color-icon-secondary)]" />,
  },
};

export const WithSmallChannelIcon: Story = {
  tags: hiddenStoryTags,
  render: () => (
    <TableCell column="center" className="!gap-[var(--spacing-8)]" leadingIcon={<ShopeeIcon />}>
      Awesome Store
    </TableCell>
  ),
};

export const WithTrailingIcon: Story = {
  tags: hiddenStoryTags,
  render: () => (
    <TableCell column="last" align="right">
      <span className="inline-flex items-center gap-[var(--spacing-8)]">
        <span>12.5 kg</span>
        <Icon name="info" size={17} className="text-[color:var(--color-icon-secondary)]" />
      </span>
    </TableCell>
  ),
};

export const LastRow: Story = {
  tags: hiddenStoryTags,
  args: { row: 'last' },
};

/* ── Composite: a small table ────────────────────────── */
const Cell = ({ children, ...rest }: React.ComponentProps<typeof TableCell>) => (
  <td className="h-px p-0">
    <TableCell {...rest}>{children}</TableCell>
  </td>
);

const fullTableShellClass = 'overflow-hidden rounded-[var(--radius-12)] bg-[var(--table-body-fill)]';
const fullTableHeaderCellClass = '!min-h-[calc(var(--leading-21)+var(--spacing-40))]';






const ActionLinks = ({ count }: { count: 1 | 2 | 3 | 4 }) => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {Array.from({ length: count }).map((_, index) => (
      <span key={index} className="inline-flex items-start py-[var(--spacing-2)]">
        <TextLink
          label="Button"
          iconPosition="left"
          icon={<Icon name="plus" size={17} />}
        />
      </span>
    ))}
  </span>
);

type ActionIconDef = { icon: IconName; variant: 'basic' | 'danger-subtle' };

const actionIconClass: Record<'basic' | 'danger-subtle', string> = {
  'basic':
    'inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)] text-[color:var(--icon-link-basic-default)] hover:text-[color:var(--icon-link-basic-hover)] active:text-[color:var(--icon-link-basic-clicked)] cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]',
  'danger-subtle':
    'inline-flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-[var(--radius-120)] p-[var(--spacing-8)] text-[color:var(--icon-link-danger-subtle-default)] hover:text-[color:var(--icon-link-danger-subtle-hover)] active:text-[color:var(--icon-link-danger-subtle-clicked)] cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--button-primary-default-fill)]',
};

const ActionIcons = ({
  count,
  icons,
}: {
  count: 1 | 2 | 3;
  icons?: ActionIconDef[];
}) => (
  <span className="inline-flex items-center gap-[var(--spacing-6)]">
    {(icons ?? Array.from({ length: count }, () => ({ icon: 'plus' as IconName, variant: 'basic' as const }))).map((def, index) => (
      <IconLink
        key={index}
        icon={def.icon}
        aria-label={`Action ${index + 1}`}
        showTooltip={false}
        className={actionIconClass[def.variant]}
      />
    ))}
  </span>
);

const TagPair = ({
  order = 'after',
  rows = [{ label: 'Tag Label', pipType: 'warning' as PipType, pipLabel: 'Pip Text' }],
}: {
  order?: 'first' | 'after';
  rows?: Array<{ label: string; pipType: PipType; pipLabel: string }>;
}) => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
    {rows.map((row, index) => (
      <span key={index} className="inline-flex items-center gap-[var(--spacing-8)]">
        {order === 'first' && <Pip type={row.pipType} pipStyle="default" label={row.pipLabel} />}
        <span className="font-[family-name:var(--general-font-family)] text-[length:var(--table-body-size)] font-[var(--font-weight-regular)] leading-[var(--table-body-lineheight)] text-[color:var(--color-text-primary)]">
          {row.label}{rows.length > 1 ? ` ${index + 1}` : ''}
        </span>
        {order === 'after' && <Pip type={row.pipType} pipStyle="default" label={row.pipLabel} />}
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

const makeTagRows = (count: 1 | 2 | 3): Array<{ label: string; pipType: PipType; pipLabel: string }> =>
  Array.from({ length: count }, (_, i) => ({
    label: count > 1 ? `Tag Label ${i + 1}` : 'Tag Label',
    pipType: 'warning' as PipType,
    pipLabel: 'Pip Text',
  }));

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

const StatusToggleCell = ({ checked = true }: { checked?: boolean }) => <Toggle checked={checked} />;

const TextInfoContent = ({
  body = 'Table Body Data',
  textWeight = 'normal',
  channel = 'SHOPEE_MY' as ListingChannelOption,
  label = 'Info',
  greenHoverClass = '',
}: {
  body?: string;
  textWeight?: 'normal' | 'bold';
  channel?: ListingChannelOption;
  label?: string;
  greenHoverClass?: string;
}) => (
  <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
    <span
      className={[
        'max-w-full truncate text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)] text-[color:var(--table-body-text)]',
        textWeight === 'bold' ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
        greenHoverClass ? `group-hover/row:font-[var(--font-weight-bold)] ${greenHoverClass}` : '',
      ].join(' ')}
    >
      {body}
    </span>
    <span className="inline-flex items-center gap-[var(--spacing-4)]">
      <img src={listingChannels[normalizeListingChannel(channel)].image} alt="" className="size-[17px] rounded-[var(--radius-2)] object-cover" />
      <span className="whitespace-nowrap text-[length:var(--general-caption-size)] leading-[var(--general-caption-lineheight)] text-[color:var(--color-text-info)]">
        {label}
      </span>
    </span>
  </span>
);

const ListingExtras = ({
  channel = 'WEBSTORE',
  showChannel = true,
  showMoreSkus = true,
  moreSkuCount = 5,
}: {
  channel?: ListingChannelOption;
  showChannel?: boolean;
  showMoreSkus?: boolean;
  moreSkuCount?: number;
}) => {
  const channelData = listingChannels[normalizeListingChannel(channel)];
  const safeMoreSkuCount = Math.max(0, Math.floor(moreSkuCount));
  const moreSkuLabel = `${safeMoreSkuCount} more SKU${safeMoreSkuCount === 1 ? '' : 's'}`;

  return (
    <>
      {showChannel && (
        <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
          <img
            src={channelData.image}
            alt=""
            aria-hidden="true"
            width={15}
            height={15}
            className="shrink-0 block rounded-[var(--radius-4)]"
          />
          {channelData.label}
        </span>
      )}
      {showMoreSkus && (
        <button
          type="button"
          className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--text-link-basic-default)] cursor-pointer"
        >
          <Icon name="plus-square" size={15} />
          {moreSkuLabel}
        </button>
      )}
    </>
  );
};

const DefaultListingContent = ({
  showCheckbox = true,
  product = 'product-2',
  listingTag = 'published',
  listingChannel = 'WEBSTORE',
  showTag = true,
  showInfoRows = true,
  showChannel = true,
  showMoreSkus = true,
  moreSkuCount = 5,
  productNameWeight = 'bold',
  productNameGreenHoverClass = '',
}: {
  showCheckbox?: boolean;
  product?: ProductPreviewOption;
  listingTag?: ListingTagOption;
  listingChannel?: ListingChannelOption;
  showTag?: boolean;
  showInfoRows?: boolean;
  showChannel?: boolean;
  showMoreSkus?: boolean;
  moreSkuCount?: number;
  productNameWeight?: 'normal' | 'bold' | 'hover';
  productNameGreenHoverClass?: string;
}) => {
  const productRecord = listingProducts[product];
  const tag = listingTags[listingTag];
  const hasExtras = showChannel || showMoreSkus;

  return (
    <TableCellListing
      checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
      image={<ProductImage size="lg" src={productRecord.image.src} alt={productRecord.image.alt} />}
      tag={showTag ? <Pip type={tag.type} pipStyle="default" label={tag.label} /> : undefined}
      productName={productRecord.productName}
      productNameWeight={productNameWeight}
      productNameGreenHoverClass={productNameGreenHoverClass}
      infoRows={showInfoRows
        ? [
            { label: 'iSKU', value: productRecord.iSku },
            { label: 'SKU', value: productRecord.sku },
          ]
        : undefined}
      extras={hasExtras
        ? (
            <ListingExtras
              channel={listingChannel}
              showChannel={showChannel}
              showMoreSkus={showMoreSkus}
              moreSkuCount={moreSkuCount}
            />
          )
        : undefined}
    />
  );
};

const StoreMeta = ({ bold = false, greenHoverClass = '' }: { bold?: boolean; greenHoverClass?: string }) => (
  <span className="inline-flex min-w-0 flex-col items-start gap-[var(--spacing-4)]">
    <span className={[
      'max-w-full truncate text-[length:var(--table-body-size)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]',
      bold ? 'font-[var(--font-weight-bold)]' : 'font-[var(--font-weight-regular)]',
      greenHoverClass,
    ].filter(Boolean).join(' ')}>
      Awesome Store
    </span>
    <span className="inline-flex flex-col gap-[var(--spacing-2)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)]">
      <span className="text-[color:var(--color-text-info)]">Shopee</span>
      <span className="text-[color:var(--color-text-primary)]">Malaysia</span>
    </span>
  </span>
);

const ChannelIconContent = ({ bold = false, greenHoverClass = '' }: { bold?: boolean; greenHoverClass?: string }) => (
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <img src={shopee} alt="" className="size-[48px] shrink-0 rounded-[var(--radius-12)] object-cover" />
    <StoreMeta bold={bold} greenHoverClass={greenHoverClass} />
  </span>
);

const PaymentShippingMethodContent = ({ bold = false, greenHoverClass = '' }: { bold?: boolean; greenHoverClass?: string }) => (
  <span className="inline-flex items-start gap-[var(--spacing-12)]">
    <span className="inline-flex h-[48px] w-[120px] shrink-0 overflow-hidden rounded-[var(--radius-4)] border border-[color:var(--color-product-image-border)]">
      <img src={sitegiantDemoApp} alt="" className="h-full w-full object-cover" />
    </span>
    <StoreMeta bold={bold} greenHoverClass={greenHoverClass} />
  </span>
);

const formFieldColumnClass = (column: 'first' | 'center' | 'last') =>
  column === 'first'
    ? '!pl-[var(--spacing-12)] !pr-[var(--spacing-6)]'
    : column === 'last'
      ? '!pl-[var(--spacing-6)] !pr-[var(--spacing-24)]'
      : '';

const FormFieldContent = ({ value = '1' }: { value?: string }) => (
  <NumberInput type="stepper" value={value} onChange={() => undefined} />
);

const TagWithChannelContent = ({
  rows,
  channel = 'WEBSTORE',
  label = 'Company Name',
  bold = false,
  greenHoverClass = '',
}: {
  rows: Array<{ tagLabel: string; pipType: PipType; pipLabel: string }>;
  channel?: ListingChannelOption;
  label?: string;
  bold?: boolean;
  greenHoverClass?: string;
}) => (
  <span className="inline-flex flex-col items-start gap-[var(--spacing-8)]">
    {rows.map((row, i) => (
      <span key={i} className="inline-flex flex-col items-start">
        <span className={[
          'whitespace-nowrap text-[length:var(--table-body-size)] leading-[var(--table-body-lineheight)]',
          bold ? 'font-[var(--font-weight-bold)] text-[color:var(--table-body-text)]' : 'font-[var(--font-weight-regular)] text-[color:var(--color-text-info)]',
          greenHoverClass ? `group-hover/row:font-[var(--font-weight-bold)] ${greenHoverClass}` : '',
        ].join(' ')}>
          {row.tagLabel}
        </span>
        <span className="py-[var(--spacing-2)]">
          <Pip type={row.pipType} pipStyle="default" label={row.pipLabel} />
        </span>
      </span>
    ))}
    <span className="inline-flex items-center gap-[var(--spacing-4)] text-[length:var(--general-caption-size)] leading-[var(--leading-15)] text-[color:var(--color-text-primary)]">
      <img
        src={listingChannels[normalizeListingChannel(channel)].image}
        alt=""
        aria-hidden="true"
        width={15}
        height={15}
        className="shrink-0 rounded-[var(--radius-4)]"
      />
      {label}
    </span>
  </span>
);

const defaultTagWithChannelRows: Array<{ tagLabel: string; pipType: PipType; pipLabel: string }> = [
  { tagLabel: 'Tag Label 1', pipType: 'warning', pipLabel: 'Pip Text' },
  { tagLabel: 'Tag Label 2', pipType: 'warning', pipLabel: 'Pip Text' },
];

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













export const Inset: Story = {
  tags: hiddenStoryTags,
  args: { inset: true, children: 'Inset cell value' },
};

export const InsetBold: Story = {
  tags: hiddenStoryTags,
  args: { inset: true, weight: 'bold', children: 'Inset bold' },
};

export const InsetHovered: Story = {
  tags: hiddenStoryTags,
  args: { inset: true, hovered: true, children: 'Inset hover' },
};









export const Selected: Story = {
  tags: hiddenStoryTags,
  args: { selected: true, children: 'Selected row cell' },
};

/* ── Sub-row variant (Sales Channel "Today Sales" pattern) ── */

export const Subrow: Story = {
  tags: hiddenStoryTags,
  args: { subrow: true, column: 'first', children: 'Awesome Store 1899' },
};

export const SubrowHovered: Story = {
  tags: hiddenStoryTags,
  args: { subrow: true, hovered: true, column: 'first', children: 'Awesome Store 1899' },
};


// ── Row Builder helpers ────────────────────────────────────────────────────

const ROW_BUILDER_DATA = [
  { text: 'Wireless Mouse', sku: 'SKU-1042', number: '128', price: 'RM 89.00', store: 'SHOPEE_MY', pipType: 'success', pipLabel: 'Active',        product: 'product-1', listingTag: 'published' },
  { text: 'USB-C Hub',      sku: 'SKU-2103', number: '42',  price: 'RM 159.00', store: 'WEBSTORE',  pipType: 'warning', pipLabel: 'Low Stock',     product: 'product-2', listingTag: 'out-of-stock' },
  { text: 'Laptop Stand',   sku: 'SKU-3301', number: '76',  price: 'RM 45.00', store: 'LAZADA_MY', pipType: 'success', pipLabel: 'Active',         product: 'product-3', listingTag: 'published' },
  { text: 'Keyboard Cover', sku: 'SKU-4487', number: '5',   price: 'RM 29.90', store: 'TIKTOK_MY', pipType: 'danger',  pipLabel: 'Out of Stock',   product: 'product-4', listingTag: 'draft' },
  { text: 'HDMI Cable',     sku: 'SKU-5610', number: '213', price: 'RM 19.90', store: 'SHOPEE_SG', pipType: 'info',    pipLabel: 'Syncing',        product: 'product-5', listingTag: 'syncing' },
] satisfies ReadonlyArray<{ text: string; sku: string; number: string; price: string; store: ListingChannelOption; pipType: PipType; pipLabel: string; product: ProductPreviewOption; listingTag: ListingTagOption }>;

type RowBuilderDatum = typeof ROW_BUILDER_DATA[number];

// Variants that render tall/multi-line content in the Row Builder — causes the
// whole row to align to the top (items-start) so short cells don't float-center.
// tag-after/tag-first render only 1 row here (single line), icon-status renders
// count=1 (single icon) — those stay center-aligned like simple text cells.
const multiRowVariants: TableCellVariantOption[] = [
  'listing', 'tag-with-channel', 'text-info', 'channel-icon',
  'payment-shipping-method', 'product-only', 'action-text-links',
];

const RowBuilderCell = ({
  variant,
  datum,
  column,
  row,
  rowAlignment,
  align,
  showCheckbox = false,
  hoverStyle = 'off',
  inset = false,
  subrow = false,
  widthStyle,
  hovered,
  selected,
}: {
  variant: TableCellVariantOption;
  datum: RowBuilderDatum;
  column: 'first' | 'center' | 'last';
  row: 'default' | 'last';
  rowAlignment: 'start' | 'center';
  align?: 'left' | 'center' | 'right';
  showCheckbox?: boolean;
  hoverStyle?: 'off' | 'green-bold';
  inset?: boolean;
  subrow?: boolean;
  widthStyle?: React.CSSProperties;
  hovered?: boolean;
  selected?: boolean;
}) => {
  const alignResolved = align ?? 'left';
  // Variants that support the col-1 hover style.
  // boldVariants: TableCell atom bolds cell text on row hover.
  //   - text-info, channel-icon, payment-shipping-method, tag-with-channel:
  //     excluded from bold (they have mixed content — bold on the whole cell
  //     would affect caption/pip rows too). Green is scoped internally instead.
  //   - listing: always-bold title, green scoped internally.
  // greenWrapperVariants: outer green span wraps the whole content.
  //   leading/info-icon green is on inner text span to avoid greening the icon.
  //   text-info/channel-icon/payment-shipping-method/tag-with-channel/listing
  //   all handle green internally.
  const boldVariants: TableCellVariantOption[] = [
    'text', 'leading-icon', 'info-icon', 'small-channel-icon',
  ];
  const greenWrapperVariants: TableCellVariantOption[] = ['text', 'small-channel-icon'];
  const boldOnRowHover = hoverStyle !== 'off' && boldVariants.includes(variant);
  const className = rowAlignment === 'start' ? '!items-start' : '!items-center';
  // subrow implies inset for green hover token selection
  const isInsetMode = inset || subrow;
  // Correct hover-text token per table mode — both are literal strings for JIT
  const greenHoverClass = isInsetMode
    ? 'group-hover/row:!text-[color:var(--table-inset-body-hover-text)]'
    : 'group-hover/row:!text-[color:var(--table-body-hover-text)]';
  const isGreenBold = hoverStyle === 'green-bold';

  const content = (() => {
    switch (variant) {
      case 'text':
        return datum.text;
      case 'leading-icon':
        return (
          <span className="inline-flex items-center gap-[var(--spacing-12)]">
            <Icon name="check" size={17} className="text-[color:var(--color-icon-secondary)]" />
            <span className={isGreenBold ? greenHoverClass : ''}>{datum.text}</span>
          </span>
        );
      case 'info-icon':
        return (
          <span className="inline-flex items-center gap-[var(--spacing-8)]">
            <span className={isGreenBold ? greenHoverClass : ''}>{datum.text}</span>
            <Icon name="info" size={17} className="text-[color:var(--color-icon-secondary)]" />
          </span>
        );
      case 'small-channel-icon':
        return (
          <span className="inline-flex items-center gap-[var(--spacing-8)]">
            <img src={listingChannels[datum.store].image} alt="" className="w-[21px] h-[21px] rounded-[var(--radius-2)] object-cover" />
            <span>{listingChannels[datum.store].label}</span>
          </span>
        );
      case 'product-only':
        return <ProductOnlyContent count={4} />;
      case 'tag-after':
        return <TagPair order="after" rows={[{ label: datum.text, pipType: datum.pipType, pipLabel: datum.pipLabel }]} />;
      case 'tag-first':
        return <TagPair order="first" rows={[{ label: datum.text, pipType: datum.pipType, pipLabel: datum.pipLabel }]} />;
      case 'action-text-links':
        return (
          <span className="inline-flex flex-col items-start gap-[var(--spacing-4)]">
            <span className="inline-flex items-start py-[var(--spacing-2)]">
              <TextLink
                label="View Order"
                variant="basic"
                iconPosition="left"
                icon={<Icon name="file-text" size={17} />}
              />
            </span>
            <span className="inline-flex items-start py-[var(--spacing-2)]">
              <TextLink
                label="Void"
                variant="basic"
                iconPosition="left"
                icon={<Icon name="close" size={17} />}
                className="!text-[color:var(--color-sys-red-DEFAULT)] hover:!text-[color:var(--color-sys-red-dark)] active:!text-[color:var(--color-sys-red-darker)]"
              />
            </span>
          </span>
        );
      case 'action-icon-buttons':
        return (
          <ActionIcons
            count={2}
            icons={[
              { icon: 'printer', variant: 'basic' },
              { icon: 'trash', variant: 'danger-subtle' },
            ]}
          />
        );
      case 'icon-status':
        return <IconStatus count={1} />;
      case 'status-toggle':
        return <StatusToggleCell checked />;
      case 'text-info':
        return (
          <TextInfoContent
            body={datum.text}
            textWeight={column === 'first' ? 'bold' : 'normal'}
            channel={datum.store}
            label={listingChannels[datum.store].label}
            greenHoverClass={isGreenBold ? greenHoverClass : ''}
          />
        );
      case 'listing':
        return (
          <DefaultListingContent
            showCheckbox={false}
            product={datum.product}
            listingTag={datum.listingTag}
            listingChannel={datum.store}
            showTag
            showInfoRows
            showChannel
            showMoreSkus={false}
            moreSkuCount={0}
            productNameWeight={column === 'first' ? 'bold' : 'normal'}
            productNameGreenHoverClass={isGreenBold ? greenHoverClass : ''}
          />
        );
      case 'channel-icon':
        return <ChannelIconContent bold={column === 'first'} greenHoverClass={isGreenBold ? greenHoverClass : ''} />;
      case 'payment-shipping-method':
        return <PaymentShippingMethodContent bold={column === 'first'} greenHoverClass={isGreenBold ? greenHoverClass : ''} />;
      case 'form-field':
        return <FormFieldContent value="1" />;
      case 'tag-with-channel':
        return (
          <TagWithChannelContent
            rows={[{ tagLabel: datum.text, pipType: datum.pipType, pipLabel: datum.pipLabel }]}
            channel={datum.store}
            label={listingChannels[datum.store].label}
            bold={column === 'first'}
            greenHoverClass={isGreenBold ? greenHoverClass : ''}
          />
        );
      default:
        return datum.text;
    }
  })();

  // For listing, green hover is scoped to the product title inside TableCellListing.
  // For leading-icon/info-icon, green is on the inner text span (not the outer wrapper).
  // For text/small-channel-icon, wrap the whole content in a green-hover span.
  const wrappedContent = isGreenBold && greenWrapperVariants.includes(variant)
    ? (
        <span className={greenHoverClass}>
          {content}
        </span>
      )
    : content;

  return (
    <td className="h-px p-0" style={widthStyle}>
      <TableCell
        column={column}
        row={row}
        hovered={hovered}
        selected={selected}
        inset={inset}
        subrow={subrow}
        checkbox={showCheckbox ? <Checkbox size="sm" /> : undefined}
        className={className}
        align={alignResolved}
        boldOnRowHover={boldOnRowHover}
      >
        {wrappedContent}
      </TableCell>
    </td>
  );
};

type RowBuilderStory = StoryObj<TableCellStoryArgs & {
  columnCount?: 1 | 2 | 3 | 4 | 5 | 6;
  showHeader?: boolean;
  col1Variant?: TableCellVariantOption; col1Width?: 'auto' | 'fixed'; col1WidthPx?: number; col1Label?: string; col1Sortable?: boolean; col1Align?: 'left' | 'center' | 'right'; col1Checkbox?: boolean; col1HoverStyle?: 'off' | 'green-bold';
  col2Variant?: TableCellVariantOption; col2Width?: 'auto' | 'fixed'; col2WidthPx?: number; col2Label?: string; col2Sortable?: boolean; col2Align?: 'left' | 'center' | 'right';
  col3Variant?: TableCellVariantOption; col3Width?: 'auto' | 'fixed'; col3WidthPx?: number; col3Label?: string; col3Sortable?: boolean; col3Align?: 'left' | 'center' | 'right';
  col4Variant?: TableCellVariantOption; col4Width?: 'auto' | 'fixed'; col4WidthPx?: number; col4Label?: string; col4Sortable?: boolean; col4Align?: 'left' | 'center' | 'right';
  col5Variant?: TableCellVariantOption; col5Width?: 'auto' | 'fixed'; col5WidthPx?: number; col5Label?: string; col5Sortable?: boolean; col5Align?: 'left' | 'center' | 'right';
  col6Variant?: TableCellVariantOption; col6Width?: 'auto' | 'fixed'; col6WidthPx?: number; col6Label?: string; col6Sortable?: boolean; col6Align?: 'left' | 'center' | 'right';
  col2Visible?: boolean; col3Visible?: boolean; col4Visible?: boolean;
  col5Visible?: boolean; col6Visible?: boolean;
  col1WidthPxVisible?: boolean; col2WidthPxVisible?: boolean; col3WidthPxVisible?: boolean;
  col4WidthPxVisible?: boolean; col5WidthPxVisible?: boolean; col6WidthPxVisible?: boolean;
  col1HoverVisible?: boolean;
}>;

const colArgTypes = (n: 1 | 2 | 3 | 4 | 5 | 6, visibleArg: string) => ({
  [`col${n}Variant`]: {
    name: `Col ${n} — Variant`,
    control: { type: 'select', labels: tableCellVariantLabels },
    options: tableCellVariantOptions,
    if: { arg: visibleArg, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: 'text' } },
  },
  [`col${n}Label`]: {
    name: `Col ${n} — Header label`,
    control: 'text',
    if: { arg: visibleArg, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: `Column ${n}` } },
  },
  [`col${n}Sortable`]: {
    name: `Col ${n} — Sortable`,
    control: 'boolean',
    if: { arg: visibleArg, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: 'false' } },
  },
  [`col${n}Align`]: {
    name: `Col ${n} — Align`,
    control: { type: 'inline-radio' },
    options: ['left', 'center', 'right'] satisfies ReadonlyArray<'left' | 'center' | 'right'>,
    if: { arg: visibleArg, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: 'left' } },
  },
  [`col${n}Width`]: {
    name: `Col ${n} — Width`,
    control: { type: 'inline-radio' },
    options: ['auto', 'fixed'],
    if: { arg: visibleArg, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: 'auto' } },
  },
  [`col${n}WidthPx`]: {
    name: `Col ${n} — Width (px)`,
    control: { type: 'number', min: 40, step: 10 },
    if: { arg: `col${n}WidthPxVisible`, truthy: true },
    table: { category: `Column ${n}`, defaultValue: { summary: '160' } },
  },
});

export const DefaultBodyRow: RowBuilderStory = {
  name: 'Row Builder',
  argTypes: {
    ...recipeOnlyControls,
    ...playgroundOnlyControls,
    hovered: { control: 'boolean', table: { category: '1. State' } },
    selected: { control: 'boolean', table: { category: '1. State' } },
    showHeader: {
      name: 'Show header',
      control: 'boolean',
      table: { category: '2. Columns', defaultValue: { summary: 'true' } },
    },
    columnCount: {
      name: 'Column count',
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4, 5, 6] satisfies ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6>,
      table: { category: '2. Columns', defaultValue: { summary: '5' } },
    },
    // Col 1 controls — explicit order: Variant → Checkbox → Label → Sortable → Align → Hover style → Width → Width (px)
    col1Variant: {
      name: 'Col 1 — Variant',
      control: { type: 'select', labels: tableCellVariantLabels },
      options: tableCellVariantOptions,
      table: { category: 'Column 1', defaultValue: { summary: 'text' } },
    },
    col1Checkbox: {
      name: 'Col 1 — Checkbox',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Label: {
      name: 'Col 1 — Header label',
      control: 'text',
      table: { category: 'Column 1', defaultValue: { summary: 'Product' } },
    },
    col1Sortable: {
      name: 'Col 1 — Sortable',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Align: {
      name: 'Col 1 — Align',
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'] satisfies ReadonlyArray<'left' | 'center' | 'right'>,
      table: { category: 'Column 1', defaultValue: { summary: 'left' } },
    },
    col1HoverStyle: {
      name: 'Col 1 — Hover style',
      control: { type: 'inline-radio' },
      options: ['off', 'green-bold'] satisfies ReadonlyArray<'off' | 'green-bold'>,
      table: { category: 'Column 1', defaultValue: { summary: 'off' } },
      if: { arg: 'col1HoverVisible', truthy: true },
    },
    col1HoverVisible: { table: { disable: true } },
    col1Width: {
      name: 'Col 1 — Width',
      control: { type: 'inline-radio' },
      options: ['auto', 'fixed'],
      table: { category: 'Column 1', defaultValue: { summary: 'auto' } },
    },
    col1WidthPx: {
      name: 'Col 1 — Width (px)',
      control: { type: 'number', min: 40, step: 10 },
      if: { arg: 'col1WidthPxVisible', truthy: true },
      table: { category: 'Column 1', defaultValue: { summary: '160' } },
    },
    ...colArgTypes(2, 'col2Visible'),
    ...colArgTypes(3, 'col3Visible'),
    ...colArgTypes(4, 'col4Visible'),
    ...colArgTypes(5, 'col5Visible'),
    ...colArgTypes(6, 'col6Visible'),
    col2Visible: { table: { disable: true } },
    col3Visible: { table: { disable: true } },
    col4Visible: { table: { disable: true } },
    col5Visible: { table: { disable: true } },
    col6Visible: { table: { disable: true } },
    col1WidthPxVisible: { table: { disable: true } },
    col2WidthPxVisible: { table: { disable: true } },
    col3WidthPxVisible: { table: { disable: true } },
    col4WidthPxVisible: { table: { disable: true } },
    col5WidthPxVisible: { table: { disable: true } },
    col6WidthPxVisible: { table: { disable: true } },
  },
  args: {
    hovered: false,
    selected: false,
    showHeader: true,
    columnCount: 5,
    col1Variant: 'text', col1Width: 'auto', col1WidthPx: 160, col1Label: 'Product', col1Sortable: false, col1Align: 'left', col1Checkbox: false, col1HoverStyle: 'off',
    col2Variant: 'text', col2Width: 'auto', col2WidthPx: 160, col2Label: 'SKU', col2Sortable: false, col2Align: 'left',
    col3Variant: 'text', col3Width: 'auto', col3WidthPx: 160, col3Label: 'Stock', col3Sortable: false, col3Align: 'left',
    col4Variant: 'text', col4Width: 'auto', col4WidthPx: 160, col4Label: 'Price', col4Sortable: false, col4Align: 'left',
    col5Variant: 'action-icon-buttons', col5Width: 'auto', col5WidthPx: 160, col5Label: 'Action', col5Sortable: false, col5Align: 'right',
    col6Variant: 'text', col6Width: 'auto', col6WidthPx: 160, col6Label: 'Column 6', col6Sortable: false, col6Align: 'left',
    col2Visible: false, col3Visible: false, col4Visible: false,
    col5Visible: false, col6Visible: false,
    col1WidthPxVisible: false, col2WidthPxVisible: false, col3WidthPxVisible: false,
    col4WidthPxVisible: false, col5WidthPxVisible: false, col6WidthPxVisible: false,
    col1HoverVisible: true,
  },
  render: ({
    hovered = false,
    selected = false,
    showHeader = true,
    columnCount = 5,
    col1Variant = 'text', col1Width = 'auto', col1WidthPx = 160, col1Label = 'Product', col1Sortable = false, col1Align = 'left' as const, col1Checkbox = false, col1HoverStyle = 'off' as const,
    col2Variant = 'text', col2Width = 'auto', col2WidthPx = 160, col2Label = 'SKU', col2Sortable = false, col2Align = 'left' as const,
    col3Variant = 'text', col3Width = 'auto', col3WidthPx = 160, col3Label = 'Stock', col3Sortable = false, col3Align = 'left' as const,
    col4Variant = 'text', col4Width = 'auto', col4WidthPx = 160, col4Label = 'Price', col4Sortable = false, col4Align = 'left' as const,
    col5Variant = 'action-icon-buttons', col5Width = 'auto', col5WidthPx = 160, col5Label = 'Action', col5Sortable = false, col5Align = 'right' as const,
    col6Variant = 'text', col6Width = 'auto', col6WidthPx = 160, col6Label = 'Column 6', col6Sortable = false, col6Align = 'left' as const,
    col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
    col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible,
    col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
    col1HoverVisible,
  }) => {
    const [, updateArgs] = useArgs();

    const colDefs = [
      { variant: col1Variant, width: col1Width, widthPx: col1WidthPx, label: col1Label, sortable: col1Sortable, align: col1Align, showCheckbox: col1Checkbox, hoverStyle: col1HoverStyle },
      { variant: col2Variant, width: col2Width, widthPx: col2WidthPx, label: col2Label, sortable: col2Sortable, align: col2Align },
      { variant: col3Variant, width: col3Width, widthPx: col3WidthPx, label: col3Label, sortable: col3Sortable, align: col3Align },
      { variant: col4Variant, width: col4Width, widthPx: col4WidthPx, label: col4Label, sortable: col4Sortable, align: col4Align },
      { variant: col5Variant, width: col5Width, widthPx: col5WidthPx, label: col5Label, sortable: col5Sortable, align: col5Align },
      { variant: col6Variant, width: col6Width, widthPx: col6WidthPx, label: col6Label, sortable: col6Sortable, align: col6Align },
    ].slice(0, columnCount);

    // Sync visibility helpers
    useEffect(() => {
      const hoverSupportedVariants: TableCellVariantOption[] = [
        'text', 'leading-icon', 'info-icon', 'small-channel-icon',
        'listing', 'text-info', 'channel-icon', 'payment-shipping-method', 'tag-with-channel',
      ];
      const nextColVisible = [true, columnCount >= 2, columnCount >= 3, columnCount >= 4, columnCount >= 5, columnCount >= 6];
      const nextWidthPxVisible = [
        col1Width === 'fixed',
        col2Width === 'fixed' && columnCount >= 2,
        col3Width === 'fixed' && columnCount >= 3,
        col4Width === 'fixed' && columnCount >= 4,
        col5Width === 'fixed' && columnCount >= 5,
        col6Width === 'fixed' && columnCount >= 6,
      ];
      const nextCol1HoverVisible = hoverSupportedVariants.includes(col1Variant);
      const updates: Record<string, boolean> = {};
      const visibleKeys = ['col2Visible', 'col3Visible', 'col4Visible', 'col5Visible', 'col6Visible'] as const;
      const currentVisible = [col2Visible, col3Visible, col4Visible, col5Visible, col6Visible];
      visibleKeys.forEach((key, i) => {
        if (currentVisible[i] !== nextColVisible[i + 1]) updates[key] = nextColVisible[i + 1];
      });
      const widthPxKeys = ['col1WidthPxVisible', 'col2WidthPxVisible', 'col3WidthPxVisible', 'col4WidthPxVisible', 'col5WidthPxVisible', 'col6WidthPxVisible'] as const;
      const currentWidthPx = [col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible];
      widthPxKeys.forEach((key, i) => {
        if (currentWidthPx[i] !== nextWidthPxVisible[i]) updates[key] = nextWidthPxVisible[i];
      });
      if (col1HoverVisible !== nextCol1HoverVisible) updates['col1HoverVisible'] = nextCol1HoverVisible;
      if (Object.keys(updates).length > 0) updateArgs(updates);
    }, [
      columnCount, col1Variant, col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
      col1Width, col2Width, col3Width, col4Width, col5Width, col6Width,
      col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
      col1HoverVisible, updateArgs,
    ]);

    const getColumn = (idx: number): 'first' | 'center' | 'last' =>
      idx === 0 ? 'first' : idx === colDefs.length - 1 ? 'last' : 'center';

    const getWidthStyle = (def: typeof colDefs[number]): React.CSSProperties | undefined =>
      def.width === 'fixed' && Number.isFinite(def.widthPx) && (def.widthPx ?? 0) >= 40
        ? { width: `${def.widthPx}px` }
        : undefined;

    // Header align follows the column's cell align setting
    const getHeaderAlign = (def: typeof colDefs[number]): 'left' | 'center' | 'right' => def.align ?? 'left';

    // Row alignment: if any column is multi-row, the whole row aligns to start
    const rowAlignment: 'start' | 'center' = colDefs.some(d => multiRowVariants.includes(d.variant))
      ? 'start'
      : 'center';

    const tableClass = colDefs.some(d => d.width === 'fixed') ? 'border-collapse w-full' : 'border-collapse w-full table-fixed';
    const shellClasses = 'rounded-[var(--inset-card-radii)] border border-[color:var(--color-surface-card-border)] bg-[var(--table-body-fill)] shadow-[var(--shadow-sm)] overflow-hidden';

    return (
      <div className={shellClasses}>
        <table className={tableClass}>
          {showHeader && (
            <thead>
              <tr>
                {colDefs.map((def, colIdx) => (
                  <th key={colIdx} className="p-0" style={getWidthStyle(def)} aria-sort={def.sortable ? 'none' : undefined}>
                    <TableHeaderCell
                      column={getColumn(colIdx)}
                      align={getHeaderAlign(def)}
                      label={def.label}
                      sortable={def.sortable}
                      checkbox={colIdx === 0 && (colDefs[0] as typeof colDefs[0]).showCheckbox ? <Checkbox size="sm" /> : undefined}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {ROW_BUILDER_DATA.map((datum, rowIdx) => (
              <tr key={rowIdx} className={defaultHoverRowClass}>
                {colDefs.map((def, colIdx) => (
                  <RowBuilderCell
                    key={colIdx}
                    variant={def.variant}
                    datum={datum}
                    column={getColumn(colIdx)}
                    row={rowIdx === ROW_BUILDER_DATA.length - 1 ? 'last' : 'default'}
                    rowAlignment={rowAlignment}
                    align={def.align}
                    showCheckbox={colIdx === 0 ? (def as typeof colDefs[0]).showCheckbox ?? false : false}
                    hoverStyle={colIdx === 0 ? (def as typeof colDefs[0]).hoverStyle ?? 'off' : 'off'}
                    widthStyle={getWidthStyle(def)}
                    hovered={hovered}
                    selected={selected}
                  />
                ))}
              </tr>
            ))}
            {/* 20px bottom spacer — matches default table bottom padding */}
            <tr>
              {colDefs.map((_, colIdx) => (
                <td key={colIdx} className="h-[20px] p-0" />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

export const InsetBodyRow: RowBuilderStory = {
  name: 'Inset Row Builder',
  argTypes: {
    ...recipeOnlyControls,
    ...playgroundOnlyControls,
    hovered: { control: 'boolean', table: { category: '1. State' } },
    selected: { control: 'boolean', table: { category: '1. State' } },
    showHeader: {
      name: 'Show header',
      control: 'boolean',
      table: { category: '2. Columns', defaultValue: { summary: 'true' } },
    },
    columnCount: {
      name: 'Column count',
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4, 5, 6] satisfies ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6>,
      table: { category: '2. Columns', defaultValue: { summary: '5' } },
    },
    // Col 1 controls — explicit order: Variant → Checkbox → Label → Sortable → Align → Hover style → Width → Width (px)
    col1Variant: {
      name: 'Col 1 — Variant',
      control: { type: 'select', labels: tableCellVariantLabels },
      options: tableCellVariantOptions,
      table: { category: 'Column 1', defaultValue: { summary: 'text' } },
    },
    col1Checkbox: {
      name: 'Col 1 — Checkbox',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Label: {
      name: 'Col 1 — Header label',
      control: 'text',
      table: { category: 'Column 1', defaultValue: { summary: 'Product' } },
    },
    col1Sortable: {
      name: 'Col 1 — Sortable',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Align: {
      name: 'Col 1 — Align',
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'] satisfies ReadonlyArray<'left' | 'center' | 'right'>,
      table: { category: 'Column 1', defaultValue: { summary: 'left' } },
    },
    col1HoverStyle: {
      name: 'Col 1 — Hover style',
      control: { type: 'inline-radio' },
      options: ['off', 'green-bold'] satisfies ReadonlyArray<'off' | 'green-bold'>,
      table: { category: 'Column 1', defaultValue: { summary: 'off' } },
      if: { arg: 'col1HoverVisible', truthy: true },
    },
    col1HoverVisible: { table: { disable: true } },
    col1Width: {
      name: 'Col 1 — Width',
      control: { type: 'inline-radio' },
      options: ['auto', 'fixed'],
      table: { category: 'Column 1', defaultValue: { summary: 'auto' } },
    },
    col1WidthPx: {
      name: 'Col 1 — Width (px)',
      control: { type: 'number', min: 40, step: 10 },
      if: { arg: 'col1WidthPxVisible', truthy: true },
      table: { category: 'Column 1', defaultValue: { summary: '160' } },
    },
    ...colArgTypes(2, 'col2Visible'),
    ...colArgTypes(3, 'col3Visible'),
    ...colArgTypes(4, 'col4Visible'),
    ...colArgTypes(5, 'col5Visible'),
    ...colArgTypes(6, 'col6Visible'),
    col2Visible: { table: { disable: true } },
    col3Visible: { table: { disable: true } },
    col4Visible: { table: { disable: true } },
    col5Visible: { table: { disable: true } },
    col6Visible: { table: { disable: true } },
    col1WidthPxVisible: { table: { disable: true } },
    col2WidthPxVisible: { table: { disable: true } },
    col3WidthPxVisible: { table: { disable: true } },
    col4WidthPxVisible: { table: { disable: true } },
    col5WidthPxVisible: { table: { disable: true } },
    col6WidthPxVisible: { table: { disable: true } },
  },
  args: {
    hovered: false,
    selected: false,
    showHeader: true,
    columnCount: 5,
    col1Variant: 'text', col1Width: 'auto', col1WidthPx: 160, col1Label: 'Product', col1Sortable: false, col1Align: 'left', col1Checkbox: false, col1HoverStyle: 'off',
    col2Variant: 'text', col2Width: 'auto', col2WidthPx: 160, col2Label: 'SKU', col2Sortable: false, col2Align: 'left',
    col3Variant: 'text', col3Width: 'auto', col3WidthPx: 160, col3Label: 'Stock', col3Sortable: false, col3Align: 'left',
    col4Variant: 'text', col4Width: 'auto', col4WidthPx: 160, col4Label: 'Price', col4Sortable: false, col4Align: 'left',
    col5Variant: 'action-icon-buttons', col5Width: 'auto', col5WidthPx: 160, col5Label: 'Action', col5Sortable: false, col5Align: 'right',
    col6Variant: 'text', col6Width: 'auto', col6WidthPx: 160, col6Label: 'Column 6', col6Sortable: false, col6Align: 'left',
    col2Visible: false, col3Visible: false, col4Visible: false,
    col5Visible: false, col6Visible: false,
    col1WidthPxVisible: false, col2WidthPxVisible: false, col3WidthPxVisible: false,
    col4WidthPxVisible: false, col5WidthPxVisible: false, col6WidthPxVisible: false,
    col1HoverVisible: true,
  },
  render: ({
    hovered = false,
    selected = false,
    showHeader = true,
    columnCount = 5,
    col1Variant = 'text', col1Width = 'auto', col1WidthPx = 160, col1Label = 'Product', col1Sortable = false, col1Align = 'left' as const, col1Checkbox = false, col1HoverStyle = 'off' as const,
    col2Variant = 'text', col2Width = 'auto', col2WidthPx = 160, col2Label = 'SKU', col2Sortable = false, col2Align = 'left' as const,
    col3Variant = 'text', col3Width = 'auto', col3WidthPx = 160, col3Label = 'Stock', col3Sortable = false, col3Align = 'left' as const,
    col4Variant = 'text', col4Width = 'auto', col4WidthPx = 160, col4Label = 'Price', col4Sortable = false, col4Align = 'left' as const,
    col5Variant = 'action-icon-buttons', col5Width = 'auto', col5WidthPx = 160, col5Label = 'Action', col5Sortable = false, col5Align = 'right' as const,
    col6Variant = 'text', col6Width = 'auto', col6WidthPx = 160, col6Label = 'Column 6', col6Sortable = false, col6Align = 'left' as const,
    col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
    col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible,
    col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
    col1HoverVisible,
  }) => {
    const [, updateArgs] = useArgs();

    const colDefs = [
      { variant: col1Variant, width: col1Width, widthPx: col1WidthPx, label: col1Label, sortable: col1Sortable, align: col1Align, showCheckbox: col1Checkbox, hoverStyle: col1HoverStyle },
      { variant: col2Variant, width: col2Width, widthPx: col2WidthPx, label: col2Label, sortable: col2Sortable, align: col2Align },
      { variant: col3Variant, width: col3Width, widthPx: col3WidthPx, label: col3Label, sortable: col3Sortable, align: col3Align },
      { variant: col4Variant, width: col4Width, widthPx: col4WidthPx, label: col4Label, sortable: col4Sortable, align: col4Align },
      { variant: col5Variant, width: col5Width, widthPx: col5WidthPx, label: col5Label, sortable: col5Sortable, align: col5Align },
      { variant: col6Variant, width: col6Width, widthPx: col6WidthPx, label: col6Label, sortable: col6Sortable, align: col6Align },
    ].slice(0, columnCount);

    // Sync visibility helpers
    useEffect(() => {
      const hoverSupportedVariants: TableCellVariantOption[] = [
        'text', 'leading-icon', 'info-icon', 'small-channel-icon',
        'listing', 'text-info', 'channel-icon', 'payment-shipping-method', 'tag-with-channel',
      ];
      const nextColVisible = [true, columnCount >= 2, columnCount >= 3, columnCount >= 4, columnCount >= 5, columnCount >= 6];
      const nextWidthPxVisible = [
        col1Width === 'fixed',
        col2Width === 'fixed' && columnCount >= 2,
        col3Width === 'fixed' && columnCount >= 3,
        col4Width === 'fixed' && columnCount >= 4,
        col5Width === 'fixed' && columnCount >= 5,
        col6Width === 'fixed' && columnCount >= 6,
      ];
      const nextCol1HoverVisible = hoverSupportedVariants.includes(col1Variant);
      const updates: Record<string, boolean> = {};
      const visibleKeys = ['col2Visible', 'col3Visible', 'col4Visible', 'col5Visible', 'col6Visible'] as const;
      const currentVisible = [col2Visible, col3Visible, col4Visible, col5Visible, col6Visible];
      visibleKeys.forEach((key, i) => {
        if (currentVisible[i] !== nextColVisible[i + 1]) updates[key] = nextColVisible[i + 1];
      });
      const widthPxKeys = ['col1WidthPxVisible', 'col2WidthPxVisible', 'col3WidthPxVisible', 'col4WidthPxVisible', 'col5WidthPxVisible', 'col6WidthPxVisible'] as const;
      const currentWidthPx = [col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible];
      widthPxKeys.forEach((key, i) => {
        if (currentWidthPx[i] !== nextWidthPxVisible[i]) updates[key] = nextWidthPxVisible[i];
      });
      if (col1HoverVisible !== nextCol1HoverVisible) updates['col1HoverVisible'] = nextCol1HoverVisible;
      if (Object.keys(updates).length > 0) updateArgs(updates);
    }, [
      columnCount, col1Variant, col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
      col1Width, col2Width, col3Width, col4Width, col5Width, col6Width,
      col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
      col1HoverVisible, updateArgs,
    ]);

    const getColumn = (idx: number): 'first' | 'center' | 'last' =>
      idx === 0 ? 'first' : idx === colDefs.length - 1 ? 'last' : 'center';

    const getWidthStyle = (def: typeof colDefs[number]): React.CSSProperties | undefined =>
      def.width === 'fixed' && Number.isFinite(def.widthPx) && (def.widthPx ?? 0) >= 40
        ? { width: `${def.widthPx}px` }
        : undefined;

    const getHeaderAlign = (def: typeof colDefs[number]): 'left' | 'center' | 'right' => def.align ?? 'left';

    const rowAlignment: 'start' | 'center' = colDefs.some(d => multiRowVariants.includes(d.variant))
      ? 'start'
      : 'center';

    const tableClass = colDefs.some(d => d.width === 'fixed') ? 'border-collapse w-full' : 'border-collapse w-full table-fixed';

    const shellClasses = 'rounded-[var(--inset-card-radii)] border border-[color:var(--color-surface-card-border)] bg-[var(--table-inset-body-fill)] shadow-[var(--shadow-sm)] pt-[var(--spacing-24)] px-[var(--spacing-24)] pb-[var(--spacing-40)]';

    return (
      <div className={shellClasses}>
        <table className={tableClass}>
          {showHeader && (
            <thead>
              <tr>
                {colDefs.map((def, colIdx) => (
                  <th key={colIdx} className="p-0" style={getWidthStyle(def)} aria-sort={def.sortable ? 'none' : undefined}>
                    <TableHeaderCell
                      inset
                      column={getColumn(colIdx)}
                      align={getHeaderAlign(def)}
                      label={def.label}
                      sortable={def.sortable}
                      checkbox={colIdx === 0 && (colDefs[0] as typeof colDefs[0]).showCheckbox ? <Checkbox size="sm" /> : undefined}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {ROW_BUILDER_DATA.map((datum, rowIdx) => (
              <tr key={rowIdx} className={insetHoverRowClass}>
                {colDefs.map((def, colIdx) => (
                  <RowBuilderCell
                    key={colIdx}
                    variant={def.variant}
                    datum={datum}
                    column={getColumn(colIdx)}
                    row={rowIdx === ROW_BUILDER_DATA.length - 1 ? 'last' : 'default'}
                    rowAlignment={rowAlignment}
                    align={def.align}
                    inset
                    showCheckbox={colIdx === 0 ? (def as typeof colDefs[0]).showCheckbox ?? false : false}
                    hoverStyle={colIdx === 0 ? (def as typeof colDefs[0]).hoverStyle ?? 'off' : 'off'}
                    widthStyle={getWidthStyle(def)}
                    hovered={hovered}
                    selected={selected}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

export const SubrowBodyRow: RowBuilderStory = {
  name: 'Subrow Builder',
  argTypes: {
    ...recipeOnlyControls,
    ...playgroundOnlyControls,
    hovered: { control: 'boolean', table: { category: '1. State' } },
    selected: { control: 'boolean', table: { category: '1. State' } },
    showHeader: {
      name: 'Show header',
      control: 'boolean',
      table: { category: '2. Columns', defaultValue: { summary: 'true' } },
    },
    columnCount: {
      name: 'Column count',
      control: { type: 'inline-radio' },
      options: [1, 2, 3, 4, 5, 6] satisfies ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6>,
      table: { category: '2. Columns', defaultValue: { summary: '5' } },
    },
    // Col 1 controls — explicit order: Variant → Checkbox → Label → Sortable → Align → Hover style → Width → Width (px)
    col1Variant: {
      name: 'Col 1 — Variant',
      control: { type: 'select', labels: tableCellVariantLabels },
      options: tableCellVariantOptions,
      table: { category: 'Column 1', defaultValue: { summary: 'text' } },
    },
    col1Checkbox: {
      name: 'Col 1 — Checkbox',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Label: {
      name: 'Col 1 — Header label',
      control: 'text',
      table: { category: 'Column 1', defaultValue: { summary: 'Product' } },
    },
    col1Sortable: {
      name: 'Col 1 — Sortable',
      control: 'boolean',
      table: { category: 'Column 1', defaultValue: { summary: 'false' } },
    },
    col1Align: {
      name: 'Col 1 — Align',
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'] satisfies ReadonlyArray<'left' | 'center' | 'right'>,
      table: { category: 'Column 1', defaultValue: { summary: 'left' } },
    },
    col1HoverStyle: {
      name: 'Col 1 — Hover style',
      control: { type: 'inline-radio' },
      options: ['off', 'green-bold'] satisfies ReadonlyArray<'off' | 'green-bold'>,
      table: { category: 'Column 1', defaultValue: { summary: 'off' } },
      if: { arg: 'col1HoverVisible', truthy: true },
    },
    col1HoverVisible: { table: { disable: true } },
    col1Width: {
      name: 'Col 1 — Width',
      control: { type: 'inline-radio' },
      options: ['auto', 'fixed'],
      table: { category: 'Column 1', defaultValue: { summary: 'auto' } },
    },
    col1WidthPx: {
      name: 'Col 1 — Width (px)',
      control: { type: 'number', min: 40, step: 10 },
      if: { arg: 'col1WidthPxVisible', truthy: true },
      table: { category: 'Column 1', defaultValue: { summary: '160' } },
    },
    ...colArgTypes(2, 'col2Visible'),
    ...colArgTypes(3, 'col3Visible'),
    ...colArgTypes(4, 'col4Visible'),
    ...colArgTypes(5, 'col5Visible'),
    ...colArgTypes(6, 'col6Visible'),
    col2Visible: { table: { disable: true } },
    col3Visible: { table: { disable: true } },
    col4Visible: { table: { disable: true } },
    col5Visible: { table: { disable: true } },
    col6Visible: { table: { disable: true } },
    col1WidthPxVisible: { table: { disable: true } },
    col2WidthPxVisible: { table: { disable: true } },
    col3WidthPxVisible: { table: { disable: true } },
    col4WidthPxVisible: { table: { disable: true } },
    col5WidthPxVisible: { table: { disable: true } },
    col6WidthPxVisible: { table: { disable: true } },
  },
  args: {
    hovered: false,
    selected: false,
    showHeader: true,
    columnCount: 5,
    col1Variant: 'text', col1Width: 'auto', col1WidthPx: 160, col1Label: 'Store', col1Sortable: false, col1Align: 'left', col1Checkbox: false, col1HoverStyle: 'off',
    col2Variant: 'text', col2Width: 'auto', col2WidthPx: 160, col2Label: 'Order', col2Sortable: false, col2Align: 'left',
    col3Variant: 'text', col3Width: 'auto', col3WidthPx: 160, col3Label: 'Total (RM)', col3Sortable: false, col3Align: 'right',
    col4Variant: 'text', col4Width: 'auto', col4WidthPx: 160, col4Label: 'Column 4', col4Sortable: false, col4Align: 'left',
    col5Variant: 'action-icon-buttons', col5Width: 'auto', col5WidthPx: 160, col5Label: 'Action', col5Sortable: false, col5Align: 'right',
    col6Variant: 'text', col6Width: 'auto', col6WidthPx: 160, col6Label: 'Column 6', col6Sortable: false, col6Align: 'left',
    col2Visible: false, col3Visible: false, col4Visible: false,
    col5Visible: false, col6Visible: false,
    col1WidthPxVisible: false, col2WidthPxVisible: false, col3WidthPxVisible: false,
    col4WidthPxVisible: false, col5WidthPxVisible: false, col6WidthPxVisible: false,
    col1HoverVisible: true,
  },
  render: ({
    hovered = false,
    selected = false,
    showHeader = true,
    columnCount = 5,
    col1Variant = 'text', col1Width = 'auto', col1WidthPx = 160, col1Label = 'Store', col1Sortable = false, col1Align = 'left' as const, col1Checkbox = false, col1HoverStyle = 'off' as const,
    col2Variant = 'text', col2Width = 'auto', col2WidthPx = 160, col2Label = 'Order', col2Sortable = false, col2Align = 'left' as const,
    col3Variant = 'text', col3Width = 'auto', col3WidthPx = 160, col3Label = 'Total (RM)', col3Sortable = false, col3Align = 'right' as const,
    col4Variant = 'text', col4Width = 'auto', col4WidthPx = 160, col4Label = 'Column 4', col4Sortable = false, col4Align = 'left' as const,
    col5Variant = 'action-icon-buttons', col5Width = 'auto', col5WidthPx = 160, col5Label = 'Action', col5Sortable = false, col5Align = 'right' as const,
    col6Variant = 'text', col6Width = 'auto', col6WidthPx = 160, col6Label = 'Column 6', col6Sortable = false, col6Align = 'left' as const,
    col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
    col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible,
    col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
    col1HoverVisible,
  }) => {
    const [, updateArgs] = useArgs();

    const colDefs = [
      { variant: col1Variant, width: col1Width, widthPx: col1WidthPx, label: col1Label, sortable: col1Sortable, align: col1Align, showCheckbox: col1Checkbox, hoverStyle: col1HoverStyle },
      { variant: col2Variant, width: col2Width, widthPx: col2WidthPx, label: col2Label, sortable: col2Sortable, align: col2Align },
      { variant: col3Variant, width: col3Width, widthPx: col3WidthPx, label: col3Label, sortable: col3Sortable, align: col3Align },
      { variant: col4Variant, width: col4Width, widthPx: col4WidthPx, label: col4Label, sortable: col4Sortable, align: col4Align },
      { variant: col5Variant, width: col5Width, widthPx: col5WidthPx, label: col5Label, sortable: col5Sortable, align: col5Align },
      { variant: col6Variant, width: col6Width, widthPx: col6WidthPx, label: col6Label, sortable: col6Sortable, align: col6Align },
    ].slice(0, columnCount);

    useEffect(() => {
      const hoverSupportedVariants: TableCellVariantOption[] = [
        'text', 'leading-icon', 'info-icon', 'small-channel-icon',
        'listing', 'text-info', 'channel-icon', 'payment-shipping-method', 'tag-with-channel',
      ];
      const nextColVisible = [true, columnCount >= 2, columnCount >= 3, columnCount >= 4, columnCount >= 5, columnCount >= 6];
      const nextWidthPxVisible = [
        col1Width === 'fixed',
        col2Width === 'fixed' && columnCount >= 2,
        col3Width === 'fixed' && columnCount >= 3,
        col4Width === 'fixed' && columnCount >= 4,
        col5Width === 'fixed' && columnCount >= 5,
        col6Width === 'fixed' && columnCount >= 6,
      ];
      const nextCol1HoverVisible = hoverSupportedVariants.includes(col1Variant);
      const updates: Record<string, boolean> = {};
      const visibleKeys = ['col2Visible', 'col3Visible', 'col4Visible', 'col5Visible', 'col6Visible'] as const;
      const currentVisible = [col2Visible, col3Visible, col4Visible, col5Visible, col6Visible];
      visibleKeys.forEach((key, i) => {
        if (currentVisible[i] !== nextColVisible[i + 1]) updates[key] = nextColVisible[i + 1];
      });
      const widthPxKeys = ['col1WidthPxVisible', 'col2WidthPxVisible', 'col3WidthPxVisible', 'col4WidthPxVisible', 'col5WidthPxVisible', 'col6WidthPxVisible'] as const;
      const currentWidthPx = [col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible];
      widthPxKeys.forEach((key, i) => {
        if (currentWidthPx[i] !== nextWidthPxVisible[i]) updates[key] = nextWidthPxVisible[i];
      });
      if (col1HoverVisible !== nextCol1HoverVisible) updates['col1HoverVisible'] = nextCol1HoverVisible;
      if (Object.keys(updates).length > 0) updateArgs(updates);
    }, [
      columnCount, col1Variant, col2Visible, col3Visible, col4Visible, col5Visible, col6Visible,
      col1Width, col2Width, col3Width, col4Width, col5Width, col6Width,
      col1WidthPxVisible, col2WidthPxVisible, col3WidthPxVisible, col4WidthPxVisible, col5WidthPxVisible, col6WidthPxVisible,
      col1HoverVisible, updateArgs,
    ]);

    const getColumn = (idx: number): 'first' | 'center' | 'last' =>
      idx === 0 ? 'first' : idx === colDefs.length - 1 ? 'last' : 'center';

    const getWidthStyle = (def: typeof colDefs[number]): React.CSSProperties | undefined =>
      def.width === 'fixed' && Number.isFinite(def.widthPx) && (def.widthPx ?? 0) >= 40
        ? { width: `${def.widthPx}px` }
        : undefined;

    const getHeaderAlign = (def: typeof colDefs[number]): 'left' | 'center' | 'right' => def.align ?? 'left';

    const rowAlignment: 'start' | 'center' = colDefs.some(d => multiRowVariants.includes(d.variant))
      ? 'start'
      : 'center';

    const tableClass = colDefs.some(d => d.width === 'fixed') ? 'border-collapse w-full' : 'border-collapse w-full table-fixed';

    return (
      <table className={tableClass}>
          {showHeader && (
            <thead>
              <tr>
                {colDefs.map((def, colIdx) => (
                  <th key={colIdx} className="p-0" style={getWidthStyle(def)} aria-sort={def.sortable ? 'none' : undefined}>
                    <TableHeaderCell
                      inset
                      subheader
                      column={getColumn(colIdx)}
                      align={getHeaderAlign(def)}
                      label={def.label}
                      sortable={def.sortable}
                      checkbox={colIdx === 0 && (colDefs[0] as typeof colDefs[0]).showCheckbox ? <Checkbox size="sm" /> : undefined}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {ROW_BUILDER_DATA.map((datum, rowIdx) => (
              <tr key={rowIdx} className={subrowHoverRowClass}>
                {colDefs.map((def, colIdx) => (
                  <RowBuilderCell
                    key={colIdx}
                    variant={def.variant}
                    datum={datum}
                    column={getColumn(colIdx)}
                    row={rowIdx === ROW_BUILDER_DATA.length - 1 ? 'last' : 'default'}
                    rowAlignment={rowAlignment}
                    align={def.align}
                    subrow
                    showCheckbox={colIdx === 0 ? (def as typeof colDefs[0]).showCheckbox ?? false : false}
                    hoverStyle={colIdx === 0 ? (def as typeof colDefs[0]).hoverStyle ?? 'off' : 'off'}
                    widthStyle={getWidthStyle(def)}
                    hovered={hovered}
                    selected={selected}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  },
};



export const InfoSingleLine: Story = {
  tags: hiddenStoryTags,
  parameters: visualReferenceParameters,
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


/* ── TableCellMainSub content variant (Figma Inset Table Row - MainSub, 2121:9632) ── */


/* ── Text listing content variant (Figma Inset Table Row - Text Listing, 2809:9099) ── */


/* ── TableCellListing content variant (Figma Inset Table Row - Listing, 1262:9692) ── */


/* ── Content composition variants (Inset Table Row family) ── */

export const WithTagContent: Story = {
  tags: hiddenStoryTags,
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
  tags: hiddenStoryTags,
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
  tags: hiddenStoryTags,
  name: 'Default Body Row',
  render: () => (
    <div className={fullTableShellClass}>
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
              <TableHeaderCell
                column="first"
                align="left"
                label="Product"
                sortable
                checkbox={<Checkbox size="sm" />}
                className={fullTableHeaderCellClass}
              />
            </th>
            <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
              <TableHeaderCell column="center" align="left" label="SKU" sortable className={fullTableHeaderCellClass} />
            </th>
            <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
              <TableHeaderCell column="center" align="right" label="Stock" sortable className={fullTableHeaderCellClass} />
            </th>
            <th className="p-0" aria-sort={sortDirectionToAria(null, true)}>
              <TableHeaderCell column="center" align="right" label="Price" sortable className={fullTableHeaderCellClass} />
            </th>
            <th className="p-0">
              <TableHeaderCell column="last" align="left" label="Action" className={fullTableHeaderCellClass} />
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
          <tr aria-hidden="true">
            <td colSpan={5} className="h-[20px] bg-[var(--table-body-fill)] p-0" />
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
