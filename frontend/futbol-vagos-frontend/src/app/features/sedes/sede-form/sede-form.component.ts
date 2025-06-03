import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SedeService } from '../../../core/services/sede.service';
import { Sede } from '../../../core/models/sede.model';

// Componente para crear y editar sedes
@Component({
  selector: 'app-sede-form',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios para el formulario
  template: `
    <div class="container-lg px-4 py-5">
      <!-- El título cambia según si estamos editando o creando -->
      <h2>{{ isEditing ? 'Editar' : 'Nueva' }} Sede</h2>
      
      <!-- Formulario reactivo con validación -->
      <form [formGroup]="sedeForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Nombre -->
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" class="form-control" id="nombre" formControlName="nombre">
          <!-- Mensaje de error si el campo es requerido -->
          <div class="text-danger" *ngIf="sedeForm.get('nombre')?.errors?.['required'] && sedeForm.get('nombre')?.touched">
            El nombre es requerido
          </div>
        </div>

        <!-- Campo Dirección -->
        <div class="col-md-6">
          <label for="direccion" class="form-label">Dirección</label>
          <input type="text" class="form-control" id="direccion" formControlName="direccion">
          <div class="text-danger" *ngIf="sedeForm.get('direccion')?.errors?.['required'] && sedeForm.get('direccion')?.touched">
            La dirección es requerida
          </div>
        </div>

        <!-- Campo Barrio (opcional) -->
        <div class="col-md-6">
          <label for="barrio" class="form-label">Barrio</label>
          <input type="text" class="form-control" id="barrio" formControlName="barrio">
        </div>

        <!-- Campo Ciudad -->
        <div class="col-md-6">
          <label for="ciudad" class="form-label">Ciudad</label>
          <input type="text" class="form-control" id="ciudad" formControlName="ciudad">
          <div class="text-danger" *ngIf="sedeForm.get('ciudad')?.errors?.['required'] && sedeForm.get('ciudad')?.touched">
            La ciudad es requerida
          </div>
        </div>

        <!-- Campo Horario de Apertura -->
        <div class="col-md-6">
          <label for="horario_apertura" class="form-label">Horario de Apertura</label>
          <input type="time" class="form-control" id="horario_apertura" formControlName="horario_apertura">
          <div class="text-danger" *ngIf="sedeForm.get('horario_apertura')?.errors?.['required'] && sedeForm.get('horario_apertura')?.touched">
            El horario de apertura es requerido
          </div>
        </div>

        <!-- Campo Horario de Cierre -->
        <div class="col-md-6">
          <label for="horario_cierre" class="form-label">Horario de Cierre</label>
          <input type="time" class="form-control" id="horario_cierre" formControlName="horario_cierre">
          <div class="text-danger" *ngIf="sedeForm.get('horario_cierre')?.errors?.['required'] && sedeForm.get('horario_cierre')?.touched">
            El horario de cierre es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-action me-2" [disabled]="sedeForm.invalid">Guardar</button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `
})
export class SedeFormComponent implements OnInit {
  // Formulario reactivo para manejar los datos
  sedeForm: FormGroup;
  // Indica si estamos en modo edición
  isEditing = false;
  // ID de la sede en caso de edición
  sedeId?: number;

  constructor(
    private fb: FormBuilder,         // Para crear el formulario reactivo
    private sedeService: SedeService, // Servicio para operaciones CRUD
    private router: Router,          // Para la navegación
    private route: ActivatedRoute    // Para obtener parámetros de la URL
  ) {
    // Inicialización del formulario con validaciones
    this.sedeForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      barrio: [''], // Campo opcional
      ciudad: ['', Validators.required],
      horario_apertura: ['', Validators.required],
      horario_cierre: ['', Validators.required]
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Verifica si hay un ID en la URL (modo edición)
    this.sedeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.sedeId) {
      this.isEditing = true;
      this.loadSede();
    }
  }

  // Carga los datos de la sede para edición
  loadSede(): void {
    if (this.sedeId) {
      this.sedeService.getSede(this.sedeId).subscribe(
        (sede) => {
          // Rellena el formulario con los datos existentes
          this.sedeForm.patchValue(sede);
        },
        (error) => {
          console.error('Error cargando sede:', error);
        }
      );
    }
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    if (this.sedeForm.valid) {
      const sede: Sede = this.sedeForm.value;
      
      if (this.isEditing && this.sedeId) {
        // Actualiza una sede existente
        this.sedeService.updateSede(this.sedeId, sede).subscribe(
          () => {
            this.router.navigate(['/sedes']);
          },
          (error) => {
            console.error('Error actualizando sede:', error);
          }
        );
      } else {
        // Crea una nueva sede
        this.sedeService.createSede(sede).subscribe(
          () => {
            this.router.navigate(['/sedes']);
          },
          (error) => {
            console.error('Error creando sede:', error);
          }
        );
      }
    }
  }

  // Cancela la operación y vuelve a la lista
  onCancel(): void {
    this.router.navigate(['/sedes']);
  }
} 