import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { routes } from './app.routes';
import { AppTitleStrategy } from './core/seo/app-title-strategy';
import { authInterceptor } from './core/auth/auth.interceptor';

// Keep PrimeNG's `primary` palette in lockstep with the Tailwind `--color-brand-*` ramp.
const MyPanelPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef6fc',
      100: '#d7e9f7',
      200: '#b0d3ef',
      300: '#7fb6e3',
      400: '#4a92d1',
      500: '#2472b4',
      600: '#1a5a91',
      700: '#144a77',
      800: '#0f3d63',
      900: '#0c3252',
      950: '#061f34',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules),
    ),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    providePrimeNG({
      ripple: false,
      theme: {
        preset: MyPanelPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
        },
      },
    }),
  ],
};
