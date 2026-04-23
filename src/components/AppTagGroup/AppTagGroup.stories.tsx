import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTagGroup } from './AppTagGroup';

const meta = {
  title: 'Components/AppTagGroup',
  component: AppTagGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sidebar'] },
  },
  args: {
    size: 'default',
    tags: [{ type: 'new' }],
  },
} satisfies Meta<typeof AppTagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count1: Story = {
  args: {
    tags: [{ type: 'new' }],
  },
};

export const Count2: Story = {
  args: {
    tags: [{ type: 'basic' }, { type: 'new' }],
  },
};

export const Count3: Story = {
  args: {
    tags: [{ type: 'add-on' }, { type: 'basic' }, { type: 'new' }],
  },
};

export const Count4: Story = {
  args: {
    tags: [
      { type: 'premium' },
      { type: 'add-on' },
      { type: 'basic' },
      { type: 'new' },
    ],
  },
};

export const SidebarGroup: Story = {
  args: {
    size: 'sidebar',
    tags: [
      { type: 'premium' },
      { type: 'add-on' },
      { type: 'basic' },
      { type: 'new' },
    ],
  },
};

export const AllCounts: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)] items-start">
      <AppTagGroup tags={[{ type: 'new' }]} />
      <AppTagGroup tags={[{ type: 'basic' }, { type: 'new' }]} />
      <AppTagGroup tags={[{ type: 'add-on' }, { type: 'basic' }, { type: 'new' }]} />
      <AppTagGroup
        tags={[
          { type: 'premium' },
          { type: 'add-on' },
          { type: 'basic' },
          { type: 'new' },
        ]}
      />
    </div>
  ),
};
