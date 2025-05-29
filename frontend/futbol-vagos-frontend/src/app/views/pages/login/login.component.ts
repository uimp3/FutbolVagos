import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, ButtonDirective, NgStyle, FormsModule]
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('LoginComponent: ngOnInit iniciado');
    // Verificar si hay un código de autorización en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const code = urlParams.get('code') || hashParams.get('code');
    console.log('LoginComponent: Código de autorización (query):', urlParams.get('code'));
    console.log('LoginComponent: Código de autorización (hash):', hashParams.get('code'));
    console.log('LoginComponent: URL completa:', window.location.href);
    
    if (code) {
      console.log('LoginComponent: Iniciando proceso de login con código');
      // Si hay un código, intercambiarlo por un token
      this.authService.login(code).subscribe({
        next: (response) => {
          console.log('LoginComponent: Login exitoso, redirigiendo al dashboard');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('LoginComponent: Error en el login:', error);
          this.redirectToKeycloak();
        }
      });
    } else if (this.authService.isAuthenticated()) {
      console.log('LoginComponent: Usuario ya autenticado, redirigiendo al dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('LoginComponent: Usuario no autenticado y sin código');
    }
  }

  async redirectToKeycloak() {
    console.log('LoginComponent: Redirigiendo a Keycloak');
    const keycloakUrl = 'http://localhost:8080/realms/futbolvagos/protocol/openid-connect/auth';
    const codeChallenge = await this.generateCodeChallenge();
    
    // URL de redirección exacta
    const redirectUri = 'http://localhost:4200/login';
    console.log('LoginComponent: URL de redirección exacta:', redirectUri);
    
    const params = new URLSearchParams({
      client_id: 'django-backend',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid',
      state: crypto.randomUUID(),
      response_mode: 'fragment',  // Cambiado a fragment para mejor compatibilidad
      nonce: crypto.randomUUID(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    const fullUrl = `${keycloakUrl}?${params.toString()}`;
    console.log('LoginComponent: URL completa de Keycloak:', fullUrl);
    window.location.href = fullUrl;
  }

  private async generateCodeChallenge(): Promise<string> {
    // Generar un code_verifier aleatorio
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Almacenar el code_verifier para usarlo después
    localStorage.setItem('code_verifier', codeVerifier);
    
    // Calcular el code_challenge usando SHA-256
    return await this.sha256(codeVerifier);
  }

  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(hashHex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async login() {
    await this.redirectToKeycloak();
  }
}
