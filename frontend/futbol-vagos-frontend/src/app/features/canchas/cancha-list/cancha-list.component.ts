import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanchaService } from '../../../core/services/cancha.service';
import { CanchaWithSede } from '../../../core/models/cancha.model';

@Component({
  selector: 'app-cancha-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <!-- Encabezado con título y botón para crear nueva cancha -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Canchas</h2>
        <button class="btn btn-success" routerLink="new">Nueva Cancha</button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por sede" 
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
            >
            <button class="btn btn-primary" type="button" (click)="onSearch()">
              <i class="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla responsive para mostrar las canchas -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sede</th>
              <th>Precio/Hora</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cancha of canchas">
              <td>{{cancha.id}}</td>
              <td>{{cancha.sede_nombre}}</td>
              <td>{{cancha.precio_hora | currency}}</td>
              <td>{{cancha.capacidad_jugadores}} jugadores</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': cancha.estado === 'Disponible',
                  'bg-warning': cancha.estado === 'En mantenimiento'
                }">
                  {{cancha.estado}}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="[cancha.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteCancha(cancha.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay canchas -->
      <div *ngIf="canchas.length === 0" class="text-center py-4">
        <p class="text-muted">No hay canchas registradas</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }
    
    /* Estilos para botón Nueva Cancha (verde) */
    .btn-success {
      background-color:rgb(65, 204, 89) !important; /* Verde */
      border-color:rgb(65, 204, 89) !important;
      color: #ffffff !important;
    }

    .btn-success:hover {
      background-color: rgb(40, 164, 60) !important; /* Verde más oscuro al pasar el mouse */
      border-color: rgb(40, 164, 60) !important;
    }

    /* Estilos para botones Ver y Editar (azul) */
    .btn-primary {
      background-color: #0d6efd !important; /* Azul */
      border-color: #0d6efd !important;
      color: #ffffff !important;
    }

    .btn-primary:hover {
      background-color: #0b5ed7 !important; /* Azul más oscuro al pasar el mouse */
      border-color: #0b5ed7 !important;
    }

    /* Estilos para botón Eliminar (rojo) */
    .btn-danger {
        background-color: #e55353 !important; /* Rojo */
        border-color: #e55353 !important;
        color: #ffffff !important;
    }

    .btn-danger:hover {
        background-color: #d32f2f !important; /* Rojo más oscuro */
        border-color: #d32f2f !important;
    }

    /* Asegurar que los estilos de tamaño pequeño se apliquen */
    .btn-sm.btn-success,
    .btn-sm.btn-primary,
    .btn-sm.btn-danger {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.2rem !important;
    }
  `]
})
export class CanchaListComponent implements OnInit {
  canchas: CanchaWithSede[] = [];
  searchTerm: string = '';

  constructor(private canchaService: CanchaService) {}

  ngOnInit(): void {
    this.loadCanchas();
  }

  loadCanchas(): void {
    this.canchaService.getCanchas().subscribe(
      (data) => {
        this.canchas = data;
      },
      (error) => {
        console.error('Error cargando canchas:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      console.log('Buscando:', this.searchTerm); // Para depuración
      this.canchaService.searchCanchas(this.searchTerm).subscribe(
        (data) => {
          console.log('Resultados:', data); // Para depuración
          this.canchas = data;
        },
        (error) => {
          console.error('Error buscando canchas:', error);
          this.loadCanchas(); // Recargar todas las canchas en caso de error
        }
      );
    } else {
      this.loadCanchas();
    }
  }

  deleteCancha(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta cancha?')) {
      this.canchaService.deleteCancha(id).subscribe(
        () => {
          this.loadCanchas();
        },
        (error) => {
          console.error('Error eliminando cancha:', error);
        }
      );
    }
  }
} 