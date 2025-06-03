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
        <button class="btn btn-action" routerLink="new">Nueva Reservación</button>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar reservación..." 
              [(ngModel)]="searchTerm"
              (keyup)="onSearch()"
            >
            <button class="btn btn-outline-secondary" type="button" (click)="onSearch()">
              <i class="cil-search"></i>
            </button>
          </div>
        </div>
      </div>

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
            <tr *ngFor="let reservacion of reservaciones">
              <td>{{reservacion.id}}</td>
              <td>{{reservacion.cliente_nombre}}</td>
              <td>{{reservacion.cancha_nombre}}</td>
              <td>{{reservacion.fecha | date:'shortDate'}}</td>
              <td>{{reservacion.hora}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': reservacion.estado === 'Confirmada' || reservacion.estado === 'Pagada',
                  'bg-danger': reservacion.estado === 'Cancelada'
                }">
                  {{reservacion.estado}}
                </span>
              </td>
              <td>{{reservacion.monto_total | currency}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-action" [routerLink]="[reservacion.id]">Ver</button>
                  <button class="btn btn-sm btn-action" [routerLink]="[reservacion.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteReservacion(reservacion.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="reservaciones.length === 0" class="text-center py-4">
        <p class="text-muted">No hay reservaciones registradas</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }
  `]
})
export class ReservacionListComponent implements OnInit {
  reservaciones: ReservacionDetail[] = [];
  searchTerm: string = '';

  constructor(private reservacionService: ReservacionService) {}

  ngOnInit(): void {
    this.loadReservaciones();
  }

  loadReservaciones(): void {
    this.reservacionService.getReservaciones().subscribe(
      (data) => {
        this.reservaciones = data;
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
        },
        (error) => {
          console.error('Error buscando reservaciones:', error);
        }
      );
    } else {
      this.loadReservaciones();
    }
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