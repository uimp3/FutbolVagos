import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservacionService } from '../../../core/services/reservacion.service';
import { ClienteService } from '../../../core/services/cliente.service'; // Necesario para seleccionar cliente
import { CanchaService } from '../../../core/services/cancha.service'; // Necesario para seleccionar cancha
import { SedeService } from '../../../core/services/sede.service'; // Necesario para obtener horario de sede
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

      <!-- Mensaje de error del backend -->
      <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <form [formGroup]="reservacionForm" (ngSubmit)="onSubmit()" class="row g-3">
        <!-- Campo Cliente -->
        <div class="col-md-6">
          <label for="cliente" class="form-label">Cliente</label>
          <input
            type="text"
            class="form-control"
            id="clienteSearch"
            placeholder="Buscar cliente por cédula..."
            [(ngModel)]="clienteSearchTerm"
            (input)="onClienteSearch()"
            [ngModelOptions]="{standalone: true}"
            [ngClass]="{'is-invalid': reservacionForm.get('cliente')?.invalid && reservacionForm.get('cliente')?.touched}"
          >
          <div class="list-group" *ngIf="clientes.length > 0 && clienteSearchTerm.length > 0">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              *ngFor="let cliente of clientes"
              (click)="selectCliente(cliente)"
            >
              {{cliente.nombre}} {{cliente.cedula}}
            </button>
          </div>
          <div class="form-text" *ngIf="selectedClienteName">Cliente seleccionado: {{selectedClienteName}}</div>
          <div class="invalid-feedback" *ngIf="reservacionForm.get('cliente')?.errors?.['required'] && reservacionForm.get('cliente')?.touched">
            El cliente es requerido
          </div>
        </div>

        <!-- Campo Cancha -->
        <div class="col-md-6">
          <label for="cancha" class="form-label">Cancha</label>
          <input
            type="text"
            class="form-control"
            id="canchaSearch"
            placeholder="Buscar cancha por sede..."
            [(ngModel)]="canchaSearchTerm"
            (input)="onCanchaSearch()"
            [ngModelOptions]="{standalone: true}"
            [ngClass]="{'is-invalid': reservacionForm.get('cancha')?.invalid && reservacionForm.get('cancha')?.touched}"
          >
           <div class="list-group" *ngIf="canchas.length > 0 && canchaSearchTerm.length > 0">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              *ngFor="let cancha of canchas"
              (click)="selectCancha(cancha)"
            >
              Cancha {{cancha.id}} (Sede: {{cancha.sede_nombre}}, Capacidad: {{cancha.capacidad_jugadores}})
            </button>
          </div>
          <div class="form-text" *ngIf="selectedCanchaDetails">Cancha seleccionada: Cancha {{selectedCanchaDetails.id}} (Sede: {{selectedCanchaDetails.sede_nombre}}, Capacidad: {{selectedCanchaDetails.capacidad_jugadores}})</div>
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
          <select
            class="form-select"
            id="hora"
            formControlName="hora"
            [ngClass]="{'is-invalid': reservacionForm.get('hora')?.invalid && reservacionForm.get('hora')?.touched}"
          >
            <option value="">Seleccione una hora</option>
            <option *ngFor="let hour of availableHours" [value]="hour">{{hour}}</option>
          </select>
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
          </select>
          <div class="invalid-feedback" *ngIf="reservacionForm.get('estado')?.errors?.['required'] && reservacionForm.get('estado')?.touched">
            El estado es requerido
          </div>
        </div>

        <!-- Campo Monto Total -->
        <div class="col-md-6">
          <label for="monto_total" class="form-label">Monto de Reserva</label>
          <input
            type="number"
            class="form-control"
            id="monto_total"
            formControlName="monto_total"
            [ngClass]="{'is-invalid': reservacionForm.get('monto_total')?.invalid && reservacionForm.get('monto_total')?.touched}"
          >
          <div class="invalid-feedback" *ngIf="reservacionForm.get('monto_total')?.errors?.['required'] && reservacionForm.get('monto_total')?.touched">
            El monto de reserva es requerido
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="col-12">
          <button type="submit" class="btn btn-success me-2" [disabled]="reservacionForm.invalid">
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
export class ReservacionFormComponent implements OnInit {
  reservacionForm: FormGroup;
  isEditing = false;
  reservacionId?: number;
  clientes: Cliente[] = [];
  canchas: CanchaWithSede[] = [];
  clienteSearchTerm: string = '';
  selectedClienteName: string | null = null;
  canchaSearchTerm: string = '';
  selectedCanchaDetails: CanchaWithSede | null = null;
  availableHours: string[] = [];
  errorMessage: string | null = null; // Variable para almacenar el mensaje de error

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionService,
    private clienteService: ClienteService,
    private canchaService: CanchaService,
    private sedeService: SedeService, // Inyectar SedeService
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
    this.generateAvailableHours();
    this.reservacionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reservacionId) {
      this.isEditing = true;
      this.loadReservacion();
    }
  }

  loadClientes(): void {
    
  }

  loadCanchas(): void {
   
  }

  loadReservacion(): void {
    if (this.reservacionId) {
      this.reservacionService.getReservacion(this.reservacionId).subscribe(
        (reservacion) => {
          // Formatear la fecha si existe
          if (reservacion.fecha) {
            reservacion.fecha = reservacion.fecha.split('T')[0];
          }

          // Guardar y formatear la hora existente si existe
          const existingHora = reservacion.hora ? reservacion.hora.substring(0, 5) : null;

          // obtener la cancha asociada para obtener la sede
          if (reservacion.cancha) {
            this.canchaService.getCancha(reservacion.cancha).subscribe(
              (canchaData) => {
                this.selectedCanchaDetails = canchaData;

                // Obtener la sede asociada a la cancha
                this.sedeService.getSede(canchaData.sede).subscribe(
                  (sedeData) => {
                    const apertura = parseInt(sedeData.horario_apertura.split(':')[0], 10);
                    const cierre = parseInt(sedeData.horario_cierre.split(':')[0], 10);
                    
                    // Regenerar todas las horas y luego filtrar
                    this.generateAvailableHours(); 

                    this.availableHours = this.availableHours.filter(hour => {
                      const hourInt = parseInt(hour.split(':')[0], 10);
                      return hourInt >= apertura && hourInt <= cierre;
                    });

                   
                     this.reservacionForm.patchValue({
                        cliente: reservacion.cliente,
                        cancha: reservacion.cancha,
                        fecha: reservacion.fecha,
                        estado: reservacion.estado,
                        monto_total: reservacion.monto_total,
                        hora: (existingHora && this.availableHours.includes(existingHora)) ? existingHora : null // Establecer la hora solo si es válida en el rango filtrado
                     });
                    
                     if (reservacion.cliente) {
                        this.clienteService.getCliente(reservacion.cliente).subscribe(
                            (clienteData) => { this.selectedClienteName = `${clienteData.nombre} ${clienteData.cedula}`; },
                            (error) => { console.error('Error cargando cliente para edición:', error); }
                        );
                     }

                  },
                  (error) => {
                    console.error('Error cargando sede para filtrar horas:', error);
                    // Si falla la carga de la sede, muestra todas las horas posibles y resetea la hora
                    this.generateAvailableHours();
                     this.reservacionForm.patchValue({ hora: null });
             
                     this.reservacionForm.patchValue({
                        cliente: reservacion.cliente,
                        cancha: reservacion.cancha,
                        fecha: reservacion.fecha,
                        estado: reservacion.estado,
                        monto_total: reservacion.monto_total
                     });
                  }
                );

              },
              (error) => {
                console.error('Error cargando cancha para edición:', error);
                // Si falla la carga de la cancha, se muestra todas las horas posibles y se resetea la hora
                this.generateAvailableHours();
                this.reservacionForm.patchValue({ hora: null });
              
                 this.reservacionForm.patchValue({
                    cliente: reservacion.cliente,
                    cancha: reservacion.cancha,
                    fecha: reservacion.fecha,
                    estado: reservacion.estado,
                    monto_total: reservacion.monto_total
                 });
              }
            );
          } else {
             this.generateAvailableHours();
             this.reservacionForm.patchValue({ hora: null });
             this.reservacionForm.patchValue({
                cliente: reservacion.cliente,
                fecha: reservacion.fecha,
                estado: reservacion.estado,
                monto_total: reservacion.monto_total
             });
          }

        },
        (error) => {
          console.error('Error cargando reservación para edición:', error);
          this.errorMessage = 'Error cargando los datos de la reservación.';
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
            // Se muestra el mensaje de error del backend
            if (error.error && error.error.non_field_errors) {
              this.errorMessage = error.error.non_field_errors[0];
            } else if (error.error) {
                 
                 this.errorMessage = JSON.stringify(error.error);
            } else {
              this.errorMessage = 'Ocurrió un error al actualizar la reservación.';
            }
          }
        );
      } else {
        this.reservacionService.createReservacion(reservacion).subscribe(
          () => {
            this.router.navigate(['/reservaciones']);
          },
          (error) => {
            console.error('Error creando reservación:', error);
            // Mostrar mensaje de error del backend
             if (error.error && error.error.non_field_errors) {
              this.errorMessage = error.error.non_field_errors[0];
            } else if (error.error) {
                 this.errorMessage = JSON.stringify(error.error);
            }
             else {
              this.errorMessage = 'Ocurrió un error al crear la reservación.';
            }
          }
        );
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.'; // Mensaje si el formulario no es válido
    }
  }

  onCancel(): void {
    this.router.navigate(['/reservaciones']);
  }

  onClienteSearch(): void {
    if (this.clienteSearchTerm.trim()) {
      this.clienteService.searchClientes(this.clienteSearchTerm.trim()).subscribe(
        (data) => {
          this.clientes = data; // Almacenar los resultados de búsqueda en la lista de clientes
        },
        (error) => {
          console.error('Error buscando clientes:', error);
          this.clientes = []; // Limpiar resultados en caso de error
        }
      );
    } else {
      this.clientes = []; // Limpiar resultados si el término de búsqueda está vacío
      this.reservacionForm.patchValue({ cliente: null }); 
      this.selectedClienteName = null; // Limpiar el nombre del cliente seleccionado
    }
  }

  selectCliente(cliente: Cliente): void {
    this.reservacionForm.patchValue({ cliente: cliente.id });
    this.selectedClienteName = `${cliente.nombre} ${cliente.cedula}`;
    this.clientes = []; // Limpiar la lista de resultados después de seleccionar
    this.clienteSearchTerm = ''; // Limpiar el término de búsqueda
  }

  onCanchaSearch(): void {
    if (this.canchaSearchTerm.trim()) {
      this.canchaService.searchCanchas(this.canchaSearchTerm.trim()).subscribe(
        (data) => {
          this.canchas = data; // Almacenar los resultados de búsqueda en la lista de canchas
        },
        (error) => {
          console.error('Error buscando canchas:', error);
          this.canchas = []; // Limpiar resultados en caso de error
        }
      );
    } else {
      this.canchas = []; // Limpiar resultados si el término de búsqueda está vacío
      this.reservacionForm.patchValue({ cancha: null }); // Resetear el valor de la cancha en el formulario
      this.selectedCanchaDetails = null; // Limpiar los detalles de la cancha seleccionada
    }
  }

  selectCancha(cancha: CanchaWithSede): void {
    this.reservacionForm.patchValue({ cancha: cancha.id });
    this.selectedCanchaDetails = cancha;
    this.canchas = []; // Limpiar la lista de resultados después de seleccionar
    this.canchaSearchTerm = ''; // Limpiar el término de búsqueda
    this.filterAvailableHours(cancha.sede); // Filtrar horas basado en la sede de la cancha
  }

  generateAvailableHours(): void {
    // Generar todas las horas posibles primero
    this.availableHours = []; // Limpiar por si acaso
    for (let i = 0; i < 24; i++) { // Horas de 00 AM a 11 PM
      const hour = i < 10 ? `0${i}` : `${i}`;
      this.availableHours.push(`${hour}:00`);
    }
  }

  filterAvailableHours(sedeId: number, existingHora: string | null = null): void {
    this.sedeService.getSede(sedeId).subscribe(
      (sede) => {
        const apertura = parseInt(sede.horario_apertura.split(':')[0], 10);
        const cierre = parseInt(sede.horario_cierre.split(':')[0], 10);
        
        // Regenerar todas las horas y luego filtrar
        this.generateAvailableHours(); 

        this.availableHours = this.availableHours.filter(hour => {
          const hourInt = parseInt(hour.split(':')[0], 10);
          return hourInt >= apertura && hourInt <= cierre;
        });
        
      },
      (error) => {
        console.error('Error cargando sede para filtrar horas:', error);
         this.generateAvailableHours(); // Volver a generar todas las horas si hay error
      }
    );
  }
} 