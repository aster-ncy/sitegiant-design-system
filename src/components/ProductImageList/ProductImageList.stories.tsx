import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductImageList } from './ProductImageList';
import { ProductImage } from './ProductImage';

/** Inline SVG thumbnail — never fails to load, good for offline Storybook. */
const makeThumb = (n: number, hue: number) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <rect width="100" height="100" fill="hsl(${hue} 60% 85%)"/>
       <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
             font-family="Roboto, sans-serif" font-size="36"
             fill="hsl(${hue} 40% 30%)">${n}</text>
     </svg>`,
  );

const items = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    src: makeThumb(i + 1, (i * 47) % 360),
    alt: `Product ${i + 1}`,
  }));

const meta = {
  title: 'Components/ProductImageList',
  component: ProductImageList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    maxVisible: { control: { type: 'number', min: 1 } },
  },
  args: {
    size: 'md',
    items: items(3),
  },
} satisfies Meta<typeof ProductImageList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: items(3), size: 'md' },
};

export const WithOverflow: Story = {
  args: { items: items(6), size: 'md', maxVisible: 3 },
};

export const MixedSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-20)]">
      <ProductImageList size="sm" items={items(3)} />
      <ProductImageList size="md" items={items(3)} />
      <ProductImageList size="lg" items={items(3)} />
      <ProductImageList size="xl" items={items(3)} />
    </div>
  ),
};

export const OverflowPerSize: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-20)]">
      <ProductImageList size="sm" items={items(8)} maxVisible={4} />
      <ProductImageList size="md" items={items(8)} maxVisible={4} />
      <ProductImageList size="lg" items={items(8)} maxVisible={4} />
      <ProductImageList size="xl" items={items(8)} maxVisible={4} />
    </div>
  ),
};

export const EmptyPlaceholder: Story = {
  name: 'Empty placeholder (no src)',
  render: () => (
    <div className="flex items-center gap-[var(--spacing-8)]">
      <ProductImage size="sm" />
      <ProductImage size="md" />
      <ProductImage size="lg" />
      <ProductImage size="xl" />
    </div>
  ),
};

export const SingleLarge: Story = {
  args: {
    items: [{ src: makeThumb(1, 210), alt: 'Single product' }],
    size: 'xl',
  },
};
