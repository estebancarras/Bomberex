import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => /* @vite-ignore */ import('./home/home.page').then(m => m.HomePage) },
  { path: 'vehiculos', loadComponent: () => /* @vite-ignore */ import('./vehiculos/vehiculos.page').then(m => m.VehiculosPage) },
  { path: 'detalle-vehiculo/:id', loadComponent: () => /* @vite-ignore */ import('./detalle-vehiculo/detalle-vehiculo.page').then(m => m.DetalleVehiculoPage) },
  { path: 'mantenimiento', loadComponent: () => /* @vite-ignore */ import('./mantenimiento/mantenimiento.page').then(m => m.MantenimientoPage) },
  { path: 'perfil', loadComponent: () => /* @vite-ignore */ import('./perfil/perfil.page').then(m => m.PerfilPage) },
];
