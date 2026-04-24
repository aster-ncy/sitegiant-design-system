import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { iconNames } from './iconPaths';
import { channelIconNames } from './channelIconPaths';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'home', size: 'lg' },
};

export const Small: Story = {
  args: { name: 'search', size: 'sm' },
};

export const CustomColor: Story = {
  args: { name: 'bell', size: 'lg', color: 'var(--button-primary-default-fill)' },
};

export const CustomSize: Story = {
  args: { name: 'settings', size: 32 },
};

/* ── All Sizes ──────────────────────────────────────────── */

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon name="home" size={size} />
          <span className="text-[11px] text-[var(--color-text-info)]">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── Icon Grid — All Icons ─────────────────────────────── */

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-[var(--radius-8)] p-3 hover:bg-[var(--color-surface-card-inset-fill)] transition-colors"
          title={name}
        >
          <Icon name={name} size="lg" />
          <span className="text-[10px] text-[var(--color-text-info)] text-center leading-tight truncate w-full">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

/* ── Color Variants ────────────────────────────────────── */

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-xs text-[var(--color-text-info)]">Default</span>
        <Icon name="home" size="lg" />
        <Icon name="search" size="lg" />
        <Icon name="settings" size="lg" />
      </div>
      <div className="flex items-center gap-4 text-[var(--color-icon-primary)]">
        <span className="w-24 text-xs text-[var(--color-text-info)]">Primary</span>
        <Icon name="home" size="lg" />
        <Icon name="search" size="lg" />
        <Icon name="settings" size="lg" />
      </div>
      <div className="flex items-center gap-4 text-[var(--color-icon-success)]">
        <span className="w-24 text-xs text-[var(--color-text-info)]">Success</span>
        <Icon name="home" size="lg" />
        <Icon name="search" size="lg" />
        <Icon name="settings" size="lg" />
      </div>
      <div className="flex items-center gap-4 text-[var(--color-icon-danger)]">
        <span className="w-24 text-xs text-[var(--color-text-info)]">Danger</span>
        <Icon name="home" size="lg" />
        <Icon name="search" size="lg" />
        <Icon name="settings" size="lg" />
      </div>
      <div className="flex items-center gap-4 text-[var(--color-icon-secondary)]">
        <span className="w-24 text-xs text-[var(--color-text-info)]">Secondary</span>
        <Icon name="home" size="lg" />
        <Icon name="search" size="lg" />
        <Icon name="settings" size="lg" />
      </div>
    </div>
  ),
};

/* ── Video Cam States ──────────────────────────────────── */

export const VideoCamStates: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-20)]">
      <div className="flex flex-col items-center gap-[var(--spacing-8)]">
        <Icon
          name="videocam"
          size="lg"
          color="var(--color-icon-danger)"
          label="Recording"
        />
        <span className="text-[11px] text-[var(--color-text-info)]">
          Recording
        </span>
      </div>
      <div className="flex flex-col items-center gap-[var(--spacing-8)]">
        <Icon
          name="videocam"
          size="lg"
          color="var(--color-icon-subtle)"
          label="Idle"
        />
        <span className="text-[11px] text-[var(--color-text-info)]">Idle</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--spacing-8)]">
        <Icon
          name="videocam-off"
          size="lg"
          color="var(--color-icon-secondary)"
          label="Stopped"
        />
        <span className="text-[11px] text-[var(--color-text-info)]">
          Stopped
        </span>
      </div>
    </div>
  ),
};

/* ── Channel Icons ─────────────────────────────────────── */

export const ChannelIcons: Story = {
  name: 'All channel icons',
  render: () => (
    <div className="grid grid-cols-8 gap-4 max-w-[600px]">
      {channelIconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-[var(--radius-8)] p-3 hover:bg-[var(--color-surface-card-inset-fill)] transition-colors"
          title={name}
        >
          <Icon name={name} size="lg" />
          <span className="text-[10px] text-[var(--color-text-info)] text-center leading-tight truncate w-full">
            {name.replace('channel-', '')}
          </span>
        </div>
      ))}
    </div>
  ),
};

/* ── Arrows & Chevrons ─────────────────────────────────── */

export const NavigationIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2 text-[var(--color-text-primary)]">Arrows</p>
        <div className="flex gap-4">
          <Icon name="arrow-up" size="lg" />
          <Icon name="arrow-right" size="lg" />
          <Icon name="arrow-down" size="lg" />
          <Icon name="arrow-left" size="lg" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2 text-[var(--color-text-primary)]">Chevrons</p>
        <div className="flex gap-4">
          <Icon name="chevron-up" size="lg" />
          <Icon name="chevron-right" size="lg" />
          <Icon name="chevron-down" size="lg" />
          <Icon name="chevron-left" size="lg" />
        </div>
      </div>
    </div>
  ),
};
