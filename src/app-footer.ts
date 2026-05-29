import { css, html, LitElement } from 'lit';

export class AppFooter extends LitElement {
  static properties = {
    version: {},
  };

  static styles = css`
    :host {
      display: inline-flex;
      justify-content: center;
    }

    .github-link {
      display: inline-flex;
      gap: 0.75rem;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: 999px;
      color: inherit;
      text-decoration: none;
    }

    img {
      width: 1.25rem;
      height: 1.25rem;
      object-fit: contain;
      filter: invert(0.08);
    }

    @media (prefers-color-scheme: dark) {
      img {
        filter: invert(0.94);
      }
    }
  `;

  declare version: string;

  constructor() {
    super();
    this.version = '';
  }

  render() {
    return html`
      <a
        class="github-link"
        href="https://github.com/axeljaeger/litra"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img alt="GitHub" src="assets/github-mark.svg" />
        <span>${this.version}</span>
      </a>
    `;
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}

declare global {
  interface HTMLElementTagNameMap {
    'app-footer': AppFooter;
  }
}
