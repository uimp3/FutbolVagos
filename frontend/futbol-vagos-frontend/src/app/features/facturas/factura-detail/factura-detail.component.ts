import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FacturaService } from '../../../core/services/factura.service';
import { FacturaDetail } from '../../../core/models/factura.model';

@Component({
  selector: 'app-factura-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle de la Factura</h2>
        <div>
          <button class="btn btn-secondary" routerLink="/factura">Volver</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title mb-4">Información de la Factura</h5>
              <dl class="row">
                <dt class="col-sm-4">ID:</dt>
                <dd class="col-sm-8">{{factura?.id}}</dd>

                <dt class="col-sm-4">Cliente:</dt>
                <dd class="col-sm-8">{{factura?.cliente_nombre}}</dd>

                <dt class="col-sm-4">Reservación:</dt>
                <dd class="col-sm-8">{{factura?.reservacion_detalle}}</dd>

                <dt class="col-sm-4">Fecha Emisión:</dt>
                <dd class="col-sm-8">{{factura?.fecha_emision | date:'short'}}</dd>

                <dt class="col-sm-4">Subtotal:</dt>
                <dd class="col-sm-8">{{factura?.subtotal | currency}}</dd>

                <dt class="col-sm-4">Impuestos:</dt>
                <dd class="col-sm-8">{{factura?.impuestos | currency}}</dd>

                <dt class="col-sm-4">Total:</dt>
                <dd class="col-sm-8">{{factura?.total | currency}}</dd>

                <dt class="col-sm-4">Método de Pago:</dt>
                <dd class="col-sm-8">{{factura?.metodo_pago}}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: none;
    }
    .card-body {
      padding: 2rem;
    }
    dt {
      font-weight: 600;
      color: #6c757d;
    }
  `]
})
export class FacturaDetailComponent implements OnInit {
  factura?: FacturaDetail;

  constructor(
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.loadFactura(id);
    }
  }

  loadFactura(id: number): void {
    this.facturaService.getFactura(id).subscribe(
      (data) => {
        this.factura = data;
      },
      (error) => {
        console.error('Error cargando factura:', error);
      }
    );
  }
} 