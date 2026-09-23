import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
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
    provideRouter(routes),
    provideAppInitializer(() => {
      const mockEngine = inject(MockDataEngineService);
      // MockDataEngineService seeds data in its constructor upon injection.
      // mockEngine.startSimulation(20000);
    })
  ]
};
