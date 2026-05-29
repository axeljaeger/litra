import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lamp-control-panel';
import { LampController } from './lamp-controller';

const controller = new LampController({
  productName: 'Desk Lamp',
  sendReport: async () => undefined,
} as unknown as HIDDevice);

const meta: Meta = {
  title: 'Components/Lamp Control Panel',
  render: () =>
    html`<lamp-control-panel .controller=${controller}></lamp-control-panel>`,
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
