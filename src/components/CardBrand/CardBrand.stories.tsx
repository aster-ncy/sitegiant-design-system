import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardBrand, type CardBrandName } from './CardBrand';

const meta = {
  title: 'Components/CardBrand',
  component: CardBrand,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'inline-radio',
      options: ['visa', 'mastercard'] satisfies CardBrandName[],
    },
    height: { control: { type: 'number', min: 8, max: 96, step: 1 } },
    label: { control: 'text' },
  },
  args: {
    name: 'visa',
    height: 36,
  },
} satisfies Meta<typeof CardBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visa: Story = { args: { name: 'visa', height: 36 } };
export const Mastercard: Story = { args: { name: 'mastercard', height: 36 } };

export const BadgeSize: Story = {
  args: { name: 'visa', height: 13 },
  parameters: { docs: { description: { story: 'Default height (13px) used inside CardNumberInput badge.' } } },
};

export const Sizes: Story = {
  args: { name: 'visa' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      {[13, 20, 36, 64].map((h) => (
        <div key={h} className="flex items-center gap-[var(--spacing-16)]">
          <span className="w-[60px] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
            {h}px
          </span>
          <CardBrand name="visa" height={h} />
          <CardBrand name="mastercard" height={h} />
        </div>
      ))}
    </div>
  ),
};

export const InsideCardNumberInputBadge: Story = {
  args: { name: 'visa' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      {(['visa', 'mastercard'] satisfies CardBrandName[]).map((name) => (
        <span
          key={name}
          className="inline-flex items-center justify-center px-[var(--spacing-2)] py-[var(--spacing-4)] bg-[var(--color-white)] border border-solid border-[color:var(--color-divider-light)] rounded-[var(--radius-2)] w-fit"
        >
          <CardBrand name={name} height={13} />
        </span>
      ))}
    </div>
  ),
};
