import { describe, expect, it, vi } from 'vitest';
import { LampController } from './lamp-controller';

describe('LampController', () => {
  it('encodes brightness commands for the HID report', async () => {
    const sendReport = vi.fn(async () => undefined);
    const controller = new LampController({
      productName: 'Desk Lamp',
      sendReport,
    } as unknown as HIDDevice);

    await controller.setBrightness(42);

    expect(sendReport).toHaveBeenLastCalledWith(
      0x11,
      Uint8Array.from([
        0xff,
        0x04,
        0x4c,
        0x00,
        116,
        ...new Array(14).fill(0x00),
      ]),
    );
  });

  it('rejects temperatures outside the supported range', async () => {
    const controller = new LampController({
      productName: 'Desk Lamp',
      sendReport: async () => undefined,
    } as unknown as HIDDevice);

    await expect(controller.setTemperature(2600)).rejects.toThrow(
      'Value 2600 out of range (2700-6500)',
    );
  });
});
