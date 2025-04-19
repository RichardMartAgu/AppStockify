import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/guards/auth.guard/auth.guard.service';
import { LoginGuard } from './core/services/guards/login.guard/login.guard.service';

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
    path: 'warehouse',
    loadChildren: () =>
      import('./pages/warehouse/warehouse.routes').then((m) => m.WAREHOUSE_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard],
  },
];
