import type { Meta, StoryObj } from '@storybook/angular';
import { WelcomePageComponent } from './welcome-page.component';

const meta: Meta<WelcomePageComponent> = {
  title: 'Welcome Page',
  component: WelcomePageComponent,
  tags: [],
  render: (args: WelcomePageComponent) => ({
    props: {
      ...args,
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
