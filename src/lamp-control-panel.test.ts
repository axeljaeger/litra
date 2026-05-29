import { describe, expect, it, vi } from 'vitest';
import './lamp-control-panel';
import type { LampControlPanel } from './lamp-control-panel';
import { LampController } from './lamp-controller';

describe('LampControlPanel', () => {
  it('updates the lamp through native inputs', async () => {
    const sendReport = vi.fn(async () => undefined);
    const controller = new LampController({
      productName: 'Desk Lamp',
      sendReport,
    } as unknown as HIDDevice);

    const panel = document.createElement(
      'lamp-control-panel',
    ) as LampControlPanel;
    panel.controller = controller;
    document.body.append(panel);

    await panel.updateComplete;

    const root = panel.shadowRoot;
    if (!root) {
      throw new Error('Expected lamp-control-panel to render a shadow root.');
    }

    const checkbox = root.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    if (!checkbox) {
      throw new Error('Expected lamp-control-panel to render a checkbox.');
    }

    const brightness = root.querySelector<HTMLInputElement>(
      'input[aria-label="Brightness"]',
    );
    if (!brightness) {
      throw new Error(
        'Expected lamp-control-panel to render a brightness slider.',
      );
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    brightness.value = '60';
    brightness.dispatchEvent(new Event('input'));

    await vi.waitFor(() => {
      expect(sendReport).toHaveBeenCalledTimes(2);
    });
  });
});
