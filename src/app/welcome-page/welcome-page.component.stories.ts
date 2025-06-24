import { type Meta, type StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { WelcomePageComponent } from './welcome-page.component';

const meta: Meta<WelcomePageComponent> = {
  title: 'Welcome Page',
  component: WelcomePageComponent,
  tags: [],
  render: (args) => ({
    props: {
      ...args,
      connect: action('onConnect')
    },
  }),
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<WelcomePageComponent>;

export const Idle: Story = {
  args: {
    state: 'Idle'
  },
};

export const Connecting: Story = {
  args: {
    state: 'Connecting'
  },
};

export const HidNotSupported: Story = {
  args: {
    state: 'HidNotSupported',
  },
};