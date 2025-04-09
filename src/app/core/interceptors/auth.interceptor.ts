import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.error('Error al decodificar el token', e);
    return true; 
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getToken()).pipe(
    switchMap((authToken) => {
      if (authToken && !isTokenExpired(authToken)) {
        console.log('Token enviado en header:', authToken);

        const newRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        return next(newRequest);
      }

      console.warn('Token ausente o expirado, no se incluye Authorization');
      return next(req);
    })
  );
};
