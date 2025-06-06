import { Routes } from '@angular/router';
import { AuthGuard } from './core/services/guards/auth.guard/auth.guard.service';
import { LoginGuard } from './core/services/guards/login.guard/login.guard.service';
import { WarehaouseGuard } from './core/services/guards/warehouse.guard/warehaouse.guard.service';
import { PaymentGuard } from './core/services/guards/payment.guard/payment.service';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [LoginGuard],
  },
  {
    path: 'warehouse',
    loadChildren: () =>
      import('./pages/warehouse/warehouse.routes').then(
        (m) => m.WAREHOUSE_ROUTES
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/product/product.routes').then((m) => m.PRODUCT_ROUTES),
    canActivate: [PaymentGuard, AuthGuard, WarehaouseGuard],
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./pages/client/client.routes').then((m) => m.CLIENT_ROUTES),
    canActivate: [PaymentGuard,AuthGuard, WarehaouseGuard],
  },
  {
    path: 'transaction',
    loadChildren: () =>
      import('./pages/transaction/transaction.routes').then(
        (m) => m.TRANSACTION_ROUTES
      ),
    canActivate: [PaymentGuard,AuthGuard, WarehaouseGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard, WarehaouseGuard],
  },
  {
    path: 'transaction',
    loadChildren: () =>
      import('./pages/transaction/transaction.routes').then(
        (m) => m.TRANSACTION_ROUTES
      ),
    canActivate: [PaymentGuard,AuthGuard, WarehaouseGuard],
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./pages/payment/payment.routes').then(
        (m) => m.PAYMENT_ROUTES
      ),
      
  },

];
