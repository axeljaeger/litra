import { Component, effect, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {form, FormField} from '@angular/forms/signals';

const onOffCommand = [0xff, 0x04, 0x1c] as const;
const brightnessCommand = [0xff, 0x04, 0x4c] as const;
const temperatureCommand = [0xff, 0x04, 0x9c] as const;

const reportId = 0x11;
const fill = new Array<number>(14).fill(0x00, 0, 14);

const minBrightness = 0x14;
const maxBrightness = 0xfa;

enum LampOnOffState {
  LightOff = 0x00,
  LightOn = 0x01
}

@Component({
    selector: 'app-single-lamp-control',
    imports: [
        MatExpansionModule,
        MatSliderModule,
        MatSlideToggleModule,
        FormField,
    ],
    templateUrl: './single-lamp-control.component.html',
    styleUrls: ['./single-lamp-control.component.scss']
})
export class SingleLampControlComponent {
  hidDevice = input.required<HIDDevice>();  

  on = signal<boolean>(false);
  brightness = signal<number>(50);
  temperature = signal<number>(2700);

  onField = form(this.on);
  brightnessField = form(this.brightness);
  temperatureField = form(this.temperature);

  updateOn = effect(() => this.setOnState(this.on()));
  updateBrightness = effect(() => this.setBrightness(this.brightness()));
  updateTemperature = effect(() => this.setTemperature(this.temperature()));

  public async setOnState(on: boolean): Promise<void> {
    await this.sendCommand(onOffCommand, [on ? LampOnOffState.LightOn : LampOnOffState.LightOff, 0x00]);
  }

  public async setBrightness(level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error("Invalid brightness specified. Must be between 1 and 100.");
    }

    const clampedLevel = Math.floor(
      minBrightness + (level / 100) * (maxBrightness - minBrightness)
    );

    await this.sendCommand(brightnessCommand, [0x00, clampedLevel]);
  }

  public async setTemperature(temperature: number): Promise<void> {
    if (temperature < 2700 || temperature > 6500) {
      throw new Error("Invalid temperature specified. Must be between 2700 and 6500.");
    }

    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setInt16(0, temperature, false);
    const bytes = [view.getInt8(0), view.getInt8(1)] as [number, number];
    await this.sendCommand(temperatureCommand, bytes);
  }

  private async sendCommand(command: readonly[number, number, number], args: [number, number]): Promise<void> {
    await this.hidDevice().sendReport(reportId, Uint8Array.from([
      ...command,
      ...args,
      ...fill
    ]));
  }
}
