/// <reference types="w3c-web-hid" />

import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

const Logitech_VID = 0x046d;
const LitraGlow_PID = 0xc900;

const onOffCommand = [0xff, 0x04, 0x1c];
const brightnessCommand = [0xff, 0x04, 0x4c];
const temperatureCommand = [0xff, 0x04, 0x9c];

enum LampOnOffState {
  LightOff = 0x00,
  LightOn = 0x01
}

const reportId = 0x11;
const fill = new Array<number>(14).fill(0x00, 0, 14);

export const minBrightness = 0x14;
export const maxBrightness = 0xfa;

enum AppState {
  Idle,
  Connecting,
  Connected,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatExpansionModule, 
    MatSlideToggleModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatSliderModule,
    NgIf
  ]
})
export class AppComponent implements OnInit {
  public appState : AppState = AppState.Idle;
  public AppState = AppState;

  constructor() { }


  ngOnInit(): void {
    this.brightness.valueChanges.subscribe(val =>
      this.setBrightness(val!)
    );

    this.temperature.valueChanges.subscribe(val =>
      this.setTemperature(val!)
    );

    this.onOff.valueChanges.subscribe(val =>
      this.sendOnOffCommand(val ? LampOnOffState.LightOn : LampOnOffState.LightOff)
    );

  }
  public LampOnOffState = LampOnOffState;
  private device: HIDDevice | null = null;

  brightness = new FormControl(0);
  temperature = new FormControl(2700);
  onOff = new FormControl(false);

  async start() {
    this.appState = AppState.Connecting;

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (device === this.device) {
        this.appState = AppState.Idle;
      }
    });


    const devices = await navigator.hid.requestDevice({
      filters: [{
        productId: LitraGlow_PID,
        vendorId: Logitech_VID,
      }]
    });
    if (devices.length > 0) {
      this.appState = AppState.Connected;
      this.device = devices[0];
      await this.device.open();

    } else {
      this.appState = AppState.Idle;
    }
  }

  async sendOnOffCommand(on: LampOnOffState): Promise<void> {
    if (this.device) {
      await this.device.sendReport(reportId, Uint8Array.from([
        ...onOffCommand,
        on,
        0x00,
        ...fill
      ]));
    }
  }

  private setBrightness(level: number) {
    if (level < 1 || level > 100) {
      throw new Error("Invalid brightness specified. Must be between 1 and 100.");
    }

    if (!this.device) {
      return;
    }

    const clampedLevel = Math.floor(
      minBrightness + (level / 100) * (maxBrightness - minBrightness)
    );
    this.device.sendReport(reportId, Uint8Array.from([
      ...brightnessCommand,
      0x00,
      clampedLevel,
      ...fill
    ]));
  }

  public setTemperature(temperature: number) {
    if (temperature < 2700 || temperature > 6500) {
      throw new Error("Invalid brightness specified. Must be between 1 and 100.");
    }

    if (!this.device) {
      return;
    }

    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setInt16(0, temperature, false);
    const bytes = [view.getInt8(0), view.getInt8(1)];

    this.device.sendReport(reportId, Uint8Array.from([
      ...temperatureCommand,
      ...bytes,
      ...fill
    ]));
  }
}
