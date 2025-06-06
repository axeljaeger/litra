import { Component, input, output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { version } from '../../../package.json';

@Component({
    selector: 'app-welcome-page',
    imports: [
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule
],
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  public connecting = input(false);
  public connect = output<void>();
  public version = version;
}
