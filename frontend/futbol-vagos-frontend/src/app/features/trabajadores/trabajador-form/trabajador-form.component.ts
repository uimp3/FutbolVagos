import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrabajadorService } from '../../../core/services/trabajador.service';
import { Trabajador } from '../../../core/models/trabajador.model';
import { SedeService } from '../../../core/services/sede.service';
import { Sede } from '../../../core/models/sede.model';

@Component({
  selector: 'app-trabajador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <h2>{{ isEditing ? 'Editar' : 'Nuevo' }} Trabajador</h2>
      
      <form [formGroup]="trabajadorForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Nombre -->
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre</label>
          <input 
            type="text" 
            class="form-control" 
            id="nombre" 
            formControlName="nombre"
            [ngClass]="{'is-invalid': trabajadorForm.get('nombre')?.invalid && trabajadorForm.get('nombre')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('nombre')?.errors?.['required'] && trabajadorForm.get('nombre')?.touched">
            El nombre es requerido
          </div>
        </div>

        <!-- Campo Cédula -->
        <div class="col-md-6">
          <label for="cedula" class="form-label">Cédula</label>
          <input 
            type="text" 
            class="form-control" 
            id="cedula" 
            formControlName="cedula"
            [ngClass]="{'is-invalid': trabajadorForm.get('cedula')?.invalid && trabajadorForm.get('cedula')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('cedula')?.errors?.['required'] && trabajadorForm.get('cedula')?.touched">
            La cédula es requerida
          </div>
        </div>

        <!-- Campo Teléfono -->
        <div class="col-md-6">
          <label for="telefono" class="form-label">Teléfono</label>
          <input 
            type="tel" 
            class="form-control" 
            id="telefono" 
            formControlName="telefono"
            [ngClass]="{'is-invalid': trabajadorForm.get('telefono')?.invalid && trabajadorForm.get('telefono')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('telefono')?.errors?.['required'] && trabajadorForm.get('telefono')?.touched">
            El teléfono es requerido
          </div>
        </div>

        <!-- Campo Email -->
        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            formControlName="email"
            [ngClass]="{'is-invalid': trabajadorForm.get('email')?.invalid && trabajadorForm.get('email')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('email')?.errors?.['email'] && trabajadorForm.get('email')?.touched">
            Ingrese un email válido
          </div>
        </div>

        <!-- Campo Sede -->
        <div class="col-md-6">
          <label for="sede" class="form-label">Sede</label>
          <select 
            class="form-select" 
            id="sede" 
            formControlName="sede"
            [ngClass]="{'is-invalid': trabajadorForm.get('sede')?.invalid && trabajadorForm.get('sede')?.touched}"
          >
            <option value="">Seleccione una sede</option>
            <option *ngFor="let sede of sedes" [value]="sede.id">{{sede.nombre}}</option>
          </select>
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('sede')?.errors?.['required'] && trabajadorForm.get('sede')?.touched">
            La sede es requerida
          </div>
        </div>

        <!-- Campo Cargo -->
        <div class="col-md-6">
          <label for="cargo" class="form-label">Cargo</label>
          <select
            class="form-select"
            id="cargo"
            formControlName="cargo"
            [ngClass]="{'is-invalid': trabajadorForm.get('cargo')?.invalid && trabajadorForm.get('cargo')?.touched}"
          >
            <option value="">Seleccione un cargo</option>
            <option *ngFor="let cargoOption of cargoOptions" [value]="cargoOption">{{cargoOption}}</option>
          </select>
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('cargo')?.errors?.['required'] && trabajadorForm.get('cargo')?.touched">
            El cargo es requerido
          </div>
        </div>

        <!-- Campo Salario -->
        <div class="col-md-6">
          <label for="salario" class="form-label">Salario</label>
          <input 
            type="number" 
            class="form-control" 
            id="salario" 
            formControlName="salario"
            [ngClass]="{'is-invalid': trabajadorForm.get('salario')?.invalid && trabajadorForm.get('salario')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="trabajadorForm.get('salario')?.errors?.['required'] && trabajadorForm.get('salario')?.touched">
            El salario es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-success me-2" [disabled]="trabajadorForm.invalid">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Estilos para botón Guardar/Actualizar (verde) */
    .btn-success {
      background-color:rgb(65, 204, 89) !important; /* Verde */
      border-color:rgb(65, 204, 89) !important;
      color: #ffffff !important;
    }

    .btn-success:hover {
      background-color: rgb(40, 164, 60) !important; /* Verde más oscuro al pasar el mouse */
      border-color: rgb(40, 164, 60) !important;
    }

    /* Estilos para botón Cancelar (secundario) */
    .btn-secondary {
        background-color: #6c757d !important; /* Gris */
        border-color: #6c757d !important;
        color: #ffffff !important;
    }

    .btn-secondary:hover {
        background-color: #5c636a !important; /* Gris más oscuro */
        border-color: #5c636a !important;
    }
  `]
})
export class TrabajadorFormComponent implements OnInit {
  trabajadorForm: FormGroup;
  isEditing = false;
  trabajadorId?: number;

  // Opciones para el campo Cargo
  cargoOptions: string[] = ["Administrador", "Mantenimiento", "Recepcionista", "Vigilante"];
  sedes: Sede[] = []; // Propiedad para almacenar las sedes

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadorService,
    private router: Router,
    private route: ActivatedRoute,
    private sedeService: SedeService // Inyectar SedeService
  ) {
    this.trabajadorForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email]],
      cargo: ['', Validators.required],
      salario: ['', [Validators.required, Validators.min(0)]],
      sede: ['', Validators.required] // Añadir validador para sede
    });
  }

  ngOnInit(): void {
    this.loadSedes(); // Cargar sedes al iniciar
    this.trabajadorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.trabajadorId) {
      this.isEditing = true;
      this.loadTrabajador();
    }
  }

  loadTrabajador(): void {
    if (this.trabajadorId) {
      this.trabajadorService.getTrabajador(this.trabajadorId).subscribe(
        (trabajador) => {
          this.trabajadorForm.patchValue(trabajador);
        },
        (error) => {
          console.error('Error cargando trabajador:', error);
        }
      );
    }
  }

  loadSedes(): void {
    this.sedeService.getSedes().subscribe(
      (data) => {
        this.sedes = data;
      },
      (error) => {
        console.error('Error cargando sedes:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.trabajadorForm.valid) {
      const trabajador: Trabajador = this.trabajadorForm.value;
      
      if (this.isEditing && this.trabajadorId) {
        this.trabajadorService.updateTrabajador(this.trabajadorId, trabajador).subscribe(
          () => {
            this.router.navigate(['/trabajadores']);
          },
          (error) => {
            console.error('Error actualizando trabajador:', error);
          }
        );
      } else {
        this.trabajadorService.createTrabajador(trabajador).subscribe(
          () => {
            this.router.navigate(['/trabajadores']);
          },
          (error) => {
            console.error('Error creando trabajador:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/trabajadores']);
  }
} 