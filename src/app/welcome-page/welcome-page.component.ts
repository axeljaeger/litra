import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { AppState } from '../app.component';

@Component({
    selector: 'app-welcome-page',
    imports: [
    MatButtonModule,
    MatProgressBarModule
],
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  public readonly state = input<AppState>('Idle');
  public readonly unsupported = input(false);
  public readonly connect = output<void>();
}
