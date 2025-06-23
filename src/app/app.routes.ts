import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth-choice', pathMatch: 'full' },
  { path: 'auth-choice', loadComponent: () => import('./auth-choice/auth-choice.page').then(m => m.AuthChoicePage) },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'registro', loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage) },
  { path: 'recuperar-contrasena', loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage) },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage), canActivate: [AuthGuard] },
  { path: 'vehiculos', loadComponent: () => import('./vehiculos/vehiculos.page').then(m => m.VehiculosPage), canActivate: [AuthGuard] },
  { path: 'detalle-vehiculo/:id', loadComponent: () => import('./detalle-vehiculo/detalle-vehiculo.page').then(m => m.DetalleVehiculoPage), canActivate: [AuthGuard] },
  {
    path: 'mantenimiento',
    loadComponent: () => import('./mantenimientos-list/mantenimientos-list.page').then(m => m.MantenimientosListPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'mantenimiento-add',
    loadComponent: () => import('./mantenimiento/mantenimiento.page').then(m => m.MantenimientoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'mantenimiento-list',
    loadComponent: () => import('./mantenimientos-list/mantenimientos-list.page').then(m => m.MantenimientosListPage),
    canActivate: [AuthGuard]
  },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage), canActivate: [AuthGuard] },
  {
    path: 'editar-mantenimiento/:id',
    loadComponent: () => import('./editar-mantenimiento/editar-mantenimiento.page').then(m => m.EditarMantenimientoPage)
  },
];
