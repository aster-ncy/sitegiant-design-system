import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';

const meta = {
  title: 'Feedback/Banner',
  component: Banner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'info', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    title: 'Information',
    description: 'This is an informational banner with helpful context.',
    dismissible: false,
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Welcome aboard!',
    description: 'Congratulations on setting up your store! Complete the tasks below to get your shop ready for selling.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Tip',
    description: 'Connect your sales channels to start receiving orders automatically.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Action required',
    description: 'Your store verification is pending review. Please update your business documents.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Verification failed',
    description: 'Your submitted documents could not be verified. Please resubmit with valid documentation.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'success',
    title: 'Setup complete!',
    description: 'Your store is now live and ready to receive orders.',
    dismissible: true,
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'info',
    title: undefined,
    description: 'A banner with just a description and no title.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-[640px]">
      <Banner
        variant="success"
        title="Welcome aboard!"
        description="Congratulations on setting up your store!"
      />
      <Banner
        variant="info"
        title="Tip"
        description="Connect your sales channels to start receiving orders."
      />
      <Banner
        variant="warning"
        title="Action required"
        description="Your store verification is pending review."
        dismissible
      />
      <Banner
        variant="danger"
        title="Verification failed"
        description="Your submitted documents could not be verified."
        dismissible
      />
    </div>
  ),
};
