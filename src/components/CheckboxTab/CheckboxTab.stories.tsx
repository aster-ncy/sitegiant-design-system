import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxTab } from './CheckboxTab';
import { Checkbox } from '../Checkbox';
import { Dropdown } from '../Dropdown';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import lazadaMy from '../../assets/channel-icons/lazada-my.png';
import shopeeSg from '../../assets/channel-icons/shopee-sg.png';
import tiktokMy from '../../assets/channel-icons/tiktok-my.png';

const meta = {
  title: 'Forms/CheckboxTab',
  component: CheckboxTab,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'selected', 'indeterminate'] },
    label: { control: 'text' },
    hintText: { control: 'text' },
    disabled: { control: 'boolean' },
    expanded: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxTab>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — heading-only, no chevron ────────────────────────────── */
export const Default: Story = {
  args: {
    label: 'Checkbox Value',
    state: 'default',
  },
};

export const Selected: Story = {
  args: {
    label: 'Checkbox Value',
    state: 'selected',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Checkbox Value',
    state: 'indeterminate',
  },
};

/* ── With hint text ───────────────────────────────────────────────── */
export const WithHint: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'selected',
  },
};

/* ── With chevron — expanded vs collapsed ─────────────────────────── */
export const ExpandedChevron: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'default',
    expanded: true,
  },
};

export const CollapsedChevron: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'default',
    expanded: false,
  },
};

/* ── With channel icon ────────────────────────────────────────────── */
export const WithChannelIcon: Story = {
  args: {
    label: 'ShopeeMY',
    state: 'indeterminate',
    expanded: true,
    icon: <img src={shopeeMy} alt="" className="w-full h-full object-cover" />,
  },
};

/* ── With dropdown slot (replaces the chevron) ────────────────────── */
export const WithDropdown: Story = {
  args: {
    label: 'Checkbox Value',
    state: 'default',
    dropdown: (
      <Dropdown
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ]}
        placeholder="Value"
      />
    ),
  },
};

/* ── Disabled ─────────────────────────────────────────────────────── */
export const DisabledExpanded: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'default',
    disabled: true,
    expanded: true,
  },
};

export const DisabledCollapsed: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'default',
    disabled: true,
    expanded: false,
  },
};

/* ── Dropdown variants — confirm checkbox state is independent ──── */
export const DropdownIndeterminate: Story = {
  args: {
    label: 'Checkbox Value',
    state: 'indeterminate',
    dropdown: (
      <Dropdown
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ]}
        placeholder="Value"
      />
    ),
  },
};

/* ── Variant matrix ───────────────────────────────────────────────── */
export const AllStates: Story = {
  args: { label: 'Checkbox Value' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)] w-[600px]">
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="default" expanded={true} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="default" expanded={false} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="selected" expanded={true} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="selected" expanded={false} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="indeterminate" expanded={true} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="indeterminate" expanded={false} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="default" disabled={true} expanded={true} />
      <CheckboxTab label="Checkbox Value" hintText="Hint text" state="default" disabled={true} expanded={false} />
    </div>
  ),
};

/* ── Live UI example: channel groups with collapsible child grids ─── */
export const ChannelGroupExample: Story = {
  args: { label: 'Channel groups' },
  render: () => {
    type ChannelKey = 'shopeeMy' | 'lazadaMy' | 'shopeeSg' | 'tiktokMy';

    const ChannelGroups = () => {
      const [expanded, setExpanded] = useState<Record<ChannelKey, boolean>>({
        shopeeMy: true,
        lazadaMy: true,
        shopeeSg: false,
        tiktokMy: true,
      });

      const toggle = (key: ChannelKey) =>
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

      // Spacing convention in the live UI:
      //   12px between a CheckboxTab heading and its child grid (within group)
      //   20px between groups (after the last child of one group, before the next heading)
      // NB: Tailwind v4 in this project has a known bug where `gap-5` / `gap-3`
      // render as 5px / 3px (not 20px / 12px) — use arbitrary values via tokens.
      // See feedback_tailwind_spacing_shadow.md.
      return (
        <div className="flex flex-col gap-[var(--spacing-20)] w-[800px]">
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <CheckboxTab
              label="ShopeeMY"
              state="indeterminate"
              icon={<img src={shopeeMy} alt="" className="w-full h-full object-cover" />}
              expanded={expanded.shopeeMy}
              onExpandChange={() => toggle('shopeeMy')}
            />
            {expanded.shopeeMy && (
              <div className="grid grid-cols-3 gap-x-[var(--spacing-16)] gap-y-[var(--spacing-8)] px-[53px]">
                <Checkbox label="Shopee Main" checked={true} />
                <Checkbox label="KX Shopee" />
                <Checkbox label="test :3" checked={true} />
                <Checkbox label="Shopee catchme2" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <CheckboxTab
              label="LazadaMY"
              state="indeterminate"
              icon={<img src={lazadaMy} alt="" className="w-full h-full object-cover" />}
              expanded={expanded.lazadaMy}
              onExpandChange={() => toggle('lazadaMy')}
            />
            {expanded.lazadaMy && (
              <div className="grid grid-cols-3 gap-x-[var(--spacing-16)] gap-y-[var(--spacing-8)] px-[53px]">
                <Checkbox label="zxstore" />
                <Checkbox label="RND-Lazada" />
                <Checkbox label="loan my" checked={true} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <CheckboxTab
              label="ShopeeSG"
              state="default"
              icon={<img src={shopeeSg} alt="" className="w-full h-full object-cover" />}
              expanded={expanded.shopeeSg}
              onExpandChange={() => toggle('shopeeSg')}
            />
            {expanded.shopeeSg && (
              <div className="grid grid-cols-3 gap-x-[var(--spacing-16)] gap-y-[var(--spacing-8)] px-[53px]">
                <Checkbox label="ShopeeSG Main" />
                <Checkbox label="ShopeeSG - Testing" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <CheckboxTab
              label="TikTokMY"
              state="default"
              icon={<img src={tiktokMy} alt="" className="w-full h-full object-cover" />}
              expanded={expanded.tiktokMy}
              onExpandChange={() => toggle('tiktokMy')}
            />
            {expanded.tiktokMy && (
              <div className="grid grid-cols-3 gap-x-[var(--spacing-16)] gap-y-[var(--spacing-8)] px-[53px]">
                <Checkbox label="TikTok RND" />
                <Checkbox label="RND tiktok" />
                <Checkbox label="TikTok Anne" />
                <Checkbox label="SGSL" />
                <Checkbox label="TikTok Sandbox" />
                <Checkbox label="TikTok MY" />
              </div>
            )}
          </div>
        </div>
      );
    };

    return <ChannelGroups />;
  },
};
