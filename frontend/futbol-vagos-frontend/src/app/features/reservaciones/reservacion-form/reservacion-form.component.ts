import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservacionService } from '../../../core/services/reservacion.service';
import { ClienteService } from '../../../core/services/cliente.service'; // Necesario para seleccionar cliente
import { CanchaService } from '../../../core/services/cancha.service'; // Necesario para seleccionar cancha
import { Reservacion } from '../../../core/models/reservacion.model';
import { Cliente } from '../../../core/models/cliente.model';
import { CanchaWithSede } from '../../../core/models/cancha.model';

@Component({
  selector: 'app-reservacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <h2>{{ isEditing ? 'Editar' : 'Nueva' }} Reservación</h2>

      <form [formGroup]="reservacionForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Cliente -->
        <div class="col-md-6">
          <label for="cliente" class="form-label">Cliente</label>
          <select
            class="form-select"
            id="cliente"
            formControlName="cliente"
            [ngClass]="{'is-invalid': reservacionForm.get('cliente')?.invalid && reservacionForm.get('cliente')?.touched}"
          >
            <option value="">Seleccione un cliente</option>
            <option *ngFor="let cliente of clientes" [value]="cliente.id">{{cliente.nombre}} {{cliente.cedula}}</option>
          </select>
          <div class="invalid-feedback" *ngIf="reservacionForm.get('cliente')?.errors?.['required'] && reservacionForm.get('cliente')?.touched">
            El cliente es requerido
          </div>
        </div>

        <!-- Campo Cancha -->
        <div class="col-md-6">
          <label for="cancha" class="form-label">Cancha</label>
          <select
            class="form-select"
            id="cancha"
            formControlName="cancha"
            [ngClass]="{'is-invalid': reservacionForm.get('cancha')?.invalid && reservacionForm.get('cancha')?.touched}"
          >
            <option value="">Seleccione una cancha</option>
            <option *ngFor="let cancha of canchas" [value]="cancha.id">Cancha {{cancha.id}} (Sede: {{cancha.sede_nombre}})</option>
          </select>
          <div class="invalid-feedback" *ngIf="reservacionForm.get('cancha')?.errors?.['required'] && reservacionForm.get('cancha')?.touched">
            La cancha es requerida
          </div>
        </div>

        <!-- Campo Fecha -->
        <div class="col-md-6">
          <label for="fecha" class="form-label">Fecha</label>
          <input
            type="date"
            class="form-control"
            id="fecha"
            formControlName="fecha"
            [ngClass]="{'is-invalid': reservacionForm.get('fecha')?.invalid && reservacionForm.get('fecha')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="reservacionForm.get('fecha')?.errors?.['required'] && reservacionForm.get('fecha')?.touched">
            La fecha es requerida
          </div>
        </div>

        <!-- Campo Hora -->
        <div class="col-md-6">
          <label for="hora" class="form-label">Hora</label>
          <input
            type="time"
            class="form-control"
            id="hora"
            formControlName="hora"
            [ngClass]="{'is-invalid': reservacionForm.get('hora')?.invalid && reservacionForm.get('hora')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="reservacionForm.get('hora')?.errors?.['required'] && reservacionForm.get('hora')?.touched">
            La hora es requerida
          </div>
        </div>

        <!-- Campo Estado -->
        <div class="col-md-6">
          <label for="estado" class="form-label">Estado</label>
          <select
            class="form-select"
            id="estado"
            formControlName="estado"
            [ngClass]="{'is-invalid': reservacionForm.get('estado')?.invalid && reservacionForm.get('estado')?.touched}"
          >
            <option value="">Seleccione un estado</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Pagada">Pagada</option>
          </select>
          <div class="invalid-feedback" *ngIf="reservacionForm.get('estado')?.errors?.['required'] && reservacionForm.get('estado')?.touched">
            El estado es requerido
          </div>
        </div>

        <!-- Campo Monto Total -->
        <div class="col-md-6">
          <label for="monto_total" class="form-label">Monto Total</label>
          <input
            type="number"
            class="form-control"
            id="monto_total"
            formControlName="monto_total"
            [ngClass]="{'is-invalid': reservacionForm.get('monto_total')?.invalid && reservacionForm.get('monto_total')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="reservacionForm.get('monto_total')?.errors?.['required'] && reservacionForm.get('monto_total')?.touched">
            El monto total es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-action me-2" [disabled]="reservacionForm.invalid">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ReservacionFormComponent implements OnInit {
  reservacionForm: FormGroup;
  isEditing = false;
  reservacionId?: number;
  clientes: Cliente[] = [];
  canchas: CanchaWithSede[] = [];

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionService,
    private clienteService: ClienteService,
    private canchaService: CanchaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservacionForm = this.fb.group({
      cliente: ['', Validators.required],
      cancha: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      estado: ['', Validators.required],
      monto_total: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadCanchas();
    this.reservacionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reservacionId) {
      this.isEditing = true;
      this.loadReservacion();
    }
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

  loadReservacion(): void {
    if (this.reservacionId) {
      this.reservacionService.getReservacion(this.reservacionId).subscribe(
        (reservacion) => {
          // Formatear la fecha para el input type="date"
          if (reservacion.fecha) {
            reservacion.fecha = reservacion.fecha.split('T')[0];
          }
          this.reservacionForm.patchValue(reservacion);
        },
        (error) => {
          console.error('Error cargando reservación:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.reservacionForm.valid) {
      const reservacion: Reservacion = this.reservacionForm.value;

      if (this.isEditing && this.reservacionId) {
        this.reservacionService.updateReservacion(this.reservacionId, reservacion).subscribe(
          () => {
            this.router.navigate(['/reservaciones']);
          },
          (error) => {
            console.error('Error actualizando reservación:', error);
          }
        );
      } else {
        this.reservacionService.createReservacion(reservacion).subscribe(
          () => {
            this.router.navigate(['/reservaciones']);
          },
          (error) => {
            console.error('Error creando reservación:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/reservaciones']);
  }
} 