/// <reference types="w3c-web-hid" />

import { Component, HostBinding, OnInit } from '@angular/core';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SingleLampControlComponent } from './single-lamp-control/single-lamp-control.component';

const Logitech_VID = 0x046d;
const LitraGlow_PID = 0xc900;

enum AppState {
  Idle,
  Connecting,
  Connected,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    WelcomePageComponent,
    SingleLampControlComponent
  ]
})
export class AppComponent implements OnInit {
  public appState: AppState = AppState.Idle;
  public AppState = AppState;

  ngOnInit(): void { }
  public devices: HIDDevice[] | null = null;

  async start() {
    this.appState = AppState.Connecting;

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (this.devices) {
        const deviceIndex = this.devices.indexOf(device);
        if (deviceIndex > -1) {
          this.devices?.splice(deviceIndex, 1);
          if (this.devices.length === 0) {
            this.appState = AppState.Idle;
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
      this.appState = AppState.Connected;
      this.devices.forEach(async device => await device.open());
    } else {
      this.appState = AppState.Idle;
    }
  }
}
