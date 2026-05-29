import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import type { LampController } from './lamp-controller';

export class LampControlPanel extends LitElement {
  static properties = {
    controller: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      font-variant-numeric: tabular-nums;
    }

    .controller {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 0.875rem;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }

    .controller-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .title {
      margin: 0;
      font-size: 1rem;
      line-height: 1.2;
    }

    .summary {
      margin: 0.25rem 0 0;
      color: rgba(15, 23, 42, 0.72);
      font-size: 0.875rem;
    }

    .toggle-row {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .control-row {
      display: grid;
      gap: 0.375rem;
    }

    .control-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .value {
      color: rgba(15, 23, 42, 0.72);
    }

    input[type='checkbox'] {
      margin: 0;
      accent-color: #4f46e5;
    }

    input[type='range'] {
      width: 100%;
      margin: 0;
      accent-color: #4f46e5;
    }

    @media (prefers-color-scheme: dark) {
      .controller {
        border-color: rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.72);
        box-shadow: none;
      }

      .summary,
      .value {
        color: rgba(226, 232, 240, 0.78);
      }
    }
  `;

  declare controller: LampController;

  #unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribeToController();
  }

  disconnectedCallback(): void {
    this.unsubscribeFromController();
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('controller')) {
      this.subscribeToController();
    }
  }

  private subscribeToController(): void {
    this.unsubscribeFromController();

    if (!this.controller) {
      return;
    }

    this.#unsubscribe = this.controller.subscribe(() => {
      this.requestUpdate();
    });
  }

  private unsubscribeFromController(): void {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
  }

  private async handleOnChange(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLInputElement;
    await this.controller.setOnState(target.checked);
  }

  private async handleBrightnessInput(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLInputElement;
    await this.controller.setBrightness(target.valueAsNumber);
  }

  private async handleTemperatureInput(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLInputElement;
    await this.controller.setTemperature(target.valueAsNumber);
  }

  protected render() {
    if (!this.controller) {
      return nothing;
    }

    return html`
      <section class="controller">
        <header class="controller-header">
          <div>
            <h2 class="title">${this.controller.label}</h2>
            <p class="summary">${this.controller.brightness}%, ${this.controller.temperature}K</p>
          </div>

          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this.controller.on}
              @change=${this.handleOnChange}
            />
            <span>On</span>
          </label>
        </header>

        <div class="control-row">
          <div class="control-header">
            <span>Brightness</span>
            <span class="value">${this.controller.brightness}%</span>
          </div>
          <input
            type="range"
            aria-label="Brightness"
            min="1"
            max="100"
            .value=${String(this.controller.brightness)}
            @input=${this.handleBrightnessInput}
          />
        </div>

        <div class="control-row">
          <div class="control-header">
            <span>Temperature</span>
            <span class="value">${this.controller.temperature}K</span>
          </div>
          <input
            type="range"
            aria-label="Temperature"
            min="2700"
            max="6500"
            step="100"
            .value=${String(this.controller.temperature)}
            @input=${this.handleTemperatureInput}
          />
        </div>
      </section>
    `;
  }
}

if (!customElements.get('lamp-control-panel')) {
  customElements.define('lamp-control-panel', LampControlPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    'lamp-control-panel': LampControlPanel;
  }
}
