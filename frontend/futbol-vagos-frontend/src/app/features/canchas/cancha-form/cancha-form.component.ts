import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanchaService } from '../../../core/services/cancha.service';
import { SedeService } from '../../../core/services/sede.service';
import { Cancha } from '../../../core/models/cancha.model';
import { Sede } from '../../../core/models/sede.model';

@Component({
  selector: 'app-cancha-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <h2>{{ isEditing ? 'Editar' : 'Nueva' }} Cancha</h2>
      
      <form [formGroup]="canchaForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Sede -->
        <div class="col-md-6">
          <label for="sede" class="form-label">Sede</label>
          <select 
            class="form-select" 
            id="sede" 
            formControlName="sede"
            [ngClass]="{'is-invalid': canchaForm.get('sede')?.invalid && canchaForm.get('sede')?.touched}"
          >
            <option value="">Seleccione una sede</option>
            <option *ngFor="let sede of sedes" [value]="sede.id">{{sede.nombre}}</option>
          </select>
          <div class="invalid-feedback" *ngIf="canchaForm.get('sede')?.errors?.['required'] && canchaForm.get('sede')?.touched">
            La sede es requerida
          </div>
        </div>

        <!-- Campo Precio por Hora -->
        <div class="col-md-6">
          <label for="precio_hora" class="form-label">Precio por Hora</label>
          <input 
            type="number" 
            class="form-control" 
            id="precio_hora" 
            formControlName="precio_hora"
            [ngClass]="{'is-invalid': canchaForm.get('precio_hora')?.invalid && canchaForm.get('precio_hora')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="canchaForm.get('precio_hora')?.errors?.['required'] && canchaForm.get('precio_hora')?.touched">
            El precio por hora es requerido
          </div>
        </div>

        <!-- Campo Capacidad de Jugadores -->
        <div class="col-md-6">
          <label for="capacidad_jugadores" class="form-label">Capacidad de Jugadores</label>
          <input 
            type="number" 
            class="form-control" 
            id="capacidad_jugadores" 
            formControlName="capacidad_jugadores"
            [ngClass]="{'is-invalid': canchaForm.get('capacidad_jugadores')?.invalid && canchaForm.get('capacidad_jugadores')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="canchaForm.get('capacidad_jugadores')?.errors?.['required'] && canchaForm.get('capacidad_jugadores')?.touched">
            La capacidad de jugadores es requerida
          </div>
        </div>

        <!-- Campo Estado -->
        <div class="col-md-6">
          <label for="estado" class="form-label">Estado</label>
          <select 
            class="form-select" 
            id="estado" 
            formControlName="estado"
            [ngClass]="{'is-invalid': canchaForm.get('estado')?.invalid && canchaForm.get('estado')?.touched}"
          >
            <option value="">Seleccione un estado</option>
            <option value="Disponible">Disponible</option>
            <option value="En mantenimiento">En mantenimiento</option>
          </select>
          <div class="invalid-feedback" *ngIf="canchaForm.get('estado')?.errors?.['required'] && canchaForm.get('estado')?.touched">
            El estado es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-action me-2" [disabled]="canchaForm.invalid">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `
})
export class CanchaFormComponent implements OnInit {
  canchaForm: FormGroup;
  isEditing = false;
  canchaId?: number;
  sedes: Sede[] = [];

  constructor(
    private fb: FormBuilder,
    private canchaService: CanchaService,
    private sedeService: SedeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.canchaForm = this.fb.group({
      sede: ['', Validators.required],
      precio_hora: ['', [Validators.required, Validators.min(0)]],
      capacidad_jugadores: ['', [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSedes();
    this.canchaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.canchaId) {
      this.isEditing = true;
      this.loadCancha();
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

  loadCancha(): void {
    if (this.canchaId) {
      this.canchaService.getCancha(this.canchaId).subscribe(
        (cancha) => {
          this.canchaForm.patchValue(cancha);
        },
        (error) => {
          console.error('Error cargando cancha:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.canchaForm.valid) {
      const cancha: Cancha = this.canchaForm.value;
      
      if (this.isEditing && this.canchaId) {
        this.canchaService.updateCancha(this.canchaId, cancha).subscribe(
          () => {
            this.router.navigate(['/canchas']);
          },
          (error) => {
            console.error('Error actualizando cancha:', error);
          }
        );
      } else {
        this.canchaService.createCancha(cancha).subscribe(
          () => {
            this.router.navigate(['/canchas']);
          },
          (error) => {
            console.error('Error creando cancha:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/canchas']);
  }
} 