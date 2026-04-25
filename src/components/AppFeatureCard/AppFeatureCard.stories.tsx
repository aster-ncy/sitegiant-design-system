import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppFeatureCard } from './AppFeatureCard';

const meta = {
  title: 'Surfaces/AppFeatureCard',
  component: AppFeatureCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    titleWeight: { control: 'select', options: ['bold', 'regular'] },
    title: { control: 'text' },
    description: { control: 'text' },
    ctaLabel: { control: 'text' },
    imageSrc: { control: 'text' },
  },
  args: {
    title: 'Vouchers',
    description:
      'Encourage customers to shop more by create Store Vouchers for storewide, or Product Vouchers for specific products.',
    imageSrc: 'https://placehold.co/325x175',
    imageAlt: 'Feature illustration',
    ctaLabel: 'Manage',
    onCtaClick: fn(),
  },
} satisfies Meta<typeof AppFeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoldTitle: Story = {
  args: { titleWeight: 'bold' },
};

export const RegularTitle: Story = {
  args: { titleWeight: 'regular' },
};

export const LongDescription: Story = {
  args: {
    titleWeight: 'bold',
    title: 'Product Vouchers',
    description:
      'Create targeted discounts for specific products or collections. Customers can apply the voucher at checkout to receive an instant price reduction, driving more sales on the items you want to promote.',
  },
};

export const CustomCta: Story = {
  args: {
    titleWeight: 'bold',
    ctaLabel: 'Set up',
  },
};

export const AllWeights: Story = {
  render: (args) => (
    <div className="flex flex-row gap-[var(--spacing-20)] items-start">
      <AppFeatureCard {...args} titleWeight="bold" />
      <AppFeatureCard {...args} titleWeight="regular" />
    </div>
  ),
};
