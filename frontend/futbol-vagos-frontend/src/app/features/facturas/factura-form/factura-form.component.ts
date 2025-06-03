import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura } from '../../../core/models/factura.model';

@Component({
  selector: 'app-factura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-lg px-4 py-5">
      <h2>{{ isEditing ? 'Editar' : 'Nueva' }} Factura</h2>

      <form [formGroup]="facturaForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Cliente (asumimos que aquí podrías poner un selector o input) -->
        <div class="col-md-6">
          <label for="cliente" class="form-label">Cliente ID</label>
          <input
            type="number"
            class="form-control"
            id="cliente"
            formControlName="cliente"
            [ngClass]="{'is-invalid': facturaForm.get('cliente')?.invalid && facturaForm.get('cliente')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="facturaForm.get('cliente')?.errors?.['required'] && facturaForm.get('cliente')?.touched">
            El cliente es requerido
          </div>
        </div>

        <!-- Campo Reservación ID -->
        <div class="col-md-6">
          <label for="reservacion" class="form-label">Reservación ID</label>
          <input
            type="number"
            class="form-control"
            id="reservacion"
            formControlName="reservacion"
            [ngClass]="{'is-invalid': facturaForm.get('reservacion')?.invalid && facturaForm.get('reservacion')?.touched}"
          >
           <div class="invalid-feedback" *ngIf="facturaForm.get('reservacion')?.errors?.['required'] && facturaForm.get('reservacion')?.touched">
            La reservación es requerida
          </div>
        </div>

         <!-- Campo Total -->
        <div class="col-md-6">
          <label for="total" class="form-label">Total</label>
          <input
            type="number"
            class="form-control"
            id="total"
            formControlName="total"
            [ngClass]="{'is-invalid': facturaForm.get('total')?.invalid && facturaForm.get('total')?.touched}"
          >
           <div class="invalid-feedback" *ngIf="facturaForm.get('total')?.errors?.['required'] && facturaForm.get('total')?.touched">
            El total es requerido
          </div>
        </div>

        <!-- Campo Método de Pago -->
        <div class="col-md-6">
          <label for="metodo_pago" class="form-label">Método de Pago</label>
          <select
            class="form-select"
            id="metodo_pago"
            formControlName="metodo_pago"
            [ngClass]="{'is-invalid': facturaForm.get('metodo_pago')?.invalid && facturaForm.get('metodo_pago')?.touched}"
          >
            <option value="">Seleccione método de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
          <div class="invalid-feedback" *ngIf="facturaForm.get('metodo_pago')?.errors?.['required'] && facturaForm.get('metodo_pago')?.touched">
            El método de pago es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-success me-2" [disabled]="facturaForm.invalid">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Estilos básicos, puedes personalizarlos */
    .btn-success {
      background-color: green;
      border-color: green;
      color: white;
    }

    .btn-success:hover {
      background-color: darkgreen;
      border-color: darkgreen;
    }

    .btn-secondary {
      background-color: gray;
      border-color: gray;
      color: white;
    }

    .btn-secondary:hover {
      background-color: darkgray;
      border-color: darkgray;
    }
  `]
})
export class FacturaFormComponent implements OnInit {
  facturaForm: FormGroup;
  isEditing = false;
  facturaId?: number;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.facturaForm = this.fb.group({
      cliente: [null, Validators.required], // Usar null para valores numéricos iniciales
      reservacion: [null, Validators.required],
      total: [null, [Validators.required, Validators.min(0)]],
      metodo_pago: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.facturaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.facturaId) {
      this.isEditing = true;
      this.loadFactura();
    }
  }

  loadFactura(): void {
    if (this.facturaId) {
      this.facturaService.getFactura(this.facturaId).subscribe(factura => {
        this.facturaForm.patchValue(factura);
      }, error => console.error('Error loading factura:', error));
    }
  }

  onSubmit(): void {
    if (this.facturaForm.valid) {
      const factura: Factura = this.facturaForm.value;

      if (this.isEditing && this.facturaId) {
        this.facturaService.updateFactura(this.facturaId, factura).subscribe(() => {
          this.router.navigate(['/factura']);
        }, error => console.error('Error updating factura:', error));
      } else {
        this.facturaService.createFactura(factura).subscribe(() => {
          this.router.navigate(['/factura']);
        }, error => console.error('Error creating factura:', error));
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/factura']);
  }
} 