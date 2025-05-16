import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { UtilsService } from '../services/utils/utils.service';

// Returns a human-readable error message based on the HTTP status code and request URL
function getErrorMessage(error: HttpErrorResponse): string {
  const url = error.url || '';

  switch (error.status) {
    case 0:
      return 'No se pudo conectar con el servidor';
    case 400:
      return 'Solicitud incorrecta';
    case 401:
      return 'Sesión expirada. Inicia sesión de nuevo';
    case 403:
      return 'No tienes permiso para realizar esta acción';
    case 404:
      if (url.includes('/login')) {
        return 'Usuario o contraseña incorrectos';
      }

      if (url.includes('/product')) {
        return 'Producto no encontrado';
      }
      return 'Recurso no encontrado';
    case 422:
      return 'Valor insertado inesperado';
    case 409:
      return 'Error de conflicto de datos'
    case 500:
      return 'Error interno del servidor';
    default:
      return error.error?.message || 'Ocurrió un error inesperado';
  }
}

// Global error interceptor
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const utilService = inject(UtilsService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = getErrorMessage(error);

      return from(
        (async () => {
          await utilService.presentToast(errorMessage, 'danger', 'alert-circle-outline');

          if (error.status === 401) {
            router.navigate(['/login']);
          }

          throw error;
        })()
      );
    })
  );
};
