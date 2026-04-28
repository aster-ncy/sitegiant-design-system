import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardNumberInput } from './CardNumberInput';
import { CardBrand } from '../CardBrand';

const meta = {
  title: 'Forms/CardNumberInput',
  component: CardNumberInput,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'focus', 'danger', 'disabled', 'readonly', 'readonly-bold'],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: '•••• •••• •••• ••••',
  },
} satisfies Meta<typeof CardNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The brand badge slot accepts any ReactNode. Pair with the <CardBrand>
   component for Visa / Mastercard, or pass your own <img> / SVG element
   for other issuers. */
const VisaBrand = <CardBrand name="visa" height={13} />;
const MastercardBrand = <CardBrand name="mastercard" height={13} />;

export const Default: Story = {
  args: {
    brand: VisaBrand,
  },
};

export const Filled: Story = {
  args: {
    brand: VisaBrand,
    defaultValue: '4111 1111 1111 1111',
  },
};

export const WithLabel: Story = {
  args: {
    brand: VisaBrand,
    label: 'Card number',
    defaultValue: '4111 1111 1111 1111',
    helperText: 'Visa, Mastercard, Amex accepted.',
  },
};

export const NoBadge: Story = {
  args: {
    defaultValue: '4111 1111 1111 1111',
    helperText: 'Brand badge omitted — falls back to plain Input.',
  },
};

export const ValidationError: Story = {
  args: {
    brand: VisaBrand,
    defaultValue: '1234 5',
    validation: 'error',
    helperText: 'Card number must be 16 digits.',
  },
};

export const ValidationSuccess: Story = {
  args: {
    brand: VisaBrand,
    defaultValue: '4111 1111 1111 1111',
    validation: 'success',
    helperText: 'Card verified.',
  },
};

export const Disabled: Story = {
  args: {
    brand: VisaBrand,
    state: 'disabled',
    defaultValue: '4111 1111 1111 1111',
  },
};

export const Readonly: Story = {
  args: {
    brand: VisaBrand,
    state: 'readonly',
    defaultValue: '4111 1111 1111 1111',
  },
};

export const MastercardSample: Story = {
  args: {
    brand: MastercardBrand,
    label: 'Card number',
    defaultValue: '5500 0000 0000 0004',
    helperText: 'Mastercard, ending 0004',
  },
};

export const Slim: Story = {
  args: {
    brand: VisaBrand,
    size: 'slim',
    defaultValue: '4111 1111 1111 1111',
  },
};

