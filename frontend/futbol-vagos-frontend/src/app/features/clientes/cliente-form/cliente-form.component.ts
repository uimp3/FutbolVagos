import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  template: `
    <div class="container-lg px-4 py-5">
      <h2>{{ isEditing ? 'Editar' : 'Nuevo' }} Cliente</h2>
      
      <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Nombre -->
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre</label>
          <input 
            type="text" 
            class="form-control" 
            id="nombre" 
            formControlName="nombre"
            [ngClass]="{'is-invalid': clienteForm.get('nombre')?.invalid && clienteForm.get('nombre')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="clienteForm.get('nombre')?.errors?.['required'] && clienteForm.get('nombre')?.touched">
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
            [ngClass]="{'is-invalid': clienteForm.get('cedula')?.invalid && clienteForm.get('cedula')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="clienteForm.get('cedula')?.errors?.['required'] && clienteForm.get('cedula')?.touched">
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
            [ngClass]="{'is-invalid': clienteForm.get('telefono')?.invalid && clienteForm.get('telefono')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="clienteForm.get('telefono')?.errors?.['required'] && clienteForm.get('telefono')?.touched">
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
            [ngClass]="{'is-invalid': clienteForm.get('email')?.invalid && clienteForm.get('email')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="clienteForm.get('email')?.errors?.['email'] && clienteForm.get('email')?.touched">
            Ingrese un email válido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-success me-2" [disabled]="clienteForm.invalid">
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
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEditing = false;
  clienteId?: number;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clienteId) {
      this.isEditing = true;
      this.loadCliente();
    }
  }

  loadCliente(): void {
    if (this.clienteId) {
      this.clienteService.getCliente(this.clienteId).subscribe(
        (cliente) => {
          this.clienteForm.patchValue(cliente);
        },
        (error) => {
          console.error('Error cargando cliente:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente: Cliente = this.clienteForm.value;
      
      if (this.isEditing && this.clienteId) {
        this.clienteService.updateCliente(this.clienteId, cliente).subscribe(
          () => {
            this.router.navigate(['/clientes']);
          },
          (error) => {
            console.error('Error actualizando cliente:', error);
          }
        );
      } else {
        this.clienteService.createCliente(cliente).subscribe(
          () => {
            this.router.navigate(['/clientes']);
          },
          (error) => {
            console.error('Error creando cliente:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }
} 