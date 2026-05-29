import { beforeEach, describe, expect, it } from 'vitest';
import './litra-app';
import { LampController } from './lamp-controller';
import type { LitraApp } from './litra-app';

describe('LitraApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    Object.defineProperty(navigator, 'hid', {
      configurable: true,
      value: {
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        requestDevice: async () => [],
      } as unknown as HID,
    });
  });

  it('creates the app', async () => {
    const app = document.createElement('litra-app') as LitraApp;
    document.body.append(app);

    await app.updateComplete;

    expect(app).toBeTruthy();
  });

  it('opens a mini controller window when Document PiP is available', async () => {
    const pipDocument = document.implementation.createHTMLDocument('PiP');
    const pipWindow = {
      addEventListener: () => undefined,
      close: () => undefined,
      closed: false,
      document: pipDocument,
      focus: () => undefined,
    } as unknown as Window;

    Object.defineProperty(window, 'documentPictureInPicture', {
      configurable: true,
      value: {
        requestWindow: async () => pipWindow,
      },
    });

    const app = document.createElement('litra-app') as LitraApp;
    const controller = new LampController({
      productName: 'Desk Lamp',
      sendReport: async () => undefined,
    } as unknown as HIDDevice);

    app.controllers = [controller];
    app.appState = 'Connected';
    document.body.append(app);

    await app.updateComplete;
    await app.openPictureInPicture();

    expect(pipDocument.title).toBe('Desk Lamp');
    expect(pipDocument.body.textContent).toContain('Brightness');
  });
});
