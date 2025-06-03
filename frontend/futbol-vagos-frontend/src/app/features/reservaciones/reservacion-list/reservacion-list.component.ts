import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservacionService } from '../../../core/services/reservacion.service';
import { ReservacionDetail } from '../../../core/models/reservacion.model';

@Component({
  selector: 'app-reservacion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Reservaciones</h2>
        <button class="btn btn-success" routerLink="new">Nueva Reservación</button>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar reservación..." 
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
            >
            <button class="btn btn-primary" type="button" (click)="onSearch()">
              <i class="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </div>

      <h3>Reservaciones Confirmadas</h3>
      <div class="table-responsive mb-5">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Cancha</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Monto Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reservacion of reservacionesConfirmadas">
              <td>{{reservacion.id}}</td>
              <td>{{reservacion.cliente_nombre}}</td>
              <td>{{reservacion.cancha_nombre}}</td>
              <td>{{reservacion.fecha | date:'shortDate'}}</td>
              <td>{{reservacion.hora}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': reservacion.estado === 'Confirmada'
                }">
                  {{reservacion.estado}}
                </span>
              </td>
              <td>{{reservacion.monto_total | currency}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="[reservacion.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteReservacion(reservacion.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="reservacionesConfirmadas.length === 0" class="text-center py-4">
        <p class="text-muted">No hay reservaciones confirmadas.</p>
      </div>

      <h3>Reservaciones Canceladas</h3>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Cancha</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Monto Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reservacion of reservacionesCanceladas">
              <td>{{reservacion.id}}</td>
              <td>{{reservacion.cliente_nombre}}</td>
              <td>{{reservacion.cancha_nombre}}</td>
              <td>{{reservacion.fecha | date:'shortDate'}}</td>
              <td>{{reservacion.hora}}</td>
              <td>
                <span class="badge bg-danger">
                  {{reservacion.estado}}
                </span>
              </td>
              <td>{{reservacion.monto_total | currency}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-danger" (click)="deleteReservacion(reservacion.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="reservacionesCanceladas.length === 0" class="text-center py-4">
        <p class="text-muted">No hay reservaciones canceladas.</p>
      </div>

    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }

    /* Estilos para botón Nueva Reservación (verde) */
    .btn-success {
      background-color:rgb(65, 204, 89) !important; /* Verde */
      border-color:rgb(65, 204, 89) !important;
      color: #ffffff !important;
    }

    .btn-success:hover {
      background-color: rgb(40, 164, 60) !important; /* Verde más oscuro al pasar el mouse */
      border-color: rgb(40, 164, 60) !important;
    }

    /* Estilos para botones Editar (azul) */
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
export class ReservacionListComponent implements OnInit {
  reservaciones: ReservacionDetail[] = [];
  reservacionesConfirmadas: ReservacionDetail[] = [];
  reservacionesCanceladas: ReservacionDetail[] = [];
  searchTerm: string = '';

  constructor(private reservacionService: ReservacionService) {}

  ngOnInit(): void {
    this.loadReservaciones();
  }

  loadReservaciones(): void {
    this.reservacionService.getReservaciones().subscribe(
      (data) => {
        this.reservaciones = data;
        this.filterReservaciones();
      },
      (error) => {
        console.error('Error cargando reservaciones:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.reservacionService.searchReservaciones(this.searchTerm).subscribe(
        (data) => {
          this.reservaciones = data;
          this.filterReservaciones();
        },
        (error) => {
          console.error('Error buscando reservaciones:', error);
        }
      );
    } else {
      this.loadReservaciones();
    }
  }

  filterReservaciones(): void {
    this.reservacionesConfirmadas = this.reservaciones.filter(res => res.estado === 'Confirmada' || res.estado === 'Pagada');
    this.reservacionesCanceladas = this.reservaciones.filter(res => res.estado === 'Cancelada');
  }

  deleteReservacion(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta reservación?')) {
      this.reservacionService.deleteReservacion(id).subscribe(
        () => {
          this.loadReservaciones();
        },
        (error) => {
          console.error('Error eliminando reservación:', error);
        }
      );
    }
  }
} 