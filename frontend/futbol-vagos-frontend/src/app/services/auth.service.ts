import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthService: Inicializando servicio');
    // Verificar si hay un token al iniciar el servicio
    const token = localStorage.getItem('access_token');
    console.log('AuthService: Token encontrado:', !!token);
    if (token) {
      this.verifyToken(token);
    }
  }

  private verifyToken(token: string) {
    console.log('AuthService: Verificando token');
    this.http.get('http://localhost:8000/api/futbolvagos/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        console.log('AuthService: Token verificado exitosamente');
        this.isAuthenticatedSubject.next(true);
      },
      error: (error) => {
        console.error('AuthService: Error verificando token:', error);
        this.logout();
      }
    });
  }

  login(code: string): Observable<any> {
    console.log('AuthService: Iniciando proceso de login con código');
    const tokenUrl = 'http://localhost:8080/realms/futbolvagos/protocol/openid-connect/token';
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', 'django-backend');
    body.set('code', code);
    
    // URL de redirección exacta
    const redirectUri = 'http://localhost:4200/login';
    console.log('AuthService: URL de redirección exacta:', redirectUri);
    body.set('redirect_uri', redirectUri);
    
    // Obtener y usar el code_verifier almacenado
    const codeVerifier = localStorage.getItem('code_verifier');
    console.log('AuthService: Code verifier encontrado:', !!codeVerifier);
    if (codeVerifier) {
      body.set('code_verifier', codeVerifier);
      localStorage.removeItem('code_verifier'); // Limpiar después de usar
    }

    console.log('AuthService: Enviando solicitud de token a:', tokenUrl);
    console.log('AuthService: Datos de la solicitud:', body.toString());
    
    return this.http.post(tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }).pipe(
      tap({
        next: (response: any) => {
          console.log('AuthService: Login exitoso, guardando tokens');
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            if (response.refresh_token) {
              localStorage.setItem('refresh_token', response.refresh_token);
            }
            this.isAuthenticatedSubject.next(true);
            // Verificar el token inmediatamente después de guardarlo
            this.verifyToken(response.access_token);
          } else {
            console.error('AuthService: No se recibió access_token en la respuesta');
            this.logout();
          }
        },
        error: (error) => {
          console.error('AuthService: Error en el login:', error);
          if (error.error) {
            console.error('AuthService: Detalles del error:', error.error);
          }
          this.logout();
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const isAuth = this.isAuthenticatedSubject.value;
    console.log('AuthService: Verificando autenticación:', isAuth);
    return isAuth;
  }
} 