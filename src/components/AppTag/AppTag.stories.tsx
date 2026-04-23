import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTag } from './AppTag';

const meta = {
  title: 'Components/AppTag',
  component: AppTag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['beta', 'basic', 'new', 'add-on', 'free-trial', 'premium', 'hot'],
    },
    size: { control: 'select', options: ['default', 'sidebar'] },
    label: { control: 'text' },
  },
  args: {
    type: 'beta',
    size: 'default',
  },
} satisfies Meta<typeof AppTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Beta: Story = { args: { type: 'beta' } };
export const Basic: Story = { args: { type: 'basic' } };
export const New: Story = { args: { type: 'new' } };
export const AddOn: Story = { args: { type: 'add-on' } };
export const FreeTrial: Story = { args: { type: 'free-trial' } };
export const Premium: Story = { args: { type: 'premium' } };
export const Hot: Story = { args: { type: 'hot' } };

export const SidebarBeta: Story = { args: { type: 'beta', size: 'sidebar' } };
export const SidebarNew: Story = { args: { type: 'new', size: 'sidebar' } };
export const SidebarAddOn: Story = { args: { type: 'add-on', size: 'sidebar' } };
export const SidebarPremium: Story = { args: { type: 'premium', size: 'sidebar' } };
export const SidebarHot: Story = { args: { type: 'hot', size: 'sidebar' } };

const allTypes: Array<Parameters<typeof AppTag>[0]['type']> = [
  'beta',
  'new',
  'add-on',
  'free-trial',
  'basic',
  'premium',
  'hot',
];

export const AllDefault: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-8)] items-start">
      {allTypes.map((t) => (
        <AppTag key={t} type={t} size="default" />
      ))}
    </div>
  ),
};

export const AllSidebar: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-8)] items-start">
      {allTypes.map((t) => (
        <AppTag key={t} type={t} size="sidebar" />
      ))}
    </div>
  ),
};

export const SideBySide: Story = {
  render: () => (
    <div className="flex gap-[var(--spacing-24)] items-start">
      <div className="flex flex-col gap-[var(--spacing-8)] items-start">
        <div className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">Default</div>
        {allTypes.map((t) => (
          <AppTag key={t} type={t} size="default" />
        ))}
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)] items-start">
        <div className="text-[length:var(--text-12)] text-[color:var(--color-text-info)] mb-[var(--spacing-4)]">Sidebar</div>
        {allTypes.map((t) => (
          <AppTag key={t} type={t} size="sidebar" />
        ))}
      </div>
    </div>
  ),
};
