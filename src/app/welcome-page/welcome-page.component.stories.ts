import { type Meta, type StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

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
    connecting: false
  },
};

export const Connecting: Story = {
  args: {
    connecting: true
  },
};
