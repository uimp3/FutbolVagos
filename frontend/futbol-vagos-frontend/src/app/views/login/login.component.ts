import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Fútbol Vagos</h2>
        <p class="subtitle">Inicia sesión para continuar</p>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button 
          class="login-button" 
          (click)="login()" 
          [disabled]="isLoading">
          <span *ngIf="!isLoading">Iniciar Sesión con Keycloak</span>
          <span *ngIf="isLoading">Cargando...</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 1rem;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h2 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }

    .login-button {
      width: 100%;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .login-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .login-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      background-color: #fff3f3;
      color: #dc3545;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border: 1px solid #dc3545;
    }
  `]
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async login(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login();
      // La redirección se maneja en el servicio de autenticación
    } catch (error: unknown) {
      console.error('Error en login:', error);
      this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
      this.isLoading = false;
    }
  }
}