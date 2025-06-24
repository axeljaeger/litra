/// <reference types="w3c-web-hid" />

import { Component, OnInit, signal } from '@angular/core';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SingleLampControlComponent } from './single-lamp-control/single-lamp-control.component';

import { version } from '../../package.json';

const Logitech_VID = 0x046d;
const LitraGlow_PID = 0xc900;

export type AppState = 'HidNotSupported' | 'Idle' | 'Connecting' | 'Connected';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        WelcomePageComponent,
        SingleLampControlComponent
    ]
})
export class AppComponent implements OnInit {
  public appState = signal<AppState>('Idle');
  public version = version;
  
  ngOnInit(): void {
    if (!navigator.hid) {
      this.appState.set('HidNotSupported');
    }
  }
  public devices: HIDDevice[] | null = null;

  async start() {
    this.appState.set('Connecting');
    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (this.devices) {
        const deviceIndex = this.devices.indexOf(device);
        if (deviceIndex > -1) {
          this.devices?.splice(deviceIndex, 1);
          if (this.devices.length === 0) {
            this.appState.set('Idle');
          }
        }
      }
    });

    this.devices = await navigator.hid.requestDevice({
      filters: [{
        productId: LitraGlow_PID,
        vendorId: Logitech_VID,
      }]
    });
    if (this.devices.length > 0) {
      this.appState.set('Connected');
      this.devices.forEach(async device => await device.open());
    } else {
      this.appState.set('Idle');
    }
  }
}
