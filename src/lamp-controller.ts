/// <reference types="w3c-web-hid" />

const onOffCommand = [0xff, 0x04, 0x1c] as const;
const brightnessCommand = [0xff, 0x04, 0x4c] as const;
const temperatureCommand = [0xff, 0x04, 0x9c] as const;

const reportId = 0x11;
const fill = new Array<number>(14).fill(0x00, 0, 14);

const minBrightness = 0x14;
const maxBrightness = 0xfa;

enum LampOnOffState {
  LightOff = 0x00,
  LightOn = 0x01,
}

export class LampController extends EventTarget {
  readonly label: string;

  #on = false;
  #brightness = 50;
  #temperature = 2700;

  constructor(readonly hidDevice: HIDDevice) {
    super();
    this.label = hidDevice.productName ?? 'LitraGlow';
  }

  get on(): boolean {
    return this.#on;
  }

  get brightness(): number {
    return this.#brightness;
  }

  get temperature(): number {
    return this.#temperature;
  }

  subscribe(listener: () => void): () => void {
    this.addEventListener('change', listener);
    return () => this.removeEventListener('change', listener);
  }

  async setOnState(on: boolean): Promise<void> {
    this.#on = on;
    this.emitChange();
    await this.sendCommand(onOffCommand, [
      on ? LampOnOffState.LightOn : LampOnOffState.LightOff,
      0x00,
    ]);
  }

  async setBrightness(level: number): Promise<void> {
    const validatedLevel = this.validateRange(level, 1, 100);
    const clampedLevel = Math.floor(
      minBrightness + (validatedLevel / 100) * (maxBrightness - minBrightness),
    );

    this.#brightness = validatedLevel;
    this.emitChange();
    await this.sendCommand(brightnessCommand, [0x00, clampedLevel]);
  }

  async setTemperature(temperature: number): Promise<void> {
    const validatedTemperature = this.validateRange(temperature, 2700, 6500);
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setInt16(0, validatedTemperature, false);

    this.#temperature = validatedTemperature;
    this.emitChange();
    await this.sendCommand(temperatureCommand, [
      view.getInt8(0),
      view.getInt8(1),
    ]);
  }

  private emitChange(): void {
    this.dispatchEvent(new Event('change'));
  }

  private validateRange(value: number, min: number, max: number): number {
    if (value < min || value > max) {
      throw new Error(`Value ${value} out of range (${min}-${max})`);
    }

    return value;
  }

  private async sendCommand(
    command: readonly [number, number, number],
    args: [number, number],
  ): Promise<void> {
    await this.hidDevice.sendReport(
      reportId,
      Uint8Array.from([...command, ...args, ...fill]),
    );
  }
}
