import { css, html, LitElement } from 'lit';

export type WelcomeState = 'Idle' | 'Connecting' | 'HidNotSupported';

export class WelcomeScreen extends LitElement {
  static properties = {
    state: {},
  };

  static styles = css`
    :host {
      display: block;
    }

    .welcome-card {
      display: grid;
      gap: 1.25rem;
      padding: 1.5rem;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    }

    .welcome-header h1 {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.15;
    }

    .welcome-header p {
      margin: 0.5rem 0 0;
      color: rgba(15, 23, 42, 0.72);
    }

    .welcome-actions {
      display: flex;
    }

    .primary-button {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(79, 70, 229, 0.35);
      border-radius: 0.875rem;
      background: #4f46e5;
      color: #fff;
      font: inherit;
      cursor: pointer;
    }

    .primary-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .progress {
      position: relative;
      overflow: hidden;
      height: 0.375rem;
      border-radius: 999px;
      background: rgba(79, 70, 229, 0.18);
    }

    .progress::before {
      content: '';
      position: absolute;
      inset: 0;
      width: 35%;
      border-radius: inherit;
      background: #4f46e5;
      animation: progress-slide 1s ease-in-out infinite alternate;
    }

    .error {
      padding: 0.875rem 1rem;
      border: 1px solid rgba(220, 38, 38, 0.18);
      border-radius: 0.875rem;
      background: rgba(254, 226, 226, 0.8);
      color: #7f1d1d;
    }

    .error a {
      color: inherit;
    }

    @keyframes progress-slide {
      from {
        transform: translateX(-10%);
      }

      to {
        transform: translateX(185%);
      }
    }

    @media (prefers-color-scheme: dark) {
      .welcome-card {
        border-color: rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.72);
        box-shadow: none;
      }

      .welcome-header p {
        color: rgba(226, 232, 240, 0.78);
      }

      .error {
        border-color: rgba(248, 113, 113, 0.25);
        background: rgba(127, 29, 29, 0.3);
        color: #fecaca;
      }
    }
  `;

  declare state: WelcomeState;

  constructor() {
    super();
    this.state = 'Idle';
  }

  private handleStartClick(): void {
    this.dispatchEvent(new CustomEvent('start-clicked'));
  }

  render() {
    return html`
      <section class="welcome-card">
        <header class="welcome-header">
          <h1>Litra PWA</h1>
          <p>PWA to control the Logitech LitraGlow video light</p>
        </header>

        <div class="welcome-actions">
          <button
            class="primary-button"
            ?disabled=${this.state === 'HidNotSupported'}
            @click=${this.handleStartClick}
          >
            Start
          </button>
        </div>

        ${
          this.state === 'Connecting'
            ? html`
              <div
                class="progress"
                role="progressbar"
                aria-label="Connecting to lamp"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            `
            : null
        }

        ${
          this.state === 'HidNotSupported'
            ? html`
              <div class="error">
                Your browser does not support the
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API" target="_blank" rel="noopener noreferrer">
                  WebHID API
                </a>.
              </div>
            `
            : null
        }
      </section>
    `;
  }
}

if (!customElements.get('welcome-screen')) {
  customElements.define('welcome-screen', WelcomeScreen);
}

declare global {
  interface HTMLElementTagNameMap {
    'welcome-screen': WelcomeScreen;
  }
}
