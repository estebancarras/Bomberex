import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonChip, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-detail-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalle de Mantenimiento</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ mantenimiento.tipo || 'Mantenimiento' }}</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Fecha</h3>
                    <p>{{ formatDate(mantenimiento.fecha) }}</p>
                  </ion-label>
                </ion-item>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Estado</h3>
                    <ion-chip [color]="getEstadoColor(mantenimiento.estado)">
                      {{ mantenimiento.estado }}
                    </ion-chip>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Categoría</h3>
                    <p>{{ mantenimiento.categoria || 'No especificada' }}</p>
                  </ion-label>
                </ion-item>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Prioridad</h3>
                    <ion-chip [color]="getPrioridadColor(mantenimiento.prioridad)">
                      {{ mantenimiento.prioridad || 'Normal' }}
                    </ion-chip>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            
            <ion-row *ngIf="mantenimiento.tallerResponsable">
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Taller Responsable</h3>
                    <p>{{ mantenimiento.tallerResponsable }}</p>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            
            <ion-row *ngIf="mantenimiento.descripcion">
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Descripción</h3>
                    <p>{{ mantenimiento.descripcion }}</p>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            
            <ion-row *ngIf="mantenimiento.costo">
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Costo</h3>
                    <p>{{ formatCurrency(mantenimiento.costo) }}</p>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            
            <ion-row *ngIf="mantenimiento.kilometraje">
              <ion-col size="12" size-md="6">
                <ion-item lines="none">
                  <ion-label>
                    <h3>Kilometraje</h3>
                    <p>{{ mantenimiento.kilometraje }} km</p>
                  </ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    ion-card {
      margin: 0;
      box-shadow: none;
      border: 1px solid var(--ion-color-light-shade);
    }
    
    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }
    
    ion-label h3 {
      font-weight: 600;
      color: var(--ion-color-dark);
      margin-bottom: 4px;
    }
    
    ion-label p {
      color: var(--ion-color-medium);
      margin: 0;
    }
    
    ion-chip {
      margin: 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonChip, 
    IonGrid, 
    IonRow, 
    IonCol
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HistorialDetailModalComponent {
  @Input() mantenimiento: any = {};

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  formatDate(date: string): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'completado':
        return 'success';
      case 'en progreso':
        return 'warning';
      case 'pendiente':
        return 'medium';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad?.toLowerCase()) {
      case 'alta':
        return 'danger';
      case 'media':
        return 'warning';
      case 'baja':
        return 'success';
      default:
        return 'medium';
    }
  }
}
