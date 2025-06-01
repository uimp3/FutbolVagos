import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isVerifyingSubject = new BehaviorSubject<boolean>(false);
  public isVerifying$ = this.isVerifyingSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isVerifying = false;

  constructor(private http: HttpClient) {
    console.log('AuthService: Inicializando servicio');
    const token = this.getToken();
    if (token && this.isValidToken(token)) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (e) {
      console.warn('AuthService: Token inválido:', e);
      return false;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isValidToken(token) : false;
  }

  verifyToken(token: string): Observable<any> {
    if (this.isVerifying) {
      console.log('AuthService: Ya hay una verificación en curso');
      return throwError(() => new Error('Ya hay una verificación en curso'));
    }

    this.isVerifying = true;
    this.isVerifyingSubject.next(true);
    console.log('AuthService: Verificando token');

    return this.http.get(`${environment.apiUrl}/futbolvagos/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        console.log('AuthService: Token verificado exitosamente');
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('AuthService: Error verificando token:', error);
        this.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isVerifying = false;
        this.isVerifyingSubject.next(false);
      })
    );
  }

  login(code: string): Observable<void> {
    console.log('AuthService: Iniciando proceso de login con código');
    const { redirectUri, clientId, clientSecret, url, realm } = environment.keycloak;
    const codeVerifier = localStorage.getItem('code_verifier');

    if (!codeVerifier) {
      console.error('AuthService: No se encontró el code_verifier');
      return throwError(() => new Error('No se encontró el code_verifier'));
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    });

    return this.http.post<any>(`${url}/realms/${realm}/protocol/openid-connect/token`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        console.log('AuthService: Respuesta de token recibida');
        if (!response.access_token) {
          throw new Error('No se recibió access_token en la respuesta');
        }
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        this.isAuthenticatedSubject.next(true);
        localStorage.removeItem('code_verifier');
        console.log('AuthService: Token almacenado y estado actualizado');
      }),
      catchError(error => {
        console.error('AuthService: Error en el login:', error);
        localStorage.removeItem('code_verifier');
        return throwError(() => error);
      }),
      // El observable emite void (no valores)
      tap(() => {}),
    );
  }

  logout(): void {
    console.log('AuthService: Logout ejecutado');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
    location.href = environment.keycloak.logoutUrl;
  }
}
