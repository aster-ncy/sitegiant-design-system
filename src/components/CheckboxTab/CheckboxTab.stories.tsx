import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxTab } from './CheckboxTab';
import { Checkbox } from '../Checkbox';
import { Dropdown } from '../Dropdown';
import shopeeMy from '../../assets/channel-icons/shopee-my.png';
import lazadaMy from '../../assets/channel-icons/lazada-my.png';
import lazadaSg from '../../assets/channel-icons/shopee-sg.png';
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
export const Disabled: Story = {
  args: {
    label: 'Checkbox Value',
    hintText: 'Hint text',
    state: 'default',
    disabled: true,
    expanded: true,
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
    </div>
  ),
};

/* ── Live UI example: channel groups with collapsible child grids ─── */
export const ChannelGroupExample: Story = {
  args: { label: 'Channel groups' },
  render: () => {
    type ChannelKey = 'shopeeMy' | 'lazadaMy' | 'lazadaSg' | 'tiktokMy';

    const ChannelGroups = () => {
      const [expanded, setExpanded] = useState<Record<ChannelKey, boolean>>({
        shopeeMy: true,
        lazadaMy: true,
        lazadaSg: false,
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
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-[53px]">
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
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-[53px]">
                <Checkbox label="zxstore" />
                <Checkbox label="RND-Lazada" />
                <Checkbox label="loan my" checked={true} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[var(--spacing-12)]">
            <CheckboxTab
              label="LazadaSG"
              state="default"
              icon={<img src={lazadaSg} alt="" className="w-full h-full object-cover" />}
              expanded={expanded.lazadaSg}
              onExpandChange={() => toggle('lazadaSg')}
            />
            {expanded.lazadaSg && (
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-[53px]">
                <Checkbox label="RND-Lazada2" />
                <Checkbox label="LazadaSG - Testing" />
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
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-[53px]">
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
