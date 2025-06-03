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
        <button class="btn btn-action" routerLink="new">Nueva Sede</button>
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
                  <button class="btn btn-sm btn-action" [routerLink]="[sede.id]">Ver</button>
                  <button class="btn btn-sm btn-action" [routerLink]="[sede.id, 'edit']">Editar</button>
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