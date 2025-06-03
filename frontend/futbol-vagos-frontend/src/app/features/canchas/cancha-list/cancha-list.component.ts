import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanchaService } from '../../../core/services/cancha.service';
import { CanchaWithSede } from '../../../core/models/cancha.model';

@Component({
  selector: 'app-cancha-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <!-- Encabezado con título y botón para crear nueva cancha -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Canchas</h2>
        <button class="btn btn-action" routerLink="new">Nueva Cancha</button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar cancha..." 
              [(ngModel)]="searchTerm"
              (keyup)="onSearch()"
            >
            <button class="btn btn-outline-secondary" type="button" (click)="onSearch()">
              <i class="cil-search"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla responsive para mostrar las canchas -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sede</th>
              <th>Precio/Hora</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cancha of canchas">
              <td>{{cancha.id}}</td>
              <td>{{cancha.sede_nombre}}</td>
              <td>{{cancha.precio_hora | currency}}</td>
              <td>{{cancha.capacidad_jugadores}} jugadores</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': cancha.estado === 'Disponible',
                  'bg-warning': cancha.estado === 'En mantenimiento'
                }">
                  {{cancha.estado}}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-action" [routerLink]="[cancha.id]">Ver</button>
                  <button class="btn btn-sm btn-action" [routerLink]="[cancha.id, 'edit']">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteCancha(cancha.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay canchas -->
      <div *ngIf="canchas.length === 0" class="text-center py-4">
        <p class="text-muted">No hay canchas registradas</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-group > .btn {
      margin: 0 2px;
    }
  `]
})
export class CanchaListComponent implements OnInit {
  canchas: CanchaWithSede[] = [];
  searchTerm: string = '';

  constructor(private canchaService: CanchaService) {}

  ngOnInit(): void {
    this.loadCanchas();
  }

  loadCanchas(): void {
    this.canchaService.getCanchas().subscribe(
      (data) => {
        this.canchas = data;
      },
      (error) => {
        console.error('Error cargando canchas:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.canchaService.searchCanchas(this.searchTerm).subscribe(
        (data) => {
          this.canchas = data;
        },
        (error) => {
          console.error('Error buscando canchas:', error);
        }
      );
    } else {
      this.loadCanchas();
    }
  }

  deleteCancha(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta cancha?')) {
      this.canchaService.deleteCancha(id).subscribe(
        () => {
          this.loadCanchas();
        },
        (error) => {
          console.error('Error eliminando cancha:', error);
        }
      );
    }
  }
} 