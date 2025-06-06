import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../core/services/factura.service';
import { FacturaDetail } from '../../../core/models/factura.model';
import { ReservacionDetail } from '../../../core/models/reservacion.model';
import { Router } from '@angular/router';
import { ReservacionService } from '../../../core/services/reservacion.service';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Reservaciones Pendientes de Pago</h2>
        <!-- Puedes añadir un botón aquí si hay otra acción principal, si no, se puede omitir -->
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar reservación..."
              [(ngModel)]="searchReservacionTerm"
              (input)="onReservacionSearch()"
            >
            <button class="btn btn-outline-secondary" type="button" (click)="onReservacionSearch()">
              <i class="cil-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cancha</th>
              <th>Cliente</th>
              <th>Monto Total Reserva</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reservacion of reservacionesPendientes">
              <td>{{ reservacion.id }}</td>
              <td>{{ reservacion.fecha | date:'shortDate' }}</td>
              <td>{{ reservacion.hora }}</td>
              <td>{{ reservacion.cancha_nombre }}</td>
              <td>{{ reservacion.cliente_nombre }}</td>
              <td>{{ reservacion.monto_total | currency:'USD':'symbol':'1.2-2' }}</td>
              <td>
                <button class="btn btn-success btn-sm" (click)="pagarReservacion(reservacion.id!)">Pagar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="reservacionesPendientes.length === 0" class="text-center py-4">
        <p class="text-muted">No hay reservaciones pendientes de pago.</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }

    /* Estilos para botón Nueva Factura (verde) */
    .btn-add {
      background-color: rgb(65, 204, 89) !important; /* Verde */
      border-color: rgb(65, 204, 89) !important;
      color: #ffffff !important;
    }

    .btn-add:hover {
      background-color: rgb(40, 164, 60) !important; /* Verde más oscuro al pasar el mouse */
      border-color: rgb(40, 164, 60) !important;
    }

    /* Estilos para botón Ver (azul) */
    .btn-action {
      background-color: #0d6efd !important; /* Azul */
      border-color: #0d6efd !important;
      color: #ffffff !important;
    }

    .btn-action:hover {
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
    .btn-sm.btn-add,
    .btn-sm.btn-action,
    .btn-sm.btn-danger {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.2rem !important;
    }
  `]
})
export class FacturaListComponent implements OnInit {
  reservacionesPendientes: ReservacionDetail[] = [];
  searchReservacionTerm: string = '';

  constructor(private facturaService: FacturaService, private router: Router, private reservacionService: ReservacionService) {}

  ngOnInit(): void {
    this.loadReservacionesPendientes();
  }

  loadReservacionesPendientes(): void {
    this.facturaService.getReservacionesPendientes().subscribe(
      (data) => {
        this.reservacionesPendientes = data;
      },
      (error) => {
        console.error('Error cargando reservaciones pendientes:', error);
      }
    );
  }

  onReservacionSearch(): void {
    if (this.searchReservacionTerm.trim()) {
      this.facturaService.searchReservacionesPendientes(this.searchReservacionTerm).subscribe(
        (data) => {
          this.reservacionesPendientes = data;
        },
        (error) => {
          console.error('Error buscando reservaciones pendientes:', error);
        }
      );
    } else {
      this.loadReservacionesPendientes();
    }
  }

  pagarReservacion(id: number): void {
    if (confirm('¿Está seguro que desea marcar esta reservación como pagada y eliminarla de la lista de pendientes?')) {
      console.log('Simulando marcar como pagada y eliminar reservación ID:', id);
      this.reservacionService.deleteReservacion(id).subscribe(
        () => {
          console.log('Reservación eliminada con éxito.', id);
          this.loadReservacionesPendientes();
        },
        (error) => {
          console.error('Error al eliminar la reservación:', error);
        }
      );
    }
  }
} 