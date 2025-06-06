import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CanchaService } from '../../../core/services/cancha.service';
import { CanchaWithSede } from '../../../core/models/cancha.model';

@Component({
  selector: 'app-cancha-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle de la Cancha</h2>
        <div>
          <button class="btn btn-action me-2" [routerLink]="['edit']">Editar</button>
          <button class="btn btn-secondary" routerLink="/canchas">Volver</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title mb-4">Información de la Cancha</h5>
              <dl class="row">
                <dt class="col-sm-4">Sede:</dt>
                <dd class="col-sm-8">{{cancha?.sede_nombre}}</dd>

                <dt class="col-sm-4">Precio por Hora:</dt>
                <dd class="col-sm-8">{{cancha?.precio_hora | currency}}</dd>

                <dt class="col-sm-4">Capacidad:</dt>
                <dd class="col-sm-8">{{cancha?.capacidad_jugadores}} jugadores</dd>

                <dt class="col-sm-4">Estado:</dt>
                <dd class="col-sm-8">
                  <span class="badge" [ngClass]="{
                    'bg-success': cancha?.estado === 'Disponible',
                    'bg-warning': cancha?.estado === 'En mantenimiento'
                  }">
                    {{cancha?.estado}}
                  </span>
                </dd>
              </dl>
            </div>

            <!-- Aquí podríamos agregar más información relacionada con la cancha -->
            <!-- Por ejemplo, sus reservaciones, horarios, etc. -->
          </div>
        </div>
      </div>
    </div>
  `
})
export class CanchaDetailComponent implements OnInit {
  cancha?: CanchaWithSede;

  constructor(
    private canchaService: CanchaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCancha(id);
    }
  }

  loadCancha(id: number): void {
    this.canchaService.getCancha(id).subscribe(
      (data) => {
        this.cancha = data;
      },
      (error) => {
        console.error('Error cargando cancha:', error);
      }
    );
  }
} 