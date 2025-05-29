import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonSearchbar, IonInput, IonButton, IonToast, IonButtons, IonModal, IonSelect, IonSelectOption, ModalController } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, switchMap, map } from 'rxjs';
import { VehiculoModalComponent } from './vehiculo-modal.component';

@Component({
  selector: 'app-vehiculos',
  templateUrl: 'vehiculos.page.html',
  styleUrls: ['vehiculos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonSearchbar, IonInput, IonButton, IonToast, IonButtons, IonModal, IonSelect, IonSelectOption],
})
export class VehiculosPage {
  private firestore = inject(Firestore);
  private modalController = inject(ModalController);
  private searchTerm$ = new BehaviorSubject<string>('');

  vehiculos$: Observable<any[]> = this.searchTerm$.pipe(
    switchMap(searchTerm => {
      return collectionData(collection(this.firestore, 'vehiculos'), { idField: 'id' }).pipe(
        map(vehiculos => {
          if (searchTerm) {
            return vehiculos.filter(v =>
              v['vehiculo'].toLowerCase().includes(searchTerm.toLowerCase()) ||
              v['estado'].toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          return vehiculos;
        })
      );
    })
  );

  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  async abrirModal() {
    const modal = await this.modalController.create({
      component: VehiculoModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.agregarVehiculo(result.data);
      }
    });

    await modal.present();
  }

  async agregarVehiculo(vehiculoData: any) {
    if (!vehiculoData.vehiculo) {
      this.toastMessage = 'Por favor, ingresa el nombre del vehículo.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    try {
      const ref = collection(this.firestore, 'vehiculos');
      await addDoc(ref, vehiculoData);
      this.toastMessage = 'Vehículo agregado con éxito.';
      this.toastColor = 'success';
      this.showToast = true;
      this.searchTerm$.next(''); // refrescar lista
    } catch (error) {
      this.toastMessage = 'Error al agregar vehículo.';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }

  searchChanged(event: any) {
    this.searchTerm$.next(event.detail.value);
  }
}
