import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SedeService } from '../../../core/services/sede.service';
import { Sede } from '../../../core/models/sede.model';

// Componente para mostrar la lista de sedes
@Component({
  selector: 'app-sede-list',
  standalone: true, // Componente independiente
  imports: [CommonModule, RouterModule], // Módulos necesarios
  template: `
    <div class="container-lg px-4 py-5">
      <!-- Encabezado con título y botón para crear nueva sede -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Sedes</h2>
        <button class="btn btn-add" routerLink="new">Nueva Sede</button>
      </div>

      <!-- Tabla responsive para mostrar las sedes -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Barrio</th>
              <th>Ciudad</th>
              <th>Horario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iteración sobre el array de sedes -->
            <tr *ngFor="let sede of sedes">
              <td>{{sede.id}}</td>
              <td>{{sede.nombre}}</td>
              <td>{{sede.direccion}}</td>
              <td>{{sede.barrio || '-'}}</td>
              <td>{{sede.ciudad}}</td>
              <td>{{sede.horario_apertura}} - {{sede.horario_cierre}}</td>
              <td>
                <!-- Botones de acción para cada sede -->
                <div class="btn-group">
                  <button class="btn btn-sm btn-edit" [routerLink]="[sede.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteSede(sede.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }

    /* Estilos para botón Nueva Sede (verde) */
    .btn-add {
      background-color:rgb(65, 204, 89) !important; /* Verde */
      border-color:rgb(0, 0, 0) !important;
      color: #ffffff !important;
    }

    .btn-add:hover {
      background-color: rgb(65, 204, 89) !important; /* Verde más oscuro al pasar el mouse */
      border-color: rgb(65, 204, 89) !important;
    }

    /* Estilos para botón Editar (azul) */
    .btn-edit {
      background-color: #0d6efd !important; /* Azul */
      border-color: #0d6efd !important;
      color: #ffffff !important;
    }

    .btn-edit:hover {
      background-color: #0b5ed7 !important; /* Azul más oscuro al pasar el mouse */
      border-color: #0b5ed7 !important;
    }

    /* Estilos para botón Ver (verde) - si btn-action no tiene color */
    .btn-action {
       background-color: rgb(65, 204, 89) !important; /* Verde */
       border-color: rgb(65, 204, 89) !important;
       color: #ffffff !important;
    }

    .btn-action:hover {
       background-color: rgb(65, 204, 89) !important; /* Verde más oscuro */
       border-color: rgb(65, 204, 89) !important;
    }

    /* Asegurar que los estilos de tamaño pequeño se apliquen */
    .btn-sm.btn-add,
    .btn-sm.btn-edit,
    .btn-sm.btn-action {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.2rem !important;
    }

    /* Estilos para botón Eliminar (rojo) */
    .btn-danger {
        background-color: #e55353 !important; /* Rojo */
        border-color: #e55353 !important;
        color: #ffffff !important; /* Texto blanco */
    }

    .btn-danger:hover {
      background-color: #e55353 !important; /* Rojo más oscuro al pasar el mouse */
      border-color: #e55353 !important;
    }
  `]
})
export class SedeListComponent implements OnInit {
  // Array para almacenar las sedes
  sedes: Sede[] = [];

  constructor(private sedeService: SedeService) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadSedes();
  }

  // Carga la lista de sedes desde el servidor
  loadSedes(): void {
    this.sedeService.getSedes().subscribe(
      (data) => {
        this.sedes = data;
      },
      (error) => {
        console.error('Error cargando sedes:', error);
        // Aquí podrías agregar una notificación de error
      }
    );
  }

  // Elimina una sede específica
  deleteSede(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta sede?')) {
      this.sedeService.deleteSede(id).subscribe(
        () => {
          // Recarga la lista después de eliminar
          this.loadSedes();
          // Aquí podrías agregar una notificación de éxito
        },
        (error) => {
          console.error('Error eliminando sede:', error);
          // Aquí podrías agregar una notificación de error
        }
      );
    }
  }
} 