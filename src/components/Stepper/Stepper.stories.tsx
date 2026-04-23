import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const storeSetupSteps = [
  { label: 'Personal Info' },
  { label: 'Store Info' },
  { label: 'Address & Billing' },
];

const channelSteps = [
  { label: 'Getting Started' },
  { label: 'Select Channel' },
  { label: 'Confirmation' },
];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    currentStep: { control: { type: 'number', min: 1, max: 5 } },
  },
  args: {
    steps: storeSetupSteps,
    currentStep: 1,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { currentStep: 1 } };
export const Step2: Story = { args: { currentStep: 2 } };
export const Step3: Story = { args: { currentStep: 3 } };
export const AllComplete: Story = { args: { currentStep: 4 } };

export const ChannelFlow: Story = {
  args: { steps: channelSteps, currentStep: 2 },
};

export const AllSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-[600px]">
      <Stepper steps={storeSetupSteps} currentStep={1} />
      <Stepper steps={storeSetupSteps} currentStep={2} />
      <Stepper steps={storeSetupSteps} currentStep={3} />
      <Stepper steps={storeSetupSteps} currentStep={4} />
    </div>
  ),
};
