import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconLink, type IconLinkVariant } from './IconLink';

const meta = {
  title: 'Actions/IconLink',
  component: IconLink,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {
    icon: 'trash',
    variant: 'basic',
    'aria-label': 'Delete',
  },
  render: (args) => <IconLink {...args} />,
} satisfies Meta<typeof IconLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-8)]">
    <span className="text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
      {label}
    </span>
    {children}
  </div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[var(--spacing-24)]">{children}</div>
);

const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-[var(--spacing-24)]">{children}</div>
);

const VARIANTS: ReadonlyArray<{ value: IconLinkVariant; label: string }> = [
  { value: 'basic', label: 'basic' },
  { value: 'danger', label: 'danger' },
  { value: 'danger-subtle', label: 'danger-subtle' },
  { value: 'subtle', label: 'subtle' },
  { value: 'default', label: 'default' },
  { value: 'success', label: 'success' },
  { value: 'close', label: 'close' },
];

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack>
      <Row label="Default state — hover/click each to see the full chain">
        <Group>
          {VARIANTS.map(({ value, label }) => (
            <div key={value} className="flex flex-col items-center gap-[var(--spacing-4)]">
              <IconLink
                icon={value === 'close' ? 'close' : 'trash'}
                variant={value}
                aria-label={label}
              />
              <span className="text-[length:var(--text-10)] text-[color:var(--color-text-info)]">
                {label}
              </span>
            </div>
          ))}
        </Group>
      </Row>
      <Row label="Disabled — every variant should paint the same disabled token">
        <Group>
          {VARIANTS.map(({ value, label }) => (
            <div key={value} className="flex flex-col items-center gap-[var(--spacing-4)]">
              <IconLink
                icon={value === 'close' ? 'close' : 'trash'}
                variant={value}
                aria-label={`${label} (disabled)`}
                disabled
              />
              <span className="text-[length:var(--text-10)] text-[color:var(--color-text-info)]">
                {label}
              </span>
            </div>
          ))}
        </Group>
      </Row>
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack>
      <Row label="basic — default / disabled (hover and click for live hover/active)">
        <Group>
          <IconLink icon="trash" variant="basic" aria-label="Delete" />
          <IconLink icon="trash" variant="basic" aria-label="Delete (disabled)" disabled />
        </Group>
      </Row>
      <Row label="danger — default / disabled">
        <Group>
          <IconLink icon="trash" variant="danger" aria-label="Delete" />
          <IconLink icon="trash" variant="danger" aria-label="Delete (disabled)" disabled />
        </Group>
      </Row>
      <Row label="close — default / disabled">
        <Group>
          <IconLink icon="close" variant="close" aria-label="Dismiss" />
          <IconLink icon="close" variant="close" aria-label="Dismiss (disabled)" disabled />
        </Group>
      </Row>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack>
      <Row label="17px (default), 21px (close default), 24px (custom)">
        <Group>
          <IconLink icon="trash" aria-label="17px" />
          <IconLink icon="close" variant="close" aria-label="21px" />
          <IconLink icon="trash" size={24} aria-label="24px" />
        </Group>
      </Row>
    </Stack>
  ),
};

const InteractiveExample = () => {
  const [count, setCount] = useState(0);
  return (
    <Stack>
      <Row label={`Click count: ${count}`}>
        <Group>
          <IconLink
            icon="plus-square"
            variant="success"
            aria-label="Increment"
            onClick={() => setCount((c) => c + 1)}
          />
          <IconLink
            icon="minus-square"
            variant="danger"
            aria-label="Decrement"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            disabled={count === 0}
          />
        </Group>
      </Row>
    </Stack>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

export const WithTooltip: Story = {
  render: () => (
    <Stack>
      <Row label="Default — tooltip text comes from aria-label">
        <IconLink icon="trash" variant="basic" aria-label="Delete this row" />
      </Row>
      <Row label="`tooltip` overrides only the visible text (SR still reads aria-label)">
        <IconLink
          icon="trash"
          variant="basic"
          aria-label="Delete user account permanently"
          tooltip="Delete"
        />
      </Row>
      <Row label="`showTooltip={false}` — no bubble (e.g. when row already has one)">
        <IconLink icon="trash" variant="basic" aria-label="Delete" showTooltip={false} />
      </Row>
      <Row label="Disabled still shows the tooltip (TooltipTrigger wraps in a span)">
        <IconLink icon="trash" variant="basic" aria-label="Delete (disabled)" disabled />
      </Row>
      <Row label="Keyboard focus (Tab to it) opens the tooltip immediately — no hover delay">
        <IconLink icon="trash" variant="basic" aria-label="Delete via keyboard" />
      </Row>
      <Row label="Placement — bottom">
        <IconLink
          icon="trash"
          variant="basic"
          aria-label="Delete"
          tooltipPlacement="bottom"
        />
      </Row>
    </Stack>
  ),
};
