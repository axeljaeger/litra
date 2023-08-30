import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SingleLampControlComponent } from './single-lamp-control.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<SingleLampControlComponent> = {
  title: 'Single Lamp Control',
  component: SingleLampControlComponent,
  decorators: [moduleMetadata({
    imports: [NoopAnimationsModule]
  })],
  tags: [],
  render: (args: SingleLampControlComponent) => ({
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