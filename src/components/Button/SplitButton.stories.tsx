import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SplitButton } from './SplitButton';

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline'],
    },
    hasIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { onClick: fn(), onDropdownClick: fn(), label: 'Button' },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryDefault: Story = {
  args: { variant: 'primary' },
};

export const PrimaryWithIcon: Story = {
  args: { variant: 'primary', hasIcon: true },
};

export const OutlineDefault: Story = {
  args: { variant: 'outline' },
};

export const OutlineWithIcon: Story = {
  args: { variant: 'outline', hasIcon: true },
};

export const PrimaryDisabled: Story = {
  args: { variant: 'primary', disabled: true },
};

export const PrimaryDisabledWithIcon: Story = {
  args: { variant: 'primary', disabled: true, hasIcon: true },
};

export const OutlineDisabled: Story = {
  args: { variant: 'outline', disabled: true },
};

export const OutlineDisabledWithIcon: Story = {
  args: { variant: 'outline', disabled: true, hasIcon: true },
};

export const AllSplitButtons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      {/* Row 1: Primary */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-20 text-sm text-[color:var(--color-text-info)]">Primary</span>
        <SplitButton variant="primary" label="Button" />
        <SplitButton variant="primary" label="Button" hasIcon />
      </div>

      {/* Row 2: Outline */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-20 text-sm text-[color:var(--color-text-info)]">Outline</span>
        <SplitButton variant="outline" label="Button" />
        <SplitButton variant="outline" label="Button" hasIcon />
      </div>

      {/* Row 3: Disabled */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="w-20 text-sm text-[color:var(--color-text-info)]">Disabled</span>
        <SplitButton variant="primary" label="Button" disabled />
        <SplitButton variant="primary" label="Button" hasIcon disabled />
      </div>
    </div>
  ),
};
