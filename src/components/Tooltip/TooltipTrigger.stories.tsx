import { createElement, forwardRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipTrigger } from './TooltipTrigger';
import { Icon } from '../Icon';

const meta = {
  title: 'Feedback/TooltipTrigger',
  component: TooltipTrigger,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    openDelay: { control: 'number' },
    enabled: { control: 'boolean' },
    width: { control: 'number' },
    content: { control: 'text' },
  },
  args: {
    content: 'Tooltip text',
    placement: 'top',
    openDelay: 150,
    enabled: true,
    // Stub satisfies the required ReactElement type; meta render overrides with a real button.
    children: createElement('button', { 'aria-label': 'Trigger' }, 'Hover me'),
  },
  render: (args) => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger {...args}>
        <button
          aria-label="Trigger"
          className="px-[var(--spacing-12)] py-[var(--spacing-8)] rounded-[var(--radius-120)] border border-solid border-[var(--button-outline-default-border)] cursor-pointer"
        >
          Hover me
        </button>
      </TooltipTrigger>
    </div>
  ),
} satisfies Meta<typeof TooltipTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 80 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <TooltipTrigger key={p} content={`Placement: ${p}`} placement={p}>
          <button
            aria-label={`Placement ${p}`}
            className="px-[var(--spacing-12)] py-[var(--spacing-8)] rounded-[var(--radius-120)] border border-solid border-[var(--button-outline-default-border)] cursor-pointer"
          >
            {p}
          </button>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const AutoFlipNearViewportEdge: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)' }}>
        <TooltipTrigger content="Should flip to bottom" placement="top">
          <button aria-label="Top edge" className="px-3 py-2 border border-solid">
            top edge (preferred top → flips)
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
        <TooltipTrigger content="Should flip to top" placement="bottom">
          <button aria-label="Bottom edge" className="px-3 py-2 border border-solid">
            bottom edge (preferred bottom → flips)
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)' }}>
        <TooltipTrigger content="Should flip to right" placement="left">
          <button aria-label="Left edge" className="px-3 py-2 border border-solid">
            left edge
          </button>
        </TooltipTrigger>
      </div>
      <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}>
        <TooltipTrigger content="Should flip to left" placement="right">
          <button aria-label="Right edge" className="px-3 py-2 border border-solid">
            right edge
          </button>
        </TooltipTrigger>
      </div>
    </div>
  ),
};

export const OnDisabledButton: Story = {
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Disabled tooltip — wrapper-listener proof">
        <button
          disabled
          aria-label="Disabled action"
          className="px-3 py-2 border border-solid opacity-50 cursor-not-allowed"
        >
          Disabled button
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const EscapeDismisses: Story = {
  parameters: {
    docs: {
      description: { story: 'Tab to focus the button, then press Escape. The bubble closes; focus stays on the button.' },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <p style={{ marginBottom: 16, fontSize: 12 }}>
        Tab to focus, then press <kbd>Esc</kbd>.
      </p>
      <TooltipTrigger content="Press Esc to dismiss without losing focus">
        <button
          aria-label="Focus me with tab"
          className="px-3 py-2 border border-solid"
        >
          Focus target
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const WithCustomDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 64 }}>
      {[0, 150, 500].map((d) => (
        <TooltipTrigger key={d} content={`openDelay: ${d}ms`} openDelay={d}>
          <button aria-label={`Delay ${d}`} className="px-3 py-2 border border-solid">
            {d}ms
          </button>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const DisabledViaEnabledProp: Story = {
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="You should never see this" enabled={false}>
        <button aria-label="Suppressed tooltip" className="px-3 py-2 border border-solid">
          Hover (no tooltip)
        </button>
      </TooltipTrigger>
    </div>
  ),
};

export const WithIconButton: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Once <IconLink> ships, this is what every IconLink does internally — hand-rolled here for now.',
      },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Close">
        <button
          aria-label="Close"
          className="inline-flex items-center justify-center w-[24px] h-[24px] rounded-[var(--radius-120)] cursor-pointer"
        >
          <Icon name="close" size={17} />
        </button>
      </TooltipTrigger>
    </div>
  ),
};

const ForwardRefButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button ref={ref} {...props} className="px-3 py-2 border border-solid" />
  ),
);
ForwardRefButton.displayName = 'ForwardRefButton';

export const WithForwardRefChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Trigger child is a forwardRef component that spreads its props onto its DOM root. Components that swallow `aria-describedby` / `onFocus` / `onBlur` / `ref` will not work — the failure mode is silent.',
      },
    },
  },
  render: () => (
    <div style={{ padding: 64 }}>
      <TooltipTrigger content="Wrapped via forwardRef">
        <ForwardRefButton aria-label="Forward ref">forwardRef child</ForwardRefButton>
      </TooltipTrigger>
    </div>
  ),
};

export const WithComposedHandlers: Story = {
  render: () => {
    const Inner = () => {
      const [log, setLog] = useState<string[]>([]);
      return (
        <div style={{ padding: 64 }}>
          <TooltipTrigger content="Consumer handlers run alongside ours">
            <button
              aria-label="Composed handlers"
              className="px-3 py-2 border border-solid"
              onFocus={() => setLog((l) => [...l, 'consumer onFocus'])}
              onBlur={() => setLog((l) => [...l, 'consumer onBlur'])}
            >
              Tab in / out
            </button>
          </TooltipTrigger>
          <pre style={{ marginTop: 16, fontSize: 12 }}>{log.join('\n')}</pre>
        </div>
      );
    };
    return <Inner />;
  },
};

export const WithWrapperClassName: Story = {
  render: () => (
    <div style={{ display: 'flex', width: 400, padding: 64, border: '1px dashed #ccc' }}>
      <TooltipTrigger content="Wrapper got flex-1" wrapperClassName="flex-1">
        <button aria-label="Stretched" className="w-full px-3 py-2 border border-solid">
          Stretches to flex-1
        </button>
      </TooltipTrigger>
    </div>
  ),
};
