import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonListHeader, IonDatetime, IonToast, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: 'mantenimiento.page.html',
  styleUrls: ['mantenimiento.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonListHeader, IonDatetime, IonToast, IonButtons, IonBackButton],
})
export class MantenimientoPage {
  private firestore = inject(Firestore);
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  nuevoMantenimiento = {
    fecha: '',
    tipo: '',
    descripcion: '',
    vehiculo: ''
  };

  mantenimientos$: Observable<any[]> = collectionData(collection(this.firestore, 'mantenimientos'), { idField: 'id' });

  async agregarMantenimiento() {
    if (!this.nuevoMantenimiento.fecha || !this.nuevoMantenimiento.tipo || !this.nuevoMantenimiento.descripcion || !this.nuevoMantenimiento.vehiculo) {
      this.toastMessage = 'Por favor, completa todos los campos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    try {
      const ref = collection(this.firestore, 'mantenimientos');
      await addDoc(ref, this.nuevoMantenimiento);
      this.toastMessage = 'Mantenimiento agregado con éxito.';
      this.toastColor = 'success';
      this.showToast = true;
      this.nuevoMantenimiento = { fecha: '', tipo: '', descripcion: '', vehiculo: '' };
    } catch (error) {
      this.toastMessage = 'Error al agregar mantenimiento.';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }
}
