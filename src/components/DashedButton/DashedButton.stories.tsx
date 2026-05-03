import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashedButton } from './DashedButton';
import { Icon } from '../Icon';

const meta = {
  title: 'Actions/DashedButton',
  component: DashedButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {
    children: (
      <>
        <Icon name="plus" size={17} />
        Button
      </>
    ),
  },
  render: (args) => <DashedButton {...args} />,
} satisfies Meta<typeof DashedButton>;

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
  <div className="flex items-start gap-[var(--spacing-16)]">{children}</div>
);

const PlusButton = () => (
  <>
    <Icon name="plus" size={17} />
    Button
  </>
);

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Stack>
      <Row label="Default — hover/click for live transitions">
        <DashedButton><PlusButton /></DashedButton>
      </Row>
      <Row label="Disabled">
        <DashedButton disabled><PlusButton /></DashedButton>
      </Row>
    </Stack>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Stack>
      <Row label="Intrinsic width (default) — hugs content">
        <div className="w-[480px] border border-dashed border-[color:var(--color-set-lightest)] p-[var(--spacing-12)]">
          <DashedButton><PlusButton /></DashedButton>
        </div>
      </Row>
      <Row label="fullWidth — fills container">
        <div className="w-[480px] border border-dashed border-[color:var(--color-set-lightest)] p-[var(--spacing-12)]">
          <DashedButton fullWidth><PlusButton /></DashedButton>
        </div>
      </Row>
    </Stack>
  ),
};

export const WithCustomChildren: Story = {
  render: () => (
    <Stack>
      <Row label="Label only">
        <DashedButton>Add new section</DashedButton>
      </Row>
      <Row label="Icon + label (Figma default)">
        <DashedButton>
          <Icon name="plus" size={17} />
          Button
        </DashedButton>
      </Row>
      <Row label="Longer label">
        <DashedButton>
          <Icon name="plus" size={17} />
          Add a column for sorting
        </DashedButton>
      </Row>
      <Row label="Icon-only — caller is responsible for an aria-label">
        <DashedButton aria-label="Add row">
          <Icon name="plus" size={17} />
        </DashedButton>
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
          <DashedButton onClick={() => setCount((c) => c + 1)}>
            <Icon name="plus" size={17} />
            Add item
          </DashedButton>
          <DashedButton onClick={() => setCount(0)} disabled={count === 0}>
            Reset
          </DashedButton>
        </Group>
      </Row>
    </Stack>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
