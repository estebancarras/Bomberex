import { Injectable } from '@angular/core';

export interface Vehiculo {
  id?: number;
  nombre: string;
  modelo: string;
  anio: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private vehiculos: Vehiculo[] = [
    { id: 1, nombre: 'Camión de Bomberos 1', modelo: 'Modelo A', anio: 2015 },
    { id: 2, nombre: 'Camión de Bomberos 2', modelo: 'Modelo B', anio: 2018 },
  ];

  constructor() {}

  async init() {
    // Aquí podrías inicializar la base de datos SQLite o Firestore
    return Promise.resolve();
  }

  async getVehiculos(): Promise<Vehiculo[]> {
    // Aquí podrías obtener los vehículos desde la base de datos
    return Promise.resolve(this.vehiculos);
  }

  async addVehiculo(vehiculo: Vehiculo): Promise<void> {
    vehiculo.id = this.vehiculos.length + 1;
    this.vehiculos.push(vehiculo);
    return Promise.resolve();
  }

  async deleteVehiculo(id: number): Promise<void> {
    this.vehiculos = this.vehiculos.filter(v => v.id !== id);
    return Promise.resolve();
  }
}
