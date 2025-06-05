import { Component, OnInit, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

const onOffCommand = [0xff, 0x04, 0x1c];
const brightnessCommand = [0xff, 0x04, 0x4c];
const temperatureCommand = [0xff, 0x04, 0x9c];

const reportId = 0x11;
const fill = new Array<number>(14).fill(0x00, 0, 14);

export const minBrightness = 0x14;
export const maxBrightness = 0xfa;

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
        ReactiveFormsModule,
    ],
    templateUrl: './single-lamp-control.component.html',
    styleUrls: ['./single-lamp-control.component.scss']
})
export class SingleLampControlComponent implements OnInit {
  hidDevice = input<HIDDevice | null>(null);
  x = input(4);
  
  brightness = new FormControl(0);
  temperature = new FormControl(2700);

  ngOnInit(): void {
    this.brightness.valueChanges.subscribe(val => this.setBrightness(val));
    this.temperature.valueChanges.subscribe(val => this.setTemperature(val));    
  }

  public async setOnState(on: boolean): Promise<void> {
    if (this.hidDevice) {
      await this.hidDevice()?.sendReport(reportId, Uint8Array.from([
        ...onOffCommand,
        on ? LampOnOffState.LightOn : LampOnOffState.LightOff,
        0x00,
        ...fill
      ]));
    }
  }

  public setBrightness(level: any) {
    if (level < 1 || level > 100) {
      throw new Error("Invalid brightness specified. Must be between 1 and 100.");
    }

    if (!this.hidDevice) {
      return;
    }

    const clampedLevel = Math.floor(
      minBrightness + (level / 100) * (maxBrightness - minBrightness)
    );
    this.hidDevice()?.sendReport(reportId, Uint8Array.from([
      ...brightnessCommand,
      0x00,
      clampedLevel,
      ...fill
    ]));
  }

  public setTemperature(temperature: any) {
    if (temperature < 2700 || temperature > 6500) {
      throw new Error("Invalid brightness specified. Must be between 1 and 100.");
    }

    if (!this.hidDevice) {
      return;
    }

    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setInt16(0, temperature, false);
    const bytes = [view.getInt8(0), view.getInt8(1)];

    this.hidDevice()?.sendReport(reportId, Uint8Array.from([
      ...temperatureCommand,
      ...bytes,
      ...fill
    ]));
  }
}
