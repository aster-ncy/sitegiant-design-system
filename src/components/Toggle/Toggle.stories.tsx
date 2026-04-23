import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'special'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Enable notifications' },
};

export const Checked: Story = {
  args: { checked: true, label: 'Notifications enabled' },
};

export const SpecialVariant: Story = {
  args: { checked: true, variant: 'special', label: 'Premium feature' },
};

export const WithHelperText: Story = {
  args: {
    checked: true,
    label: 'Auto-sync inventory',
    helperText: 'Automatically sync stock levels across all channels',
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled toggle' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: 'Disabled (on)' },
};

/* ── Interactive ───────────────────────────────────────── */

const InteractiveToggle = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
      label={checked ? 'ON — Click to turn off' : 'OFF — Click to turn on'}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveToggle />,
};

/* ── All States Overview ───────────────────────────────── */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        All Toggle States
      </p>
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <Toggle label="Off (default)" />
        <Toggle checked label="On (default variant)" />
        <Toggle checked variant="special" label="On (special variant — blue)" />
        <Toggle label="With helper text" helperText="Additional description for context" />
        <Toggle disabled label="Disabled off" />
        <Toggle disabled checked label="Disabled on" />
      </div>
    </div>
  ),
};

/* ── Settings Panel Example ────────────────────────────── */

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: false,
    darkMode: false,
    analytics: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-[var(--spacing-16)] w-[320px]">
      <p className="text-[length:var(--text-14)] font-[var(--font-weight-semibold)] text-[color:var(--color-text-primary)]">
        Settings
      </p>
      <div className="flex flex-col gap-[var(--spacing-12)]">
        <Toggle
          checked={settings.notifications}
          onChange={() => toggle('notifications')}
          label="Push Notifications"
          helperText="Receive alerts for new orders"
        />
        <Toggle
          checked={settings.autoSync}
          onChange={() => toggle('autoSync')}
          label="Auto-sync Inventory"
          helperText="Sync stock across channels hourly"
        />
        <Toggle
          checked={settings.darkMode}
          onChange={() => toggle('darkMode')}
          variant="special"
          label="Dark Mode"
          helperText="Switch to dark theme"
        />
        <Toggle
          checked={settings.analytics}
          onChange={() => toggle('analytics')}
          label="Usage Analytics"
          helperText="Help us improve with anonymous data"
        />
      </div>
    </div>
  );
};

export const SettingsExample: Story = {
  render: () => <SettingsPanel />,
};
