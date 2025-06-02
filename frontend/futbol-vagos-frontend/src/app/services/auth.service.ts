import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak.KeycloakInstance;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isVerifyingSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isVerifying$ = this.isVerifyingSubject.asObservable();

  constructor(private router: Router) {
    this.keycloak = new (Keycloak as any)({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });

    // Inicializar Keycloak al crear el servicio
    this.initKeycloak();
  }

  private async initKeycloak(): Promise<void> {
    try {
      // Verificar si hay un código de autorización en la URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const code = params.get('code');
      const state = params.get('state');
      const sessionState = params.get('session_state');

      if (code) {
        console.log('Código de autorización recibido, procesando...');
        // Inicializar Keycloak con el código
        const initResult = await this.keycloak.init({
          onLoad: 'check-sso',
          checkLoginIframe: false
        });

        if (initResult) {
          console.log('Autenticación exitosa');
          this.isAuthenticatedSubject.next(true);
          // Limpiar la URL
          window.history.replaceState({}, document.title, window.location.pathname);
          // Redirigir al dashboard
          await this.router.navigate(['/dashboard']);
        } else {
          console.log('No autenticado');
          this.isAuthenticatedSubject.next(false);
          await this.router.navigate(['/dashboard']);
        }
      } else {
        // Inicialización normal sin código
        const initResult = await this.keycloak.init({
          onLoad: 'check-sso',
          checkLoginIframe: false
        });
        this.isAuthenticatedSubject.next(!!initResult);
      }
    } catch (error) {
      console.error('Error al inicializar Keycloak:', error);
      this.isAuthenticatedSubject.next(false);
      await this.router.navigate(['/dashboard']);
    }
  }

  async login(): Promise<void> {
    try {
      console.log('Iniciando login...');
      await this.keycloak.login({
        redirectUri: window.location.origin + '/login'
      });
    } catch (error) {
      console.error('Error en login:', error);
      this.isAuthenticatedSubject.next(false);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin + '/login'
      });
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Método para verificar si la URL actual es la de login
  isLoginPage(): boolean {
    return window.location.pathname === '/login';
  }
}

