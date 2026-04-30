import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SmallSegmentedButton } from './SmallSegmentedButton';

const meta = {
  title: 'Navigation/SmallSegmentedButton',
  component: SmallSegmentedButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    onChange: { action: 'changed' },
  },
  args: {
    value: 'color',
    'aria-label': 'Color picker',
  },
  render: (args) => (
    <SmallSegmentedButton {...args}>
      <SmallSegmentedButton.Segment
        value="color"
        glyph={{ kind: 'inline', name: 'color' }}
        aria-label="Color"
      />
      <SmallSegmentedButton.Segment
        value="text"
        glyph={{ kind: 'inline', name: 'text' }}
        aria-label="Text"
      />
    </SmallSegmentedButton>
  ),
} satisfies Meta<typeof SmallSegmentedButton>;

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
  <div className="flex flex-col gap-[var(--spacing-16)]">{children}</div>
);

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const ColorPicker2: Story = {
  args: { value: 'color' },
  render: () => (
    <Stack>
      <Row label="Selected: color">
        <SmallSegmentedButton value="color" onChange={() => {}} aria-label="Color picker">
          <SmallSegmentedButton.Segment
            value="color"
            glyph={{ kind: 'inline', name: 'color' }}
            aria-label="Color"
          />
          <SmallSegmentedButton.Segment
            value="text"
            glyph={{ kind: 'inline', name: 'text' }}
            aria-label="Text"
          />
        </SmallSegmentedButton>
      </Row>
      <Row label="Selected: text">
        <SmallSegmentedButton value="text" onChange={() => {}} aria-label="Color picker">
          <SmallSegmentedButton.Segment
            value="color"
            glyph={{ kind: 'inline', name: 'color' }}
            aria-label="Color"
          />
          <SmallSegmentedButton.Segment
            value="text"
            glyph={{ kind: 'inline', name: 'text' }}
            aria-label="Text"
          />
        </SmallSegmentedButton>
      </Row>
    </Stack>
  ),
};

const COLOR_PICKER_4_SEGMENTS = [
  { value: 'color', name: 'color' as const, label: 'Color' },
  { value: 'text', name: 'text' as const, label: 'Text' },
  { value: 'hover-color', name: 'hover-color' as const, label: 'Hover color' },
  { value: 'hover-text', name: 'hover-text' as const, label: 'Hover text' },
];

export const ColorPicker4: Story = {
  args: { value: 'color' },
  render: () => (
    <Stack>
      {COLOR_PICKER_4_SEGMENTS.map((sel) => (
        <Row key={sel.value} label={`Selected: ${sel.label}`}>
          <SmallSegmentedButton value={sel.value} onChange={() => {}} aria-label="Color picker">
            {COLOR_PICKER_4_SEGMENTS.map((seg) => (
              <SmallSegmentedButton.Segment
                key={seg.value}
                value={seg.value}
                glyph={{ kind: 'inline', name: seg.name }}
                aria-label={seg.label}
              />
            ))}
          </SmallSegmentedButton>
        </Row>
      ))}
    </Stack>
  ),
};

const DEVICE_SEGMENTS = [
  { value: 'monitor', name: 'monitor' as const, label: 'Desktop' },
  { value: 'tablet', name: 'tablet' as const, label: 'Tablet' },
  { value: 'mobile', name: 'mobile' as const, label: 'Mobile' },
];

export const Devices3: Story = {
  args: { value: 'monitor' },
  render: () => (
    <Stack>
      {DEVICE_SEGMENTS.map((sel) => (
        <Row key={sel.value} label={`Selected: ${sel.label}`}>
          <SmallSegmentedButton value={sel.value} onChange={() => {}} aria-label="Device preview">
            {DEVICE_SEGMENTS.map((seg) => (
              <SmallSegmentedButton.Segment
                key={seg.value}
                value={seg.value}
                glyph={{ kind: 'inline', name: seg.name }}
                aria-label={seg.label}
              />
            ))}
          </SmallSegmentedButton>
        </Row>
      ))}
    </Stack>
  ),
};

