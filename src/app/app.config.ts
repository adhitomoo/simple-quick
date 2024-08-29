import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID, Provider, EnvironmentProviders, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideIcons } from '../core/icons/icons.provider';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from '../core/interceptor/auth.interceptor';
import { mockApiService } from './mock-api';
import { mockApiInterceptor } from '../core/mock/mock-api.interceptor';
import { FUSE_MOCK_API_DEFAULT_DELAY } from '../core/mock/mock-api.constants';

export type ProviderConfig = {
  mockApi?: {
      delay?: number;
      services?: any[];
  },
}
const provideApi = (config: ProviderConfig): Array<Provider | EnvironmentProviders> =>
  {
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
      {
        provide : FUSE_MOCK_API_DEFAULT_DELAY,
        useValue: config?.mockApi?.delay ?? 0,
      },
    ]

    if ( config?.mockApi?.services )
      {
          providers.push(
              provideHttpClient(withInterceptors([mockApiInterceptor])),
              {
                  provide   : APP_INITIALIZER,
                  deps      : [...config.mockApi.services],
                  useFactory: () => (): any => null,
                  multi     : true,
              },
          );
      }

    return providers;
  }

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideAnimationsAsync(),
    provideApi({
      mockApi: {
        delay   : 250,
        services: mockApiService,
      },
    }),
    provideIcons()
  ]
};
