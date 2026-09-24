import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

import { MockDataEngineService } from './services/mock-data-engine.service';

export function initializeMockEngine(mockEngine: MockDataEngineService) {
  return () => {
    // Engine automatically seeds in constructor, start live simulation if desired
    // mockEngine.startSimulation(20000);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      const mockEngine = inject(MockDataEngineService);
      //MockDataEngineService seeds data in its constructor upon injection.
      mockEngine.startSimulation(20000);
    })
  ]
};
