import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { combineLatest, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    authService.isAuthenticated$,
    authService.isVerifying$
  ]).pipe(
    take(1),
    map(([isAuthenticated, isVerifying]) => {
      const isLoginPage = state.url === '/login';

      if (isVerifying) {
        return false;
      }

      if (isLoginPage && isAuthenticated) {
        return router.parseUrl('/dashboard');
      }

      if (!isLoginPage && !isAuthenticated) {
        return router.parseUrl('/login?returnUrl=' + encodeURIComponent(state.url));
      }

      return true;
    })
  );
};
