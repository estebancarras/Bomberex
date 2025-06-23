import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule, ModalController, IonDatetime } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rango-fechas-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Seleccionar rango de fechas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancelar()">Cancelar</ion-button>
          <ion-button (click)="confirmar()" [disabled]="!fechaInicio || !fechaFin">Confirmar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Fecha Inicio</ion-label>
        <ion-datetime display-format="YYYY-MM-DD" [(ngModel)]="fechaInicio"></ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label>Fecha Fin</ion-label>
        <ion-datetime display-format="YYYY-MM-DD" [(ngModel)]="fechaFin"></ion-datetime>
      </ion-item>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RangoFechasModalComponent {
  fechaInicio: string | undefined;
  fechaFin: string | undefined;

  @Output() rangoSeleccionado = new EventEmitter<{inicio: string, fin: string}>();

  constructor(private modalCtrl: ModalController) {}

  cancelar() {
    this.modalCtrl.dismiss();
  }

  confirmar() {
    if (this.fechaInicio && this.fechaFin) {
      this.rangoSeleccionado.emit({inicio: this.fechaInicio, fin: this.fechaFin});
      this.modalCtrl.dismiss({inicio: this.fechaInicio, fin: this.fechaFin});
    }
  }
}
