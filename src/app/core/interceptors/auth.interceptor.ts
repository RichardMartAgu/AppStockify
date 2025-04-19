import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage/storage.service';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {

    return true; 
  }
}

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
