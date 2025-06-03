import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle del Cliente</h2>
        <div>
          <button class="btn btn-action me-2" [routerLink]="['edit']">Editar</button>
          <button class="btn btn-secondary" routerLink="/clientes">Volver</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title mb-4">Información Personal</h5>
              <dl class="row">
                <dt class="col-sm-4">Nombre:</dt>
                <dd class="col-sm-8">{{cliente?.nombre}}</dd>

                <dt class="col-sm-4">Cédula:</dt>
                <dd class="col-sm-8">{{cliente?.cedula}}</dd>

                <dt class="col-sm-4">Teléfono:</dt>
                <dd class="col-sm-8">{{cliente?.telefono}}</dd>

                <dt class="col-sm-4">Email:</dt>
                <dd class="col-sm-8">{{cliente?.email || '-'}}</dd>

                <dt class="col-sm-4">Fecha Registro:</dt>
                <dd class="col-sm-8">{{cliente?.fecha_registro | date:'dd/MM/yyyy'}}</dd>
              </dl>
            </div>

            <!-- Aquí podríamos agregar más información relacionada con el cliente -->
            <!-- Por ejemplo, sus reservaciones, facturas, etc. -->
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClienteDetailComponent implements OnInit {
  cliente?: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCliente(id);
    }
  }

  loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe(
      (data) => {
        this.cliente = data;
      },
      (error) => {
        console.error('Error cargando cliente:', error);
      }
    );
  }
} 