import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    subtleText: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    label: 'Tag Text',
    subtleText: 'Subtle Text',
    dismissible: true,
    onDismiss: fn(),
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSubtle: Story = {
  args: { subtleText: undefined },
};

export const WithoutClose: Story = {
  args: { dismissible: false },
};

export const LabelOnly: Story = {
  args: { subtleText: undefined, dismissible: false },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)] items-start">
      <Tag label="Tag Text" subtleText="Subtle Text" dismissible onDismiss={fn()} />
      <Tag label="Tag Text" dismissible onDismiss={fn()} />
      <Tag label="Tag Text" subtleText="Subtle Text" />
      <Tag label="Tag Text" />
    </div>
  ),
};
