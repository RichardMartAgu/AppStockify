import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage/storage.service';

// Helper function to check if a JWT token has expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

// Interceptor function to attach Authorization header if token is valid
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);

  return from(storageService.get<string>('token')).pipe(
    switchMap((authToken) => {
      if (authToken && !isTokenExpired(authToken)) {
        const newRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        return next(newRequest);
      }

      return next(req);
    })
  );
};
