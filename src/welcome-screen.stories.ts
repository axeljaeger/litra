import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './welcome-screen';

type WelcomeState = 'Idle' | 'Connecting' | 'HidNotSupported';

const meta: Meta<{ state: WelcomeState }> = {
  title: 'Components/Welcome Screen',
  args: {
    state: 'Idle',
  },
  render: ({ state }) =>
    html`<welcome-screen .state=${state}></welcome-screen>`,
};

export default meta;

type Story = StoryObj<{ state: WelcomeState }>;

export const Idle: Story = {};

export const Connecting: Story = {
  args: {
    state: 'Connecting',
  },
};

export const HidNotSupported: Story = {
  args: {
    state: 'HidNotSupported',
  },
};
