import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'create',
        canActivate: [authGuard],
        data: { roles: ['admin', 'supplier'] },
        loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'edit/:id',
        canActivate: [authGuard],
        data: { roles: ['admin', 'supplier'] },
        loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      }
    ]
  },
  {
    path: 'demand-forecast',
    canActivate: [authGuard],
    loadComponent: () => import('./features/forecasting/pages/demand-forecast/demand-forecast.component').then(m => m.DemandForecastComponent)
  },
  {
    path: 'pricing-optimization',
    canActivate: [authGuard],
    loadComponent: () => import('./features/pricing/pages/pricing-optimization/pricing-optimization.component').then(m => m.PricingOptimizationComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
