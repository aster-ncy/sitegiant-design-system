import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab } from './Tab';
import type { TabSize, TabSelectedVariant } from './TabSegment';

const meta = {
  title: 'Components/Tab',
  component: Tab,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'lg'] satisfies TabSize[] },
    selectedVariant: {
      control: 'inline-radio',
      options: ['default', 'primary'] satisfies TabSelectedVariant[],
    },
    value: { control: false },
    onChange: { action: 'changed' },
  },
  args: {
    value: 'b',
    children: (
      <>
        <Tab.Segment value="a">Option</Tab.Segment>
        <Tab.Segment value="b">Option</Tab.Segment>
        <Tab.Segment value="c">Option</Tab.Segment>
      </>
    ),
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_OPTIONS = [
  { value: 'monitor', icon: 'monitor' as const, label: 'Desktop' },
  { value: 'tablet', icon: 'tablet' as const, label: 'Tablet' },
  { value: 'mobile', icon: 'mobile' as const, label: 'Mobile' },
] as const;

const TEXT_OPTIONS = ['One', 'Two', 'Three'] as const;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-8)]">
    <span className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
      {label}
    </span>
    {children}
  </div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-16)]">{children}</div>
);

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { value: 'b', size: 'sm', selectedVariant: 'default' },
  render: (args) => (
    <Tab {...args}>
      <Tab.Segment value="a">Option</Tab.Segment>
      <Tab.Segment value="b">Option</Tab.Segment>
      <Tab.Segment value="c">Option</Tab.Segment>
    </Tab>
  ),
};

export const AllStates: Story = {
  args: { value: 'b' },
  render: () => (
    <Stack>
      <Row label="State = Default (no selection match)">
        <Tab value="__none__" size="sm" selectedVariant="default" onChange={() => {}}>
          <Tab.Segment value="a">Option</Tab.Segment>
          <Tab.Segment value="b">Option</Tab.Segment>
          <Tab.Segment value="c">Option</Tab.Segment>
        </Tab>
      </Row>
      <Row label="State = Selected (default variant)">
        <Tab value="b" size="sm" selectedVariant="default" onChange={() => {}}>
          <Tab.Segment value="a">Option</Tab.Segment>
          <Tab.Segment value="b">Option</Tab.Segment>
          <Tab.Segment value="c">Option</Tab.Segment>
        </Tab>
      </Row>
      <Row label="State = Selected Primary">
        <Tab value="b" size="sm" selectedVariant="primary" onChange={() => {}}>
          <Tab.Segment value="a">Option</Tab.Segment>
          <Tab.Segment value="b">Option</Tab.Segment>
          <Tab.Segment value="c">Option</Tab.Segment>
        </Tab>
      </Row>
    </Stack>
  ),
};

const renderTextRow = (count: number, size: TabSize, selectedVariant: TabSelectedVariant) => {
  const options = Array.from({ length: count }, (_, i) => `s${i}`);
  return (
    <Tab value="s0" size={size} selectedVariant={selectedVariant} onChange={() => {}}>
      {options.map((v) => (
        <Tab.Segment key={v} value={v}>
          Option
        </Tab.Segment>
      ))}
    </Tab>
  );
};

const renderIconRow = (count: number, size: TabSize, selectedVariant: TabSelectedVariant) => {
  const options = Array.from({ length: count }, (_, i) => ({
    value: `s${i}`,
    icon: ICON_OPTIONS[i % ICON_OPTIONS.length].icon,
    label: ICON_OPTIONS[i % ICON_OPTIONS.length].label,
  }));
  return (
    <Tab value="s0" size={size} selectedVariant={selectedVariant} onChange={() => {}}>
      {options.map((opt) => (
        <Tab.Segment key={opt.value} value={opt.value} type="icon" icon="apps" aria-label={opt.label} />
      ))}
    </Tab>
  );
};

export const TextSmall_Counts: Story = {
  args: { value: 's0' },
  render: () => (
    <Stack>
      {[1, 2, 3, 4, 5].map((n) => (
        <Row key={n} label={`count = ${n}`}>
          {renderTextRow(n, 'sm', 'default')}
        </Row>
      ))}
    </Stack>
  ),
};

export const TextLarge_Counts: Story = {
  args: { value: 's0' },
  render: () => (
    <Stack>
      {[1, 2, 3, 4, 5].map((n) => (
        <Row key={n} label={`count = ${n}`}>
          {renderTextRow(n, 'lg', 'default')}
        </Row>
      ))}
    </Stack>
  ),
};

export const IconSmall_Counts: Story = {
  args: { value: 's0' },
  render: () => (
    <Stack>
      {[1, 2, 3, 4, 5].map((n) => (
        <Row key={n} label={`count = ${n}`}>
          {renderIconRow(n, 'sm', 'default')}
        </Row>
      ))}
    </Stack>
  ),
};

export const IconLarge_Counts: Story = {
  args: { value: 's0' },
  render: () => (
    <Stack>
      {[1, 2, 3, 4, 5].map((n) => (
        <Row key={n} label={`count = ${n}`}>
          {renderIconRow(n, 'lg', 'default')}
        </Row>
      ))}
    </Stack>
  ),
};

export const TextSmall_PrimarySelected: Story = {
  args: { value: 's2' },
  render: () => (
    <Tab value="s2" size="sm" selectedVariant="primary" onChange={() => {}}>
      {Array.from({ length: 5 }, (_, i) => (
        <Tab.Segment key={i} value={`s${i}`}>
          Option
        </Tab.Segment>
      ))}
    </Tab>
  ),
};

export const IconSmall_PrimarySelected: Story = {
  args: { value: 's2' },
  render: () => (
    <Tab value="s2" size="sm" selectedVariant="primary" onChange={() => {}}>
      {Array.from({ length: 5 }, (_, i) => (
        <Tab.Segment key={i} value={`s${i}`} type="icon" icon="apps" aria-label={`Option ${i + 1}`} />
      ))}
    </Tab>
  ),
};

export const MixedTextIcon: Story = {
  args: { value: 'desktop' },
  render: () => (
    <Tab value="desktop" size="sm" selectedVariant="default" onChange={() => {}}>
      <Tab.Segment value="all">All</Tab.Segment>
      <Tab.Segment value="desktop" type="icon" icon="monitor" aria-label="Desktop" />
      <Tab.Segment value="tablet" type="icon" icon="tablet" aria-label="Tablet" />
      <Tab.Segment value="mobile" type="icon" icon="mobile" aria-label="Mobile" />
    </Tab>
  ),
};

export const Disabled: Story = {
  args: { value: 'a' },
  render: () => (
    <Tab value="a" size="sm" selectedVariant="default" onChange={() => {}}>
      <Tab.Segment value="a">Active</Tab.Segment>
      <Tab.Segment value="b" disabled>
        Disabled
      </Tab.Segment>
      <Tab.Segment value="c">Available</Tab.Segment>
    </Tab>
  ),
};

const ControlledExample = () => {
  const [value, setValue] = useState('b');
  return (
    <Stack>
      <Row label={`Selected value: ${value}`}>
        <Tab value={value} onChange={setValue} size="sm" selectedVariant="default">
          {TEXT_OPTIONS.map((opt) => (
            <Tab.Segment key={opt} value={opt.toLowerCase()}>
              {opt}
            </Tab.Segment>
          ))}
        </Tab>
      </Row>
    </Stack>
  );
};

export const Controlled: Story = {
  args: { value: 'b' },
  render: () => <ControlledExample />,
};
