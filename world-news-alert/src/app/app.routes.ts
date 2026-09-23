import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component').then(
        m => m.UserDashboardComponent
      )
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];