import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, addDoc, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: 'mantenimiento.page.html',
  styleUrls: ['mantenimiento.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption],
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
    vehiculo: '',
    estado: ''
  };

  mantenimientos$: Observable<any[]> = collectionData(collection(this.firestore, 'mantenimientos'), { idField: 'id' });

  vehiculos$: Observable<any[]> = collectionData(collection(this.firestore, 'vehiculos'), { idField: 'id' });

  async agregarMantenimiento() {
    if (!this.nuevoMantenimiento.fecha || !this.nuevoMantenimiento.tipo || !this.nuevoMantenimiento.descripcion || !this.nuevoMantenimiento.vehiculo || !this.nuevoMantenimiento.estado) {
      this.toastMessage = 'Por favor, completa todos los campos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    try {
      const ref = collection(this.firestore, 'mantenimientos');
      const docRef = await addDoc(ref, this.nuevoMantenimiento);

      // Actualizar el vehículo con el nuevo mantenimiento y estado
      const vehiculoRef = doc(this.firestore, `vehiculos/${this.nuevoMantenimiento.vehiculo}`);
      const vehiculoSnap = await new Promise<any>((resolve, reject) => {
        const sub = docData(vehiculoRef).subscribe({
          next: data => {
            resolve(data);
            sub.unsubscribe();
          },
          error: err => {
            resolve(null);
            sub.unsubscribe();
          }
        });
      });
      let mantenimientos = [];
      if (vehiculoSnap && vehiculoSnap.mantenimientos) {
        mantenimientos = vehiculoSnap.mantenimientos;
      }
      mantenimientos.push({
        id: docRef.id,
        fecha: this.nuevoMantenimiento.fecha,
        tipo: this.nuevoMantenimiento.tipo,
        descripcion: this.nuevoMantenimiento.descripcion,
        estado: this.nuevoMantenimiento.estado
      });
      await setDoc(vehiculoRef, { mantenimientos, estado: this.nuevoMantenimiento.estado }, { merge: true });

      this.toastMessage = 'Mantenimiento agregado con éxito.';
      this.toastColor = 'success';
      this.showToast = true;
      this.nuevoMantenimiento = { fecha: '', tipo: '', descripcion: '', vehiculo: '', estado: '' };
    } catch (error) {
      this.toastMessage = 'Error al agregar mantenimiento.';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }
}
