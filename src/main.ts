import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptors/auth.interceptor'
import { Storage } from '@ionic/storage-angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { errorInterceptor} from './app/core/interceptors/error.interceptor';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideCharts(withDefaultRegisterables()),
    Storage,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
});

defineCustomElements(window);

