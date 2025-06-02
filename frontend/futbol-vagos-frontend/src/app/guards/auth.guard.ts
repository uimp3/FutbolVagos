import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Temporalmente permitimos acceso a todas las rutas
  console.log('AuthGuard: Acceso permitido a:', state.url);
  return true;
};
