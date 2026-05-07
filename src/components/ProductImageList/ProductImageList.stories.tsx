import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductImageList } from './ProductImageList';
import { ProductImage } from './ProductImage';
import { productImages } from '../../assets/product-images';

const items = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    src: productImages[i % productImages.length].src,
    alt: `Product ${i + 1}`,
  }));

const meta = {
  title: 'Surfaces/ProductImageList',
  component: ProductImageList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'atom', 'xl'] },
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
      <ProductImageList size="atom" items={items(3)} />
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
      <ProductImageList size="atom" items={items(8)} maxVisible={4} />
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
      <ProductImage size="atom" />
      <ProductImage size="xl" />
    </div>
  ),
};

export const SingleLarge: Story = {
  args: {
    items: [productImages[0]],
    size: 'xl',
  },
};

export const FigmaAtoms: Story = {
  name: 'Figma atoms',
  render: () => (
    <div className="flex items-center gap-[var(--spacing-20)]">
      {productImages.map((item) => (
        <ProductImage
          key={item.alt}
          src={item.src}
          alt={item.alt}
          size="atom"
          className="border-0 rounded-none bg-transparent"
        />
      ))}
    </div>
  ),
};
