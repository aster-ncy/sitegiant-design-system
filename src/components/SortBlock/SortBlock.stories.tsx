import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortBlock } from './SortBlock';
import { Icon } from '../Icon';
import { Pip } from '../Pip';
import { TextLink } from '../TextLink';
import { DashedButton } from '../DashedButton';
import { IconLink } from '../IconLink';

const meta = {
  title: 'Information/SortBlock',
  component: SortBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    rows: [{ label: 'Label', value: 'Value' }],
  },
  render: (args) => <SortBlock {...args} />,
} satisfies Meta<typeof SortBlock>;

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
  <div className="flex flex-wrap items-start gap-[var(--spacing-16)]">{children}</div>
);

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const OrientationsAndRowCounts: Story = {
  render: () => (
    <Stack>
      <Row label="Horizontal · 1 row · Readonly">
        <SortBlock rows={[{ label: 'Label', value: 'Value' }]} />
      </Row>
      <Row label="Horizontal · 1 row · Readonly Bold">
        <SortBlock rows={[{ label: 'Label', value: 'Value', bold: true }]} />
      </Row>
      <Row label="Horizontal · 2 rows · Readonly">
        <SortBlock
          rows={[
            { label: 'Label', value: 'Value' },
            { label: 'Label 2', value: 'Value 2' },
          ]}
        />
      </Row>
      <Row label="Horizontal · 2 rows · Readonly Bold (both rows bold)">
        <SortBlock
          rows={[
            { label: 'Label', value: 'Value', bold: true },
            { label: 'Label 2', value: 'Value 2', bold: true },
          ]}
        />
      </Row>
      <Row label="Vertical · 1 row · Readonly">
        <SortBlock orientation="vertical" rows={[{ label: 'Label', value: 'Value' }]} />
      </Row>
      <Row label="Vertical · 1 row · Readonly Bold">
        <SortBlock
          orientation="vertical"
          rows={[{ label: 'Label', value: 'Value', bold: true }]}
        />
      </Row>
      <Row label="Vertical · 2 rows · Readonly">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Label', value: 'Value' },
            { label: 'Label 2', value: 'Value 2' },
          ]}
        />
      </Row>
      <Row label="Vertical · 2 rows · Readonly Bold">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Label', value: 'Value', bold: true },
            { label: 'Label 2', value: 'Value 2', bold: true },
          ]}
        />
      </Row>
    </Stack>
  ),
};

export const MainSub: Story = {
  render: () => (
    <Stack>
      <Row label="Readonly — main and sub rows both regular weight">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Main Label', value: 'Main Value' },
            { label: 'Sub Label', value: 'Sub Value', caption: true },
          ]}
        />
      </Row>
      <Row label="Readonly Bold Main — only the main value is bold; sub stays regular">
        <SortBlock
          orientation="vertical"
          rows={[
            { label: 'Main Label', value: 'Main Value', bold: true },
            { label: 'Sub Label', value: 'Sub Value', caption: true },
          ]}
        />
      </Row>
    </Stack>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <Stack>
      <Row label="Icon-prefixed value (e.g. date with calendar/clock prefix)">
        <Group>
          <SortBlock>
            <Icon name="clock" size={17} />
            <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
              Value
            </span>
          </SortBlock>
          <SortBlock>
            <Icon name="calendar" size={17} />
            <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
              2020-08-18
            </span>
          </SortBlock>
        </Group>
      </Row>
      <Row label="Drag handle — body is just an icon">
        <SortBlock>
          <Icon name="drag" size={17} />
        </SortBlock>
      </Row>
      <Row label="Tag — Pip body">
        <Group>
          <SortBlock>
            <Pip type="success" label="Pip Text" />
          </SortBlock>
          <SortBlock>
            <Pip type="alert" label="Alert" />
          </SortBlock>
        </Group>
      </Row>
      <Row label="Button — TextLink or DashedButton body">
        <Group>
          <SortBlock>
            <TextLink label="Button" />
          </SortBlock>
          <SortBlock>
            <DashedButton>
              <Icon name="plus" size={17} />
              Button
            </DashedButton>
          </SortBlock>
        </Group>
      </Row>
      <Row label="Image — 41x41 thumbnail body">
        <Group>
          <SortBlock>
            <div className="size-[41px] bg-[color:var(--color-set-DEFAULT)] rounded-[var(--radius-4)]" />
          </SortBlock>
          <SortBlock>
            <div className="size-[41px] bg-[color:var(--color-space-light)] rounded-[var(--radius-4)] border border-[color:var(--color-space-dark)]" />
          </SortBlock>
        </Group>
      </Row>
    </Stack>
  ),
};

export const SortableRowComposition: Story = {
  render: () => (
    <Stack>
      <Row label="The sb6 composition: drag handle + index + 3 SortBlocks + close-X">
        <div className="flex items-center gap-[var(--spacing-8)] bg-[color:var(--color-surface-card)] border border-[color:var(--color-space-dark)] rounded-[var(--radius-4)] px-[var(--spacing-8)] py-[var(--spacing-4)]">
          <SortBlock>
            <Icon name="drag" size={17} />
          </SortBlock>
          <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)] font-[var(--font-weight-medium)] px-[var(--spacing-4)]">
            1
          </span>
          <SortBlock rows={[{ label: '', value: '2023-03-09-1' }]} />
          <SortBlock>
            <Icon name="calendar" size={17} />
            <span className="text-[length:var(--text-14)] leading-[var(--leading-17)] text-[color:var(--color-text-primary)]">
              2020-08-18
            </span>
          </SortBlock>
          <SortBlock rows={[{ label: 'Notes', value: 'testinggggggggggggg' }]} />
          <IconLink icon="close" variant="close" aria-label="Remove row" />
        </div>
      </Row>
    </Stack>
  ),
};
