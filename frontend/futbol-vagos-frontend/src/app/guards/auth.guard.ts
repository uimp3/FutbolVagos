import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Verificando ruta:', state.url);
  console.log('AuthGuard: Estado de autenticación:', authService.isAuthenticated());

  // Si la ruta es /login y el usuario está autenticado, redirigir al dashboard
  if (state.url === '/login' && authService.isAuthenticated()) {
    console.log('AuthGuard: Usuario autenticado intentando acceder a login, redirigiendo a dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  // Si el usuario no está autenticado y no está en /login, redirigir a login
  if (!authService.isAuthenticated() && state.url !== '/login') {
    console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('AuthGuard: Acceso permitido a la ruta:', state.url);
  return true;
}; 