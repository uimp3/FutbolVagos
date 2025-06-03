import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { SedeListComponent } from './features/sedes/sede-list/sede-list.component';
import { SedeFormComponent } from './features/sedes/sede-form/sede-form.component';
import { ClienteListComponent } from './features/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './features/clientes/cliente-form/cliente-form.component';
import { ClienteDetailComponent } from './features/clientes/cliente-detail/cliente-detail.component';
import { CanchaListComponent } from './features/canchas/cancha-list/cancha-list.component';
import { CanchaFormComponent } from './features/canchas/cancha-form/cancha-form.component';
import { CanchaDetailComponent } from './features/canchas/cancha-detail/cancha-detail.component';
import { ReservacionListComponent } from './features/reservaciones/reservacion-list/reservacion-list.component';
import { ReservacionFormComponent } from './features/reservaciones/reservacion-form/reservacion-form.component';
import { ReservacionDetailComponent } from './features/reservaciones/reservacion-detail/reservacion-detail.component';
import { FacturaListComponent } from './features/facturas/factura-list/factura-list.component';
import { FacturaDetailComponent } from './features/facturas/factura-detail/factura-detail.component';
import { FacturaFormComponent } from './features/facturas/factura-form/factura-form.component';
import { authGuard } from './guards/auth.guard';
import { TRABAJADORES_ROUTES } from './features/trabajadores/trabajadores.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    //canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'sedes',
        data: {
          title: 'Gestión de Sedes'
        },
        children: [
          { path: '', component: SedeListComponent },
          { path: 'new', component: SedeFormComponent },
          { path: ':id/edit', component: SedeFormComponent }
        ]
      },
      {
        path: 'clientes',
        data: {
          title: 'Gestión de Clientes'
        },
        children: [
          { path: '', component: ClienteListComponent },
          { path: 'new', component: ClienteFormComponent },
          { path: ':id', component: ClienteDetailComponent },
          { path: ':id/edit', component: ClienteFormComponent }
        ]
      },
      {
        path: 'canchas',
        data: {
          title: 'Gestión de Canchas'
        },
        children: [
          { path: '', component: CanchaListComponent },
          { path: 'new', component: CanchaFormComponent },
          { path: ':id', component: CanchaDetailComponent },
          { path: ':id/edit', component: CanchaFormComponent }
        ]
      },
      {
        path: 'reservaciones',
        data: {
          title: 'Gestión de Reservaciones'
        },
        children: [
          { path: '', component: ReservacionListComponent },
          { path: 'new', component: ReservacionFormComponent },
          { path: ':id', component: ReservacionDetailComponent },
          { path: ':id/edit', component: ReservacionFormComponent }
        ]
      },
      {
        path: 'factura',
        data: {
          title: 'Gestión de Facturación'
        },
        children: [
          { path: '', component: FacturaListComponent },
          { path: 'new', component: FacturaFormComponent },
          { path: ':id', component: FacturaDetailComponent }
        ]
      },
      {
        path: 'trabajadores',
        data: {
          title: 'Gestión de Trabajadores'
        },
        children: TRABAJADORES_ROUTES
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
