import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode, provideZonelessChangeDetection } from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: [
    provideZonelessChangeDetection(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
})
  .catch(err => console.error(err));
