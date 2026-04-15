import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LanguageService } from './language.service';

export function initializeLanguage(langService: LanguageService) {
  return () => langService.initPromise;
}

const EspadrinaPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#f7edeb',
            100: '#e0c5c0',
            200: '#c99d94',
            300: '#b27569',
            400: '#9b4d3e',
            500: '#b04b3a', // drina-accent
            600: '#9e4334',
            700: '#8d3b2e',
            800: '#7b3428',
            900: '#6a2d22',
            950: '#58251c'
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: EspadrinaPreset,
            options: {
                darkModeSelector: false 
            }
        }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      deps: [LanguageService],
      multi: true
    }
  ]
};
