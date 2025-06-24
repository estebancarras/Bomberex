import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonButtons, IonTextarea } from '@ionic/angular/standalone';
import { RangoFechasModalComponent } from '../rango-fechas-modal/rango-fechas-modal.component';

@Component({
  selector: 'app-mantenimiento-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Agregar Nuevo Mantenimiento</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form (ngSubmit)="onSubmit()">
        <ion-item>
          <ion-label position="floating">Vehículo</ion-label>
          <ion-select [(ngModel)]="mantenimiento.vehiculo" name="vehiculo" required>
            <ion-select-option *ngFor="let vehiculo of vehiculos" [value]="vehiculo.id">
              {{vehiculo.patente}} - {{vehiculo.vehiculo}}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Categoría</ion-label>
          <ion-select [(ngModel)]="mantenimiento.categoria" name="categoria" required>
            <ion-select-option value="Preventivo">Preventivo</ion-select-option>
            <ion-select-option value="Correctivo">Correctivo</ion-select-option>
            <ion-select-option value="Predictivo">Predictivo</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Tipo</ion-label>
          <ion-input [(ngModel)]="mantenimiento.tipo" name="tipo" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Descripción</ion-label>
          <ion-textarea [(ngModel)]="mantenimiento.descripcion" name="descripcion" required></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Estado</ion-label>
          <ion-select [(ngModel)]="mantenimiento.estado" name="estado" required>
            <ion-select-option value="Pendiente">Pendiente</ion-select-option>
            <ion-select-option value="En progreso">En progreso</ion-select-option>
            <ion-select-option value="Completado">Completado</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Prioridad</ion-label>
          <ion-select [(ngModel)]="mantenimiento.prioridad" name="prioridad" required>
            <ion-select-option value="alta">Alta</ion-select-option>
            <ion-select-option value="media">Media</ion-select-option>
            <ion-select-option value="baja">Baja</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Taller Responsable</ion-label>
          <ion-input [(ngModel)]="mantenimiento.tallerResponsable" name="tallerResponsable" required></ion-input>
        </ion-item>

        <ion-item button (click)="abrirModalRangoFechas()">
          <ion-label>Tiempo Mantenimiento</ion-label>
          <ion-label slot="end">{{mostrarRangoFechas()}}</ion-label>
        </ion-item>

        <ion-button expand="block" type="submit" [disabled]="!esFormularioValido()">
          Agregar Mantenimiento
        </ion-button>
      </form>
    </ion-content>
  `,
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
    IonTextarea
  ],
})
export class MantenimientoModalComponent {
  mantenimiento = {
    Tiempomanteni: ['', ''],
    categoria: '',
    tipo: '',
    descripcion: '',
    vehiculo: '',
    estado: '',
    prioridad: '',
    tallerResponsable: ''
  };

  vehiculos: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  async abrirModalRangoFechas() {
    const modal = await this.modalCtrl.create({
      component: RangoFechasModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.mantenimiento.Tiempomanteni = [data.inicio, data.fin];
    }
  }

  mostrarRangoFechas() {
    if (this.mantenimiento.Tiempomanteni[0] && this.mantenimiento.Tiempomanteni[1]) {
      return this.mantenimiento.Tiempomanteni[0] + ' - ' + this.mantenimiento.Tiempomanteni[1];
    }
    return 'Seleccionar fechas';
  }

  esFormularioValido(): boolean {
    return !!(
      this.mantenimiento.Tiempomanteni[0] &&
      this.mantenimiento.Tiempomanteni[1] &&
      this.mantenimiento.categoria &&
      this.mantenimiento.tipo &&
      this.mantenimiento.descripcion &&
      this.mantenimiento.vehiculo &&
      this.mantenimiento.estado &&
      this.mantenimiento.prioridad &&
      this.mantenimiento.tallerResponsable
    );
  }

  async onSubmit() {
    if (!this.esFormularioValido()) {
      return;
    }
    await this.modalCtrl.dismiss(this.mantenimiento);
  }

  async cerrar() {
    await this.modalCtrl.dismiss();
  }
}
