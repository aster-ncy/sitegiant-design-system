import type { Meta, StoryObj } from '@storybook/react-vite';
import { UnderlinedTextField } from './UnderlinedTextField';

const meta = {
  title: 'Forms/UnderlinedTextField',
  component: UnderlinedTextField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    children: 'Text',
  },
} satisfies Meta<typeof UnderlinedTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Text' },
};

export const LongerValue: Story = {
  args: { children: 'jane.doe@example.com' },
};

export const InAList: Story = {
  args: { children: 'Text' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <div className="flex items-center gap-[var(--spacing-8)]">
        <span className="w-[120px] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
          Name
        </span>
        <UnderlinedTextField>Jane Doe</UnderlinedTextField>
      </div>
      <div className="flex items-center gap-[var(--spacing-8)]">
        <span className="w-[120px] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
          Email
        </span>
        <UnderlinedTextField>jane.doe@example.com</UnderlinedTextField>
      </div>
      <div className="flex items-center gap-[var(--spacing-8)]">
        <span className="w-[120px] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
          Phone
        </span>
        <UnderlinedTextField>+60 12-345 6789</UnderlinedTextField>
      </div>
    </div>
  ),
};
