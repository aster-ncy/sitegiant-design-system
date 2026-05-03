import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Typography,
  type TypographyType,
  type TypographyState,
  type TypographyLang,
} from './Typography';

const meta = {
  title: 'Foundation/Typography',
  component: Typography,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    type: 'body',
    state: 'primary',
    lang: 'en',
    children: 'Text Content',
  },
  render: (args) => <Typography {...args} />,
} satisfies Meta<typeof Typography>;

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

const TYPES: TypographyType[] = [
  'section-title',
  'section-small-title',
  'display',
  'display-small',
  'heading',
  'body-large',
  'body',
  'body-medium',
  'body-bold',
  'body-slim',
  'body-medium-slim',
  'body-bold-slim',
  'caption',
  'caption-slim',
  'caption-small',
  'caption-medium-small',
  'caption-medium-slim',
  'caption-large',
  'caption-larger',
];

const STATES: TypographyState[] = [
  'primary',
  'secondary',
  'info',
  'muted',
  'basic',
  'success',
  'danger',
  'alert',
  'warning',
];

/* ──────────────────────────────────────────────────────────────────────── */

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <Stack>
      {TYPES.map((t) => (
        <Row key={t} label={t}>
          <Typography type={t}>Text Content</Typography>
        </Row>
      ))}
    </Stack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack>
      {STATES.map((s) => (
        <Row key={s} label={s}>
          <Typography state={s}>Text Content ({s})</Typography>
        </Row>
      ))}
      <Row label="on-dark (rendered against a dark background)">
        <div className="bg-[color:var(--color-set-DEFAULT)] p-[var(--spacing-12)]">
          <Typography state="on-dark">Text Content (on-dark)</Typography>
        </div>
      </Row>
    </Stack>
  ),
};

const MatrixTable = ({ lang }: { lang: TypographyLang }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className="text-left p-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]">
          Type / State
        </th>
        {STATES.map((s) => (
          <th
            key={s}
            className="text-left p-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)]"
          >
            {s}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {TYPES.map((t) => (
        <tr key={t}>
          <th className="text-left p-[var(--spacing-8)] text-[length:var(--text-12)] text-[color:var(--color-text-info)] font-[var(--font-weight-regular)] whitespace-nowrap align-top">
            {t}
          </th>
          {STATES.map((s) => (
            <td key={s} className="p-[var(--spacing-8)] align-top">
              <Typography type={t} state={s} lang={lang}>
                Text Content
              </Typography>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const MatrixEN: Story = {
  render: () => <MatrixTable lang="en" />,
};

export const MatrixTC: Story = {
  render: () => <MatrixTable lang="tc" />,
};

export const MatrixSC: Story = {
  render: () => <MatrixTable lang="sc" />,
};

export const Italic: Story = {
  render: () => (
    <Stack>
      <Row label="body + italic">
        <Typography type="body" italic>
          The quick brown fox jumps over the lazy dog.
        </Typography>
      </Row>
      <Row label="body-slim + italic">
        <Typography type="body-slim" italic>
          The quick brown fox jumps over the lazy dog.
        </Typography>
      </Row>
    </Stack>
  ),
};

export const Languages: Story = {
  render: () => (
    <Stack>
      <Row label="en — Roboto">
        <Typography type="display" lang="en">
          The quick brown fox
        </Typography>
      </Row>
      <Row label="tc — Noto Sans TC">
        <Typography type="display" lang="tc">
          設計系統測試文字
        </Typography>
      </Row>
      <Row label="sc — Noto Sans SC">
        <Typography type="display" lang="sc">
          设计系统测试文字
        </Typography>
      </Row>
    </Stack>
  ),
};

export const AsElement: Story = {
  render: () => (
    <Stack>
      <Row label="as='h1' type='section-title' — semantic h1 with section-title typography">
        <Typography as="h1" type="section-title">
          Page Heading
        </Typography>
      </Row>
      <Row label="as='h2' type='section-small-title'">
        <Typography as="h2" type="section-small-title">
          Section Heading
        </Typography>
      </Row>
      <Row label="as='p' type='body' — paragraph">
        <Typography as="p" type="body">
          This is a regular paragraph of body text. The Typography component
          contributes only the typography classes; the parent picks the
          semantic element via the `as` prop.
        </Typography>
      </Row>
      <Row label="as='label' type='caption' — form label">
        <Typography as="label" type="caption" state="info">
          Form field label
        </Typography>
      </Row>
    </Stack>
  ),
};
