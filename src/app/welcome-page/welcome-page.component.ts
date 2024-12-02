import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-welcome-page',
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatProgressBarModule,
    ],
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  public connecting = input(false);
  public connect = output<void>();
}
