import { Routes } from '@angular/router';
import { TrabajadorListComponent } from './trabajador-list/trabajador-list.component';
import { TrabajadorFormComponent } from './trabajador-form/trabajador-form.component';

export const TRABAJADORES_ROUTES: Routes = [
  {
    path: '',
    component: TrabajadorListComponent
  },
  { path: 'new', component: TrabajadorFormComponent },
  { path: ':id/edit', component: TrabajadorFormComponent }
]; 