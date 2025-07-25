import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import MyPreset from './mypreset';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
//import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
          withFetch(),
          withInterceptors([
          //loggingInterceptor,
          //authInterceptor,
         ])
        ),
        provideClientHydration(withEventReplay()),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: MyPreset,
                options: {
                  darkModeSelector: '.my-app-dark'
              }
            }
        }),
      //MessageService,
  ]
};
