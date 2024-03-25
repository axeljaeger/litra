import { type Meta, type StoryObj, applicationConfig } from '@storybook/angular';
import { SingleLampControlComponent } from './single-lamp-control.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

const meta: Meta<SingleLampControlComponent> = {
  title: 'Single Lamp Control',
  component: SingleLampControlComponent,
  decorators: [applicationConfig({
    providers: [importProvidersFrom(NoopAnimationsModule)]
  })],
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