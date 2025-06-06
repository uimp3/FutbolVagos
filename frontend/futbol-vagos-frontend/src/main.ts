/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    // Removemos provideClientHydration() ya que no estamos usando SSR
  ]
}).catch(err => console.error(err));

