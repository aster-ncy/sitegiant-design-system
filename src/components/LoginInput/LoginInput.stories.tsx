import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  LoginInput,
  type LoginInputState,
  type LoginInputValidation,
  type LoginInputType,
} from './LoginInput';

const meta = {
  title: 'Forms/LoginInput',
  component: LoginInput,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['text', 'password', 'email'] satisfies LoginInputType[],
    },
    state: {
      control: 'select',
      options: ['default', 'disabled', 'readonly', 'readonly-bold'] satisfies LoginInputState[],
    },
    validation: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'] satisfies LoginInputValidation[],
    },
  },
  args: {
    placeholder: 'Label',
    type: 'text',
    state: 'default',
    validation: 'default',
  },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Single-cell stories ───────────────────────────────── */

export const Default: Story = {
  args: { placeholder: 'Email', hintText: 'Hint text' },
};

export const Filled: Story = {
  args: { placeholder: 'Email', defaultValue: 'jane.doe@example.com', hintText: 'Hint text' },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    defaultValue: 'super-secret',
    hintText: 'At least 8 characters',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Email',
    defaultValue: 'not-an-email',
    validation: 'error',
    hintText: 'Please enter a valid email address.',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Email',
    defaultValue: 'jane.doe@example.com',
    validation: 'success',
    hintText: 'Looks good.',
  },
};

export const Disabled: Story = {
  args: { state: 'disabled', placeholder: 'Email', hintText: 'Hint text' },
};

export const Readonly: Story = {
  args: {
    state: 'readonly',
    defaultValue: 'jane.doe@example.com',
    hintText: 'Hint text',
  },
};

export const ReadonlyBold: Story = {
  args: {
    state: 'readonly-bold',
    defaultValue: 'jane.doe@example.com',
    hintText: 'Hint text',
  },
};

/* ── Full state × validation matrix ────────────────────── */

const validations: LoginInputValidation[] = ['default', 'error', 'success'];

// Row spec mirrors Figma's 6×3 matrix exactly. `filled` and `filled-hover`
// share state="default" with the regular Default row — they're identical in
// visual spec (Figma documents the interaction states for completeness).
type MatrixRow = {
  label: string;
  state: LoginInputState;
  defaultValue?: string;
};
const rows: MatrixRow[] = [
  { label: 'default', state: 'default' },
  { label: 'filled', state: 'default', defaultValue: 'Value' },
  { label: 'filled-hover', state: 'default', defaultValue: 'Value' },
  { label: 'disabled', state: 'disabled' },
  { label: 'readonly', state: 'readonly', defaultValue: 'Value' },
  { label: 'readonly-bold', state: 'readonly-bold', defaultValue: 'Value' },
];

export const FullMatrix: Story = {
  args: { placeholder: 'Label' },
  decorators: [(Story) => <div className="w-[1100px]"><Story /></div>],
  render: () => (
    <div className="grid grid-cols-[140px_repeat(3,_minmax(0,_1fr))] gap-x-[var(--spacing-16)] gap-y-[var(--spacing-20)]">
      <span />
      {validations.map((v) => (
        <span
          key={v}
          className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)]"
        >
          validation = {v}
        </span>
      ))}
      {rows.map((row) => (
        <Fragment key={row.label}>
          <span className="text-[length:var(--text-12)] font-[var(--font-weight-medium)] text-[color:var(--color-text-info)] self-center">
            state = {row.label}
          </span>
          {validations.map((v) => (
            <LoginInput
              key={`${row.label}-${v}`}
              state={row.state}
              validation={v}
              placeholder="Label"
              defaultValue={row.defaultValue}
              hintText="Hint text"
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/* ── Controlled login form example ─────────────────────── */

const ControlledLoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = email.length > 0 && !emailValid;
  const showPasswordHint = password.length > 0 && password.length < 8;
  return (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      <LoginInput
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        validation={showEmailError ? 'error' : email.length > 0 ? 'success' : 'default'}
        hintText={showEmailError ? 'Please enter a valid email address.' : ''}
        autoComplete="username"
      />
      <LoginInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
        validation={showPasswordHint ? 'error' : 'default'}
        hintText={showPasswordHint ? 'At least 8 characters' : ''}
        autoComplete="current-password"
      />
    </div>
  );
};

export const ControlledLoginForm: Story = {
  render: () => <ControlledLoginExample />,
};
