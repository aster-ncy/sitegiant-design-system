import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Checkbox,
  Icon,
  Pip,
  ProductImage,
  TableCardCell,
  TableCardCellListing,
  Toggle,
} from '../../components';
import { NumberInput } from '../../components/NumberInput';
import productImage from '../../assets/product-images/product-1.png';
import shopeeIcon from '../../assets/channel-icons/shopee.png';
import webstoreIcon from '../../assets/channel-icons/sitegiant-webstore.png';

/**
 * Reproductions of 3 live ERP **card-table** screens.
 * Each story exercises the `TableCardCell` top-tier + bottom-tier path so the
 * card-table rendering is provably faithful end-to-end.
 *
 * - S10 — Shocking Sale Products (campaign variant editing)
 * - S13 — Shopee Ratings (reviewer card with product, rating, toggle)
 * - S14 — Order Processing (package header + nested order card)
 *
 * Source screenshots: `references/inset_table_s10.png`,
 * `references/table_s13.png`, `references/table_s14.png`.
 * Pairs with DefaultTableScreens.stories.tsx (s4, s7, s8) and
 * InsetTableScreens.stories.tsx (s1..s9).
 */
const meta = {
  title: 'Tables/Table Recipes/Card Table Reference Screens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Shared assets
// ---------------------------------------------------------------------------

const ShopeeIcon = () => (
  <img
    src={shopeeIcon}
    alt="Shopee"
    className="size-[21px] shrink-0 rounded-[var(--radius-4)] object-cover"
  />
);

const WebstoreIcon = () => (
  <img
    src={webstoreIcon}
    alt="Webstore"
    className="size-[21px] shrink-0 rounded-[var(--radius-4)] object-cover"
  />
);

// Card-table outer container — white panel with 20px border-radius.
const cardClasses =
  'rounded-[var(--inset-card-radii)] border border-[color:var(--color-surface-card-border)] bg-[color:var(--color-surface-card)] p-[var(--spacing-24)]';

// Fixed height for S13 bottom-tier card rows — matches the Figma 105px cell spec.
const cardBottomHeightClass = '!h-[105px]';

// ── S10 Shocking Sale ────────────────────────────────────────────────────────

/**
 * Shocking Sale Products — campaign variant editing table.
 * One product card with a top-tier header (product title + checkbox) and
 * N bottom-tier rows (variant label | price display | price input | %off
 * input | campaign stock input | stock | status toggle).
 *
 * Proves: `mode="default"` padding, `bottomVariant="form-field"` centering
 * for number inputs, `bottomVariant="status-toggle"` trailing padding flip
 * for the last column, and `group/row` hover wiring.
 */
export const S10ShockingSale: Story = {
  render: () => {
    type Variant = {
      key: string;
      label: string;
      price: string;
      offPercent: string;
      campaignStock: string;
      stock: number;
      purchaseLimit: string;
      enabled: boolean;
    };

    const [variants, setVariants] = useState<Variant[]>([
      { key: 'blue-s', label: 'Blue, S', price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '2', enabled: true },
      { key: 'blue-m', label: 'Blue, M', price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '2', enabled: true },
      { key: 'red-s',  label: 'Red, S',  price: '16.00', offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '4', enabled: true },
      { key: 'red-m',  label: 'Red, M',  price: '0.00',  offPercent: '20', campaignStock: '10', stock: 44, purchaseLimit: '', enabled: true },
    ]);

    const update = <K extends keyof Variant>(key: string, field: K, value: Variant[K]) =>
      setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)));

    return (
      <div className={cardClasses}>
        <h2 className="mb-[var(--spacing-16)] font-[var(--font-weight-bold)] text-[length:var(--text-16)]">
          Shocking Sale Products
        </h2>
        <div className="overflow-hidden rounded-[var(--radius-4)]">
          <table className="w-full table-fixed border-collapse">
            <tbody>
              {/* Top Tier — product header spanning all columns */}
              <tr className="group/row">
                <td className="p-0" colSpan={7}>
                  <TableCardCell
                    tier="top"
                    column="first"
                    mode="default"
                    checkbox={<Checkbox size="sm" />}
                    className="!border-r rounded-tr-[var(--radius-4)]"
                  >
                    <span className="inline-flex items-center gap-[var(--spacing-8)]">
                      <span
                        aria-hidden="true"
                        className="size-[var(--spacing-40)] shrink-0 rounded-[var(--radius-4)] bg-[var(--color-set-light)]"
                      />
                      <span className="font-[var(--font-weight-bold)]">
                        Women's Fashion Cat Print Plus Velvet Hooded Sweater
                      </span>
                    </span>
                  </TableCardCell>
                </td>
              </tr>

              {/* Bottom Tier — one row per variant */}
              {variants.map((v, i) => {
                const row = i === variants.length - 1 ? 'last' : i === 0 ? 'first' : 'middle';
                return (
                  <tr key={v.key} className="group/row">
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="first" mode="default" bottomVariant="form-field">
                        {v.label}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" mode="default" bottomVariant="form-field">
                        RM{v.price}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" mode="default" bottomVariant="form-field">
                        <NumberInput
                          value={v.price}
                          onChange={(val) => update(v.key, 'price', val)}
                        />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" mode="default" bottomVariant="form-field">
                        <NumberInput
                          value={v.offPercent}
                          onChange={(val) => update(v.key, 'offPercent', val)}
                        />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" mode="default" bottomVariant="form-field">
                        <NumberInput
                          value={v.campaignStock}
                          onChange={(val) => update(v.key, 'campaignStock', val)}
                        />
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell tier="bottom" row={row} column="center" mode="default" bottomVariant="form-field">
                        {v.stock}
                      </TableCardCell>
                    </td>
                    <td className="p-0">
                      <TableCardCell
                        tier="bottom"
                        row={row}
                        column="last"
                        mode="default"
                        bottomVariant="status-toggle"
                        trailing={
                          <Toggle
                            checked={v.enabled}
                            onChange={(checked) => update(v.key, 'enabled', checked)}
                          />
                        }
                      >
                        {v.purchaseLimit || 'No limit'}
                      </TableCardCell>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};

// ── S13 Shopee Ratings ───────────────────────────────────────────────────────

/**
 * Shopee Ratings — reviewer card layout.
 * Top tier: checkbox offset | reviewer avatar + name | review # | channel icon + name.
 * Bottom tier: product listing | star rating + review text | timestamp | status toggle.
 *
 * Proves: `topVariant="user-icon"` tight gap, `topVariant="app-icon"` for channel,
 * `bottomVariant="listing"` for the product cell, `bottomVariant="status-toggle"`,
 * and `mode="default"` padding throughout.
 */
export const S13ShopeeRatings: Story = {
  render: () => {
    const [toggled, setToggled] = useState(true);

    return (
      <div className="inline-flex items-start gap-[var(--spacing-12)]">
        {/* Row-select checkbox offset outside the card */}
        <span className="inline-flex pt-[var(--spacing-14)]">
          <Checkbox size="sm" />
        </span>

        <div className="w-[980px] overflow-hidden rounded-[var(--radius-4)] border border-solid border-[color:var(--table-divider-border)]">
          {/* Top tier — reviewer meta */}
          <div className="group/row grid grid-cols-[32%_40%_18%_10%] border-b border-solid border-[color:var(--table-divider-border)]">
            <TableCardCell
              tier="top"
              column="first"
              mode="default"
              topVariant="user-icon"
              className="!items-center !rounded-none !border-0"
              leadingIcon={
                <span className="inline-flex size-[21px] shrink-0 items-center justify-center rounded-full bg-[var(--color-space-DEFAULT)] text-[length:var(--text-12)] leading-none text-[color:var(--color-text-info)]">
                  A
                </span>
              }
            >
              Tiffany
            </TableCardCell>
            <TableCardCell
              tier="top"
              column="center"
              mode="default"
              className="!items-center !rounded-none !border-0 !border-l-0"
            >
              #233
            </TableCardCell>
            <TableCardCell
              tier="top"
              column="last"
              mode="default"
              topVariant="app-icon"
              className="!items-center !rounded-none !border-0 !border-l-0 col-span-2"
              leadingIcon={<ShopeeIcon />}
            >
              SHOPEE MY
            </TableCardCell>
          </div>

          {/* Bottom tier — product + review */}
          <div className="group/row grid grid-cols-[32%_40%_18%_10%]">
            <TableCardCell
              tier="bottom"
              row="last"
              column="first"
              mode="default"
              bottomVariant="listing"
              className={`${cardBottomHeightClass} !rounded-none !border-0`}
            >
              <TableCardCellListing
                image={<ProductImage src={productImage} alt="Dynamo" size="lg" />}
                productName="DYNAMO 4in1 Laundry Capsules Fresh 10ml 52pcs"
                variant={{ label: 'Variant', value: 'Red' }}
                sku={{ label: 'SKU', value: '1902839204' }}
              />
            </TableCardCell>
            <TableCardCell
              tier="bottom"
              row="last"
              column="center"
              mode="default"
              className={`${cardBottomHeightClass} !rounded-none !border-0 !border-l-0`}
            >
              <span className="flex flex-col items-start gap-[var(--spacing-4)]">
                <span className="inline-flex items-center gap-[var(--spacing-2)] text-[color:var(--color-sys-orange-light)]">
                  <Icon name="star-full" size={16} />
                  <Icon name="star-full" size={16} />
                  <Icon name="star-full" size={16} />
                  <Icon name="star-full" size={16} />
                  <Icon name="star-full" size={16} color="var(--color-space-DEFAULT)" />
                </span>
                <span>Baju dalam keadaan baik. Pembungkusan pun teliti.</span>
              </span>
            </TableCardCell>
            {/* Timestamp — single line in a tall row, use form-field to vertically centre */}
            <TableCardCell
              tier="bottom"
              row="last"
              column="center"
              mode="default"
              bottomVariant="form-field"
              className={`${cardBottomHeightClass} !rounded-none !border-0 !border-l-0`}
            >
              <span className="whitespace-nowrap">22 May 2025 11:58am</span>
            </TableCardCell>
            <TableCardCell
              tier="bottom"
              row="last"
              column="last"
              mode="default"
              bottomVariant="status-toggle"
              className={`${cardBottomHeightClass} !rounded-none !border-0 !border-l-0`}
              trailing={<Toggle checked={toggled} onChange={setToggled} />}
            />
          </div>
        </div>
      </div>
    );
  },
};

// ── S14 Order Processing ─────────────────────────────────────────────────────

/**
 * Order Processing — package header with nested order card.
 * Outer top tier: Package ID / Packing Note / Tracking No / Courier (label-value pairs).
 * Outer bottom tier: white panel containing an inner card.
 * Inner card top tier: Order IDs | Buyer + location | Channel icon.
 * Inner card bottom tier: product listing | dates + shipping | status pips | amounts | × action.
 *
 * Proves: nested card layout, `bottomVariant="listing"` + `properties` + `extras`,
 * `bottomVariant="action-button"` for the close action, `mode="default"` throughout.
 */
export const S14OrderProcessing: Story = {
  render: () => (
    <div className="inline-flex w-[1000px] flex-col">
      {/* Outer top tier — package metadata */}
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[28%]" />
          <col className="w-[26%]" />
          <col className="w-[32%]" />
        </colgroup>
        <tbody>
          <tr>
            <td className="p-0">
              <TableCardCell tier="top" column="first" mode="default">
                <span className="flex flex-col gap-[var(--spacing-2)]">
                  <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Package ID</span>
                  <span className="font-[var(--font-weight-bold)]">7</span>
                </span>
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center" mode="default" className="!border-l-0">
                <span className="flex flex-col gap-[var(--spacing-2)]">
                  <span className="flex items-center gap-[var(--spacing-4)] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">
                    Packing Note
                    <Icon name="edit-pen" size={17} color="var(--color-sys-blue-DEFAULT)" />
                  </span>
                  <span>—</span>
                </span>
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="center" mode="default" className="!border-l-0">
                <span className="flex flex-col gap-[var(--spacing-2)]">
                  <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Tracking No</span>
                  <span>4678326478</span>
                </span>
              </TableCardCell>
            </td>
            <td className="p-0">
              <TableCardCell tier="top" column="last" mode="default" className="!border-l-0">
                <span className="flex flex-col gap-[var(--spacing-2)]">
                  <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Courier Service</span>
                  <span>Others (Self-Delivery)</span>
                </span>
              </TableCardCell>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Outer bottom tier — white panel containing the inner order card */}
      <div className="rounded-b-[var(--radius-4)] border-x border-b border-solid border-[color:var(--table-divider-border)] bg-[color:var(--color-surface-card)] px-[var(--spacing-24)] pt-[var(--spacing-12)] pb-[var(--spacing-24)]">
        <div className="overflow-hidden rounded-[var(--radius-4)]">

          {/* Inner top tier — order IDs / buyer / channel */}
          <div className="flex">
            <div className="w-[34%]">
              <TableCardCell tier="top" column="first" mode="default">
                <span className="flex items-center gap-[var(--spacing-20)] whitespace-nowrap">
                  <span className="font-[var(--font-weight-bold)]">#7</span>
                  <span>COID: -</span>
                  <span>INV: -</span>
                </span>
              </TableCardCell>
            </div>
            <div className="w-[32%]">
              <TableCardCell tier="top" column="center" mode="default" className="!pl-[var(--spacing-12)] !pr-[var(--spacing-12)] !border-l-0">
                <span className="flex min-w-0 items-center gap-[var(--spacing-8)] whitespace-nowrap">
                  <span>Edward</span>
                  <span className="shrink-0">|</span>
                  <span>Pulau Pinang, Malaysia</span>
                  <Icon name="edit-pen" size={17} color="var(--color-sys-blue-DEFAULT)" />
                </span>
              </TableCardCell>
            </div>
            <div className="w-[34%]">
              <TableCardCell
                tier="top"
                column="last"
                mode="default"
                topVariant="app-icon"
                className="!pl-[var(--spacing-12)] !pr-[var(--spacing-24)] !border-l-0"
                leadingIcon={<WebstoreIcon />}
              >
                <span className="ml-auto">WEBSTORE</span>
              </TableCardCell>
            </div>
          </div>

          {/* Inner bottom tier — product | dates | status pips | amounts | × */}
          <div className="group/row flex">
            <div className="flex w-[34%]">
              <TableCardCell tier="bottom" row="last" column="first" mode="default" bottomVariant="listing">
                <TableCardCellListing
                  image={<ProductImage src={productImage} alt="Product" size="lg" />}
                  productName="[TESTING PRODUCT, DO NOT BUY] FishBone Keychain"
                  variant={{ label: 'iSKU', value: 'cute-keycap-fidget-clicker-keychain-fishbone-black' }}
                  sku={{ label: 'SKU', value: 'cute-keycap-fidget-clicker-keychain-fishbone-black' }}
                  properties={[{ label: 'Color/Size', value: 'Black/5cm' }]}
                  extras={
                    <span>
                      RM299.00{' '}
                      <span className="text-[color:var(--color-sys-blue-DEFAULT)]">
                        x <span className="font-[var(--font-weight-bold)]">1</span>
                      </span>
                    </span>
                  }
                />
              </TableCardCell>
            </div>
            <div className="flex w-[18%]">
              <TableCardCell
                tier="bottom"
                row="last"
                column="center"
                mode="default"
                className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0"
              >
                <span className="flex flex-col gap-[var(--spacing-4)]">
                  <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Order Date</span>
                  <span>13-02-2026</span>
                  <span>10:45:20</span>
                  <span className="mt-[var(--spacing-8)] text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Shipping Method</span>
                  <span>Pickup</span>
                </span>
              </TableCardCell>
            </div>
            <div className="flex w-[14%]">
              <TableCardCell
                tier="bottom"
                row="last"
                column="center"
                mode="default"
                className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0"
              >
                <span className="flex flex-col items-start gap-[var(--spacing-4)]">
                  <Pip type="warning" label="Processed" />
                  <Pip type="success" label="Paid" />
                </span>
              </TableCardCell>
            </div>
            <div className="flex w-[24%]">
              <TableCardCell
                tier="bottom"
                row="last"
                column="center"
                mode="default"
                className="!pl-[var(--spacing-12)] !pr-[var(--spacing-6)] !border-l-0"
              >
                <span className="flex flex-col gap-[var(--spacing-4)]">
                  <span className="text-[length:var(--text-16)] leading-[var(--leading-24)] font-[var(--font-weight-bold)]">RM299.00</span>
                  <span className="text-[length:var(--text-12)] leading-[var(--leading-17)] text-[color:var(--color-text-info)]">Cash on delivery</span>
                  <span className="flex items-center gap-[var(--spacing-4)]">
                    <Icon name="database" size={17} color="var(--color-text-info)" />
                    <span className="text-[color:var(--color-sys-green-DEFAULT)]">RM299.00</span>
                  </span>
                  <span className="pl-[calc(17px+var(--spacing-4))] text-[color:var(--color-sys-green-DEFAULT)]">100%</span>
                </span>
              </TableCardCell>
            </div>
            <div className="flex w-[10%]">
              <TableCardCell
                tier="bottom"
                row="last"
                column="last"
                mode="default"
                bottomVariant="action-button"
                className="!border-l-0"
              >
                <Icon name="close" size={17} color="var(--color-sys-red-DEFAULT)" />
              </TableCardCell>
            </div>
          </div>

        </div>
      </div>
    </div>
  ),
};
