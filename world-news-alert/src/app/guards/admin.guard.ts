import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  console.warn(`[AdminGuard] Blocked unauthorized navigation attempt to ${state.url}`);

  // Redirect unauthorized users back to the user dashboard
  return router.createUrlTree(['/dashboard']);
};