export const States: Story = {
  args: { value: 'a' },
  render: () => (
    <Stack>
      <Row label="Default + selected">
        <SmallSegmentedButton value="a" onChange={() => {}} aria-label="States">
          <SmallSegmentedButton.Segment
            value="a"
            glyph={{ kind: 'inline', name: 'color' }}
            aria-label="Selected"
          />
          <SmallSegmentedButton.Segment
            value="b"
            glyph={{ kind: 'inline', name: 'text' }}
            aria-label="Default"
          />
        </SmallSegmentedButton>
      </Row>
      <Row label="Disabled (selected and unselected)">
        <SmallSegmentedButton value="a" onChange={() => {}} aria-label="Disabled states">
          <SmallSegmentedButton.Segment
            value="a"
            glyph={{ kind: 'inline', name: 'color' }}
            aria-label="Disabled selected"
            disabled
          />
          <SmallSegmentedButton.Segment
            value="b"
            glyph={{ kind: 'inline', name: 'text' }}
            aria-label="Disabled unselected"
            disabled
          />
        </SmallSegmentedButton>
      </Row>
    </Stack>
  ),
};

const InteractiveExample = () => {
  const [value, setValue] = useState<string>('color');
  return (
    <Stack>
      <Row label={`Controlled value: ${value}`}>
        <SmallSegmentedButton value={value} onChange={setValue} aria-label="Color picker">
          {COLOR_PICKER_4_SEGMENTS.map((seg) => (
            <SmallSegmentedButton.Segment
              key={seg.value}
              value={seg.value}
              glyph={{ kind: 'inline', name: seg.name }}
              aria-label={seg.label}
            />
          ))}
        </SmallSegmentedButton>
      </Row>
    </Stack>
  );
};

export const Interactive: Story = {
  args: { value: 'color' },
  render: () => <InteractiveExample />,
};

/* ──────────────────────────────────────────────────────────────────────── *
 * Full Figma variant matrix — count × selected. Byte-diffable against
 * Figma node 3504:3253.
 * ──────────────────────────────────────────────────────────────────────── */

export const VariantMatrix: Story = {
  args: { value: 'color' },
  render: () => (
    <Stack>
      <Row label="Color Picker / count=2">
        <div className="flex gap-[var(--spacing-16)]">
          {['color', 'text'].map((sel) => (
            <SmallSegmentedButton
              key={sel}
              value={sel}
              onChange={() => {}}
              aria-label={`Selected ${sel}`}
            >
              <SmallSegmentedButton.Segment
                value="color"
                glyph={{ kind: 'inline', name: 'color' }}
                aria-label="Color"
              />
              <SmallSegmentedButton.Segment
                value="text"
                glyph={{ kind: 'inline', name: 'text' }}
                aria-label="Text"
              />
            </SmallSegmentedButton>
          ))}
        </div>
      </Row>
      <Row label="Color Picker / count=4">
        <div className="flex gap-[var(--spacing-16)]">
          {COLOR_PICKER_4_SEGMENTS.map((sel) => (
            <SmallSegmentedButton
              key={sel.value}
              value={sel.value}
              onChange={() => {}}
              aria-label={`Selected ${sel.label}`}
            >
              {COLOR_PICKER_4_SEGMENTS.map((seg) => (
                <SmallSegmentedButton.Segment
                  key={seg.value}
                  value={seg.value}
                  glyph={{ kind: 'inline', name: seg.name }}
                  aria-label={seg.label}
                />
              ))}
            </SmallSegmentedButton>
          ))}
        </div>
      </Row>
      <Row label="Devices / count=3">
        <div className="flex gap-[var(--spacing-16)]">
          {DEVICE_SEGMENTS.map((sel) => (
            <SmallSegmentedButton
              key={sel.value}
              value={sel.value}
              onChange={() => {}}
              aria-label={`Selected ${sel.label}`}
            >
              {DEVICE_SEGMENTS.map((seg) => (
                <SmallSegmentedButton.Segment
                  key={seg.value}
                  value={seg.value}
                  glyph={{ kind: 'inline', name: seg.name }}
                  aria-label={seg.label}
                />
              ))}
            </SmallSegmentedButton>
          ))}
        </div>
      </Row>
    </Stack>
  ),
};
