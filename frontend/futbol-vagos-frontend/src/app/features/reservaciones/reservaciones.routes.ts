import { Routes } from '@angular/router';
import { ReservacionListComponent } from './reservacion-list/reservacion-list.component';
import { ReservacionFormComponent } from './reservacion-form/reservacion-form.component';
import { ReservacionDetailComponent } from './reservacion-detail/reservacion-detail.component';
// Importar los componentes de formulario y detalle cuando estén creados
// import { ReservacionFormComponent } from './reservacion-form/reservacion-form.component';
// import { ReservacionDetailComponent } from './reservacion-detail/reservacion-detail.component';

export const RESERVACIONES_ROUTES: Routes = [
  {
    path: '',
    component: ReservacionListComponent
  },
  { path: 'new', component: ReservacionFormComponent },
  { path: ':id', component: ReservacionDetailComponent },
  { path: ':id/edit', component: ReservacionFormComponent }
]; 