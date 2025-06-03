import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../core/services/factura.service';
import { FacturaDetail } from '../../../core/models/factura.model';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Facturación</h2>
        <!-- Decidimos si agregamos un botón para crear factura aquí, o si se crea desde la reservación/otro lado -->
        <!-- <button class="btn btn-action" routerLink="new">Nueva Factura</button> -->
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar factura..." 
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
              <th>Reservación</th>
              <th>Cliente</th>
              <th>Fecha Emisión</th>
              <th>Subtotal</th>
              <th>Impuestos</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let factura of facturas">
              <td>{{factura.id}}</td>
              <td>{{factura.reservacion_detalle || factura.reservacion}}</td>
              <td>{{factura.cliente_nombre || factura.cliente}}</td>
              <td>{{factura.fecha_emision | date:'shortDate'}}</td>
              <td>{{factura.subtotal | currency}}</td>
              <td>{{factura.impuestos | currency}}</td>
              <td>{{factura.total | currency}}</td>
              <td>{{factura.metodo_pago}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-action" [routerLink]="[factura.id]">Ver</button>
                  <!-- Botón de editar si es necesario -->
                  <!-- <button class="btn btn-sm btn-action" [routerLink]="[factura.id, 'edit']">Editar</button> -->
                  <!-- Botón de eliminar si la lógica lo permite -->
                  <!-- <button class="btn btn-sm btn-danger" (click)="deleteFactura(factura.id!)">Eliminar</button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="facturas.length === 0" class="text-center py-4">
        <p class="text-muted">No hay facturas registradas</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }
  `]
})
export class FacturaListComponent implements OnInit {
  facturas: FacturaDetail[] = [];
  searchTerm: string = '';

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas(): void {
    this.facturaService.getFacturas().subscribe(
      (data) => {
        this.facturas = data;
      },\n      (error) => {
        console.error('Error cargando facturas:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.facturaService.searchFacturas(this.searchTerm).subscribe(
        (data) => {
          this.facturas = data;
        },
        (error) => {
          console.error('Error buscando facturas:', error);
        }
      );
    } else {
      this.loadFacturas();
    }
  }

  // Dependiendo de la lógica de negocio, puede que no se permita eliminar facturas
  // deleteFactura(id: number): void {
  //   if (confirm('¿Está seguro que desea eliminar esta factura?')) {
  //     this.facturaService.deleteFactura(id).subscribe(
  //       () => {
  //         this.loadFacturas();
  //       },
  //       (error) => {
  //         console.error('Error eliminando factura:', error);
  //       }
  //     );
  //   }
  // }
} 