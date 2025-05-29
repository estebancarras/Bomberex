import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-vehiculo-modal',
  template: "<ion-header><ion-toolbar><ion-title>Agregar Nuevo Vehículo</ion-title><ion-buttons slot='end'><ion-button (click)='cerrar()'>Cerrar</ion-button></ion-buttons></ion-toolbar></ion-header><ion-content class='ion-padding'><form (ngSubmit)='onSubmit()'><ion-item><ion-label position='floating'>Nombre</ion-label><ion-input [(ngModel)]='vehiculo.vehiculo' name='vehiculo' required></ion-input></ion-item><ion-item><ion-label position='floating'>Estado</ion-label><ion-select [(ngModel)]='vehiculo.estado' name='estado' required><ion-select-option value='Operativo'>Operativo</ion-select-option><ion-select-option value='En mantenimiento'>En mantenimiento</ion-select-option><ion-select-option value='Fuera de servicio'>Fuera de servicio</ion-select-option></ion-select></ion-item><ion-item><ion-label position='floating'>Kilometraje</ion-label><ion-input type='number' [(ngModel)]='vehiculo.kilometraje' name='kilometraje' required></ion-input></ion-item><ion-item><ion-label position='floating'>Marca</ion-label><ion-input [(ngModel)]='vehiculo.marca' name='marca' required></ion-input></ion-item><ion-item><ion-label position='floating'>Modelo</ion-label><ion-input [(ngModel)]='vehiculo.modelo' name='modelo' required></ion-input></ion-item><ion-item><ion-label position='floating'>Patente</ion-label><ion-input [(ngModel)]='vehiculo.patente' name='patente' required></ion-input></ion-item><ion-button expand='block' type='submit'>Agregar Vehículo</ion-button></form></ion-content>",
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonButtons],
})
export class VehiculoModalComponent {
  vehiculo = {
    vehiculo: '',
    estado: 'Operativo',
    kilometraje: null,
    marca: '',
    modelo: '',
    patente: ''
  };

  constructor(private modalCtrl: ModalController) {}

  async onSubmit() {
    if (this.vehiculo.vehiculo.trim() === '') {
      return;
    }
    await this.modalCtrl.dismiss(this.vehiculo);
  }

  async cerrar() {
    await this.modalCtrl.dismiss();
  }
}
