import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Mantenimiento {
  fecha: string;
  tipo: string;
  descripcion: string;
}

export interface Vehiculo {
  id?: string;
  nombre: string;
  estado: string;
  modelo: string;
  anio: number;
  mantenimientos: Mantenimiento[];
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private vehiculosCollection;
  private offlineMode = true; // Cambiar a false para usar Firestore
  private localVehiculos: Vehiculo[] = [
    {
      id: '1',
      nombre: 'Camión de Bomberos 1',
      estado: 'Operativo',
      modelo: 'Modelo A',
      anio: 2015,
      mantenimientos: [
        { fecha: '2023-01-10', tipo: 'Revisión', descripcion: 'Cambio de aceite' },
        { fecha: '2023-03-15', tipo: 'Reparación', descripcion: 'Frenos' }
      ]
    },
    {
      id: '2',
      nombre: 'Camión de Bomberos 2',
      estado: 'En reparación',
      modelo: 'Modelo B',
      anio: 2018,
      mantenimientos: [
        { fecha: '2023-02-20', tipo: 'Revisión', descripcion: 'Cambio de frenos' }
      ]
    }
  ];

  constructor(private firestore: Firestore) {
    this.offlineMode = false; // Desactivar modo offline porque Firebase ya funciona
    this.vehiculosCollection = collection(this.firestore, 'vehiculos');
  }

  async init(): Promise<void> {
    // Inicialización si es necesaria
    return Promise.resolve();
  }

  getVehiculos(): Observable<Vehiculo[]> {
    if (this.offlineMode) {
      return of(this.localVehiculos);
    }
    return collectionData(this.vehiculosCollection, { idField: 'id' }).pipe(
      map((vehiculos: any[]) => {
        console.log('Datos crudos vehiculos:', vehiculos);
        return vehiculos.map((v: any) => ({
          ...v,
          nombre: v.nombre || v.vehiculo || v.marca || v.patente || 'Sin nombre'
        }));
      })
    );
  }

  async addVehiculo(vehiculo: Vehiculo): Promise<void> {
    if (this.offlineMode) {
      vehiculo.id = (this.localVehiculos.length + 1).toString();
      this.localVehiculos.push(vehiculo);
      return Promise.resolve();
    }
    await addDoc(this.vehiculosCollection, vehiculo);
  }

  async deleteVehiculo(id: string): Promise<void> {
    if (this.offlineMode) {
      this.localVehiculos = this.localVehiculos.filter(v => v.id !== id);
      return Promise.resolve();
    }
    const vehiculoDoc = doc(this.firestore, `vehiculos/${id}`);
    await deleteDoc(vehiculoDoc);
  }

  getVehiculoById(id: string): Observable<Vehiculo | undefined> {
    if (this.offlineMode) {
      const vehiculo = this.localVehiculos.find(v => v.id === id);
      return of(vehiculo);
    }
    const vehiculoDoc = doc(this.firestore, `vehiculos/${id}`);
    return docData(vehiculoDoc, { idField: 'id' }) as Observable<Vehiculo | undefined>;
  }

  async updateVehiculo(id: string, data: Partial<Vehiculo>): Promise<void> {
    if (this.offlineMode) {
      const index = this.localVehiculos.findIndex(v => v.id === id);
      if (index !== -1) {
        this.localVehiculos[index] = { ...this.localVehiculos[index], ...data };
      }
      return Promise.resolve();
    }
    const vehiculoDoc = doc(this.firestore, `vehiculos/${id}`);
    await updateDoc(vehiculoDoc, data);
  }
}
