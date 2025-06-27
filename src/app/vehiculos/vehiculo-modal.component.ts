import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonTextarea
} from '@ionic/angular/standalone';
import { Vehiculo } from '../services/vehiculos.service';

import { addIcons } from 'ionicons';
import { closeOutline, saveOutline, carOutline } from 'ionicons/icons';

addIcons({
  'close-outline': closeOutline,
  'save-outline': saveOutline,
  'car-outline': carOutline
});

@Component({
  selector: 'app-vehiculo-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon name="car-outline"></ion-icon>
          {{ isEdit ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="cerrar()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Información del Vehículo</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form (ngSubmit)="onSubmit()" #vehiculoForm="ngForm">
          <ion-item>
              <ion-label position="floating">Nombre del Vehículo *</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.nombre" 
                name="nombre" 
                required
                placeholder="Ej: Carro Bomba 1"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Vehículo/Descripción</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.vehiculo" 
                name="vehiculo"
                placeholder="Ej: Autobomba"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Estado *</ion-label>
              <ion-select [(ngModel)]="vehiculoData.estado" name="estado" required
                [disabled]="userRole === 'bombero'">
                <ion-select-option value="Operativo">Operativo</ion-select-option>
                <ion-select-option value="En mantenimiento">En mantenimiento</ion-select-option>
                <ion-select-option value="Fuera de servicio">Fuera de servicio</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Kilometraje</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.kilometraje" 
                name="kilometraje"
                placeholder="Ej: 50000"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Marca</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.marca" 
                name="marca"
                placeholder="Ej: Toyota"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Modelo *</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.modelo" 
                name="modelo" 
                required
                placeholder="Ej: Hilux"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Patente</ion-label>
              <ion-input 
                [(ngModel)]="vehiculoData.patente" 
                name="patente"
                placeholder="Ej: ABC123"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Año</ion-label>
              <ion-input 
                type="number" 
                [(ngModel)]="vehiculoData.anio" 
                name="anio"
                placeholder="Ej: 2020"
                [disabled]="userRole === 'mecanico' || userRole === 'jefeFlota' || userRole === 'bombero'">
              </ion-input>
            </ion-item>

            <div class="form-actions">
              <ion-button 
                expand="block" 
                type="submit" 
                color="primary"
                [disabled]="!vehiculoForm.form.valid"
                *ngIf="userRole === 'admin' || userRole === 'jefeFlota' || userRole === 'mecanico'">
                <ion-icon slot="start" name="save-outline"></ion-icon>
                {{ isEdit ? 'Actualizar Vehículo' : 'Agregar Vehículo' }}
              </ion-button>
              
              <ion-button 
                expand="block" 
                fill="outline" 
                color="medium" 
                (click)="cerrar()">
                Cancelar
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    ion-card {
      margin: 0;
      box-shadow: none;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      margin-bottom: 1rem;
    }

    .form-actions {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    ion-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    ion-textarea {
      min-height: 80px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonTextarea
  ],
})
export class VehiculoModalComponent implements OnInit {
  @Input() vehiculo?: Vehiculo;
  @Input() isEdit: boolean = false;
  @Input() userRole: string | null = null;
  @ViewChild('vehiculoForm') vehiculoForm!: NgForm;

  vehiculoData = {
    nombre: '',
    vehiculo: '',
    estado: 'Operativo',
    kilometraje: '',
    marca: '',
    modelo: '',
    patente: '',
    anio: null as number | null,
    mantenimientos: [] as any[]
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.isEdit && this.vehiculo) {
      this.vehiculoData = {
        nombre: this.vehiculo.nombre || '',
        vehiculo: this.vehiculo.vehiculo || '',
        estado: this.vehiculo.estado || 'Operativo',
        kilometraje: this.vehiculo.kilometraje || '',
        marca: this.vehiculo.marca || '',
        modelo: this.vehiculo.modelo || '',
        patente: this.vehiculo.patente || '',
        anio: this.vehiculo.anio || null,
        mantenimientos: this.vehiculo.mantenimientos || []
      };
    }
  }

  async onSubmit() {
    if (!this.vehiculoForm.valid || this.vehiculoData.nombre.trim() === '') {
      return;
    }

    // Asegurarse de que los campos requeridos según la interfaz estén presentes
    const dataToSend: Partial<Vehiculo> = {
      nombre: this.vehiculoData.nombre,
      estado: this.vehiculoData.estado,
      modelo: this.vehiculoData.modelo,
      anio: this.vehiculoData.anio || new Date().getFullYear(),
      mantenimientos: this.vehiculoData.mantenimientos
    };

    // Agregar campos opcionales si tienen valor
    if (this.vehiculoData.vehiculo) dataToSend.vehiculo = this.vehiculoData.vehiculo;
    if (this.vehiculoData.kilometraje) dataToSend.kilometraje = this.vehiculoData.kilometraje;
    if (this.vehiculoData.marca) dataToSend.marca = this.vehiculoData.marca;
    if (this.vehiculoData.patente) dataToSend.patente = this.vehiculoData.patente;

    await this.modalCtrl.dismiss(dataToSend);
  }

  async cerrar() {
    await this.modalCtrl.dismiss();
  }
}
