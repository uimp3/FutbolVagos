import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrabajadorService } from '../../../core/services/trabajador.service';
import { Trabajador } from '../../../core/models/trabajador.model';

@Component({
  selector: 'app-trabajador-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Trabajadores</h2>
        <button class="btn btn-success" routerLink="new">Nuevo Trabajador</button>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por cédula..." 
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
            >
            <button class="btn btn-primary" type="button" (click)="onSearch()">
              <i class="bi bi-search"></i> Buscar
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Salario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let trabajador of trabajadores">
              <td>{{trabajador.id}}</td>
              <td>{{trabajador.nombre}}</td>
              <td>{{trabajador.cedula}}</td>
              <td>{{trabajador.telefono || '-'}}</td>
              <td>{{trabajador.email || '-'}}</td>
              <td>{{trabajador.cargo}}</td>
              <td>{{trabajador.salario | currency}}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-primary" [routerLink]="[trabajador.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteTrabajador(trabajador.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="trabajadores.length === 0" class="text-center py-4">
        <p class="text-muted">No hay trabajadores registrados</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }

    /* Estilos para botón Nuevo Trabajador (verde) */
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
export class TrabajadorListComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  searchTerm: string = '';

  constructor(private trabajadorService: TrabajadorService) {}

  ngOnInit(): void {
    this.loadTrabajadores();
  }

  loadTrabajadores(): void {
    this.trabajadorService.getTrabajadores().subscribe(
      (data) => {
        this.trabajadores = data;
      },
      (error) => {
        console.error('Error cargando trabajadores:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.trabajadorService.searchTrabajadores(this.searchTerm).subscribe(
        (data) => {
          this.trabajadores = data;
        },
        (error) => {
          console.error('Error buscando trabajadores:', error);
        }
      );
    } else {
      this.loadTrabajadores();
    }
  }

  deleteTrabajador(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este trabajador?')) {
      this.trabajadorService.deleteTrabajador(id).subscribe(
        () => {
          this.loadTrabajadores();
        },
        (error) => {
          console.error('Error eliminando trabajador:', error);
        }
      );
    }
  }
} 