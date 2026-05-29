/// <reference types="w3c-web-hid" />

import { css, html, LitElement, type PropertyValues } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { version } from '../package.json';
import './lamp-control-panel';
import './welcome-screen';
import './app-footer';
import { LampController } from './lamp-controller';
import { mountPictureInPictureWindow } from './picture-in-picture-window';
import type { WelcomeState } from './welcome-screen';

type AppState = WelcomeState | 'Connected';

const logitechVendorId = 0x046d;
const litraGlowProductId = 0xc900;

export class LitraApp extends LitElement {
  static properties = {
    appState: { state: true },
    controllers: { state: true },
    pictureInPictureActive: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100dvh;
    }

    main {
      display: grid;
      gap: 1rem;
      min-height: 100dvh;
      padding: 1.5rem;
      box-sizing: border-box;
    }

    .connected-layout {
      align-content: start;
      width: min(48rem, 100%);
      margin: 0 auto;
    }

    .app-actions {
      display: flex;
      justify-content: flex-end;
    }

    .action-button,
    .primary-button {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(79, 70, 229, 0.35);
      border-radius: 0.875rem;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .action-button {
      background: rgba(79, 70, 229, 0.08);
    }

    .action-button:hover {
      background: rgba(79, 70, 229, 0.14);
    }

    .primary-button {
      background: #4f46e5;
      color: #fff;
    }

    .primary-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .controllers {
      display: grid;
      gap: 1rem;
    }

    .welcome-layout {
      place-content: center;
      width: min(28rem, 100%);
      margin: 0 auto;
    }
  `;

  declare appState: AppState;
  declare controllers: LampController[];
  declare pictureInPictureActive: boolean;

  readonly pictureInPictureSupported =
    typeof window !== 'undefined' &&
    typeof window.documentPictureInPicture !== 'undefined';

  #pictureInPictureWindow: Window | null = null;
  #destroyPictureInPictureWindow: (() => void) | null = null;

  constructor() {
    super();
    this.appState = navigator.hid ? 'Idle' : 'HidNotSupported';
    this.controllers = [];
    this.pictureInPictureActive = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    navigator.hid?.addEventListener('disconnect', this.handleDisconnect);
  }

  disconnectedCallback(): void {
    navigator.hid?.removeEventListener('disconnect', this.handleDisconnect);
    this.destroyPictureInPictureWindow();

    if (this.#pictureInPictureWindow && !this.#pictureInPictureWindow.closed) {
      this.#pictureInPictureWindow.close();
    }

    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (
      changedProperties.has('controllers') &&
      this.pictureInPictureActive &&
      this.#pictureInPictureWindow &&
      !this.#pictureInPictureWindow.closed
    ) {
      this.renderPictureInPicture();
    }
  }

  async start(): Promise<void> {
    this.appState = 'Connecting';

    try {
      const devices = await navigator.hid.requestDevice({
        filters: [
          {
            productId: litraGlowProductId,
            vendorId: logitechVendorId,
          },
        ],
      });

      const controllers = await Promise.all(
        devices.map(async (device) => {
          if (!device.opened) {
            await device.open();
          }

          return new LampController(device);
        }),
      );

      this.controllers = controllers;
      this.appState = controllers.length > 0 ? 'Connected' : 'Idle';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        this.appState = 'Idle';
        return;
      }

      throw error;
    }
  }

  async openPictureInPicture(): Promise<void> {
    if (!this.pictureInPictureSupported || this.controllers.length === 0) {
      return;
    }

    if (this.#pictureInPictureWindow && !this.#pictureInPictureWindow.closed) {
      this.#pictureInPictureWindow.focus();
      return;
    }

    const documentPictureInPicture = window.documentPictureInPicture;
    if (!documentPictureInPicture) {
      return;
    }

    const pictureInPictureWindow = await documentPictureInPicture.requestWindow(
      {
        width: 320,
        height: Math.max(156, this.controllers.length * 144),
      },
    );

    this.#pictureInPictureWindow = pictureInPictureWindow;
    pictureInPictureWindow.addEventListener(
      'pagehide',
      this.handlePictureInPictureClosed,
      { once: true },
    );
    this.pictureInPictureActive = true;
    this.renderPictureInPicture();
  }

  private readonly handleDisconnect = ({
    device,
  }: HIDConnectionEvent): void => {
    const remainingControllers = this.controllers.filter(
      (controller) => controller.hidDevice !== device,
    );
    if (remainingControllers.length === this.controllers.length) {
      return;
    }

    this.controllers = remainingControllers;
    this.appState = remainingControllers.length > 0 ? 'Connected' : 'Idle';

    if (
      remainingControllers.length === 0 &&
      this.#pictureInPictureWindow &&
      !this.#pictureInPictureWindow.closed
    ) {
      this.#pictureInPictureWindow.close();
    }
  };

  private readonly handlePictureInPictureClosed = (): void => {
    this.destroyPictureInPictureWindow();
    this.#pictureInPictureWindow = null;
    this.pictureInPictureActive = false;
  };

  private destroyPictureInPictureWindow(): void {
    this.#destroyPictureInPictureWindow?.();
    this.#destroyPictureInPictureWindow = null;
  }

  private renderPictureInPicture(): void {
    if (!this.#pictureInPictureWindow || this.#pictureInPictureWindow.closed) {
      return;
    }

    this.destroyPictureInPictureWindow();
    this.#destroyPictureInPictureWindow = mountPictureInPictureWindow(
      this.#pictureInPictureWindow.document,
      this.controllers,
    );
  }

  protected render() {
    const connected = this.appState === 'Connected';

    return html`
      <main class=${connected ? 'connected-layout' : 'welcome-layout'}>
        ${
          connected
            ? html`
              ${
                this.pictureInPictureSupported
                  ? html`
                    <div class="app-actions">
                      <button class="action-button" type="button" @click=${this.openPictureInPicture}>
                        ${this.pictureInPictureActive ? 'Focus mini controller' : 'Open mini controller'}
                      </button>
                    </div>
                  `
                  : null
              }

              <div class="controllers">
                ${repeat(
                  this.controllers,
                  (controller) => controller.hidDevice,
                  (controller) =>
                    html`<lamp-control-panel .controller=${controller}></lamp-control-panel>`,
                )}
              </div>
            `
            : html`<welcome-screen .state=${this.appState} @start-clicked=${this.start}></welcome-screen>`
        }

        <app-footer .version=${version}></app-footer>
      </main>
    `;
  }
}

if (!customElements.get('litra-app')) {
  customElements.define('litra-app', LitraApp);
}

declare global {
  interface HTMLElementTagNameMap {
    'litra-app': LitraApp;
  }
}
