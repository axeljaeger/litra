import { type Meta, type StoryObj } from '@storybook/angular';
import { SingleLampControlComponent } from './single-lamp-control.component';

const meta: Meta<SingleLampControlComponent> = {
  title: 'Single Lamp Control',
  component: SingleLampControlComponent,
  tags: [],
  render: (args) => ({
    props: {
      ...args,
    },
  }),
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<SingleLampControlComponent>;

export const Idle: Story = {
  args: {
   },
};