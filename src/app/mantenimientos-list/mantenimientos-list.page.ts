import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonButtons, IonBackButton, IonBadge, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-mantenimientos-list',
  templateUrl: './mantenimientos-list.page.html',
  styleUrls: ['./mantenimientos-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonButtons, IonBackButton, IonBadge,
    IonButton, IonIcon,
    RouterModule
  ]
})
export class MantenimientosListPage {
  private firestore = inject(Firestore);
  private alertController = inject(AlertController);
  public router = inject(Router);

  mantenimientos$: Observable<any[]> = collectionData(collection(this.firestore, 'mantenimientos'), { idField: 'id' });

  selectedMantenimientoId: string | null = null;

  onMouseEnter(id: string) {
    this.selectedMantenimientoId = id;
  }

  onMouseLeave() {
    this.selectedMantenimientoId = null;
  }

  descargarPDF(mantenimiento: any) {
    const doc = new jsPDF();
    doc.text(`Tipo: ${mantenimiento.tipo}`, 10, 10);
    doc.text(`Descripción: ${mantenimiento.descripcion}`, 10, 20);
    doc.text(`Fecha: ${new Date(mantenimiento.fecha).toLocaleDateString()}`, 10, 30);
    doc.text(`Vehículo: ${mantenimiento.vehiculo}`, 10, 40);
    doc.text(`Estado: ${mantenimiento.completado}`, 10, 50);
    doc.save(`mantenimiento_${mantenimiento.id}.pdf`);
  }

  async borrarMantenimiento(mantenimiento: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Está seguro que desea borrar el mantenimiento "${mantenimiento.tipo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            await deleteDoc(doc(this.firestore, 'mantenimientos', mantenimiento.id));
          }
        }
      ]
    });
    await alert.present();
  }
}
