import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <!-- Encabezado con título y botón para crear nuevo cliente -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Clientes</h2>
        <button class="btn btn-success" routerLink="new">Nuevo Cliente</button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar cliente..." 
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
            >
            <button class="btn btn-primary" type="button" (click)="onSearch()">
              <i class="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla responsive para mostrar los clientes -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes">
              <td>{{cliente.id}}</td>
              <td>{{cliente.nombre}}</td>
              <td>{{cliente.cedula}}</td>
              <td>{{cliente.telefono}}</td>
              <td>{{cliente.email || '-'}}</td>
              <td>{{cliente.fecha_registro | date:'dd/MM/yyyy'}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="[cliente.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteCliente(cliente.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay clientes -->
      <div *ngIf="clientes.length === 0" class="text-center py-4">
        <p class="text-muted">No hay clientes registrados</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }

    /* Estilos para botón Nuevo Cliente (verde) */
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
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  searchTerm: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
      },
      (error) => {
        console.error('Error cargando clientes:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.clienteService.searchClientes(this.searchTerm).subscribe(
        (data) => {
          this.clientes = data;
        },
        (error) => {
          console.error('Error buscando clientes:', error);
        }
      );
    } else {
      this.loadClientes();
    }
  }

  deleteCliente(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe(
        () => {
          this.loadClientes();
        },
        (error) => {
          console.error('Error eliminando cliente:', error);
        }
      );
    }
  }
} 