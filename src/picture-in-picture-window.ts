import { html, render } from 'lit';
import type { LampController } from './lamp-controller';

const pictureInPictureStyles = `
  :root {
    color-scheme: light dark;
    font-family: Inter, system-ui, sans-serif;
    accent-color: #4f46e5;
  }

  html {
    background: #101217;
  }

  body {
    margin: 0;
    background: #101217;
    color: #f4f7fb;
  }

  main {
    display: grid;
    gap: 0;
  }

  section {
    display: grid;
    gap: 10px;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .control-row {
    display: grid;
    gap: 4px;
  }

  .control-header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 0.75rem;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
  }

  .value {
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.72);
  }

  input[type='checkbox'] {
    margin: 0;
  }

  input[type='range'] {
    width: 100%;
    margin: 0;
  }
`;

function windowTitle(controllers: LampController[]): string {
  return controllers.length === 1
    ? controllers[0].label
    : `${controllers[0]?.label ?? 'Litra'} + ${controllers.length - 1} more`;
}

function ensureStyles(doc: Document): void {
  if (doc.head.querySelector('style[data-litra-pip]')) {
    return;
  }

  const style = doc.createElement('style');
  style.dataset.litraPip = 'true';
  style.textContent = pictureInPictureStyles;
  doc.head.append(style);
}

function template(controllers: LampController[]) {
  return html`
    <main>
      ${controllers.map(
        (controller) => html`
          <section>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${controller.on}
                @change=${(event: Event) =>
                  void controller.setOnState(
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              />
              <span>On</span>
            </label>

            <div class="control-row">
              <div class="control-header">
                <span>Brightness</span>
                <span class="value">${controller.brightness}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                .value=${String(controller.brightness)}
                @input=${(event: Event) =>
                  void controller.setBrightness(
                    (event.currentTarget as HTMLInputElement).valueAsNumber,
                  )}
              />
            </div>

            <div class="control-row">
              <div class="control-header">
                <span>Temperature</span>
                <span class="value">${controller.temperature}K</span>
              </div>
              <input
                type="range"
                min="2700"
                max="6500"
                step="100"
                .value=${String(controller.temperature)}
                @input=${(event: Event) =>
                  void controller.setTemperature(
                    (event.currentTarget as HTMLInputElement).valueAsNumber,
                  )}
              />
            </div>
          </section>
        `,
      )}
    </main>
  `;
}

export function mountPictureInPictureWindow(
  doc: Document,
  controllers: LampController[],
): () => void {
  ensureStyles(doc);

  const renderContent = () => {
    doc.title = windowTitle(controllers);
    render(template(controllers), doc.body);
  };

  renderContent();
  const unsubscribes = controllers.map((controller) =>
    controller.subscribe(renderContent),
  );

  return () => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }

    render('', doc.body);
  };
}
