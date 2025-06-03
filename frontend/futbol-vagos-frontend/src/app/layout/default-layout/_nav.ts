import { INavData } from '@coreui/angular';

// Array que define la estructura del menú de navegación
export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  // Separador con título para la sección de gestión
  {
    title: true,
    name: 'Gestión'
  },
  {
    name: 'Sedes',
    url: '/sedes',
    iconComponent: { name: 'cil-location-pin' }
  },
  {
    name: 'Canchas',
    url: '/canchas',
    iconComponent: { name: 'cil-basketball' }
  },
  {
    name: 'Clientes',
    url: '/clientes',
    iconComponent: { name: 'cil-people' }
  },
  {
    title: true,
    name: 'Reservaciones'
  },
  {
    name: 'Reservacion',    // Nombre que aparece en el menú
    url: '/reservaciones',               // URL a la que navegará
    iconComponent: { name: 'cil-notes' }, // Icono que se muestra
  },
  {
    name: 'Facturacion',    // Nombre que aparece en el menú
    url: '/factura',               // URL a la que navegará
    iconComponent: { name: 'cil-pencil' }, // Icono que se muestra
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
