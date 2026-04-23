import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pip } from './Pip';
import type { PipType } from './Pip';

const meta = {
  title: 'Components/Pip',
  component: Pip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'],
    },
    pipStyle: { control: 'select', options: ['default', 'solid'] },
    label: { control: 'text' },
  },
  args: { label: 'Pip Text' },
} satisfies Meta<typeof Pip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { type: 'success', pipStyle: 'default' },
};

export const Info: Story = {
  args: { type: 'info', pipStyle: 'default' },
};

export const Warning: Story = {
  args: { type: 'warning', pipStyle: 'default' },
};

export const Alert: Story = {
  args: { type: 'alert', pipStyle: 'default' },
};

export const Danger: Story = {
  args: { type: 'danger', pipStyle: 'default' },
};

export const Muted: Story = {
  args: { type: 'muted', pipStyle: 'default' },
};

export const Highlight: Story = {
  args: { type: 'highlight', pipStyle: 'default' },
};

export const Blocked: Story = {
  args: { type: 'blocked', pipStyle: 'default' },
};

export const SolidSuccess: Story = {
  args: { type: 'success', pipStyle: 'solid' },
};

export const SolidInfo: Story = {
  args: { type: 'info', pipStyle: 'solid' },
};

export const SolidWarning: Story = {
  args: { type: 'warning', pipStyle: 'solid' },
};

export const SolidAlert: Story = {
  args: { type: 'alert', pipStyle: 'solid' },
};

export const SolidDanger: Story = {
  args: { type: 'danger', pipStyle: 'solid' },
};

export const SolidMuted: Story = {
  args: { type: 'muted', pipStyle: 'solid' },
};

export const SolidHighlight: Story = {
  args: { type: 'highlight', pipStyle: 'solid' },
};

export const SolidBlocked: Story = {
  args: { type: 'blocked', pipStyle: 'solid' },
};

/* ── Gallery: all types side by side ──────────────── */
const allTypes: PipType[] = ['success', 'info', 'warning', 'alert', 'danger', 'muted', 'highlight', 'blocked'];

export const AllDefault: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-8)]">
      {allTypes.map(t => <Pip key={t} type={t} pipStyle="default" label={t} />)}
    </div>
  ),
};

export const AllSolid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-8)]">
      {allTypes.map(t => <Pip key={t} type={t} pipStyle="solid" label={t} />)}
    </div>
  ),
};
