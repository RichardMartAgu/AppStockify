import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard/auth.guard.service';
import { LoginGuard } from './core/services/login.guard/login.guard.service';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [LoginGuard],
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/product/product.routes').then((m) => m.PRODUCT_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage),
    canActivate: [AuthGuard],
  },
];
