import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReservacionService } from '../../../core/services/reservacion.service';
import { ReservacionDetail } from '../../../core/models/reservacion.model';

@Component({
  selector: 'app-reservacion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle de la Reservación</h2>
        <div>
          <button class="btn btn-action me-2" [routerLink]="['edit']">Editar</button>
          <button class="btn btn-secondary" routerLink="/reservaciones">Volver</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title mb-4">Información de la Reservación</h5>
              <dl class="row">
                <dt class="col-sm-4">Cliente:</dt>
                <dd class="col-sm-8">{{reservacion?.cliente_nombre}}</dd>

                <dt class="col-sm-4">Cancha:</dt>
                <dd class="col-sm-8">{{reservacion?.cancha_nombre}}</dd>

                <dt class="col-sm-4">Fecha:</dt>
                <dd class="col-sm-8">{{reservacion?.fecha | date:'shortDate'}}</dd>

                <dt class="col-sm-4">Hora:</dt>
                <dd class="col-sm-8">{{reservacion?.hora}}</dd>

                <dt class="col-sm-4">Estado:</dt>
                <dd class="col-sm-8">
                  <span class="badge" [ngClass]="{
                    'bg-success': reservacion?.estado === 'Confirmada' || reservacion?.estado === 'Pagada',
                    'bg-danger': reservacion?.estado === 'Cancelada'
                  }">
                    {{reservacion?.estado}}
                  </span>
                </dd>

                <dt class="col-sm-4">Monto Total:</dt>
                <dd class="col-sm-8">{{reservacion?.monto_total | currency}}</dd>

                <dt class="col-sm-4">Fecha Creación:</dt>
                <dd class="col-sm-8">{{reservacion?.fecha_creacion | date:'short'}}</dd>
              </dl>
            </div>

            <!-- Aquí podríamos agregar más información relacionada -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReservacionDetailComponent implements OnInit {
  reservacion?: ReservacionDetail;

  constructor(
    private reservacionService: ReservacionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.loadReservacion(id);
    }
  }

  loadReservacion(id: number): void {
    this.reservacionService.getReservacion(id).subscribe(
      (data) => {
        this.reservacion = data;
      },
      (error) => {
        console.error('Error cargando reservación:', error);
      }
    );
  }
} 