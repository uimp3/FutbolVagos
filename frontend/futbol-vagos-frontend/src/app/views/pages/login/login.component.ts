import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
  TextColorDirective, CardComponent, CardBodyComponent,
  FormDirective, ButtonDirective
} from '@coreui/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
    TextColorDirective, CardComponent, CardBodyComponent,
    FormDirective, ButtonDirective, NgStyle, FormsModule, RouterModule
  ]
})
export class LoginComponent implements OnInit {
  private isProcessingLogin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
  
    if (code) {
      this.handleLogin(code, state);
      return;
    }
  
    const token = this.authService.getToken();
    if (token && this.authService.isValidToken(token)) {
      this.authService.verifyToken(token).subscribe({
        next: () => {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        },
        error: () => {
          this.authService.logout();
        }
      });
    } else {
      this.authService.logout();
    }
  }
  
  private handleLogin(code: string, state: string | null) {
    this.authService.login(code).subscribe({
      next: () => {
        let returnUrl = '/dashboard';
        if (state) {
          try {
            const stateData = JSON.parse(atob(state));
            returnUrl = stateData.returnUrl || '/dashboard';
          } catch (e) {
            console.error('LoginComponent: Error decodificando state:', e);
          }
        }
        history.replaceState({}, '', this.router.url.split('?')[0]);
        this.router.navigate([returnUrl], { replaceUrl: true });
      },
      error: (error) => {
        console.error('LoginComponent: Error en el login:', error);
        this.authService.logout();
      }
    });
  }
  
  

  async redirectToKeycloak() {
    if (this.isProcessingLogin) return;

    console.log('LoginComponent: Redirigiendo a Keycloak');
    const { url, realm, clientId, redirectUri } = environment.keycloak;
    const codeChallenge = await this.generateCodeChallenge();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid',
      state: btoa(JSON.stringify({ returnUrl })),
      response_mode: 'query',
      nonce: crypto.randomUUID(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    const keycloakAuthUrl = `${url}/realms/${realm}/protocol/openid-connect/auth`;
    window.location.replace(`${keycloakAuthUrl}?${params.toString()}`);
  }

  private async generateCodeChallenge(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('code_verifier', codeVerifier);
    return await this.sha256(codeVerifier);
  }

  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    return hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async login() {
    await this.redirectToKeycloak();
  }
}
