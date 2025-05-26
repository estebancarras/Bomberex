import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => /* @vite-ignore */ import('./home/home.page').then(m => m.HomePage) },
  { path: 'vehiculos', loadComponent: () => /* @vite-ignore */ import('./vehiculos/vehiculos.page').then(m => m.VehiculosPage) },
  { path: 'detalle-vehiculo/:id', loadComponent: () => /* @vite-ignore */ import('./detalle-vehiculo/detalle-vehiculo.page').then(m => m.DetalleVehiculoPage) },
  {
    path: 'mantenimiento',
    loadComponent: () => import('./mantenimiento-home/mantenimiento-home.page').then(m => m.MantenimientoHomePage),
    children: [
      {
        path: 'add',
        loadComponent: () => import('./mantenimiento/mantenimiento.page').then(m => m.MantenimientoPage)
      },
      {
        path: 'list',
        loadComponent: () => import('./mantenimientos-list/mantenimientos-list.page').then(m => m.MantenimientosListPage)
      }
    ]
  },
  { path: 'perfil', loadComponent: () => /* @vite-ignore */ import('./perfil/perfil.page').then(m => m.PerfilPage) },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
];
